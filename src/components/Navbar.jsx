import React, { useState } from 'react';
import { FaBroadcastTower, FaSignOutAlt, FaUser } from 'react-icons/fa';
import SubmissionModal from './SubmissionModal';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { user, signOut } = useAuth();
    const navigate = useNavigate();

    const handleSignOut = async () => {
        await signOut();
        navigate('/login');
    };

    return (
        <>
            <nav className="glass-panel" style={{
                margin: '20px',
                padding: '1rem 2rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                position: 'sticky',
                top: '20px',
                zIndex: 100
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <FaBroadcastTower size={28} color="var(--primary)" />
                    <h1 style={{ margin: 0, background: 'linear-gradient(to right, var(--primary), var(--secondary))', WebkitBackgroundClip: 'text', color: 'transparent', fontSize: '1.5rem', fontWeight: 'bold' }}>
                        MY-Callbook
                    </h1>
                </div>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    {user ? (
                        <>
                            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginRight: '10px' }}>
                                <FaUser style={{ marginRight: '5px' }} /> {user.email}
                            </span>
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="btn-primary"
                                style={{ fontSize: '0.9rem' }}
                            >
                                + Add Callsign
                            </button>
                            <button
                                onClick={handleSignOut}
                                style={{
                                    background: 'rgba(255, 255, 255, 0.1)',
                                    border: '1px solid var(--glass-border)',
                                    color: 'var(--text-muted)',
                                    padding: '8px 12px',
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                    fontSize: '0.9rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px'
                                }}
                            >
                                <FaSignOutAlt /> Logout
                            </button>
                        </>
                    ) : (
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                            Restricted Access
                        </div>
                    )}
                </div>
            </nav>
            <SubmissionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </>
    );
};

export default Navbar;
