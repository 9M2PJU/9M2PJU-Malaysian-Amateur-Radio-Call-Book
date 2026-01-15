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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-300">
            <div className="bg-[#0a0a0a] border border-gray-800 rounded-2xl p-6 w-full max-w-sm shadow-2xl relative">
                <button
                    onClick={handleDismiss}
                    className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                >
                    <MdClose size={24} />
                </button>

                <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-rose-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-pink-500/20">
                        <MdSmartphone className="text-white text-3xl" />
                    </div>

                    <h2 className="text-xl font-bold text-white mb-2">Add MY-Callbook to Homescreen</h2>
                    <p className="text-gray-400 text-sm mb-6">
                        Access MY-Callbook faster! Install as an app for the best experience.
                    </p>

                    <div className="w-full space-y-3 mb-8 text-left">
                        <div className="flex items-center text-gray-300 text-sm">
                            <MdFlashOn className="text-yellow-400 mr-3 text-lg" />
                            <span>Fast access from homescreen</span>
                        </div>
                        <div className="flex items-center text-gray-300 text-sm">
                            <MdNotifications className="text-yellow-400 mr-3 text-lg" />
                            <span>Latest event notifications</span>
                        </div>
                        <div className="flex items-center text-gray-300 text-sm">
                            <MdOfflinePin className="text-yellow-400 mr-3 text-lg" />
                            <span>Works offline</span>
                        </div>
                    </div>

                    <button
                        onClick={handleInstallClick}
                        className="w-full bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white font-semibold py-3 px-6 rounded-xl transition-all active:scale-95 mb-3 shadow-lg shadow-pink-500/25"
                    >
                        Install Now
                    </button>

                    <button
                        onClick={handleDismiss}
                        className="w-full bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-500 font-semibold py-3 px-6 rounded-xl transition-all active:scale-95 border border-yellow-500/20"
                    >
                        Maybe later
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PWAInstallPrompt;
