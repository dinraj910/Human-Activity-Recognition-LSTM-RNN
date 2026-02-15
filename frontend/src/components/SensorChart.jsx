/**
 * SensorChart.jsx
 * ───────────────
 * Real-time line chart of the last 128 sensor readings.
 * Toggleable between Accelerometer (ax, ay, az) and Gyroscope (gx, gy, gz).
 */

import React, { useMemo, useState } from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from 'recharts';

const ACC_LINES = [
    { key: 'ax', label: 'Acc X', color: '#3b82f6' },
    { key: 'ay', label: 'Acc Y', color: '#10b981' },
    { key: 'az', label: 'Acc Z', color: '#f59e0b' },
];

const GYRO_LINES = [
    { key: 'gx', label: 'Gyro α', color: '#8b5cf6' },
    { key: 'gy', label: 'Gyro β', color: '#ec4899' },
    { key: 'gz', label: 'Gyro γ', color: '#06b6d4' },
];

/**
 * @param {Object} props
 * @param {number[][]} props.buffer - Array of [ax,ay,az,gx,gy,gz] readings.
 */
export default function SensorChart({ buffer }) {
    const [mode, setMode] = useState('acc');

    const lines = mode === 'acc' ? ACC_LINES : GYRO_LINES;

    /* Transform buffer into Recharts data format */
    const data = useMemo(() => {
        const last128 = (buffer || []).slice(-128);
        return last128.map((sample, i) => ({
            t: i,
            ax: parseFloat((sample[0] ?? 0).toFixed(2)),
            ay: parseFloat((sample[1] ?? 0).toFixed(2)),
            az: parseFloat((sample[2] ?? 0).toFixed(2)),
            gx: parseFloat((sample[3] ?? 0).toFixed(2)),
            gy: parseFloat((sample[4] ?? 0).toFixed(2)),
            gz: parseFloat((sample[5] ?? 0).toFixed(2)),
        }));
    }, [buffer]);

    return (
        <div className="har-card">
            {/* Header */}
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '1rem',
                }}
            >
                <div className="card-title" style={{ marginBottom: 0 }}>
                    <i className="bi bi-graph-up"></i>
                    Sensor Stream
                </div>

                <div className="chart-toggle-group">
                    <button
                        className={`chart-toggle-btn ${mode === 'acc' ? 'active' : ''}`}
                        onClick={() => setMode('acc')}
                    >
                        Accel
                    </button>
                    <button
                        className={`chart-toggle-btn ${mode === 'gyro' ? 'active' : ''}`}
                        onClick={() => setMode('gyro')}
                    >
                        Gyro
                    </button>
                </div>
            </div>

            {/* Chart */}
            <div className="chart-wrapper">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                        <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="rgba(255,255,255,0.04)"
                            vertical={false}
                        />
                        <XAxis
                            dataKey="t"
                            tick={{ fontSize: 10, fill: '#64748b' }}
                            axisLine={{ stroke: 'rgba(255,255,255,0.06)' }}
                            tickLine={false}
                            interval={31}
                        />
                        <YAxis
                            tick={{ fontSize: 10, fill: '#64748b' }}
                            axisLine={false}
                            tickLine={false}
                            width={40}
                        />
                        <Tooltip
                            contentStyle={{
                                background: '#1e293b',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: 8,
                                fontSize: 12,
                                color: '#f1f5f9',
                            }}
                            labelFormatter={(v) => `Step ${v}`}
                        />
                        <Legend
                            iconType="circle"
                            iconSize={6}
                            wrapperStyle={{ fontSize: 11, color: '#94a3b8' }}
                        />
                        {lines.map((l) => (
                            <Line
                                key={l.key}
                                type="monotone"
                                dataKey={l.key}
                                name={l.label}
                                stroke={l.color}
                                strokeWidth={1.5}
                                dot={false}
                                animationDuration={300}
                            />
                        ))}
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
