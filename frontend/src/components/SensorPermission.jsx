/**
 * SensorPermission.jsx
 * ────────────────────
 * Handles the iOS / Android sensor permission flow.
 * Shows a clean card explaining why sensor access is needed
 * and triggers the browser permission prompt.
 */

import React from 'react';
import { motion } from 'framer-motion';

export default function SensorPermission({ onGrant, onDemoMode }) {
    const [status, setStatus] = React.useState(null); // null | 'requesting' | 'denied'

    async function handleRequest() {
        setStatus('requesting');

        // iOS 13+ explicit permission
        if (
            typeof DeviceMotionEvent !== 'undefined' &&
            typeof DeviceMotionEvent.requestPermission === 'function'
        ) {
            try {
                const result = await DeviceMotionEvent.requestPermission();
                if (result === 'granted') {
                    onGrant();
                    return;
                }
                setStatus('denied');
                return;
            } catch {
                setStatus('denied');
                return;
            }
        }

        // Android / browsers that don't require permission
        if (typeof DeviceMotionEvent !== 'undefined') {
            onGrant();
            return;
        }

        setStatus('denied');
    }

    return (
        <motion.div
            className="permission-card"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
        >
            <div className="permission-icon">
                <i className="bi bi-phone-vibrate"></i>
            </div>

            <h3 style={{ fontWeight: 700, marginBottom: '0.75rem', fontSize: '1.25rem' }}>
                Sensor Access Required
            </h3>

            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem', lineHeight: 1.6 }}>
                This app uses your device's accelerometer and gyroscope to recognise
                physical activities in real time. Your data stays on-device and is only
                sent to the prediction server temporarily.
            </p>

            {status === 'denied' && (
                <div
                    style={{
                        background: 'rgba(239,68,68,0.1)',
                        border: '1px solid rgba(239,68,68,0.2)',
                        borderRadius: 'var(--radius-md)',
                        padding: '0.75rem 1rem',
                        fontSize: '0.8rem',
                        color: 'var(--accent-red)',
                        marginBottom: '1rem',
                    }}
                >
                    <i className="bi bi-exclamation-triangle me-2"></i>
                    Permission denied. Please enable motion sensors in your browser settings.
                </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <button
                    className="btn-glow"
                    onClick={handleRequest}
                    disabled={status === 'requesting'}
                    style={{ justifyContent: 'center', width: '100%' }}
                >
                    {status === 'requesting' ? (
                        <>
                            <span className="spinner-border spinner-border-sm" role="status" />
                            Requesting...
                        </>
                    ) : (
                        <>
                            <i className="bi bi-shield-check"></i>
                            Grant Sensor Access
                        </>
                    )}
                </button>

                <button
                    onClick={onDemoMode}
                    style={{
                        background: 'transparent',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: 'var(--radius-full)',
                        padding: '0.75rem 1.5rem',
                        color: 'var(--text-secondary)',
                        fontSize: '0.875rem',
                        fontWeight: 500,
                        cursor: 'pointer',
                        fontFamily: 'var(--font-sans)',
                        transition: 'all var(--transition-fast)',
                    }}
                    onMouseEnter={(e) => {
                        e.target.style.borderColor = 'rgba(255,255,255,0.2)';
                        e.target.style.color = 'var(--text-primary)';
                    }}
                    onMouseLeave={(e) => {
                        e.target.style.borderColor = 'rgba(255,255,255,0.1)';
                        e.target.style.color = 'var(--text-secondary)';
                    }}
                >
                    <i className="bi bi-play-circle me-2"></i>
                    Use Demo Mode Instead
                </button>
            </div>
        </motion.div>
    );
}
