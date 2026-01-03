import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { HeartPulse, LayoutDashboard, Pill, MessageSquare, Calendar, User, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const Sidebar = () => {
    const location = useLocation();
    const { user, logout } = useAuth();
    const [isOpen, setIsOpen] = useState(false); // Mobile state

    const isActive = (path) => location.pathname === path;
    const closeSidebar = () => setIsOpen(false);

    // Overlay for mobile when sidebar is open
    const Overlay = () => (
        <div
            style={{
                position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 99
            }}
            onClick={closeSidebar}
        />
    );

    return (
        <>
            {/* Mobile Header with Hamburger */}
            <div className="mobile-header" style={{
                display: 'none', // Hidden on desktop via CSS (media query needed in index.css)
                padding: '15px', alignItems: 'center', justifyContent: 'space-between',
                backgroundColor: 'white', borderBottom: '1px solid #e2e8f0',
                position: 'fixed', top: 0, left: 0, width: '100%', zIndex: 100
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#0056b3' }}>
                    <HeartPulse size={24} />
                    <span style={{ fontWeight: 'bold', fontSize: '18px' }}>MedCare</span>
                </div>
                <button onClick={() => setIsOpen(!isOpen)} style={{ background: 'none', border: 'none' }}>
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Overlay */}
            {isOpen && <Overlay />}

            {/* Sidebar Navigation */}
            <nav className={`sidebar ${isOpen ? 'open' : ''}`} style={{
                zIndex: 101, // Above overlay
                // Add specific mobile styles via class in CSS or inline conditional if prefer JS-only for now
            }}>
                <div className="logo" style={{ marginBottom: '40px' }}>
                    <HeartPulse size={28} />
                    <span>MedCare</span>
                </div>

                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <Link to="/" onClick={closeSidebar} className={`nav-item ${isActive('/') ? 'active' : ''}`}>
                        <LayoutDashboard size={20} /> <span>Dashboard</span>
                    </Link>
                    <Link to="/library" onClick={closeSidebar} className={`nav-item ${isActive('/library') ? 'active' : ''}`}>
                        <Pill size={20} /> <span>Drugs Library</span>
                    </Link>
                    <Link to="/chat" onClick={closeSidebar} className={`nav-item ${isActive('/chat') ? 'active' : ''}`}>
                        <MessageSquare size={20} /> <span>Assistant</span>
                    </Link>
                    <Link to="/calendar" onClick={closeSidebar} className={`nav-item ${isActive('/calendar') ? 'active' : ''}`}>
                        <Calendar size={20} /> <span>Calendar</span>
                    </Link>
                </div>

                <div className="user-profile">
                    <div className="avatar"><User size={20} /></div>
                    <div className="user-info" style={{ flex: 1 }}>
                        <p style={{ fontWeight: '600', color: '#2d3436' }}>{user?.name || 'User'}</p>
                        <p style={{ fontSize: '12px', textTransform: 'capitalize' }}>{user?.role} View</p>
                    </div>
                    <button onClick={logout} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#636e72' }}>
                        <LogOut size={18} />
                    </button>
                </div>
            </nav>
        </>
    );
};

export default Sidebar;
