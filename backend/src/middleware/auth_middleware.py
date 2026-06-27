import os
import jwt
from functools import wraps
from flask import request, jsonify
from dotenv import load_dotenv

load_dotenv()

JWT_SECRET = os.getenv("JWT_SECRET", "default_secret")


def auth_required(f):
    """
    Authentication middleware decorator.
    Verifies JWT token from the Authorization header.
    Attaches decoded user info to flask.g.user.
    """

    @wraps(f)
    def decorated(*args, **kwargs):
        auth_header = request.headers.get("Authorization")

        if not auth_header:
            return jsonify({"error": "Access denied. No token provided."}), 401

        # Support both "Bearer <token>" and raw "<token>" formats
        token = auth_header
        if auth_header.startswith("Bearer "):
            token = auth_header[7:]

        if not token:
            return jsonify({"error": "Access denied. Invalid token format."}), 401

        try:
            decoded = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
            # Attach user info to request context
            request.user = decoded  # { "id", "email", "role" }
        except jwt.ExpiredSignatureError:
            return jsonify({"error": "Token has expired. Please login again."}), 401
        except jwt.InvalidTokenError:
            return jsonify({"error": "Invalid token."}), 401

        return f(*args, **kwargs)

    return decorated
