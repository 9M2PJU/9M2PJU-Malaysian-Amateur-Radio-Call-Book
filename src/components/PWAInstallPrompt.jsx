import React, { useEffect, useState } from 'react';
import { MdSmartphone, MdFlashOn, MdNotifications, MdFavorite, MdClose } from 'react-icons/md';
import { useAuth } from './AuthContext';
import { usePWA } from './PWAContext';
import DonationModal from './DonationModal';

const PWAInstallPrompt = () => {
    const { user } = useAuth();
    const { isPromptVisible, showInstallPrompt, hideInstallPrompt, installFromPrompt, isInstallable } = usePWA();
    const [isMobile, setIsMobile] = useState(false);
    const [isDonationModalOpen, setIsDonationModalOpen] = useState(false);

    // Detect if user is on mobile device
    useEffect(() => {
        const checkMobile = () => {
            const userAgent = navigator.userAgent || navigator.vendor || window.opera;
            const mobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent.toLowerCase());
            setIsMobile(mobile);
        };
        checkMobile();
    }, []);

    // Auto-show logic: Only auto-show on MOBILE when logged in and installable
    useEffect(() => {
        console.log('🔧 PWAInstallPrompt: Auto-show check', { isInstallable, hasUser: !!user, isMobile });
        if (isInstallable && user && isMobile) {
            // Mobile: Always show until user installs
            console.log('✅ PWAInstallPrompt: Auto-showing install prompt (mobile)');
            showInstallPrompt();
        }
    }, [isInstallable, user, isMobile]);

    if (!isPromptVisible) return null;

    return (
        <div className="pwa-overlay">
            <div className="pwa-modal">
                <button
                    onClick={hideInstallPrompt}
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
                            <MdFavorite className="pwa-feature-icon" />
                            <span>Support via donation</span>
                        </div>
                    </div>

                    <button
                        onClick={installFromPrompt}
                        className="pwa-btn-install"
                    >
                        Install Now
                    </button>

                    <button
                        onClick={() => setIsDonationModalOpen(true)}
                        className="pwa-btn-donate"
                    >
                        ❤️ Donate
                    </button>

                    <button
                        onClick={hideInstallPrompt}
                        className="pwa-btn-later"
                    >
                        Maybe later
                    </button>

                    <DonationModal
                        isOpen={isDonationModalOpen}
                        onClose={() => setIsDonationModalOpen(false)}
                    />
                </div>
            </div>
        </div>
    );
};

export default PWAInstallPrompt;
