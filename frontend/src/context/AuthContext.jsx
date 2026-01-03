import React, { createContext, useState, useContext } from 'react';
import { api } from '../api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    const login = async (username, password) => {
        try {
            const res = await api.login(username, password);
            // res: { id, username, role }
            setUser(res);
            localStorage.setItem('user', JSON.stringify(res));
            return true;
        } catch (e) {
            console.error("Login failed", e);
            throw e; // Let component handle error UI
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
    };

    React.useEffect(() => {
        const saved = localStorage.getItem('user');
        if (saved) setUser(JSON.parse(saved));
    }, []);

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
