"""
predict.py — /predict route
────────────────────────────
Accepts a JSON body with 128×6 sensor data and returns the predicted
human activity with confidence scores.
"""

import logging
from flask import Blueprint, request, jsonify

from utils.validators import validate_sensor_payload, ValidationError
from services.inference import predict_activity

logger = logging.getLogger(__name__)

predict_bp = Blueprint("predict", __name__)


@predict_bp.route("/predict", methods=["POST"])
def predict():
    """
    POST /predict
    ─────────────
    Body (JSON):
        {
            "sensor_data": [[ax,ay,az,gx,gy,gz], ...] // 128 rows × 6 cols
        }

    Response 200:
        {
            "activity": "WALKING",
            "activity_index": 0,
            "confidence": 0.94,
            "probabilities": { ... },
            "inference_ms": 23.5
        }

    Response 400:  Validation error.
    Response 500:  Internal model/server error.
    """
    try:
        # ── Parse & validate ─────────────────────────────────────────
        data = request.get_json(silent=True)
        sensor_array = validate_sensor_payload(data)

        # ── Run inference ────────────────────────────────────────────
        result = predict_activity(sensor_array)

        return jsonify(result), 200

    except ValidationError as ve:
        logger.warning("Validation failed: %s", ve.message)
        return jsonify({"error": ve.message}), ve.status_code

    except FileNotFoundError as fnf:
        logger.error("Model file missing: %s", fnf)
        return jsonify({"error": str(fnf)}), 503

    except Exception as exc:
        logger.exception("Unexpected error during prediction")
        return jsonify({"error": "Internal server error."}), 500
