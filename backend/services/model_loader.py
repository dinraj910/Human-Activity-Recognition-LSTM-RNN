"""
model_loader.py
───────────────
Singleton-style model and scaler loader.

Loads the trained LSTM model and StandardScaler once at application startup
and caches them in memory for fast inference.  Thread-safe by virtue of
Python's GIL and the fact that TensorFlow models are read-only after load.
"""

import os
import json
import logging
import joblib
import tensorflow as tf
import numpy as np

logger = logging.getLogger(__name__)

# ── Module-level cache ───────────────────────────────────────────────────
_model = None
_scaler = None
_class_map = None

# ── Paths (relative to backend/) ─────────────────────────────────────────
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_PATH = os.environ.get(
    "HAR_MODEL_PATH",
    os.path.join(BASE_DIR, "model", "best_har_model.h5"),
)
SCALER_PATH = os.environ.get(
    "HAR_SCALER_PATH",
    os.path.join(BASE_DIR, "model", "scaler.pkl"),
)
CLASS_MAP_PATH = os.environ.get(
    "HAR_CLASS_MAP_PATH",
    os.path.join(BASE_DIR, "model", "class_map.json"),
)


def load_model():
    """Load the Keras LSTM model from disk (cached after first call)."""
    global _model
    if _model is None:
        logger.info("Loading HAR LSTM model from %s …", MODEL_PATH)
        if not os.path.exists(MODEL_PATH):
            raise FileNotFoundError(
                f"Model file not found at {MODEL_PATH}. "
                "Place your trained har_model.h5 in backend/model/."
            )
        _model = tf.keras.models.load_model(MODEL_PATH, compile=False)
        logger.info("Model loaded — input shape: %s", _model.input_shape)
    return _model


def load_scaler():
    """Load the fitted StandardScaler from disk (cached after first call)."""
    global _scaler
    if _scaler is None:
        logger.info("Loading StandardScaler from %s …", SCALER_PATH)
        if not os.path.exists(SCALER_PATH):
            raise FileNotFoundError(
                f"Scaler file not found at {SCALER_PATH}. "
                "Place your fitted scaler.pkl in backend/model/."
            )
        _scaler = joblib.load(SCALER_PATH)
        logger.info("Scaler loaded — n_features: %s", _scaler.n_features_in_)
    return _scaler


def load_class_map() -> dict:
    """Load the integer→label class mapping."""
    global _class_map
    if _class_map is None:
        logger.info("Loading class map from %s …", CLASS_MAP_PATH)
        if not os.path.exists(CLASS_MAP_PATH):
            # Fallback to default if file is missing
            _class_map = {
                0: "WALKING",
                1: "WALKING_UPSTAIRS",
                2: "WALKING_DOWNSTAIRS",
                3: "SITTING",
                4: "STANDING",
                5: "LAYING",
            }
            logger.warning("class_map.json not found — using defaults.")
        else:
            with open(CLASS_MAP_PATH, "r") as f:
                raw = json.load(f)
            # Keys in JSON are always strings; convert to int
            _class_map = {int(k): v for k, v in raw.items()}
            logger.info("Class map loaded — %d classes", len(_class_map))
    return _class_map


def get_all():
    """Convenience: return (model, scaler, class_map) in one call."""
    return load_model(), load_scaler(), load_class_map()
