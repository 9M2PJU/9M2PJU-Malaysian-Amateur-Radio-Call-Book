import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { FaUsers, FaMapMarkerAlt, FaClock, FaBroadcastTower, FaSpinner } from 'react-icons/fa';

const PublicStats = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const { data, error } = await supabase.rpc('get_public_stats');
                if (error) throw error;
                setStats(data);
            } catch (err) {
                console.error('Error fetching public stats:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) {
        return (
            <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)' }}>
                <FaSpinner className="spin" /> Loading stats...
            </div>
        );
    }

    if (error || !stats) return null;

    const statNumberStyle = {
        fontSize: '1.8rem',
        fontWeight: 'bold',
        background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
        WebkitBackgroundClip: 'text',
        color: 'transparent',
        margin: '5px 0'
    };

    const statLabelStyle = {
        color: 'var(--text-muted)',
        fontSize: '0.75rem',
        textTransform: 'uppercase',
        letterSpacing: '0.5px'
    };

    return (
        <div className="glass-panel" style={{
            width: '100%',
            maxWidth: '500px',
            margin: '0 auto',
            padding: '20px',
            background: 'rgba(255, 255, 255, 0.03)'
        }}>
            <div style={{
                display: 'flex',
                justifyContent: 'space-around',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '20px'
            }}>
                {/* Total Operators Section */}
                <div style={{ flex: '1', minWidth: '120px', textAlign: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '5px' }}>
                        <FaUsers size={14} color="var(--primary)" />
                        <span style={statLabelStyle}>Total Operators</span>
                    </div>
                    <div style={statNumberStyle}>{stats.total_operators}</div>
                </div>

                {/* Divider - Hidden on small mobile */}
                <div className="hide-on-mobile" style={{ width: '1px', height: '40px', background: 'var(--glass-border)', opacity: 0.5 }}></div>

                {/* Class Breakdown Section */}
                <div style={{ flex: '1', minWidth: '150px' }}>
                    {Object.entries(stats.class_counts).map(([cls, count]) => (
                        <div key={cls} style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            fontSize: '0.8rem',
                            marginBottom: '4px'
                        }}>
                            <span style={{ color: 'var(--text-muted)' }}>{cls}</span>
                            <span style={{ color: 'var(--secondary)', fontWeight: 'bold' }}>{count}</span>
                        </div>
                    ))}
                </div>

                {/* Divider */}
                <div style={{ width: '100%', height: '1px', background: 'var(--glass-border)', opacity: 0.3, margin: '10px 0' }}></div>

                {/* Bottom Row: Locations and Recent */}
                <div style={{ width: '100%', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', alignItems: 'start' }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase' }}>
                            <FaMapMarkerAlt size={12} /> Top Locations
                        </div>
                        {stats.top_locations?.map((loc) => (
                            <div key={loc.location} style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                fontSize: '0.75rem',
                                color: 'var(--text-muted)',
                                marginBottom: '2px'
                            }}>
                                <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '80%' }}>{loc.location}</span>
                                <span style={{ color: 'var(--primary)' }}>{loc.count}</span>
                            </div>
                        ))}
                    </div>

                    <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                            <FaClock size={12} color="#22c55e" />
                            <span style={statLabelStyle}>New (7 Days)</span>
                        </div>
                        <div style={{ ...statNumberStyle, fontSize: '1.5rem', margin: 0 }}>{stats.recent_count}</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PublicStats;
