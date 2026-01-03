import React, { useState, useEffect } from 'react';
import { User, Activity, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { api } from '../api';
import DoctorPatientView from './DoctorPatientView';

const CaregiverDashboard = () => {
    const [patients, setPatients] = useState([]);
    const [selectedPatient, setSelectedPatient] = useState(null);

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const data = await api.getPatients();
                setPatients(data);
            } catch (e) {
                console.error("Failed to load patients", e);
            }
        };
        fetchPatients();
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <header className="mb-10 bg-white p-5 rounded-xl border border-slate-200 flex justify-between items-center shadow-sm" style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                <div>
                    <h1 style={{ marginBottom: '5px' }}>Doctor Dashboard</h1>
                    <p>Manage Patients & Prescriptions</p>
                </div>
            </header>

            {/* Patient List */}
            <div>
                <h2 style={{ marginBottom: '20px' }}>My Patients</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                    {patients.map(patient => (
                        <div
                            key={patient.id}
                            className="card card-hover"
                            style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                            onClick={() => setSelectedPatient(patient)}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                <div style={{
                                    width: '50px', height: '50px', borderRadius: '50%',
                                    backgroundColor: '#e3f2fd', color: '#0056b3',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                                }}>
                                    <User size={24} />
                                </div>
                                <div>
                                    <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{patient.username}</h3>
                                    <span style={{ fontSize: '0.9rem', color: '#64748b' }}>Patient ID: #{patient.id}</span>
                                </div>
                            </div>
                            <ChevronRight color="#cbd5e1" />
                        </div>
                    ))}

                    {patients.length === 0 && (
                        <div style={{ color: '#64748b', fontStyle: 'italic' }}>No patients found.</div>
                    )}
                </div>
            </div>

            {/* Modal for Patient View */}
            {selectedPatient && (
                <DoctorPatientView
                    patientId={selectedPatient.id}
                    patientName={selectedPatient.username}
                    onClose={() => setSelectedPatient(null)}
                />
            )}

        </motion.div>
    );
};

export default CaregiverDashboard;
