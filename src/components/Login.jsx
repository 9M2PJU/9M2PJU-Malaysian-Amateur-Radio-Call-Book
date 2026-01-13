import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { FaLock, FaEnvelope, FaSpinner, FaBroadcastTower } from 'react-icons/fa';

const Login = () => {
    const { signIn } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Redirect to where they were trying to go, or home
    const from = location.state?.from?.pathname || '/';

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const { error } = await signIn({ email, password });
            if (error) throw error;
            navigate(from, { replace: true });
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            height: '100vh',
            width: '100vw',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            padding: '10px'
        }}>
            <div style={{
                width: '100%',
                maxWidth: '450px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '10px' // Tighter gap between header and form
            }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '5px' }}>
                        <FaBroadcastTower size={24} color="var(--primary)" />
                        <h2 style={{ margin: 0, background: 'linear-gradient(to right, var(--primary), var(--secondary))', WebkitBackgroundClip: 'text', color: 'transparent', fontSize: '1.5rem', fontWeight: 'bold' }}>
                            MY-Callbook
                        </h2>
                    </div>
                </div>

                <div className="glass-panel" style={{
                    width: '100%',
                    padding: '25px', // Reduced padding
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '15px' // Use gap for spacing instead of margins
                }}>
                    <div style={{ textAlign: 'center' }}>
                        <h2 style={{
                            margin: 0,
                            background: 'linear-gradient(to right, var(--primary), var(--secondary))',
                            WebkitBackgroundClip: 'text',
                            color: 'transparent',
                            fontSize: '1.5rem'
                        }}>Restricted Access</h2>
                    </div>

                    <div style={{
                        background: 'rgba(255, 100, 100, 0.1)',
                        borderLeft: '4px solid #ff4444',
                        padding: '10px',
                        borderRadius: '4px',
                        fontSize: '0.8rem', // Smaller text
                        color: '#ffaaaa',
                        lineHeight: '1.3'
                    }}>
                        <strong>🔒 Login Required: </strong>
                        Directory contains sensitive info. Please log in to view.
                    </div>

                    {error && (
                        <div style={{
                            background: 'rgba(255,0,0,0.1)',
                            border: '1px solid #ff4444',
                            color: '#ff6666',
                            padding: '8px',
                            borderRadius: '8px',
                            fontSize: '0.85rem'
                        }}>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        <div>
                            <div style={{ position: 'relative' }}>
                                <FaEnvelope style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '10px 10px 10px 35px', // Compact padding
                                        borderRadius: '8px',
                                        border: '1px solid var(--glass-border)',
                                        background: 'rgba(255,255,255,0.05)',
                                        color: '#fff',
                                        fontSize: '0.95rem'
                                    }}
                                    placeholder="Email"
                                />
                            </div>
                        </div>

                        <div>
                            <div style={{ position: 'relative' }}>
                                <FaLock style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '10px 10px 10px 35px',
                                        borderRadius: '8px',
                                        border: '1px solid var(--glass-border)',
                                        background: 'rgba(255,255,255,0.05)',
                                        color: '#fff',
                                        fontSize: '0.95rem'
                                    }}
                                    placeholder="Password"
                                />
                            </div>
                            <div style={{ textAlign: 'right', marginTop: '5px' }}>
                                <Link to="/forgot-password" style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textDecoration: 'none' }}>
                                    Forgot Password?
                                </Link>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                width: '100%',
                                padding: '12px',
                                background: loading
                                    ? 'rgba(255, 255, 255, 0.1)'
                                    : 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
                                border: 'none',
                                borderRadius: '10px',
                                color: loading ? 'var(--text-muted)' : '#000',
                                fontSize: '1rem',
                                fontWeight: 'bold',
                                cursor: loading ? 'wait' : 'pointer',
                                transition: 'all 0.2s',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                gap: '10px'
                            }}
                        >
                            {loading ? <><FaSpinner className="spin" /> ...</> : 'Sign In'}
                        </button>
                    </form>

                    <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                        No account?{' '}
                        <Link to="/register" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 'bold' }}>
                            Register
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
