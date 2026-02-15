/**
 * sensorService.js
 * ────────────────
 * Abstracts browser DeviceMotion / DeviceOrientation APIs.
 *
 * On real mobile devices:   uses actual sensor data.
 * On desktop / unsupported: falls back to realistic simulated data
 *                           so the dashboard always has something to show.
 */

// ── Permission helpers ──────────────────────────────────────────────────

/**
 * Check whether DeviceMotion sensors are available and permitted.
 * @returns {Promise<'granted'|'denied'|'unsupported'>}
 */
export async function requestSensorPermission() {
    // iOS 13+ requires explicit permission request
    if (
        typeof DeviceMotionEvent !== 'undefined' &&
        typeof DeviceMotionEvent.requestPermission === 'function'
    ) {
        try {
            const state = await DeviceMotionEvent.requestPermission();
            return state; // 'granted' or 'denied'
        } catch {
            return 'denied';
        }
    }

    // Android / older browsers — check if the event fires
    if (typeof DeviceMotionEvent !== 'undefined') {
        return 'granted'; // We'll validate on first data
    }

    return 'unsupported';
}

/**
 * Check if we're likely on a mobile device with sensors.
 */
export function isMobileDevice() {
    return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
}


// ── Sensor listener ─────────────────────────────────────────────────────

/**
 * Start listening to device motion events.
 * @param {Function} onData - Called with [ax, ay, az, gx, gy, gz] per event.
 * @returns {Function} cleanup — call to stop listening.
 */
export function startSensorStream(onData) {
    let active = true;

    function handleMotion(event) {
        if (!active) return;

        const acc = event.accelerationIncludingGravity || {};
        const rot = event.rotationRate || {};

        const sample = [
            acc.x ?? 0,
            acc.y ?? 0,
            acc.z ?? 0,
            rot.alpha ?? 0,
            rot.beta ?? 0,
            rot.gamma ?? 0,
        ];

        onData(sample);
    }

    window.addEventListener('devicemotion', handleMotion, true);

    return function stop() {
        active = false;
        window.removeEventListener('devicemotion', handleMotion, true);
    };
}


// ── Simulated sensor stream (demo mode) ─────────────────────────────────

const ACTIVITIES = [
    {
        name: 'WALKING',
        duration: [8000, 15000],
        gen: (t) => [
            0.2 + Math.sin(t * 4) * 2.5 + (Math.random() - 0.5) * 0.3,
            9.5 + Math.sin(t * 8) * 1.2 + (Math.random() - 0.5) * 0.2,
            -0.8 + Math.cos(t * 4) * 1.8 + (Math.random() - 0.5) * 0.3,
            Math.sin(t * 6) * 50 + (Math.random() - 0.5) * 10,
            Math.cos(t * 4) * 40 + (Math.random() - 0.5) * 8,
            Math.sin(t * 3) * 30 + (Math.random() - 0.5) * 6,
        ],
    },
    {
        name: 'WALKING_UPSTAIRS',
        duration: [6000, 12000],
        gen: (t) => [
            0.5 + Math.sin(t * 3.5) * 3.0 + (Math.random() - 0.5) * 0.4,
            10.2 + Math.sin(t * 7) * 2.0 + (Math.random() - 0.5) * 0.3,
            -1.5 + Math.cos(t * 3.5) * 2.5 + (Math.random() - 0.5) * 0.4,
            Math.sin(t * 5) * 70 + (Math.random() - 0.5) * 15,
            Math.cos(t * 3.5) * 55 + (Math.random() - 0.5) * 10,
            Math.sin(t * 2.5) * 40 + (Math.random() - 0.5) * 8,
        ],
    },
    {
        name: 'SITTING',
        duration: [10000, 20000],
        gen: (_t) => [
            0.05 + (Math.random() - 0.5) * 0.15,
            9.81 + (Math.random() - 0.5) * 0.1,
            -0.1 + (Math.random() - 0.5) * 0.12,
            (Math.random() - 0.5) * 3,
            (Math.random() - 0.5) * 2,
            (Math.random() - 0.5) * 2,
        ],
    },
    {
        name: 'STANDING',
        duration: [8000, 16000],
        gen: (_t) => [
            0.02 + (Math.random() - 0.5) * 0.2,
            9.8 + (Math.random() - 0.5) * 0.15,
            -0.05 + (Math.random() - 0.5) * 0.18,
            (Math.random() - 0.5) * 5,
            (Math.random() - 0.5) * 4,
            (Math.random() - 0.5) * 3,
        ],
    },
    {
        name: 'LAYING',
        duration: [12000, 25000],
        gen: (_t) => [
            0.01 + (Math.random() - 0.5) * 0.08,
            0.3 + (Math.random() - 0.5) * 0.1,
            9.78 + (Math.random() - 0.5) * 0.06,
            (Math.random() - 0.5) * 1.5,
            (Math.random() - 0.5) * 1,
            (Math.random() - 0.5) * 1,
        ],
    },
];

/**
 * Start a simulated sensor stream that cycles through activities.
 * Emits data at ~50 Hz to match the UCI HAR sampling rate.
 *
 * @param {Function} onData - Called with [ax,ay,az,gx,gy,gz].
 * @returns {Function} cleanup — call to stop.
 */
export function startSimulatedStream(onData) {
    let active = true;
    let actIdx = Math.floor(Math.random() * ACTIVITIES.length);
    let actStart = Date.now();
    let actDuration =
        ACTIVITIES[actIdx].duration[0] +
        Math.random() * (ACTIVITIES[actIdx].duration[1] - ACTIVITIES[actIdx].duration[0]);

    const intervalId = setInterval(() => {
        if (!active) return;

        const now = Date.now();
        const elapsed = (now - actStart) / 1000;

        // Switch activity when duration expires
        if (now - actStart > actDuration) {
            actIdx = (actIdx + 1) % ACTIVITIES.length;
            actStart = now;
            actDuration =
                ACTIVITIES[actIdx].duration[0] +
                Math.random() * (ACTIVITIES[actIdx].duration[1] - ACTIVITIES[actIdx].duration[0]);
        }

        onData(ACTIVITIES[actIdx].gen(elapsed));
    }, 20); // 50 Hz

    return function stop() {
        active = false;
        clearInterval(intervalId);
    };
}
