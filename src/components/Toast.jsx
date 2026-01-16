import React, { createContext, useContext, useState, useCallback } from 'react';
import { FaCheckCircle, FaExclamationCircle, FaInfoCircle, FaTimes } from 'react-icons/fa';

// Toast Context
const ToastContext = createContext(null);

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        // Return a no-op fallback to prevent crashes during SSR or lazy loading
        console.warn('useToast called outside ToastProvider - returning no-op fallback');
        return {
            success: () => { },
            error: () => { },
            info: () => { }
        };
    }
    return context;
};

// Toast Component
const Toast = ({ id, message, type, onClose }) => {
    const icons = {
        success: <FaCheckCircle />,
        error: <FaExclamationCircle />,
        info: <FaInfoCircle />
    };

    const colors = {
        success: { bg: 'rgba(0, 200, 83, 0.15)', border: '#00c853', text: '#69f0ae' },
        error: { bg: 'rgba(255, 68, 68, 0.15)', border: '#ff4444', text: '#ff6b6b' },
        info: { bg: 'rgba(79, 172, 254, 0.15)', border: '#4facfe', text: '#81d4fa' }
    };

    const color = colors[type] || colors.info;

    return (
        <div
            className="toast-item"
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '14px 18px',
                background: color.bg,
                border: `1px solid ${color.border}`,
                borderRadius: '12px',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                color: color.text,
                fontSize: '0.95rem',
                minWidth: '280px',
                maxWidth: '400px',
                animation: 'slideIn 0.3s ease-out'
            }}
        >
            <span style={{ fontSize: '1.2rem', flexShrink: 0 }}>{icons[type]}</span>
            <span style={{ flex: 1 }}>{message}</span>
            <button
                onClick={() => onClose(id)}
                style={{
                    background: 'transparent',
                    border: 'none',
                    color: color.text,
                    cursor: 'pointer',
                    padding: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    opacity: 0.7,
                    transition: 'opacity 0.2s'
                }}
                onMouseEnter={e => e.target.style.opacity = 1}
                onMouseLeave={e => e.target.style.opacity = 0.7}
            >
                <FaTimes />
            </button>
        </div>
    );
};

// Toast Container
const ToastContainer = ({ toasts, removeToast }) => {
    return (
        <>
            <style>{`
                @keyframes slideIn {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
                @keyframes slideDown {
                    from {
                        transform: translateY(-50px);
                        opacity: 0;
                    }
                    to {
                        transform: translateY(0);
                        opacity: 1;
                    }
                }
                
                /* Mobile Responsive Toast */
                @media (max-width: 480px) {
                    .toast-container {
                        left: 10px !important;
                        right: 10px !important;
                        top: 70px !important;
                        align-items: center !important;
                        width: auto !important;
                    }
                    .toast-item {
                        width: 100% !important;
                        min-width: unset !important;
                        max-width: 100% !important;
                        animation: slideDown 0.3s ease-out !important;
                        box-sizing: border-box;
                    }
                }
            `}</style>
            <div
                className="toast-container"
                style={{
                    position: 'fixed',
                    top: '80px',
                    right: '20px',
                    zIndex: 9999,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px'
                }}
            >
                {toasts.map(toast => (
                    <Toast
                        key={toast.id}
                        id={toast.id}
                        message={toast.message}
                        type={toast.type}
                        onClose={removeToast}
                    />
                ))}
            </div>
        </>
    );
};

// Toast Provider
export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((message, type = 'info', duration = 4000) => {
        const id = Date.now() + Math.random();
        setToasts(prev => [...prev, { id, message, type }]);

        // Auto remove after duration
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, duration);

        return id;
    }, []);

    const removeToast = useCallback((id) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    const toast = {
        success: (message, duration) => addToast(message, 'success', duration),
        error: (message, duration) => addToast(message, 'error', duration),
        info: (message, duration) => addToast(message, 'info', duration)
    };

    return (
        <ToastContext.Provider value={toast}>
            {children}
            <ToastContainer toasts={toasts} removeToast={removeToast} />
        </ToastContext.Provider>
    );
};

export default Toast;
