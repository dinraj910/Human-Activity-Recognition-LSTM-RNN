/**
 * CalorieTracker.jsx
 * ──────────────────
 * Displays estimated calories burned with a radial progress ring,
 * activity duration breakdown, and a weight input.
 */

import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import {
    ACTIVITY_COLORS,
    ACTIVITY_LABELS,
    totalCalories,
    formatDuration,
} from '../utils/calorieUtils';

/**
 * @param {Object} props
 * @param {Object<string, number>} props.durations - Seconds per activity
 * @param {number} props.weight - User weight in kg
 * @param {Function} props.onWeightChange
 */
export default function CalorieTracker({ durations, weight, onWeightChange }) {
    const cal = useMemo(() => totalCalories(durations, weight), [durations, weight]);

    /* Build pie data from durations */
    const pieData = useMemo(() => {
        return Object.entries(durations)
            .filter(([, secs]) => secs > 0)
            .map(([activity, secs]) => ({
                name: ACTIVITY_LABELS[activity] || activity,
                value: secs,
                color: ACTIVITY_COLORS[activity] || '#64748b',
            }));
    }, [durations]);

    /* Total active seconds */
    const totalSecs = useMemo(
        () => Object.values(durations).reduce((s, v) => s + v, 0),
        [durations],
    );

    /* Sort activities by duration descending */
    const sortedActivities = useMemo(() => {
        return Object.entries(durations)
            .sort(([, a], [, b]) => b - a);
    }, [durations]);

    return (
        <div className="har-card" style={{ height: '100%' }}>
            <div className="card-title">
                <i className="bi bi-fire"></i>
                Calorie Tracker
            </div>

            {/* Radial Ring */}
            <div className="calorie-ring-container">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={pieData.length > 0 ? pieData : [{ name: 'Idle', value: 1, color: '#334155' }]}
                            cx="50%"
                            cy="50%"
                            innerRadius={45}
                            outerRadius={62}
                            paddingAngle={2}
                            dataKey="value"
                            strokeWidth={0}
                            animationDuration={600}
                        >
                            {(pieData.length > 0 ? pieData : [{ color: '#334155' }]).map((entry, i) => (
                                <Cell key={i} fill={entry.color} />
                            ))}
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>
                <div className="calorie-ring-text">
                    <div className="value">{cal.toFixed(1)}</div>
                    <div className="unit">kcal</div>
                </div>
            </div>

            {/* Weight Input */}
            <div style={{ display: 'flex', justifyContent: 'center', margin: '1rem 0' }}>
                <div className="weight-input-group">
                    <input
                        type="number"
                        min="30"
                        max="300"
                        value={weight}
                        onChange={(e) => onWeightChange(Number(e.target.value) || 70)}
                        aria-label="Body weight in kg"
                    />
                    <span>kg</span>
                </div>
            </div>

            {/* Duration Breakdown */}
            <div style={{ marginTop: '0.5rem' }}>
                {sortedActivities.map(([activity, secs]) => {
                    const pct = totalSecs > 0 ? (secs / totalSecs) * 100 : 0;
                    const color = ACTIVITY_COLORS[activity] || '#64748b';
                    return (
                        <div key={activity} className="duration-item">
                            <span className="label">{ACTIVITY_LABELS[activity] || activity}</span>
                            <div className="duration-track">
                                <div
                                    className="duration-fill"
                                    style={{ width: `${pct}%`, background: color }}
                                />
                            </div>
                            <span className="time">{formatDuration(secs)}</span>
                        </div>
                    );
                })}

                {sortedActivities.length === 0 && (
                    <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem', padding: '0.5rem' }}>
                        No activity tracked yet
                    </div>
                )}
            </div>

            {/* Total session time */}
            {totalSecs > 0 && (
                <div
                    style={{
                        marginTop: '0.75rem',
                        paddingTop: '0.75rem',
                        borderTop: '1px solid rgba(255,255,255,0.06)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        fontSize: '0.75rem',
                        color: 'var(--text-secondary)',
                    }}
                >
                    <span>Session Time</span>
                    <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                        {formatDuration(totalSecs)}
                    </span>
                </div>
            )}
        </div>
    );
}
