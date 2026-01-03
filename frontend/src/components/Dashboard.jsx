import React, { useState, useEffect } from 'react';
import { api } from '../api';
import { useAuth } from '../context/AuthContext';
import { Check, Calendar, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

const Dashboard = () => {
    const [schedule, setSchedule] = useState([]);
    const [stats, setStats] = useState({ taken: 0, missed: 0, total: 0, adherence: 0 });
    const { user } = useAuth();
    const todayStr = new Date().toISOString().split('T')[0];

    const loadData = async () => {
        if (!user) return;
        try {
            // 1. Get Reminders (The Plan)
            const reminders = await api.getReminders(user.id);

            // 2. Get Adherence (The History)
            const adherenceHistory = await api.getAdherence(user.id);

            // 3. Filter for Today's Status
            const todayStatusMap = {}; // { reminderId: 'taken' | 'missed' }

            // Calculate stats for today
            let takenCount = 0;
            let missedCount = 0;

            adherenceHistory.forEach(record => {
                if (record.date === todayStr) {
                    todayStatusMap[record.reminder_id] = record.status;
                }

                // For stats, we might want all time or just today. Let's do Today's stats for the cards.
                // Actually, "Doses Taken 4/5" usually implies today.
                if (record.date === todayStr) {
                    if (record.status === 'taken') takenCount++;
                    if (record.status === 'missed') missedCount++;
                }
            });

            // Adherence Rate (Weekly/All Time is better, but let's do simple calculation)
            const totalReminders = reminders.length;
            const percentage = totalReminders === 0 ? 100 : Math.round((takenCount / totalReminders) * 100);

            setStats({
                taken: takenCount,
                missed: missedCount,
                total: totalReminders,
                adherence: percentage
            });

            // 4. Merge Data
            const formatted = reminders.map(r => ({
                id: r.id,
                drug: r.drug_name,
                dosage: r.dosage,
                instructions: r.frequency,
                times: r.times,
                status: todayStatusMap[r.id] || null // 'taken', 'missed', or null (pending)
            }));

            setSchedule(formatted);

        } catch (e) {
            console.error("Failed to load dashboard data", e);
        }
    };

    useEffect(() => {
        loadData();
    }, [user]);

    const handleAdherence = async (reminderId, status) => {
        try {
            // Optimistic Update
            setSchedule(prev => prev.map(item =>
                item.id === reminderId ? { ...item, status: status } : item
            ));

            // Recalculate stats optimistically
            setStats(prev => {
                const isTaken = status === 'taken';
                return {
                    ...prev,
                    taken: isTaken ? prev.taken + 1 : prev.taken,
                    missed: !isTaken ? prev.missed + 1 : prev.missed,
                    adherence: Math.round(((isTaken ? prev.taken + 1 : prev.taken) / prev.total) * 100)
                };
            });

            await api.recordAdherence({
                reminder_id: reminderId,
                date: todayStr,
                status: status
            });

            // No alert needed, UI update is sufficient feedback
        } catch (e) {
            console.error("Failed to record adherence", e);
            alert("Failed to save status. Please try again.");
            loadData(); // Revert on error
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <header className="mb-10">
                <h1>Good Morning! ☀️</h1>
                <p>Here is your medication schedule for today.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '40px' }}>
                <StatCard
                    icon={<Check size={24} />}
                    color="rgba(88, 166, 255, 0.2)"
                    iconColor="#58a6ff"
                    value={`${stats.adherence}%`}
                    label="Today's Adherence"
                />
                <StatCard
                    icon={<Calendar size={24} />}
                    color="rgba(63, 185, 80, 0.2)"
                    iconColor="#3FB950"
                    value={`${stats.taken} / ${stats.total}`}
                    label="Doses Taken"
                />
                <StatCard
                    icon={<AlertTriangle size={24} />}
                    color="rgba(210, 153, 34, 0.2)"
                    iconColor="#d29922"
                    value={stats.missed}
                    label="Missed"
                />
            </div>

            <h2>Today's Schedule</h2>
            <div className="timeline mt-5" style={{ borderLeft: '2px solid #30363d', marginLeft: '10px', paddingLeft: '30px', marginTop: '20px' }}>
                {schedule.length === 0 ? (
                    <div className="p-5 text-gray-500">No medications scheduled. Add one from the Library!</div>
                ) : (
                    schedule.map((item, idx) => (
                        <div key={idx} style={{ position: 'relative', marginBottom: '30px' }}>
                            <div style={{
                                position: 'absolute', left: '-37px', top: '5px', width: '12px', height: '12px',
                                backgroundColor: item.status === 'taken' ? '#22c55e' : item.status === 'missed' ? '#ef4444' : '#1e2530',
                                border: `2px solid ${item.status === 'taken' ? '#22c55e' : item.status === 'missed' ? '#ef4444' : '#58a6ff'}`,
                                borderRadius: '50%'
                            }}></div>

                            <div className="card" style={{
                                borderLeft: item.status === 'taken' ? '4px solid #22c55e' : item.status === 'missed' ? '4px solid #ef4444' : '1px solid #e2e8f0',
                                opacity: item.status ? 0.8 : 1
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                    <h3 style={{ fontSize: '18px' }}>{item.drug} <span style={{ fontSize: '14px', color: '#8b949e' }}>{item.dosage}</span></h3>
                                    <span style={{ color: '#58a6ff', fontWeight: 'bold' }}>
                                        {item.times && item.times.length > 0 ? item.times.join(', ') : 'Daily'}
                                    </span>
                                </div>
                                <p style={{ marginBottom: '15px' }}>{item.instructions}</p>

                                {item.status ? (
                                    <div style={{
                                        padding: '10px', borderRadius: '8px',
                                        backgroundColor: item.status === 'taken' ? '#dcfce7' : '#fee2e2',
                                        color: item.status === 'taken' ? '#15803d' : '#b91c1c',
                                        fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px'
                                    }}>
                                        {item.status === 'taken' ? <Check size={20} /> : <AlertTriangle size={20} />}
                                        {item.status === 'taken' ? 'Completed' : 'Missed'}
                                    </div>
                                ) : (
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        <button
                                            onClick={() => handleAdherence(item.id, 'taken')}
                                            className="btn"
                                            style={{ backgroundColor: '#dcfce7', color: '#15803d', flex: 1, padding: '8px' }}
                                        >
                                            <Check size={16} style={{ marginRight: '5px' }} /> Taken
                                        </button>
                                        <button
                                            onClick={() => handleAdherence(item.id, 'missed')}
                                            className="btn"
                                            style={{ backgroundColor: '#fee2e2', color: '#b91c1c', flex: 1, padding: '8px' }}
                                        >
                                            <AlertTriangle size={16} style={{ marginRight: '5px' }} /> Missed
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </motion.div>
    );
};

const StatCard = ({ icon, color, iconColor, value, label }) => (
    <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <div style={{
            width: '50px', height: '50px', borderRadius: '12px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            backgroundColor: color, color: iconColor
        }}>
            {icon}
        </div>
        <div>
            <h3 style={{ fontSize: '24px' }}>{value}</h3>
            <p>{label}</p>
        </div>
    </div>
);

export default Dashboard;
