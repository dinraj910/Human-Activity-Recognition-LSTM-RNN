"""
inference.py
────────────
Orchestrates the full prediction pipeline:
  raw sensor data → validation → preprocessing → model prediction → result.

This is the single entry point called by the API route.
"""

import time
import logging
import numpy as np

from services.model_loader import load_model, load_scaler, load_class_map
from services.preprocessing import preprocess_window

logger = logging.getLogger(__name__)


def predict_activity(sensor_data: np.ndarray) -> dict:
    """
    Run end-to-end inference on a validated (128, 6) sensor window.

    Parameters
    ----------
    sensor_data : np.ndarray
        Validated array of shape (128, 6).

    Returns
    -------
    dict
        {
            "activity": str,          # Human-readable label
            "activity_index": int,    # 0-5
            "confidence": float,      # Max softmax probability
            "probabilities": dict,    # All class probabilities
            "inference_ms": float     # Wall-clock inference time
        }
    """
    model = load_model()
    scaler = load_scaler()
    class_map = load_class_map()

    # ── Preprocess ───────────────────────────────────────────────────
    processed = preprocess_window(sensor_data, scaler)

    # ── Predict ──────────────────────────────────────────────────────
    t0 = time.perf_counter()
    predictions = model.predict(processed, verbose=0)
    inference_ms = (time.perf_counter() - t0) * 1000

    # ── Decode ───────────────────────────────────────────────────────
    probs = predictions[0]                       # shape (6,)
    predicted_index = int(np.argmax(probs))
    confidence = float(np.max(probs))
    activity = class_map.get(predicted_index, "UNKNOWN")

    # Build per-class probability map
    prob_map = {
        class_map.get(i, f"CLASS_{i}"): round(float(p), 4)
        for i, p in enumerate(probs)
    }

    logger.info(
        "Prediction: %s (%.1f%%) in %.1f ms",
        activity,
        confidence * 100,
        inference_ms,
    )

    return {
        "activity": activity,
        "activity_index": predicted_index,
        "confidence": round(confidence, 4),
        "probabilities": prob_map,
        "inference_ms": round(inference_ms, 2),
    }
