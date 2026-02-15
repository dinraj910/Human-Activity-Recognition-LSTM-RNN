/**
 * Dashboard.jsx
 * ─────────────
 * Main dashboard page that orchestrates the entire HAR pipeline:
 *
 *   Sensors → Buffer → API → State → UI Components
 *
 * State is managed via useReducer for predictable updates across
 * activity tracking, timeline, durations, and calorie estimation.
 */

import React, { useReducer, useRef, useEffect, useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

// Components
import ActivityCard from '../components/ActivityCard';
import SensorChart from '../components/SensorChart';
import Timeline from '../components/Timeline';
import CalorieTracker from '../components/CalorieTracker';
import SensorPermission from '../components/SensorPermission';

// Services
import { createSensorBuffer } from '../services/bufferService';
import { startSensorStream, startSimulatedStream, isMobileDevice } from '../services/sensorService';
import { createThrottledPredictor, checkHealth } from '../services/apiService';


// ── State Management ────────────────────────────────────────────────────

const initialState = {
    // Prediction
    activity: null,
    confidence: 0,
    inferenceMs: null,
    probabilities: {},

    // Tracking
    timeline: [],
    durations: {},         // { WALKING: 45, SITTING: 120, ... } seconds
    lastActivityTime: null,

    // Session
    sessionStart: Date.now(),
    predictionCount: 0,
    weight: 70,

    // UI
    sensorMode: 'idle',    // 'idle' | 'permission' | 'live' | 'demo'
    backendStatus: null,   // null | 'healthy' | 'degraded' | 'unreachable'
    bufferFill: 0,
};

function reducer(state, action) {
    switch (action.type) {
        case 'SET_PREDICTION': {
            const { activity, confidence, inference_ms, probabilities } = action.payload;
            const now = Date.now();
            const prevActivity = state.activity;

            // Calculate duration for previous activity
            let newDurations = { ...state.durations };
            if (prevActivity && state.lastActivityTime) {
                const elapsed = (now - state.lastActivityTime) / 1000;
                newDurations[prevActivity] = (newDurations[prevActivity] || 0) + elapsed;
            }

            // Add to timeline only if activity changed
            let newTimeline = state.timeline;
            if (activity !== prevActivity) {
                newTimeline = [
                    ...state.timeline,
                    { activity, confidence, timestamp: new Date(now) },
                ];
                // Keep last 100 entries
                if (newTimeline.length > 100) {
                    newTimeline = newTimeline.slice(-100);
                }
            }

            return {
                ...state,
                activity,
                confidence,
                inferenceMs: inference_ms,
                probabilities: probabilities || {},
                timeline: newTimeline,
                durations: newDurations,
                lastActivityTime: now,
                predictionCount: state.predictionCount + 1,
            };
        }

        case 'SET_SENSOR_MODE':
            return { ...state, sensorMode: action.payload };

        case 'SET_BACKEND_STATUS':
            return { ...state, backendStatus: action.payload };

        case 'SET_WEIGHT':
            return { ...state, weight: action.payload };

        case 'SET_BUFFER_FILL':
            return { ...state, bufferFill: action.payload };

        case 'TICK_DURATION': {
            // Called every second to keep current activity duration accurate
            if (!state.activity || !state.lastActivityTime) return state;
            const elapsed = (Date.now() - state.lastActivityTime) / 1000;
            return {
                ...state,
                durations: {
                    ...state.durations,
                    [state.activity]: (state.durations[state.activity] || 0) + 1,
                },
                lastActivityTime: Date.now(),
            };
        }

        default:
            return state;
    }
}


// ── Component ───────────────────────────────────────────────────────────

export default function Dashboard() {
    const navigate = useNavigate();
    const [state, dispatch] = useReducer(reducer, initialState);
    const [sensorBuffer, setSensorBuffer] = useState([]);

    // Refs for cleanup
    const cleanupRef = useRef(null);
    const bufferRef = useRef(null);
    const predictorRef = useRef(null);
    const tickIntervalRef = useRef(null);

    // ── Initialize throttled predictor ──────────────────────────────
    useEffect(() => {
        predictorRef.current = createThrottledPredictor(600);
    }, []);

    // ── Health check on mount ───────────────────────────────────────
    useEffect(() => {
        checkHealth().then((res) => {
            dispatch({ type: 'SET_BACKEND_STATUS', payload: res.status });
        });
    }, []);

    // ── Duration ticker (1 Hz) ──────────────────────────────────────
    useEffect(() => {
        tickIntervalRef.current = setInterval(() => {
            dispatch({ type: 'TICK_DURATION' });
        }, 1000);
        return () => clearInterval(tickIntervalRef.current);
    }, []);

    // ── Prediction callback ─────────────────────────────────────────
    const handleWindowReady = useCallback(async (window128) => {
        if (!predictorRef.current) return;

        try {
            const result = await predictorRef.current(window128);
            if (result) {
                dispatch({ type: 'SET_PREDICTION', payload: result });
            }
        } catch (err) {
            console.warn('Prediction failed:', err.message);
        }
    }, []);

    // ── Start sensor stream ─────────────────────────────────────────
    const startStream = useCallback(
        (mode) => {
            // Clean up any existing stream
            if (cleanupRef.current) {
                cleanupRef.current();
            }

            const buffer = createSensorBuffer(handleWindowReady);
            bufferRef.current = buffer;

            const onData = (sample) => {
                buffer.push(sample);
                // Update chart buffer every ~10 samples (throttle renders)
                if (Math.random() < 0.2) {
                    setSensorBuffer(buffer.getBuffer());
                    dispatch({ type: 'SET_BUFFER_FILL', payload: buffer.getFillPercent() });
                }
            };

            if (mode === 'live') {
                cleanupRef.current = startSensorStream(onData);
            } else {
                cleanupRef.current = startSimulatedStream(onData);
            }

            dispatch({ type: 'SET_SENSOR_MODE', payload: mode });
        },
        [handleWindowReady],
    );

    // ── Cleanup on unmount ──────────────────────────────────────────
    useEffect(() => {
        return () => {
            if (cleanupRef.current) cleanupRef.current();
            if (tickIntervalRef.current) clearInterval(tickIntervalRef.current);
        };
    }, []);

    // ── Handlers ────────────────────────────────────────────────────
    const handleSensorGranted = () => startStream('live');
    const handleDemoMode = () => startStream('demo');

    const isStreaming = state.sensorMode === 'live' || state.sensorMode === 'demo';

    // ── Render ──────────────────────────────────────────────────────
    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            {/* ── Header ────────────────────────────────────────────── */}
            <header className="dashboard-header">
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        maxWidth: 1200,
                        margin: '0 auto',
                        width: '100%',
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <button
                            onClick={() => navigate('/')}
                            style={{
                                background: 'none',
                                border: 'none',
                                color: 'var(--text-secondary)',
                                cursor: 'pointer',
                                fontSize: '1.1rem',
                                padding: '0.25rem',
                                display: 'flex',
                            }}
                            aria-label="Back to home"
                        >
                            <i className="bi bi-arrow-left"></i>
                        </button>
                        <h1 style={{ margin: 0 }}>
                            <i className="bi bi-activity me-2"></i>
                            HAR Dashboard
                        </h1>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        {/* Backend Status */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            <span
                                className={`status-dot ${state.backendStatus === 'healthy' ? 'online' : 'offline'}`}
                            />
                            API
                        </div>

                        {/* Sensor Status */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            <span className={`status-dot ${isStreaming ? 'online' : 'offline'}`} />
                            {state.sensorMode === 'demo' ? 'Demo' : 'Sensor'}
                        </div>
                    </div>
                </div>
            </header>

            {/* ── Body ──────────────────────────────────────────────── */}
            <main className="dashboard-body" style={{ maxWidth: 1200, margin: '0 auto', width: '100%' }}>
                {/* Demo mode banner */}
                {state.sensorMode === 'demo' && (
                    <div className="demo-banner">
                        <i className="bi bi-info-circle"></i>
                        <span>
                            <strong>Demo Mode</strong> — Using simulated sensor data.
                            Open on a mobile device for real sensor input.
                        </span>
                    </div>
                )}

                {/* Permission state — show permission card */}
                {!isStreaming && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        style={{ paddingTop: '3rem' }}
                    >
                        <SensorPermission
                            onGrant={handleSensorGranted}
                            onDemoMode={handleDemoMode}
                        />
                    </motion.div>
                )}

                {/* Dashboard grid — only when streaming */}
                {isStreaming && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.4 }}
                    >
                        {/* Row 1: Activity Card + Stats */}
                        <div
                            style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                                gap: '1rem',
                                marginBottom: '1rem',
                            }}
                        >
                            {/* Activity Card */}
                            <ActivityCard
                                activity={state.activity}
                                confidence={state.confidence}
                                inferenceMs={state.inferenceMs}
                            />

                            {/* Quick Stats */}
                            <div className="har-card">
                                <div className="card-title">
                                    <i className="bi bi-speedometer2"></i>
                                    Session Stats
                                </div>

                                <div
                                    style={{
                                        display: 'grid',
                                        gridTemplateColumns: 'repeat(2, 1fr)',
                                        gap: '1rem',
                                    }}
                                >
                                    <div>
                                        <div className="stat-value">
                                            {state.predictionCount}
                                        </div>
                                        <div className="stat-label">Predictions</div>
                                    </div>
                                    <div>
                                        <div className="stat-value">
                                            {state.inferenceMs != null ? `${state.inferenceMs.toFixed(0)}` : '—'}
                                            <span className="stat-unit">ms</span>
                                        </div>
                                        <div className="stat-label">Latency</div>
                                    </div>
                                    <div>
                                        <div className="stat-value">
                                            {state.bufferFill}<span className="stat-unit">%</span>
                                        </div>
                                        <div className="stat-label">Buffer Fill</div>
                                    </div>
                                    <div>
                                        <div className="stat-value">
                                            {Object.keys(state.durations).length}
                                        </div>
                                        <div className="stat-label">Activities</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Row 2: Sensor Chart */}
                        <div style={{ marginBottom: '1rem' }}>
                            <SensorChart buffer={sensorBuffer} />
                        </div>

                        {/* Row 3: Timeline + Calorie Tracker */}
                        <div
                            style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                                gap: '1rem',
                            }}
                        >
                            <Timeline events={state.timeline} />
                            <CalorieTracker
                                durations={state.durations}
                                weight={state.weight}
                                onWeightChange={(w) => dispatch({ type: 'SET_WEIGHT', payload: w })}
                            />
                        </div>
                    </motion.div>
                )}
            </main>
        </div>
    );
}
