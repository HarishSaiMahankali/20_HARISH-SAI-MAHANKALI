import React, { useState } from 'react';
import { Search, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';
import { api } from '../api';
import { useAuth } from '../context/AuthContext';

const Library = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(false);
    const [selectedDrug, setSelectedDrug] = useState(null);

    const handleSearch = async () => {
        if (!query) return;
        setLoading(true);
        setResults(null);

        const data = await api.ingest(query);
        setLoading(false);

        if (data.success) {
            setResults([{ name: query }]); // Mocking result list since ingest returns success/fail
        } else {
            setResults([]);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
        >
            <header className="mb-10">
                <h1>Drugs Library</h1>
                <p>Search official FDA labels for safety information.</p>
                <div style={{ marginTop: '10px', fontSize: '13px', color: '#0056b3', backgroundColor: '#e3f2fd', padding: '8px', borderRadius: '8px', display: 'inline-block' }}>
                    Reference: Drug information sourced from official FDA labels only.
                </div>
            </header>

            <div style={{
                backgroundColor: '#1e2530', padding: '16px 24px', borderRadius: '50px',
                display: 'flex', alignItems: 'center', gap: '15px', border: '1px solid #30363d', marginBottom: '30px'
            }}>
                <Search size={20} color="#8b949e" />
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search for a medicine (e.g., Advil, Metformin)..."
                    style={{ background: 'transparent', border: 'none', flex: 1, color: 'white', fontSize: '16px', outline: 'none' }}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
                <button
                    onClick={handleSearch}
                    style={{
                        backgroundColor: '#58a6ff', color: 'white', border: 'none',
                        padding: '8px 24px', borderRadius: '20px', cursor: 'pointer', fontWeight: '600'
                    }}
                >
                    {loading ? '...' : 'Search'}
                </button>
            </div>

            <div className="results-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
                {results === null && (
                    <div style={{ textAlign: 'center', gridColumn: '1/-1', color: '#8b949e', padding: '40px' }}>
                        <BookOpen size={48} style={{ marginBottom: '10px', opacity: 0.5 }} />
                        <p>Search for a drug to see details.</p>
                    </div>
                )}

                {results && results.length === 0 && (
                    <div style={{ textAlign: 'center', gridColumn: '1/-1', padding: '20px' }}>No results found.</div>
                )}

                {results && results.map((drug, idx) => (
                    <div
                        key={idx}
                        className="card"
                        style={{ cursor: 'pointer', transition: 'transform 0.2s' }}
                        onClick={() => setSelectedDrug(drug.name)}
                    >
                        <h3>{drug.name}</h3>
                        <p>Click to view details</p>
                    </div>
                ))}
            </div>

            {selectedDrug && (
                <DrugModal drugName={selectedDrug} onClose={() => setSelectedDrug(null)} />
            )}
        </motion.div>
    );
};

const DrugModal = ({ drugName, onClose }) => {
    const [activeTab, setActiveTab] = useState('usage');
    const [content, setContent] = useState('Loading...');
    const [loading, setLoading] = useState(false);

    React.useEffect(() => {
        const fetchInfo = async () => {
            setLoading(true);
            setContent('Loading...');

            let q = "";
            if (activeTab === 'usage') q = `What are the indications and usage for ${drugName}?`;
            if (activeTab === 'dosage') q = `What is the dosage for ${drugName}?`;
            if (activeTab === 'warnings') q = `What are the warnings for ${drugName}?`;

            const res = await api.chat(q);
            setContent(res.answer);
            setLoading(false);
        };
        fetchInfo();
    }, [activeTab, drugName]);

    const { user } = useAuth();

    const addToSchedule = async () => {
        if (!user) { alert("Please login first"); return; }

        await api.generateReminder(drugName, content, user.id);
        alert('Added to schedule!');
        onClose();
    };

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
            background: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
        }}>
            <div className="card" style={{ width: '600px', maxHeight: '80vh', display: 'flex', flexDirection: 'column', position: 'relative' }}>
                <button onClick={onClose} style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', color: 'white', fontSize: '24px', cursor: 'pointer' }}>&times;</button>

                <h2 style={{ marginBottom: '20px' }}>{drugName}</h2>

                <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', borderBottom: '1px solid #30363d' }}>
                    {['usage', 'dosage', 'warnings'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            style={{
                                background: 'none', border: 'none', color: activeTab === tab ? '#58a6ff' : '#8b949e',
                                padding: '10px 15px', cursor: 'pointer', borderBottom: activeTab === tab ? '2px solid #58a6ff' : '2px solid transparent',
                                textTransform: 'capitalize'
                            }}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                <div style={{ flex: 1, overflowY: 'auto', marginBottom: '20px', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
                    {content}
                </div>

                <button
                    onClick={addToSchedule}
                    style={{
                        backgroundColor: '#3FB950', color: 'white', border: 'none',
                        padding: '12px', borderRadius: '8px', width: '100%', fontSize: '16px', cursor: 'pointer'
                    }}
                >
                    📅 Add to Schedule
                </button>

                <button
                    onClick={() => { alert("Redirecting to Chat with context..."); }}
                    style={{
                        marginTop: '10px',
                        backgroundColor: 'transparent', color: '#0056b3', border: '1px solid #0056b3',
                        padding: '12px', borderRadius: '8px', width: '100%', fontSize: '16px', cursor: 'pointer'
                    }}
                >
                    🤖 Ask AI about this drug
                </button>
            </div>
        </div>
    );
};

export default Library;
