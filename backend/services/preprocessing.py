"""
preprocessing.py
────────────────
Applies the same StandardScaler transform that was used during training.

The scaler was fitted on the flattened (N*128, 6) training data.  At inference
time we flatten the incoming (128, 6) window, transform, then reshape back
to (1, 128, 6) for the LSTM.
"""

import numpy as np
import logging

logger = logging.getLogger(__name__)


def preprocess_window(sensor_data: np.ndarray, scaler) -> np.ndarray:
    """
    Scale a raw sensor window and reshape for model input.

    Parameters
    ----------
    sensor_data : np.ndarray
        Shape (128, 6) — one sliding window of raw sensor readings.
    scaler : sklearn.preprocessing.StandardScaler
        The fitted scaler saved during training.

    Returns
    -------
    np.ndarray
        Shape (1, 128, 6) — ready for ``model.predict()``.
    """
    # Flatten to (128, 6) → apply per-feature scaling
    flat = sensor_data.reshape(-1, 6)
    scaled = scaler.transform(flat)

    # Reshape to batch dimension (1, 128, 6)
    result = scaled.reshape(1, 128, 6).astype(np.float32)

    logger.debug(
        "Preprocessed window — mean: %.4f, std: %.4f",
        result.mean(),
        result.std(),
    )
    return result
