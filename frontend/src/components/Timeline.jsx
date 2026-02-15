/**
 * Timeline.jsx
 * ────────────
 * Scrollable activity timeline showing detected activity changes
 * with timestamps and confidence levels.
 */

import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ACTIVITY_COLORS,
    ACTIVITY_LABELS,
    ACTIVITY_ICONS,
} from '../utils/calorieUtils';

/**
 * @param {Object} props
 * @param {Array<{activity: string, confidence: number, timestamp: Date}>} props.events
 */
export default function Timeline({ events }) {
    const scrollRef = useRef(null);

    /* Auto-scroll to bottom when new events arrive */
    useEffect(() => {
        const el = scrollRef.current;
        if (el) {
            el.scrollTop = el.scrollHeight;
        }
    }, [events.length]);

    const formatTime = (date) => {
        if (!date) return '';
        const d = new Date(date);
        return d.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false,
        });
    };

    return (
        <div className="har-card" style={{ height: '100%' }}>
            <div className="card-title">
                <i className="bi bi-clock-history"></i>
                Activity Timeline
                <span
                    style={{
                        marginLeft: 'auto',
                        fontSize: '0.65rem',
                        color: 'var(--text-muted)',
                        fontWeight: 400,
                        textTransform: 'none',
                        letterSpacing: 'normal',
                    }}
                >
                    {events.length} events
                </span>
            </div>

            <div ref={scrollRef} className="timeline-container">
                {events.length === 0 && (
                    <div
                        style={{
                            textAlign: 'center',
                            padding: '2rem 1rem',
                            color: 'var(--text-muted)',
                            fontSize: '0.85rem',
                        }}
                    >
                        <i className="bi bi-hourglass-split" style={{ fontSize: '1.5rem', display: 'block', marginBottom: '0.5rem' }}></i>
                        Waiting for activity data…
                    </div>
                )}

                <AnimatePresence initial={false}>
                    {events.map((event, idx) => {
                        const color = ACTIVITY_COLORS[event.activity] || '#64748b';
                        const icon = ACTIVITY_ICONS[event.activity] || 'bi-question-circle';
                        const label = ACTIVITY_LABELS[event.activity] || event.activity;

                        return (
                            <motion.div
                                key={idx}
                                className="timeline-item"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.25, delay: 0.05 }}
                            >
                                <div className="timeline-dot" style={{ color, backgroundColor: color }} />

                                <div className="timeline-content">
                                    <div className="timeline-activity">
                                        <i className={`bi ${icon} me-1`} style={{ color, fontSize: '0.8rem' }}></i>
                                        {label}
                                    </div>
                                    <div className="timeline-confidence">
                                        {Math.round((event.confidence ?? 0) * 100)}% confidence
                                    </div>
                                </div>

                                <div className="timeline-time">
                                    {formatTime(event.timestamp)}
                                </div>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>
        </div>
    );
}
