/**
 * bufferService.js
 * ────────────────
 * Circular buffer for sensor data with 50% overlap windowing.
 *
 * Architecture:
 *   Sensor stream  →  push()  →  circular ring buffer
 *                               ↓  (every 64 new samples)
 *                          getWindow()  →  128×6 array for prediction
 */

const WINDOW_SIZE = 128;
const OVERLAP_SHIFT = 64; // 50% overlap → shift by 64

/**
 * Creates a new SensorBuffer instance.
 * @param {Function} onWindowReady - Called with a 128×6 array when a window is complete.
 * @returns {Object} Buffer API.
 */
export function createSensorBuffer(onWindowReady) {
    /** @type {number[][]} Internal ring buffer */
    let buffer = [];

    /** Samples received since last window emission */
    let samplesSinceEmit = 0;

    /** Whether at least one full window has been emitted */
    let hasEmitted = false;

    /**
     * Push a single sensor reading into the buffer.
     * @param {number[]} sample - [ax, ay, az, gx, gy, gz]
     */
    function push(sample) {
        if (!Array.isArray(sample) || sample.length !== 6) return;

        buffer.push([...sample]);
        samplesSinceEmit++;

        // Keep buffer from growing unbounded
        if (buffer.length > WINDOW_SIZE * 3) {
            buffer = buffer.slice(-WINDOW_SIZE);
        }

        // First window: need WINDOW_SIZE samples
        // Subsequent windows: need OVERLAP_SHIFT new samples
        const threshold = hasEmitted ? OVERLAP_SHIFT : WINDOW_SIZE;

        if (buffer.length >= WINDOW_SIZE && samplesSinceEmit >= threshold) {
            const window = buffer.slice(-WINDOW_SIZE);
            samplesSinceEmit = 0;
            hasEmitted = true;

            if (typeof onWindowReady === 'function') {
                onWindowReady(window);
            }
        }
    }

    /**
     * Push an array of sensor readings.
     * @param {number[][]} samples
     */
    function pushBatch(samples) {
        for (const sample of samples) {
            push(sample);
        }
    }

    /**
     * Return the current buffer contents (for visualization).
     * @returns {number[][]}
     */
    function getBuffer() {
        return [...buffer];
    }

    /**
     * Return the most recent full window, or null.
     * @returns {number[][]|null}
     */
    function getLatestWindow() {
        if (buffer.length < WINDOW_SIZE) return null;
        return buffer.slice(-WINDOW_SIZE);
    }

    /**
     * Get buffer fill percentage.
     * @returns {number} 0–100
     */
    function getFillPercent() {
        return Math.min(100, Math.round((buffer.length / WINDOW_SIZE) * 100));
    }

    /** Reset the buffer. */
    function reset() {
        buffer = [];
        samplesSinceEmit = 0;
        hasEmitted = false;
    }

    return {
        push,
        pushBatch,
        getBuffer,
        getLatestWindow,
        getFillPercent,
        reset,
        WINDOW_SIZE,
        OVERLAP_SHIFT,
    };
}
