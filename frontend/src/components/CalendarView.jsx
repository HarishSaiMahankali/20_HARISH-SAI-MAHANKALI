import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Check, X, AlertTriangle } from 'lucide-react';
import { api } from '../api';
import { useAuth } from '../context/AuthContext';

const CalendarView = ({ adherenceData: propData }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [internalData, setInternalData] = useState({});
    const { user } = useAuth();

    // Use props if available (Doctor view), otherwise use internal state (Patient view)
    const adherenceData = propData || internalData;

    React.useEffect(() => {
        // Only fetch if no props provided AND we have a user (Patient View)
        if (!propData && user) {
            const fetchData = async () => {
                try {
                    const data = await api.getAdherence(user.id);
                    // Convert array to map: { 'YYYY-MM-DD': 'status' }
                    const map = data.reduce((acc, curr) => ({
                        ...acc,
                        [curr.date]: curr.status
                    }), {});
                    setInternalData(map);
                } catch (e) {
                    console.error("Failed to load calendar data", e);
                }
            };
            fetchData();
        }
    }, [user, propData]);


    const getDaysInMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        return new Date(year, month + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        return new Date(year, month, 1).getDay();
    };

    const changeMonth = (offset) => {
        const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + offset, 1);
        setCurrentDate(newDate);
    };

    const renderCalendar = () => {
        const daysInMonth = getDaysInMonth(currentDate);
        const firstDay = getFirstDayOfMonth(currentDate);
        const blanks = Array(firstDay).fill(null);
        const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

        const allCells = [...blanks, ...days];

        return (
            <div className="calendar-grid">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} style={{ textAlign: 'center', fontWeight: 'bold', color: '#64748b', padding: '10px' }}>
                        {day}
                    </div>
                ))}

                {allCells.map((day, index) => {
                    if (!day) return <div key={`blank-${index}`} />;

                    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                    const status = adherenceData[dateStr];

                    let bgColor = 'white';
                    let borderColor = '#e2e8f0';
                    let icon = null;

                    if (status === 'full') {
                        bgColor = '#dcfce7'; // Light Green
                        borderColor = '#22c55e';
                        icon = <Check size={16} color="#15803d" />;
                    } else if (status === 'missed') {
                        bgColor = '#fee2e2'; // Light Red
                        borderColor = '#ef4444';
                        icon = <X size={16} color="#b91c1c" />;
                    } else if (status === 'partial') {
                        bgColor = '#fef9c3'; // Light Yellow
                        borderColor = '#eab308';
                        icon = <AlertTriangle size={16} color="#a16207" />;
                    }

                    return (
                        <div
                            key={day}
                            className="card"
                            style={{
                                minHeight: '100px', padding: '10px',
                                backgroundColor: bgColor, borderColor: borderColor,
                                display: 'flex', flexDirection: 'column', gap: '5px',
                                cursor: 'pointer', transition: 'transform 0.1s'
                            }}
                            onClick={() => alert(`Details for ${dateStr}`)}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ fontWeight: 'bold' }}>{day}</span>
                                {icon}
                            </div>
                            {status && (
                                <span style={{ fontSize: '10px', color: '#475569' }}>
                                    {status === 'full' ? 'All Taken' : status === 'missed' ? 'Missed' : 'Pending'}
                                </span>
                            )}
                        </div>
                    );
                })}
            </div>
        );
    };

    return (
        <div>
            <header className="mb-8" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <div>
                    <h1>Medication Calendar</h1>
                    <p>Track your adherence history.</p>
                </div>

                <div className="card" style={{ padding: '0.5rem 1rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <button onClick={() => changeMonth(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                        <ChevronLeft />
                    </button>
                    <h2 style={{ margin: 0, minWidth: '150px', textAlign: 'center' }}>
                        {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                    </h2>
                    <button onClick={() => changeMonth(1)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                        <ChevronRight />
                    </button>
                </div>
            </header>

            <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
                <LegendItem color="#22c55e" label="All Doses Taken" />
                <LegendItem color="#eab308" label="Partial / Pending" />
                <LegendItem color="#ef4444" label="Missed Dose" />
            </div>

            {renderCalendar()}
        </div>
    );
};

const LegendItem = ({ color, label }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: color }}></div>
        <span style={{ fontSize: '14px', color: '#64748b' }}>{label}</span>
    </div>
);

export default CalendarView;
