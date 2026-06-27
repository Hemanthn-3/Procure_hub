from flask import Blueprint
from src.controllers.auth_controller import signup, login

auth_bp = Blueprint("auth", __name__, url_prefix="/api/v1/auth")

# POST /api/v1/auth/signup
auth_bp.route("/signup", methods=["POST"])(signup)

# POST /api/v1/auth/login
auth_bp.route("/login", methods=["POST"])(login)
