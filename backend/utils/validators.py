"""
validators.py
─────────────
Input validation helpers for the HAR prediction API.
Ensures incoming sensor payloads match the expected (128, 6) shape
before they reach the model pipeline.
"""

import numpy as np
from typing import Tuple, Optional


# ── Constants ────────────────────────────────────────────────────────────
WINDOW_SIZE = 128          # Timesteps per sliding window
NUM_FEATURES = 6           # ax, ay, az, gx, gy, gz
SENSOR_VALUE_MIN = -1000   # Reasonable physical bound (m/s² & °/s)
SENSOR_VALUE_MAX = 1000


class ValidationError(Exception):
    """Raised when sensor data fails validation."""

    def __init__(self, message: str, status_code: int = 400):
        super().__init__(message)
        self.message = message
        self.status_code = status_code


def validate_sensor_payload(data: dict) -> np.ndarray:
    """
    Validate and parse a raw JSON payload into a NumPy array.

    Parameters
    ----------
    data : dict
        Parsed request JSON. Must contain key ``sensor_data`` with shape (128, 6).

    Returns
    -------
    np.ndarray
        Validated array of shape (128, 6), dtype float32.

    Raises
    ------
    ValidationError
        If the payload is malformed or values are out of range.
    """
    # ── Check top-level key ──────────────────────────────────────────
    if data is None:
        raise ValidationError("Request body is empty or not valid JSON.")

    if "sensor_data" not in data:
        raise ValidationError(
            "Missing required key 'sensor_data' in request body."
        )

    raw = data["sensor_data"]

    # ── Convert to array ─────────────────────────────────────────────
    try:
        arr = np.array(raw, dtype=np.float32)
    except (ValueError, TypeError) as exc:
        raise ValidationError(
            f"sensor_data contains non-numeric values: {exc}"
        )

    # ── Check for NaN / Inf ──────────────────────────────────────────
    if np.any(np.isnan(arr)):
        raise ValidationError("sensor_data contains NaN values.")
    if np.any(np.isinf(arr)):
        raise ValidationError("sensor_data contains infinite values.")

    # ── Shape validation ─────────────────────────────────────────────
    if arr.ndim != 2:
        raise ValidationError(
            f"Expected 2-D array (128, 6), got {arr.ndim}-D array."
        )

    rows, cols = arr.shape
    if rows != WINDOW_SIZE:
        raise ValidationError(
            f"Expected {WINDOW_SIZE} timesteps, got {rows}."
        )
    if cols != NUM_FEATURES:
        raise ValidationError(
            f"Expected {NUM_FEATURES} features per timestep, got {cols}."
        )

    # ── Range sanity check ───────────────────────────────────────────
    if np.any(arr < SENSOR_VALUE_MIN) or np.any(arr > SENSOR_VALUE_MAX):
        raise ValidationError(
            f"Sensor values must be in [{SENSOR_VALUE_MIN}, {SENSOR_VALUE_MAX}]."
        )

    return arr
