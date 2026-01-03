import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api';
import { useNavigate } from 'react-router-dom';
import { HeartPulse, User, Users, ArrowRight } from 'lucide-react';

const Register = () => {
    const [role, setRole] = useState('patient');
    const [formData, setFormData] = useState({
        fullName: '',
        identifier: '', // Email or Phone
        password: '',
        confirmPassword: ''
    });

    const { login } = useAuth(); // We'll just auto-login after mock reg
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        if (!formData.fullName || !formData.identifier || !formData.password) return;
        if (formData.password !== formData.confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        try {
            await api.register({
                username: formData.identifier,
                password: formData.password,
                fullname: formData.fullName,
                role: role
            });
            alert("Registration successful! Please sign in.");
            navigate('/login');
        } catch (e) {
            alert("Registration failed: " + (e.response?.data?.detail || e.message));
        }
    };

    return (
        <div className="auth-container" style={{ padding: '20px', minHeight: '100vh', overflowY: 'auto' }}>
            <div className="auth-card" style={{ maxWidth: '500px', margin: '20px auto' }}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px', color: '#0056b3' }}>
                    <HeartPulse size={56} />
                </div>
                <h1 style={{ marginBottom: '10px', fontSize: '2rem' }}>Create Account</h1>
                <p style={{ marginBottom: '30px', fontSize: '1.1rem' }}>Join MedCare for trusted medication tracking.</p>

                <form onSubmit={handleRegister}>
                    {/* Role Cards */}
                    <div className="form-group" style={{ marginBottom: '2rem' }}>
                        <label style={{ fontSize: '1rem', marginBottom: '1rem' }}>I am creating an account as...</label>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                            <div
                                onClick={() => setRole('patient')}
                                style={{
                                    border: `2px solid ${role === 'patient' ? '#0056b3' : '#e2e8f0'}`,
                                    padding: '15px', borderRadius: '12px', cursor: 'pointer',
                                    backgroundColor: role === 'patient' ? '#f0f9ff' : 'white',
                                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px'
                                }}
                            >
                                <User size={32} color={role === 'patient' ? '#0056b3' : '#64748b'} />
                                <span style={{ fontWeight: '600', color: role === 'patient' ? '#0056b3' : '#2d3436' }}>Patient</span>
                            </div>

                            <div
                                onClick={() => setRole('caregiver')}
                                style={{
                                    border: `2px solid ${role === 'caregiver' ? '#0056b3' : '#e2e8f0'}`,
                                    padding: '15px', borderRadius: '12px', cursor: 'pointer',
                                    backgroundColor: role === 'caregiver' ? '#f0f9ff' : 'white',
                                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px'
                                }}
                            >
                                <Users size={32} color={role === 'caregiver' ? '#0056b3' : '#64748b'} />
                                <span style={{ fontWeight: '600', color: role === 'caregiver' ? '#0056b3' : '#2d3436' }}>Caregiver</span>
                            </div>
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Full Name</label>
                        <input
                            type="text" name="fullName"
                            placeholder="e.g. Jane Doe"
                            value={formData.fullName} onChange={handleChange}
                            style={{ padding: '14px', fontSize: '1.1rem' }}
                        />
                    </div>

                    <div className="form-group">
                        <label>Email or Phone Number</label>
                        <input
                            type="text" name="identifier"
                            placeholder="e.g. jane@example.com"
                            value={formData.identifier} onChange={handleChange}
                            style={{ padding: '14px', fontSize: '1.1rem' }}
                        />
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password" name="password"
                            placeholder="Create a strong password"
                            value={formData.password} onChange={handleChange}
                            style={{ padding: '14px', fontSize: '1.1rem' }}
                        />
                    </div>

                    <div className="form-group" style={{ marginBottom: '2rem' }}>
                        <label>Confirm Password</label>
                        <input
                            type="password" name="confirmPassword"
                            placeholder="Repeat password"
                            value={formData.confirmPassword} onChange={handleChange}
                            style={{ padding: '14px', fontSize: '1.1rem' }}
                        />
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ padding: '16px', fontSize: '1.2rem', marginBottom: '1rem', width: '100%', display: 'flex', justifyContent: 'center', gap: '10px' }}>
                        <span>Create Account</span> <ArrowRight size={20} />
                    </button>
                </form>

                <p style={{ marginTop: '20px', fontSize: '1rem' }}>
                    Already have an account? <span onClick={() => navigate('/login')} style={{ color: '#0056b3', cursor: 'pointer', fontWeight: 'bold', textDecoration: 'underline' }}>Sign In</span>
                </p>
            </div>
        </div>
    );
};

export default Register;
