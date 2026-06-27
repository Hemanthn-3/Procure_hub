from flask import Flask, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import os

load_dotenv()


def create_app():
    """Flask application factory."""
    app = Flask(__name__)

    # ─── CONFIGURATION ───────────────────────────────────
    app.config["SECRET_KEY"] = os.getenv("JWT_SECRET", "default_secret")

    # ─── CORS ────────────────────────────────────────────
    CORS(
        app,
        origins=[os.getenv("FRONTEND_URL", "http://localhost:5173")],
        supports_credentials=True,
    )

    # ─── REGISTER BLUEPRINTS ─────────────────────────────
    from src.routes.auth_routes import auth_bp
    from src.routes.procurement_routes import procurement_bp
    from src.routes.vendor_routes import vendor_bp

    app.register_blueprint(auth_bp)
    app.register_blueprint(procurement_bp)
    app.register_blueprint(vendor_bp)

    # ─── HEALTH CHECK ────────────────────────────────────
    @app.route("/api/v1/health", methods=["GET"])
    def health_check():
        from datetime import datetime, timezone
        return jsonify({"status": "ok", "timestamp": datetime.now(timezone.utc).isoformat()})

    # ─── 404 HANDLER ─────────────────────────────────────
    @app.errorhandler(404)
    def not_found(e):
        return jsonify({"error": "Route not found."}), 404

    # ─── 500 HANDLER ─────────────────────────────────────
    @app.errorhandler(500)
    def internal_error(e):
        return jsonify({"error": "Internal server error."}), 500

    return app
