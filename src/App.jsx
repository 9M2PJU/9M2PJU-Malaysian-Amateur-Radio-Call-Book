import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Search from './components/Search';
import Card from './components/Card';
import Footer from './components/Footer';

function App() {
    const [callsigns, setCallsigns] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Fetch the latest callsign data directly from the repository
        // Using refs/heads/main format for reliable access
        const url = `https://raw.githubusercontent.com/9M2PJU/9M2PJU-Malaysian-Amateur-Radio-Call-Book/refs/heads/main/public/callsigns.json?t=${Date.now()}`;

        fetch(url)
            .then(res => {
                if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
                return res.json();
            })
            .then(data => {
                if (!Array.isArray(data)) throw new Error("Data format error: Expected an array");
                setCallsigns(data);
                setFiltered(data);
                setLoading(false);
            })
            .catch(err => {
                console.error('Error fetching data:', err);
                setError(err.message);
                setLoading(false);
            });
    }, []);

    const handleSearch = (term) => {
        setSearchTerm(term);
        if (!term) {
            setFiltered(callsigns);
            return;
        }
        const upperTerm = term.toUpperCase();
        const results = callsigns.filter(item =>
            item.callsign.toUpperCase().includes(upperTerm) ||
            item.name.toUpperCase().includes(upperTerm) ||
            item.location.toUpperCase().includes(upperTerm)
        );
        setFiltered(results);
    };

    return (
        <div className="min-h-screen">
            <Navbar />

            <main className="container" style={{ minHeight: '80vh' }}>
                <div style={{ textAlign: 'center', margin: '40px 0 60px' }}>
                    <h1 style={{
                        fontSize: 'clamp(2rem, 5vw, 3.5rem)',
                        fontWeight: '800',
                        marginBottom: '16px',
                        background: 'linear-gradient(to right, #fff, #94a3b8)',
                        WebkitBackgroundClip: 'text',
                        color: 'transparent',
                        lineHeight: 1.1
                    }}>
                        Malaysian Amateur<br />Radio Directory
                    </h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem' }}>
                        The Modern Interactive Callbook
                    </p>
                </div>

                <Search onSearch={handleSearch} />

                {loading && (
                    <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                        <div style={{ fontSize: '1.5rem', marginBottom: '10px' }}>Loading Directory...</div>
                        <div>Fetching live data from GitHub</div>
                    </div>
                )}

                {error && (
                    <div style={{
                        textAlign: 'center',
                        padding: '20px',
                        background: 'rgba(255, 0, 0, 0.1)',
                        border: '1px solid red',
                        borderRadius: '8px',
                        color: '#ff6666',
                        maxWidth: '600px',
                        margin: '0 auto 20px'
                    }}>
                        <h3>Error Loading Data</h3>
                        <p>{error}</p>
                        <button onClick={() => window.location.reload()} style={{
                            background: '#ff4444',
                            color: 'white',
                            border: 'none',
                            padding: '8px 16px',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            marginTop: '10px'
                        }}>
                            Retry
                        </button>
                    </div>
                )}

                {!loading && !error && (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                        gap: '20px'
                    }}>
                        {filtered.map((item, index) => (
                            <Card key={index} data={item} />
                        ))}
                    </div>
                )}

                {!loading && !error && filtered.length === 0 && (
                    <div style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '40px' }}>
                        No callsigns found for "{searchTerm}"
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}

export default App;
