import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

/**
 * Hook to track online users using Supabase Realtime Presence
 * Also handles visitor count increment on first visit
 */
export const usePresence = (userId) => {
    const [onlineCount, setOnlineCount] = useState(0);
    const [totalVisitors, setTotalVisitors] = useState(0);

    useEffect(() => {
        if (!userId) return;

        // Create a unique channel for presence tracking
        const channel = supabase.channel('online-users', {
            config: {
                presence: {
                    key: userId,
                },
            },
        });

        // Track presence state
        channel
            .on('presence', { event: 'sync' }, () => {
                const state = channel.presenceState();
                const count = Object.keys(state).length;
                setOnlineCount(count);
            })
            .on('presence', { event: 'join' }, ({ key, newPresences }) => {
                console.log('User joined:', key);
            })
            .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
                console.log('User left:', key);
            })
            .subscribe(async (status) => {
                if (status === 'SUBSCRIBED') {
                    // Track this user as present
                    await channel.track({
                        user_id: userId,
                        online_at: new Date().toISOString(),
                    });
                }
            });

        // Cleanup on unmount
        return () => {
            channel.unsubscribe();
        };
    }, [userId]);

    // Fetch and increment visitor count (once per session)
    useEffect(() => {
        const sessionKey = 'my-callbook-visited';
        const hasVisited = sessionStorage.getItem(sessionKey);

        const trackVisit = async () => {
            try {
                if (!hasVisited) {
                    // First visit this session - increment counter
                    const { data } = await supabase.rpc('increment_visit');
                    setTotalVisitors(data || 0);
                    sessionStorage.setItem(sessionKey, 'true');
                } else {
                    // Already visited - just get current count
                    const { data } = await supabase.rpc('get_visit_count');
                    setTotalVisitors(data || 0);
                }
            } catch (err) {
                console.error('Error tracking visit:', err);
            }
        };

        trackVisit();
    }, []);

    return { onlineCount, totalVisitors };
};

export default usePresence;
