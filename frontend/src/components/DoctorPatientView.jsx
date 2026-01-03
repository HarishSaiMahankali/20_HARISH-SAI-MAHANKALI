import React, { useState, useEffect } from 'react';
import { api } from '../api';
import CalendarView from './CalendarView';
import { Pill, Activity, X } from 'lucide-react';

const DoctorPatientView = ({ patientId, patientName, onClose }) => {
    const [activeTab, setActiveTab] = useState('adherence'); // 'adherence' | 'prescribe'
    const [reminders, setReminders] = useState([]);
    const [adherence, setAdherence] = useState([]);

    // Prescription Form State
    const [drugName, setDrugName] = useState('');
    const [dosage, setDosage] = useState('');
    const [frequency, setFrequency] = useState('daily');
    const [time, setTime] = useState('09:00');
    const [duration, setDuration] = useState('7 days');
    const [reason, setReason] = useState('');

    useEffect(() => {
        if (!patientId) return;
        const loadData = async () => {
            const rems = await api.getReminders(patientId);
            const adhs = await api.getAdherence(patientId);
            setReminders(rems);
            setAdherence(adhs);
        };
        loadData();
    }, [patientId]);

    const handlePrescribe = async (e) => {
        e.preventDefault();
        try {
            await api.addReminder({
                user_id: patientId,
                drug_name: drugName,
                dosage: dosage,
                frequency: frequency,
                times: [time],
                duration: duration,
                reason: reason
            });
            alert("Prescription added & Email sent to patient!");
            setDrugName('');
            setDosage('');
            setReason('');
            onClose(); // Close or refresh
        } catch (e) {
            alert("Failed to prescribe");
        }
    };

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
        }}>
            <div style={{
                backgroundColor: 'white', borderRadius: '12px', width: '90%', maxWidth: '800px', height: '80vh',
                display: 'flex', flexDirection: 'column', overflow: 'hidden'
            }}>
                {/* Header */}
                <div style={{ padding: '20px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2>Patient: {patientName}</h2>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={24} /></button>
                </div>

                {/* Tabs */}
                <div style={{ display: 'flex', padding: '10px 20px', gap: '10px', backgroundColor: '#f8fafc' }}>
                    <button
                        className={`btn ${activeTab === 'adherence' ? 'btn-primary' : 'btn-secondary'}`}
                        onClick={() => setActiveTab('adherence')}
                    >
                        <Activity size={16} style={{ marginRight: 5 }} /> Adherence & History
                    </button>
                    <button
                        className={`btn ${activeTab === 'prescribe' ? 'btn-primary' : 'btn-secondary'}`}
                        onClick={() => setActiveTab('prescribe')}
                    >
                        <Pill size={16} style={{ marginRight: 5 }} /> Prescribe Medication
                    </button>
                </div>

                {/* Content */}
                <div style={{ padding: '20px', overflowY: 'auto', flex: 1 }}>
                    {activeTab === 'adherence' ? (
                        <>
                            <h3>Adherence Calendar</h3>
                            <CalendarView
                                adherenceData={adherence.reduce((acc, curr) => ({ ...acc, [curr.date]: curr.status }), {})}
                                reminders={reminders}
                                isInteractive={false} // Doctor shouldn't click to take meds
                            />
                        </>
                    ) : (
                        <div style={{ maxWidth: '500px', margin: '0 auto' }}>
                            <h3>Add New Prescription</h3>
                            <form onSubmit={handlePrescribe}>
                                <div className="form-group">
                                    <label>Drug Name</label>
                                    <input value={drugName} onChange={e => setDrugName(e.target.value)} placeholder="e.g. Amoxicillin" required />
                                </div>
                                <div className="form-group">
                                    <label>Dosage</label>
                                    <input value={dosage} onChange={e => setDosage(e.target.value)} placeholder="e.g. 500mg" required />
                                </div>
                                <div className="form-group">
                                    <label>Duration</label>
                                    <input value={duration} onChange={e => setDuration(e.target.value)} placeholder="e.g. 7 days" required />
                                </div>
                                <div className="form-group">
                                    <label>Reason for Medication</label>
                                    <textarea
                                        value={reason}
                                        onChange={e => setReason(e.target.value)}
                                        placeholder="e.g. For throat infection..."
                                        style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                                        rows={3}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Frequency</label>
                                    <select value={frequency} onChange={e => setFrequency(e.target.value)}>
                                        <option value="daily">Daily</option>
                                        <option value="twice_daily">Twice Daily</option>
                                        <option value="weekly">Weekly</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Time</label>
                                    <input type="time" value={time} onChange={e => setTime(e.target.value)} required />
                                </div>
                                <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '10px' }}>
                                    Confirm Prescription & Notify Patient
                                </button>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DoctorPatientView;
