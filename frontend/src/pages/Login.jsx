import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { HeartPulse, User, Users } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        if (!email || !password) {
            setError('Please enter both email and password');
            return;
        }

        try {
            await login(email, password);
            navigate('/');
        } catch (err) {
            setError('Invalid email or password');
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px', color: '#0056b3' }}>
                    <HeartPulse size={48} />
                </div>
                <h1 style={{ marginBottom: '10px' }}>MedCare Portal</h1>
                <p style={{ marginBottom: '30px' }}>Secure Access</p>

                {error && <div style={{ color: 'red', marginBottom: '15px', fontSize: '0.9rem' }}>{error}</div>}

                <form onSubmit={handleLogin}>
                    <div className="form-group">
                        <label>Email or Phone Number</label>
                        <input
                            type="text"
                            placeholder="e.g. 555-0123"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={{ width: '100%', padding: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '8px' }}
                        />
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ marginTop: '10px' }}>
                        Sign In
                    </button>
                </form>

                <p style={{ marginTop: '20px', fontSize: '0.9rem' }}>
                    New User? <span onClick={() => navigate('/register')} style={{ color: '#0056b3', cursor: 'pointer', fontWeight: 'bold' }}>Register Here</span>
                </p>
            </div>
        </div>
    );
};

export default Login;
