import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { HeartPulse, LayoutDashboard, Pill, MessageSquare, User, LogOut, Calendar, Users } from 'lucide-react';
import Dashboard from './components/Dashboard';
import Library from './components/Library';
import Chat from './components/Chat';
import CalendarView from './components/CalendarView';
import CaregiverDashboard from './components/CaregiverDashboard';
import Sidebar from './components/Sidebar';
import Register from './pages/Register';
import Login from './pages/Login';
import { AuthProvider, useAuth } from './context/AuthContext';

const ProtectedRoute = ({ children }) => {
    const { user } = useAuth();
    if (!user) return <Navigate to="/login" replace />;
    return children;
};

const AppLayout = ({ children }) => {
    return (
        <div className="app-container">
            <Sidebar />
            <main className="content">
                {children}
            </main>
        </div>
    );
};

const HomeRoute = () => {
    const { user } = useAuth();
    return user?.role === 'caregiver' ? <CaregiverDashboard /> : <Dashboard />;
};

const App = () => {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    <Route path="/*" element={
                        <ProtectedRoute>
                            <AppLayout>
                                <Routes>
                                    <Route path="/" element={<HomeRoute />} />
                                    <Route path="/library" element={<Library />} />
                                    <Route path="/chat" element={<Chat />} />
                                    <Route path="/calendar" element={<CalendarView />} />
                                </Routes>
                            </AppLayout>
                        </ProtectedRoute>
                    } />
                </Routes>
            </Router>
        </AuthProvider>
    );
};

export default App;
