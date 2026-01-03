import React, { useState, useEffect } from 'react';
import { api } from '../api';
import { useAuth } from '../context/AuthContext';
import { Check, Calendar, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

const Dashboard = () => {
    const [schedule, setSchedule] = useState([]);

    const { user } = useAuth();

    useEffect(() => {
        const fetchReminders = async () => {
            if (user) {
                try {
                    const data = await api.getReminders(user.id);
                    // Map DB response to UI format
                    const formatted = data.map(r => ({
                        drug: r.drug_name,
                        dosage: r.dosage,
                        instructions: r.frequency, // Simple mapping for now
                        times: r.times
                    }));
                    setSchedule(formatted);
                } catch (e) {
                    console.error("Failed to load schedule", e);
                }
            }
        };
        fetchReminders();
    }, [user]);

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
                    value="80%"
                    label="Adherence"
                />
                <StatCard
                    icon={<Calendar size={24} />}
                    color="rgba(63, 185, 80, 0.2)"
                    iconColor="#3FB950"
                    value="4 / 5"
                    label="Doses Taken"
                />
                <StatCard
                    icon={<AlertTriangle size={24} />}
                    color="rgba(210, 153, 34, 0.2)"
                    iconColor="#d29922"
                    value="1"
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
                                backgroundColor: '#1e2530', border: '2px solid #58a6ff', borderRadius: '50%'
                            }}></div>
                            <div className="card">
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                    <h3 style={{ fontSize: '18px' }}>{item.drug} <span style={{ fontSize: '14px', color: '#8b949e' }}>{item.dosage}</span></h3>
                                    <span style={{ color: '#58a6ff', fontWeight: 'bold' }}>
                                        {item.times && item.times.length > 0 ? item.times.join(', ') : 'Daily'}
                                    </span>
                                </div>
                                <p>{item.instructions}</p>
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
