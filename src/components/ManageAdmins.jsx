import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';
import Navbar from './Navbar';
import Footer from './Footer';
import { FaUserShield, FaTrash, FaPlus, FaSpinner } from 'react-icons/fa';

const ManageAdmins = () => {
    const { user, isSuperAdmin } = useAuth();
    const [admins, setAdmins] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newEmail, setNewEmail] = useState('');
    const [adding, setAdding] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        if (isSuperAdmin) {
            fetchAdmins();
        }
    }, [isSuperAdmin]);

    const fetchAdmins = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('admins')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setAdmins(data || []);
        } catch (err) {
            console.error('Error fetching admins:', err);
            setError('Failed to load admins');
        } finally {
            setLoading(false);
        }
    };

    const handleAddAdmin = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!newEmail.trim()) {
            setError('Please enter an email address');
            return;
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(newEmail)) {
            setError('Please enter a valid email address');
            return;
        }

        setAdding(true);

        try {
            const { error } = await supabase
                .from('admins')
                .insert({
                    email: newEmail.toLowerCase().trim(),
                    created_by: user?.email
                });

            if (error) {
                if (error.code === '23505') { // Unique violation
                    throw new Error('This email is already an admin');
                }
                throw error;
            }

            setSuccess(`${newEmail} has been added as an admin`);
            setNewEmail('');
            fetchAdmins();
        } catch (err) {
            console.error('Error adding admin:', err);
            setError(err.message || 'Failed to add admin');
        } finally {
            setAdding(false);
        }
    };

    const handleRemoveAdmin = async (adminEmail) => {
        if (!window.confirm(`Are you sure you want to remove ${adminEmail} as an admin?`)) {
            return;
        }

        try {
            const { error } = await supabase
                .from('admins')
                .delete()
                .eq('email', adminEmail);

            if (error) throw error;

            setSuccess(`${adminEmail} has been removed as an admin`);
            fetchAdmins();
        } catch (err) {
            console.error('Error removing admin:', err);
            setError('Failed to remove admin');
        }
    };

    if (!isSuperAdmin) {
        return (
            <div className="min-h-screen">
                <Navbar />
                <main className="container" style={{ minHeight: '80vh', padding: '40px 20px', textAlign: 'center' }}>
                    <h1 style={{ color: '#ff4444' }}>Access Denied</h1>
                    <p style={{ color: 'var(--text-muted)' }}>You do not have permission to access this page.</p>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            <Navbar />
            <main className="container" style={{ minHeight: '80vh', padding: '20px' }}>
                <div style={{ marginTop: '40px', marginBottom: '40px' }}>
                    <h1 style={{
                        fontSize: '2rem',
                        background: 'linear-gradient(to right, var(--primary), var(--secondary))',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        marginBottom: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px'
                    }}>
                        <FaUserShield /> Manage Admins
                    </h1>
                    <p style={{ color: 'var(--text-muted)' }}>
                        Add or remove administrators who can edit any callsign.
                    </p>
                </div>

                {/* Add Admin Form */}
                <div className="glass-panel" style={{ padding: '24px', marginBottom: '24px', maxWidth: '500px' }}>
                    <h3 style={{ color: '#fff', marginTop: 0, marginBottom: '16px' }}>Add New Admin</h3>

                    {error && (
                        <div style={{
                            background: 'rgba(255, 0, 0, 0.1)',
                            border: '1px solid #ff4444',
                            borderRadius: '8px',
                            padding: '12px',
                            marginBottom: '16px',
                            color: '#ff6666'
                        }}>
                            {error}
                        </div>
                    )}

                    {success && (
                        <div style={{
                            background: 'rgba(34, 197, 94, 0.1)',
                            border: '1px solid #22c55e',
                            borderRadius: '8px',
                            padding: '12px',
                            marginBottom: '16px',
                            color: '#22c55e'
                        }}>
                            {success}
                        </div>
                    )}

                    <form onSubmit={handleAddAdmin} style={{ display: 'flex', gap: '12px' }}>
                        <input
                            type="email"
                            value={newEmail}
                            onChange={(e) => setNewEmail(e.target.value)}
                            placeholder="admin@example.com"
                            style={{
                                flex: 1,
                                padding: '12px',
                                borderRadius: '8px',
                                border: '1px solid var(--glass-border)',
                                background: 'rgba(255,255,255,0.05)',
                                color: '#fff',
                                fontSize: '1rem'
                            }}
                        />
                        <button
                            type="submit"
                            disabled={adding}
                            style={{
                                padding: '12px 24px',
                                background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
                                border: 'none',
                                borderRadius: '8px',
                                color: '#000',
                                fontWeight: 'bold',
                                cursor: adding ? 'wait' : 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}
                        >
                            {adding ? <FaSpinner className="spin" /> : <FaPlus />}
                            Add
                        </button>
                    </form>
                </div>

                {/* Admin List */}
                <div className="glass-panel" style={{ padding: '24px' }}>
                    <h3 style={{ color: '#fff', marginTop: 0, marginBottom: '16px' }}>
                        Current Admins ({admins.length})
                    </h3>

                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                            <FaSpinner className="spin" /> Loading...
                        </div>
                    ) : admins.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                            No admins added yet. Add an admin above.
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {admins.map((admin) => (
                                <div
                                    key={admin.id}
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        padding: '16px',
                                        background: 'rgba(255,255,255,0.03)',
                                        borderRadius: '8px',
                                        border: '1px solid var(--glass-border)'
                                    }}
                                >
                                    <div>
                                        <div style={{ color: '#fff', fontWeight: '500' }}>{admin.email}</div>
                                        <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                                            Added {new Date(admin.created_at).toLocaleDateString()}
                                            {admin.created_by && ` by ${admin.created_by}`}
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleRemoveAdmin(admin.email)}
                                        style={{
                                            background: 'rgba(239, 68, 68, 0.2)',
                                            border: '1px solid rgba(239, 68, 68, 0.4)',
                                            color: '#ef4444',
                                            padding: '8px 16px',
                                            borderRadius: '6px',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '6px',
                                            fontWeight: '500'
                                        }}
                                    >
                                        <FaTrash /> Remove
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Info Box */}
                <div style={{
                    marginTop: '24px',
                    padding: '16px',
                    background: 'rgba(79, 172, 254, 0.1)',
                    borderLeft: '4px solid var(--primary)',
                    borderRadius: '4px'
                }}>
                    <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                        <strong>Admin Permissions:</strong> Admins can edit any callsign in the directory.<br />
                        <strong>Super Admin:</strong> Only you (9m2pju@hamradio.my) can delete callsigns and manage admins.
                    </p>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default ManageAdmins;
