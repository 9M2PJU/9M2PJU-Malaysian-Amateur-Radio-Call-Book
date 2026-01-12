import React from 'react';
import { FaTimes, FaGithub, FaExclamationTriangle, FaCheckCircle } from 'react-icons/fa';

const SubmissionModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    const GITHUB_ISSUE_URL = 'https://github.com/9M2PJU/9M2PJU-Malaysian-Amateur-Radio-Call-Book/issues/new?template=callsign-submission.yml';

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.8)',
            backdropFilter: 'blur(5px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            overflow: 'auto',
            padding: '20px'
        }} onClick={onClose}>
            <div
                className="glass-panel"
                style={{
                    padding: '40px',
                    maxWidth: '600px',
                    width: '100%',
                    position: 'relative',
                    background: '#1a1a1a',
                    maxHeight: '90vh',
                    overflowY: 'auto'
                }}
                onClick={e => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    style={{
                        position: 'absolute',
                        top: '20px',
                        right: '20px',
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--text-muted)',
                        cursor: 'pointer',
                        fontSize: '1.5rem'
                    }}
                >
                    <FaTimes />
                </button>

                <h2 style={{ color: 'var(--primary)', marginTop: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                    📻 Register Your Callsign
                </h2>

                <p style={{ lineHeight: '1.6', marginBottom: '25px' }}>
                    Submit your callsign to be added to the Malaysian Amateur Radio Callbook directory.
                    The process is simple and automated!
                </p>

                {/* How it works */}
                <div style={{
                    background: 'rgba(79, 172, 254, 0.1)',
                    padding: '20px',
                    borderRadius: '12px',
                    marginBottom: '25px',
                    border: '1px solid rgba(79, 172, 254, 0.3)'
                }}>
                    <h3 style={{ marginTop: 0, color: 'var(--primary)', fontSize: '1.1rem' }}>
                        📋 How It Works
                    </h3>
                    <ol style={{ margin: 0, paddingLeft: '20px', lineHeight: '2' }}>
                        <li>Click the button below to open the submission form</li>
                        <li>Fill in your callsign details (requires GitHub account)</li>
                        <li>Submit the form</li>
                        <li>Your submission will be reviewed and approved</li>
                        <li>Once approved, your callsign appears in the directory!</li>
                    </ol>
                </div>

                {/* Submit Button */}
                <div style={{ textAlign: 'center', marginBottom: '25px' }}>
                    <a
                        href={GITHUB_ISSUE_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                            background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
                            color: '#000',
                            fontSize: '1.1rem',
                            fontWeight: 'bold',
                            textDecoration: 'none',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '10px',
                            padding: '16px 32px',
                            borderRadius: '12px',
                            transition: 'transform 0.2s, box-shadow 0.2s'
                        }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.transform = 'translateY(-2px)';
                            e.currentTarget.style.boxShadow = '0 4px 20px rgba(79, 172, 254, 0.5)';
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = 'none';
                        }}
                    >
                        <FaGithub size={24} /> Submit Your Callsign
                    </a>
                    <p style={{ margin: '12px 0 0 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        Opens GitHub in a new tab
                    </p>
                </div>

                {/* What you need */}
                <div style={{
                    background: 'rgba(255,255,255,0.05)',
                    padding: '20px',
                    borderRadius: '12px',
                    marginBottom: '25px'
                }}>
                    <h3 style={{ marginTop: 0, fontSize: '1rem' }}>✅ What You'll Need</h3>
                    <ul style={{ margin: 0, paddingLeft: '20px', lineHeight: '1.8' }}>
                        <li><strong>Required:</strong> Callsign, Name, State</li>
                        <li><strong>Optional:</strong> Email, Phone, Address, Website, Facebook, QRZ.com link</li>
                        <li>A <strong>GitHub account</strong> (free to create)</li>
                    </ul>
                </div>

                {/* Benefits */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                    gap: '15px',
                    marginBottom: '25px'
                }}>
                    <div style={{
                        background: 'rgba(0, 200, 83, 0.1)',
                        padding: '15px',
                        borderRadius: '10px',
                        textAlign: 'center',
                        border: '1px solid rgba(0, 200, 83, 0.3)'
                    }}>
                        <FaCheckCircle color="#00c853" size={24} />
                        <p style={{ margin: '10px 0 0 0', fontSize: '0.9rem' }}>Quick Review</p>
                    </div>
                    <div style={{
                        background: 'rgba(0, 200, 83, 0.1)',
                        padding: '15px',
                        borderRadius: '10px',
                        textAlign: 'center',
                        border: '1px solid rgba(0, 200, 83, 0.3)'
                    }}>
                        <FaCheckCircle color="#00c853" size={24} />
                        <p style={{ margin: '10px 0 0 0', fontSize: '0.9rem' }}>Auto-Published</p>
                    </div>
                    <div style={{
                        background: 'rgba(0, 200, 83, 0.1)',
                        padding: '15px',
                        borderRadius: '10px',
                        textAlign: 'center',
                        border: '1px solid rgba(0, 200, 83, 0.3)'
                    }}>
                        <FaCheckCircle color="#00c853" size={24} />
                        <p style={{ margin: '10px 0 0 0', fontSize: '0.9rem' }}>Update Anytime</p>
                    </div>
                </div>

                {/* Privacy Disclaimer */}
                <div style={{
                    padding: '15px',
                    background: 'rgba(255, 100, 100, 0.1)',
                    borderLeft: '4px solid #ff4444',
                    borderRadius: '4px'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#ff4444', fontWeight: 'bold', marginBottom: '8px' }}>
                        <FaExclamationTriangle /> Privacy Disclaimer
                    </div>
                    <p style={{ margin: 0, fontSize: '0.9rem', color: '#ffaaaa' }}>
                        Submission is voluntary. By submitting your details, you agree to have this information published publicly in this directory.
                        The maintainer is not responsible for any privacy breach or misuse of the published information.
                    </p>
                </div>

            </div>
        </div>
    );
};

export default SubmissionModal;
