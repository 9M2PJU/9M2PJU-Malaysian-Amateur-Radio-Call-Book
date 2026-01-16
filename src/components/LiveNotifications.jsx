import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';
import { MdPersonAdd, MdEdit, MdPersonOff, MdPerson, MdClose } from 'react-icons/md';

const LiveNotifications = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [notifications, setNotifications] = useState([]);
    const [myIdentity, setMyIdentity] = useState(null);

    // Keep track of processed events to prevent duplicates
    const processedEvents = useRef(new Set());

    const addNotification = (input) => {
        const id = Date.now() + Math.random();
        const newNotification = {
            id,
            ...input,
            timestamp: new Date()
        };

        setNotifications(prev => [...prev, newNotification]);

        // Auto remove after 5 seconds
        setTimeout(() => {
            removeNotification(id);
        }, 5000);
    };

    const removeNotification = (id) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    const handleNotificationClick = (callsign) => {
        if (!callsign) return;

        // If on directory page, dispatch event
        if (location.pathname === '/') {
            window.dispatchEvent(new CustomEvent('triggerSearch', { detail: callsign }));
        } else {
            // Navigate to home with state
            navigate('/', { state: { search: callsign } });
        }
    };

    // 1. Determine Identity for Presence
    useEffect(() => {
        const fetchIdentity = async () => {
            if (!user) return;

            try {
                // Fetch the primary callsign for this user
                const { data, error } = await supabase
                    .from('callsigns')
                    .select('callsign')
                    .eq('user_id', user.id)
                    .order('created_at', { ascending: true })
                    .limit(1)
                    .maybeSingle();

                if (data) {
                    setMyIdentity(data.callsign);
                } else {
                    const name = user.email ? user.email.split('@')[0] : 'Member';
                    setMyIdentity(name);
                }
            } catch (err) {
                console.error('Error fetching identity:', err);
                setMyIdentity('Member');
            }
        };

        fetchIdentity();
    }, [user]);

    // 2. Setup Realtime Subscriptions
    useEffect(() => {
        if (!user) return;

        const channel = supabase.channel('global_presence', {
            config: {
                presence: {
                    key: user?.id || 'anon-' + Math.random(),
                },
            },
        });

        // --- Presence: Track Logins / Logouts ---
        channel
            .on('presence', { event: 'sync' }, () => {
                // Initial sync - skip
            })
            .on('presence', { event: 'join' }, ({ key, newPresences }) => {
                newPresences.forEach(presence => {
                    if (presence.user_id === user?.id) return;
                    // Debounce logic if needed, but simple check is ok

                    const name = presence.callsign || 'A member';
                    addNotification({
                        type: 'login',
                        title: `${name} is online`,
                        message: 'Just logged in',
                        callsign: presence.callsign, // For click handler
                        icon: <MdPersonAdd style={{ color: '#4ade80' }} />
                    });
                });
            })
            .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
                leftPresences.forEach(presence => {
                    if (presence.user_id === user?.id) return;

                    const name = presence.callsign || 'A member';
                    addNotification({
                        type: 'logout',
                        title: `${name} went offline`,
                        message: 'Logged out',
                        callsign: presence.callsign,
                        icon: <MdPersonOff style={{ color: '#9ca3af' }} />
                    });
                });
            });

        // --- Database: Track Edits ---
        channel
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'callsigns' },
                (payload) => {
                    handleDatabaseChange(payload);
                }
            )
            .subscribe(async (status) => {
                if (status === 'SUBSCRIBED') {
                    if (myIdentity && user) {
                        await channel.track({
                            user_id: user.id,
                            callsign: myIdentity,
                            online_at: new Date().toISOString(),
                        });
                    }
                }
            });

        return () => {
            supabase.removeChannel(channel);
        };
    }, [user, myIdentity]);

    const handleDatabaseChange = async (payload) => {
        const record = payload.new || payload.old;
        if (!record) return;

        // If it's our own change, skip
        if (user && record.user_id === user.id) return;

        let title = '';
        let message = '';
        let icon = <MdEdit style={{ color: '#60a5fa' }} />;
        // Map eventType to class type (insert, update, delete)
        let type = payload.eventType.toLowerCase();

        try {
            if (payload.eventType === 'INSERT') {
                title = `New Operator: ${record.callsign}`;
                message = `${record.name} just joined the directory!`;
                icon = <MdPersonAdd style={{ color: '#c084fc' }} />;
            } else if (payload.eventType === 'UPDATE') {
                title = `${record.callsign} updated`;
                message = 'Profile information was just updated.';
            } else if (payload.eventType === 'DELETE') {
                title = `${record.callsign} removed`;
                message = 'Operator removed from directory.';
                icon = <MdClose style={{ color: '#f87171' }} />;
            }

            if (title) {
                addNotification({
                    type,
                    title,
                    message,
                    icon,
                    callsign: record.callsign
                });
            }
        } catch (e) {
            console.error('Error handling db notification:', e);
        }
    };

    if (notifications.length === 0) return null;

    return (
        <div className="live-notifications-container">
            {notifications.map((note) => (
                <div
                    key={note.id}
                    className={`live-notification-toast ${note.type}`}
                    onClick={() => handleNotificationClick(note.callsign)}
                    role="alert"
                >
                    <div className="notification-icon-wrapper">
                        {note.icon || <MdPerson style={{ color: '#ffffff' }} />}
                    </div>
                    <div className="notification-content">
                        <h4 className="notification-title">{note.title}</h4>
                        <p className="notification-message">{note.message}</p>
                    </div>
                    <button
                        onClick={(e) => {
                            e.stopPropagation(); // Don't trigger search
                            removeNotification(note.id);
                        }}
                        className="notification-close-btn"
                    >
                        <MdClose size={16} />
                    </button>
                    {/* The ::after element handles the countdown bar via CSS */}
                </div>
            ))}
        </div>
    );
};

export default LiveNotifications;
