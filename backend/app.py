"""
app.py — Flask Application Factory
───────────────────────────────────
Human Activity Recognition (HAR) Prediction API.

This module bootstraps the Flask application, configures CORS, structured
logging, and registers all route blueprints.  On startup (when not in
lazy-load mode) it pre-loads the LSTM model and scaler into memory so the
first prediction request is fast.

Usage (development):
    python app.py

Usage (production):
    gunicorn -w 1 -b 0.0.0.0:5000 app:app
    (Use 1 worker — TF models are large; share via threads, not forks.)
"""

import os
import sys
import logging
from flask import Flask
from flask_cors import CORS

# ---------------------------------------------------------------------------
# Logging
# ---------------------------------------------------------------------------
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s │ %(levelname)-8s │ %(name)-24s │ %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
    handlers=[logging.StreamHandler(sys.stdout)],
)
logger = logging.getLogger(__name__)


def create_app() -> Flask:
    """Application factory."""
    app = Flask(__name__)

    # ── CORS ─────────────────────────────────────────────────────────
    # In production, replace "*" with your frontend origin.
    CORS(
        app,
        resources={r"/*": {"origins": os.environ.get("CORS_ORIGINS", "*")}},
        supports_credentials=True,
    )

    # ── Register blueprints ──────────────────────────────────────────
    from routes.predict import predict_bp
    from routes.health import health_bp

    app.register_blueprint(predict_bp)
    app.register_blueprint(health_bp)

    # ── Eagerly load model & scaler (optional but recommended) ───────
    if os.environ.get("LAZY_LOAD", "false").lower() != "true":
        with app.app_context():
            try:
                from services.model_loader import get_all
                get_all()
                logger.info("✓ Model, scaler, and class map pre-loaded.")
            except FileNotFoundError as e:
                logger.warning(
                    "⚠ Model files not found — predictions will fail "
                    "until files are placed in backend/model/.  (%s)", e
                )

    logger.info("HAR Prediction API ready.")
    return app


# ---------------------------------------------------------------------------
# Entry point
# ---------------------------------------------------------------------------
app = create_app()

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    debug = os.environ.get("FLASK_DEBUG", "true").lower() == "true"
    logger.info("Starting development server on port %d (debug=%s)", port, debug)
    app.run(host="0.0.0.0", port=port, debug=debug)
