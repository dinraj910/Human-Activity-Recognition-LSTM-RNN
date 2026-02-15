"""
health.py — /health route
──────────────────────────
Simple liveness and readiness probe for container orchestrators
and monitoring dashboards.
"""

import os
import logging
from flask import Blueprint, jsonify

logger = logging.getLogger(__name__)

health_bp = Blueprint("health", __name__)


@health_bp.route("/health", methods=["GET"])
def health():
    """
    GET /health
    ───────────
    Returns server status and whether required model files are present.
    """
    base = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    model_path = os.path.join(base, "model", "har_model.h5")
    scaler_path = os.path.join(base, "model", "scaler.pkl")

    model_ready = os.path.exists(model_path)
    scaler_ready = os.path.exists(scaler_path)
    all_ready = model_ready and scaler_ready

    status = {
        "status": "healthy" if all_ready else "degraded",
        "model_loaded": model_ready,
        "scaler_loaded": scaler_ready,
        "service": "HAR Prediction API",
        "version": "1.0.0",
    }

    http_code = 200 if all_ready else 503
    return jsonify(status), http_code
