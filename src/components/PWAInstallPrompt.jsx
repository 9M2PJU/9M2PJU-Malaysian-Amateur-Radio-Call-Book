import React, { useState, useEffect } from 'react';
import { MdSmartphone, MdFlashOn, MdNotifications, MdOfflinePin, MdClose } from 'react-icons/md';
import { useAuth } from './AuthContext';

const PWAInstallPrompt = () => {
    const { user } = useAuth();
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handler = (e) => {
            // Prevent the mini-infobar from appearing on mobile
            e.preventDefault();
            // Stash the event so it can be triggered later.
            setDeferredPrompt(e);
            // Don't show yet, wait for user login check in next effect
        };

        window.addEventListener('beforeinstallprompt', handler);

        return () => {
            window.removeEventListener('beforeinstallprompt', handler);
        };
    }, []);

    // Show prompt only when we have the deferred event AND the user is logged in
    useEffect(() => {
        if (deferredPrompt && user) {
            setIsVisible(true);
        }
    }, [deferredPrompt, user]);

    const handleInstallClick = async () => {
        if (!deferredPrompt) return;

        // Show the install prompt
        deferredPrompt.prompt();

        // Wait for the user to respond to the prompt
        const { outcome } = await deferredPrompt.userChoice;

        // We've used the prompt, and can't use it again, discard it
        setDeferredPrompt(null);
        setIsVisible(false);
    };

    const handleDismiss = () => {
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div className="pwa-overlay">
            <div className="pwa-modal">
                <button
                    onClick={handleDismiss}
                    className="pwa-close-btn"
                >
                    <MdClose size={24} />
                </button>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                    <div className="pwa-icon-container">
                        <MdSmartphone style={{ color: 'white', fontSize: '1.875rem' }} />
                    </div>

                    <h2 className="pwa-title">Add MY-Callbook to Homescreen</h2>
                    <p className="pwa-text">
                        Access MY-Callbook faster! Install as an app for the best experience.
                    </p>

                    <div className="pwa-features">
                        <div className="pwa-feature-item">
                            <MdFlashOn className="pwa-feature-icon" />
                            <span>Fast access from homescreen</span>
                        </div>
                        <div className="pwa-feature-item">
                            <MdNotifications className="pwa-feature-icon" />
                            <span>Latest event notifications</span>
                        </div>
                        <div className="pwa-feature-item">
                            <MdOfflinePin className="pwa-feature-icon" />
                            <span>Works offline</span>
                        </div>
                    </div>

                    <button
                        onClick={handleInstallClick}
                        className="pwa-btn-install"
                    >
                        Install Now
                    </button>

                    <button
                        onClick={handleDismiss}
                        className="pwa-btn-later"
                    >
                        Maybe later
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PWAInstallPrompt;
