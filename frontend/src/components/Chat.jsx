import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot } from 'lucide-react';
import { motion } from 'framer-motion';
import { api } from '../api';

const Chat = () => {
    const [messages, setMessages] = useState([
        { role: 'system', text: 'Hello! I am your Label-Aware Assistant. I can answer questions about medicines found in my database.' }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const bottomRef = useRef(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg = { role: 'user', text: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setLoading(true);

        try {
            const res = await api.chat(userMsg.text);
            setMessages(prev => [...prev, { role: 'system', text: res.answer }]);
        } catch (e) {
            setMessages(prev => [...prev, { role: 'system', text: "Error: Could not reach assistant." }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            style={{ height: 'calc(100vh - 80px)', display: 'flex', flexDirection: 'column' }}
        >
            <header className="mb-5">
                <h1>MedCare Assistant</h1>
                <p>Ask questions based on official FDA labels.</p>
                <div style={{ marginTop: '10px', fontSize: '13px', color: '#b91c1c', backgroundColor: '#fee2e2', padding: '8px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontWeight: 'bold' }}>!</span> This system provides information from official drug labels and does not replace professional medical advice.
                </div>
            </header>

            <div className="card" style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden' }}>
                <div style={{ flex: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    {messages.map((msg, idx) => (
                        <div key={idx} style={{
                            maxWidth: '80%', padding: '12px 18px', borderRadius: '12px', lineHeight: '1.5',
                            alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                            backgroundColor: msg.role === 'user' ? '#1976d2' : '#e3f2fd', // Medical Blue / Soft Blue
                            color: msg.role === 'user' ? 'white' : '#0d47a1', // White / Dark Blue Text
                            border: msg.role === 'system' ? '1px solid #bbdefb' : 'none'
                        }}>
                            {msg.text}
                        </div>
                    ))}
                    {loading && (
                        <div style={{ alignSelf: 'flex-start', color: '#8b949e', padding: '10px' }}>Typing...</div>
                    )}
                    <div ref={bottomRef} />
                </div>

                <div style={{ padding: '20px', borderTop: '1px solid #30363d', display: 'flex', gap: '10px' }}>
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Ask a question..."
                        style={{
                            flex: 1, backgroundColor: 'white', border: '1px solid #e2e8f0',
                            padding: '12px', borderRadius: '8px', color: '#2d3436', outline: 'none'
                        }}
                    />
                    <button
                        onClick={handleSend}
                        style={{
                            backgroundColor: '#58a6ff', border: 'none', width: '46px',
                            borderRadius: '8px', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}
                    >
                        <Send size={20} />
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

export default Chat;
