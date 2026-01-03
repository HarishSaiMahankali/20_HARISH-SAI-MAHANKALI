import React from 'react';
import { Check, Calendar, AlertTriangle, User } from 'lucide-react';
import { motion } from 'framer-motion';
import CalendarView from './CalendarView';

const CaregiverDashboard = () => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <header className="mb-10 bg-white p-5 rounded-xl border border-slate-200 flex justify-between items-center shadow-sm" style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                <div>
                    <h1 style={{ marginBottom: '5px' }}>Patient Overview</h1>
                    <p>Monitoring: <span style={{ fontWeight: 'bold', color: '#0056b3' }}>John Doe (Patient)</span></p>
                </div>
                <div style={{ padding: '8px 16px', backgroundColor: '#e3f2fd', color: '#0056b3', borderRadius: '20px', fontSize: '14px', fontWeight: '600' }}>
                    Read-Only Access
                </div>
            </header>

            {/* Stats Row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '40px' }}>
                <StatCard
                    icon={<Check size={24} />}
                    color="#dcfce7"
                    iconColor="#15803d"
                    value="92%"
                    label="Weekly Adherence"
                />
                <StatCard
                    icon={<Calendar size={24} />}
                    color="#e3f2fd"
                    iconColor="#0056b3"
                    value="Full"
                    label="Today's Status"
                />
                <StatCard
                    icon={<AlertTriangle size={24} />}
                    color="#fef9c3"
                    iconColor="#a16207"
                    value="0"
                    label="Missed Doses (7d)"
                />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
                {/* Recent Activity */}
                <div>
                    <h2>Recent Activity</h2>
                    <div className="card" style={{ marginTop: '15px' }}>
                        <ActivityItem time="08:00 AM" text="Taken: Metformin 500mg" type="success" />
                        <ActivityItem time="Yesterday" text="Taken: Atorvastatin 20mg" type="success" />
                        <ActivityItem time="Yesterday" text="Missed: Vitamin D" type="warning" />
                    </div>
                </div>

                {/* Calendar View (Embedded) */}
                <div>
                    <h2>Adherence Calendar</h2>
                    <div className="card" style={{ marginTop: '15px' }}>
                        <CalendarView embed={true} />
                    </div>
                </div>
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
            <h3 style={{ fontSize: '24px', margin: 0 }}>{value}</h3>
            <p style={{ margin: 0 }}>{label}</p>
        </div>
    </div>
);

const ActivityItem = ({ time, text, type }) => (
    <div style={{ display: 'flex', gap: '15px', padding: '10px 0', borderBottom: '1px solid #f1f5f9' }}>
        <span style={{ color: '#64748b', fontSize: '14px', minWidth: '80px' }}>{time}</span>
        <span style={{
            color: type === 'success' ? '#15803d' : '#b91c1c',
            fontWeight: '500'
        }}>
            {text}
        </span>
    </div>
);

export default CaregiverDashboard;
