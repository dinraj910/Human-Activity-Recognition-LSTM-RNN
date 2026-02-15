/**
 * Landing.jsx
 * ───────────
 * Landing page with a hero section explaining what HAR does,
 * feature highlights, and a CTA to enter the dashboard.
 */

import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const FEATURES = [
    {
        icon: 'bi-cpu',
        title: 'Deep Learning LSTM',
        description: 'Bidirectional LSTM model trained on the UCI HAR dataset with 96%+ accuracy.',
    },
    {
        icon: 'bi-phone-vibrate',
        title: 'Real-Time Sensors',
        description: 'Captures accelerometer & gyroscope data directly from your mobile browser.',
    },
    {
        icon: 'bi-graph-up-arrow',
        title: 'Live Visualisation',
        description: 'Real-time sensor waveform charts, activity timeline, and calorie tracking.',
    },
    {
        icon: 'bi-shield-check',
        title: 'Privacy First',
        description: 'Sensor data is processed transiently — nothing is stored on the server.',
    },
];

const ACTIVITIES = [
    { emoji: '🚶', label: 'Walking' },
    { emoji: '🧗', label: 'Upstairs' },
    { emoji: '🏃', label: 'Downstairs' },
    { emoji: '🪑', label: 'Sitting' },
    { emoji: '🧍', label: 'Standing' },
    { emoji: '🛌', label: 'Laying' },
];

const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function Landing() {
    const navigate = useNavigate();

    return (
        <div className="landing-container">
            {/* Hero */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
                style={{ position: 'relative', zIndex: 1 }}
            >
                <div
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        background: 'rgba(59,130,246,0.1)',
                        border: '1px solid rgba(59,130,246,0.2)',
                        borderRadius: 'var(--radius-full)',
                        padding: '0.4rem 1rem',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        color: 'var(--accent-blue)',
                        marginBottom: '1.5rem',
                        letterSpacing: '0.04em',
                    }}
                >
                    <i className="bi bi-lightning-charge-fill"></i>
                    Powered by Deep Learning
                </div>

                <h1 className="landing-title">
                    Human Activity
                    <br />
                    Recognition
                </h1>

                <p className="landing-subtitle">
                    Real-time activity detection using a Bidirectional LSTM model.
                    Point your mobile browser here to classify walking, climbing stairs,
                    sitting, standing, and laying — all from raw sensor data.
                </p>

                {/* Activity Pills */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        justifyContent: 'center',
                        gap: '0.5rem',
                        marginBottom: '2rem',
                    }}
                >
                    {ACTIVITIES.map((a) => (
                        <motion.span
                            key={a.label}
                            variants={itemVariants}
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.4rem',
                                padding: '0.35rem 0.85rem',
                                background: 'rgba(255,255,255,0.04)',
                                border: '1px solid rgba(255,255,255,0.08)',
                                borderRadius: 'var(--radius-full)',
                                fontSize: '0.8rem',
                                color: 'var(--text-secondary)',
                            }}
                        >
                            {a.emoji} {a.label}
                        </motion.span>
                    ))}
                </motion.div>

                {/* CTA */}
                <motion.button
                    className="btn-glow"
                    onClick={() => navigate('/dashboard')}
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.97 }}
                >
                    <i className="bi bi-play-fill"></i>
                    Open Dashboard
                </motion.button>
            </motion.div>

            {/* Feature Grid */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                    gap: '1rem',
                    maxWidth: '900px',
                    width: '100%',
                    marginTop: '4rem',
                    position: 'relative',
                    zIndex: 1,
                }}
            >
                {FEATURES.map((f) => (
                    <motion.div
                        key={f.title}
                        variants={itemVariants}
                        className="har-card"
                        style={{ textAlign: 'left' }}
                    >
                        <div
                            style={{
                                width: 40,
                                height: 40,
                                borderRadius: 'var(--radius-md)',
                                background: 'rgba(59,130,246,0.1)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginBottom: '0.75rem',
                                color: 'var(--accent-blue)',
                                fontSize: '1.1rem',
                            }}
                        >
                            <i className={`bi ${f.icon}`}></i>
                        </div>
                        <h3
                            style={{
                                fontSize: '0.95rem',
                                fontWeight: 700,
                                marginBottom: '0.35rem',
                                color: 'var(--text-primary)',
                            }}
                        >
                            {f.title}
                        </h3>
                        <p
                            style={{
                                fontSize: '0.8rem',
                                color: 'var(--text-secondary)',
                                lineHeight: 1.6,
                                margin: 0,
                            }}
                        >
                            {f.description}
                        </p>
                    </motion.div>
                ))}
            </motion.div>

            {/* Footer */}
            <div
                style={{
                    marginTop: '3rem',
                    fontSize: '0.75rem',
                    color: 'var(--text-muted)',
                    position: 'relative',
                    zIndex: 1,
                }}
            >
                Built with React · Flask · TensorFlow · LSTM
            </div>
        </div>
    );
}
