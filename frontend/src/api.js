import axios from 'axios';

const API_BASE = '/api/v1';

export const api = {
    // Auth
    register: async (userData) => {
        // userData: { username, password, role, fullname }
        const res = await axios.post(`${API_BASE}/auth/register`, userData);
        return res.data;
    },
    login: async (username, password) => {
        const res = await axios.post(`${API_BASE}/auth/login`, { username, password });
        return res.data;
    },

    // Chat
    chat: async (question) => {
        const res = await axios.post(`${API_BASE}/chat`, { question });
        return res.data;
    },

    ingest: async (drugName) => {
        try {
            const res = await axios.post(`${API_BASE}/ingest/${drugName}`);
            return res.data;
        } catch (e) {
            return { success: false };
        }
    },

    generateReminder: async (drugName, dosageText) => {
        const res = await axios.post(`${API_BASE}/reminders/generate`, {
            drug_name: drugName,
            dosage_text: dosageText
        });
        return res.data;
    },

    // Persistence
    addReminder: async (reminderData) => {
        const res = await axios.post(`${API_BASE}/reminders/add`, reminderData);
        return res.data;
    },

    getReminders: async (userId) => {
        const res = await axios.get(`${API_BASE}/reminders/${userId}`);
        return res.data;
    },

    recordAdherence: async (data) => {
        const res = await axios.post(`${API_BASE}/adherence`, data);
        return res.data;
    },

    getAdherence: async (userId) => {
        const res = await axios.get(`${API_BASE}/adherence/${userId}`);
        return res.data;
    }
};
