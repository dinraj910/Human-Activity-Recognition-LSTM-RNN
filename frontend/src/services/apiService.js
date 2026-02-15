/**
 * apiService.js
 * ─────────────
 * Handles communication with the Flask backend.
 * Provides prediction and health-check endpoints with error handling,
 * request timeout, and optional debouncing.
 */

const API_BASE = import.meta.env.VITE_API_URL || '';

/**
 * POST a sensor window to /predict.
 * @param {number[][]} sensorData - 128×6 array of sensor readings.
 * @returns {Promise<Object>} Prediction result from backend.
 */
export async function predictActivity(sensorData) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

    try {
        const response = await fetch(`${API_BASE}/predict`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sensor_data: sensorData }),
            signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            const err = await response.json().catch(() => ({}));
            throw new Error(err.error || `Server error: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        clearTimeout(timeoutId);
        if (error.name === 'AbortError') {
            throw new Error('Prediction request timed out.');
        }
        throw error;
    }
}

/**
 * GET /health to check backend readiness.
 * @returns {Promise<Object>} Health status.
 */
export async function checkHealth() {
    try {
        const response = await fetch(`${API_BASE}/health`, {
            method: 'GET',
            headers: { 'Accept': 'application/json' },
        });
        return await response.json();
    } catch {
        return { status: 'unreachable', model_loaded: false, scaler_loaded: false };
    }
}

/**
 * Create a debounced predictor that avoids flooding the backend.
 * @param {number} minIntervalMs - Minimum ms between API calls.
 * @returns {Function} Debounced predict function.
 */
export function createThrottledPredictor(minIntervalMs = 500) {
    let lastCall = 0;
    let pending = false;

    return async function throttledPredict(sensorData) {
        const now = Date.now();
        if (pending || now - lastCall < minIntervalMs) {
            return null; // Skip this window
        }

        pending = true;
        lastCall = now;

        try {
            const result = await predictActivity(sensorData);
            return result;
        } finally {
            pending = false;
        }
    };
}
