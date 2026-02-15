/**
 * calorieUtils.js
 * ───────────────
 * MET-based calorie estimation for recognized activities.
 *
 * Formula:  Calories = MET × weight_kg × time_hours
 */

/** MET values mapped to activity labels */
export const MET_VALUES = {
    WALKING: 3.5,
    WALKING_UPSTAIRS: 8.0,
    WALKING_DOWNSTAIRS: 4.0,
    SITTING: 1.3,
    STANDING: 1.8,
    LAYING: 1.0,
};

/** Colour mapping per activity for consistent UI theming */
export const ACTIVITY_COLORS = {
    WALKING: '#3b82f6',
    WALKING_UPSTAIRS: '#8b5cf6',
    WALKING_DOWNSTAIRS: '#06b6d4',
    SITTING: '#f59e0b',
    STANDING: '#10b981',
    LAYING: '#64748b',
};

/** User-friendly labels */
export const ACTIVITY_LABELS = {
    WALKING: 'Walking',
    WALKING_UPSTAIRS: 'Upstairs',
    WALKING_DOWNSTAIRS: 'Downstairs',
    SITTING: 'Sitting',
    STANDING: 'Standing',
    LAYING: 'Laying',
};

/** Icons (Bootstrap Icons class names) */
export const ACTIVITY_ICONS = {
    WALKING: 'bi-person-walking',
    WALKING_UPSTAIRS: 'bi-arrow-up-circle',
    WALKING_DOWNSTAIRS: 'bi-arrow-down-circle',
    SITTING: 'bi-person',
    STANDING: 'bi-person-standing',
    LAYING: 'bi-moon',
};

/**
 * Estimate calories burned for a single activity period.
 *
 * @param {string}  activity   - Activity label (e.g. "WALKING")
 * @param {number}  seconds    - Duration in seconds
 * @param {number}  weightKg   - User weight in kg
 * @returns {number} Estimated kcal burned
 */
export function estimateCalories(activity, seconds, weightKg = 70) {
    const met = MET_VALUES[activity] ?? 1.0;
    const hours = seconds / 3600;
    return met * weightKg * hours;
}

/**
 * Compute total calories from a duration map.
 *
 * @param {Object<string, number>} durations - { WALKING: 120, SITTING: 300, ... } in seconds
 * @param {number} weightKg
 * @returns {number} Total estimated kcal
 */
export function totalCalories(durations, weightKg = 70) {
    return Object.entries(durations).reduce((sum, [activity, secs]) => {
        return sum + estimateCalories(activity, secs, weightKg);
    }, 0);
}

/**
 * Format seconds to human-readable duration.
 * @param {number} s - Seconds
 * @returns {string} e.g. "2m 30s" or "1h 5m"
 */
export function formatDuration(s) {
    if (s < 0) s = 0;
    const hrs = Math.floor(s / 3600);
    const mins = Math.floor((s % 3600) / 60);
    const secs = Math.floor(s % 60);

    if (hrs > 0) return `${hrs}h ${mins}m`;
    if (mins > 0) return `${mins}m ${secs}s`;
    return `${secs}s`;
}
