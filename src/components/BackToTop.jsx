import React, { useState, useEffect } from 'react';

const BackToTop = () => {
    const [isVisible, setIsVisible] = useState(false);

    // Toggle visibility based on scroll position
    const toggleVisibility = () => {
        if (window.scrollY > 300) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    };

    // Scroll to top smoothly
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    useEffect(() => {
        toggleVisibility();
        window.addEventListener('scroll', toggleVisibility);
        return () => {
            window.removeEventListener('scroll', toggleVisibility);
        };
    }, []);

    return (
        <div
            className={`transition-all duration-500 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}
            style={{
                position: 'fixed',
                bottom: '2rem',
                right: '2rem',
                zIndex: 99
            }}
        >
            <button
                type="button"
                onClick={scrollToTop}
                className="group flex items-center justify-center w-12 h-12 rounded-full backdrop-blur-md transition-all duration-300 shadow-lg hover:shadow-cyan-500/50 border border-white/10"
                style={{
                    background: 'rgba(15, 23, 42, 0.6)',
                }}
                aria-label="Back to top"
            >
                {/* Gradient Border Overlay */}
                <div className="absolute inset-0 rounded-full p-[1px] bg-gradient-to-br from-cyan-400 to-blue-600 opacity-50 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>

                <svg
                    className="w-6 h-6 text-cyan-400 group-hover:text-white transition-colors duration-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2.5"
                        d="M5 15l7-7 7 7"
                    ></path>
                </svg>
            </button>
        </div>
    );
};

export default BackToTop;
