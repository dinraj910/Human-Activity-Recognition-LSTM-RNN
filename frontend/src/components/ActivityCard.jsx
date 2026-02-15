/**
 * ActivityCard.jsx
 * ────────────────
 * Hero card at the top of the dashboard showing the current
 * recognised activity with an animated label, confidence bar,
 * and a subtle avatar illustration that changes per activity.
 */

import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ACTIVITY_COLORS,
    ACTIVITY_LABELS,
    ACTIVITY_ICONS,
} from '../utils/calorieUtils';

/* ── Avatar Emojis ─────────────────────────────────────────── */
const ACTIVITY_AVATARS = {
    WALKING: '🚶',
    WALKING_UPSTAIRS: '🧗',
    WALKING_DOWNSTAIRS: '🏃',
    SITTING: '🪑',
    STANDING: '🧍',
    LAYING: '🛌',
};

export default function ActivityCard({ activity, confidence, inferenceMs }) {
    const color = ACTIVITY_COLORS[activity] || '#64748b';
    const label = ACTIVITY_LABELS[activity] || activity || '—';
    const icon = ACTIVITY_ICONS[activity] || 'bi-question-circle';
    const emoji = ACTIVITY_AVATARS[activity] || '❓';
    const pct = Math.round((confidence ?? 0) * 100);

    /* Confidence colour gradient */
    const barColor = useMemo(() => {
        if (pct >= 80) return 'var(--accent-green)';
        if (pct >= 50) return 'var(--accent-amber)';
        return 'var(--accent-red)';
    }, [pct]);

    return (
        <div className="har-card" style={{ borderColor: `${color}22` }}>
            <div className="card-title">
                <i className="bi bi-activity"></i>
                Current Activity
            </div>

            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1.25rem',
                    marginBottom: '1.25rem',
                }}
            >
                {/* Animated Avatar */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activity}
                        initial={{ scale: 0.5, opacity: 0, rotate: -20 }}
                        animate={{ scale: 1, opacity: 1, rotate: 0 }}
                        exit={{ scale: 0.5, opacity: 0, rotate: 20 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                        style={{
                            fontSize: '3rem',
                            width: 70,
                            height: 70,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: 'var(--radius-lg)',
                            background: `${color}15`,
                            border: `2px solid ${color}30`,
                            flexShrink: 0,
                        }}
                    >
                        {emoji}
                    </motion.div>
                </AnimatePresence>

                {/* Activity Label */}
                <div style={{ flex: 1, minWidth: 0 }}>
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activity}
                            initial={{ y: 12, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -12, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div
                                className="activity-label"
                                style={{
                                    background: `linear-gradient(135deg, ${color}, ${color}cc)`,
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                }}
                            >
                                {label}
                            </div>
                        </motion.div>
                    </AnimatePresence>

                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            marginTop: '0.25rem',
                        }}
                    >
                        <span
                            className="activity-badge"
                            style={{
                                background: `${color}18`,
                                color,
                                border: `1px solid ${color}30`,
                            }}
                        >
                            <i className={`bi ${icon}`}></i>
                            {activity || 'IDLE'}
                        </span>
                        {inferenceMs != null && (
                            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                                {inferenceMs.toFixed(0)}ms
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Confidence Bar */}
            <div>
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginBottom: '0.375rem',
                    }}
                >
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                        Confidence
                    </span>
                    <span
                        style={{
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            color: barColor,
                            fontVariantNumeric: 'tabular-nums',
                        }}
                    >
                        {pct}%
                    </span>
                </div>
                <div className="confidence-track">
                    <motion.div
                        className="confidence-fill"
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ type: 'spring', stiffness: 120, damping: 20 }}
                        style={{
                            background: `linear-gradient(90deg, ${color}, ${barColor})`,
                        }}
                    />
                </div>
            </div>
        </div>
    );
}
