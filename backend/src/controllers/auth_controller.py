import os
import jwt
from datetime import datetime, timedelta, timezone
from flask import request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from dotenv import load_dotenv

from src.models.User import User
from src.utils.validators import validate_signup, validate_login

load_dotenv()

JWT_SECRET = os.getenv("JWT_SECRET", "default_secret")
JWT_EXPIRES_IN_HOURS = int(os.getenv("JWT_EXPIRES_IN_HOURS", 24))


def signup():
    """
    POST /api/v1/auth/signup
    Register a new user (procurement_manager or vendor).
    """
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "Request body is required."}), 400

        # Validate request body
        errors = validate_signup(data)
        if errors:
            return jsonify({"errors": errors}), 400

        email = data["email"]
        password = data["password"]
        company_name = data["company_name"]
        role = data["role"]

        # Check if email already exists
        existing_user = User.find_by_email(email)
        if existing_user:
            return jsonify({"error": "Email already registered."}), 409

        # Hash the password using werkzeug (pbkdf2:sha256)
        password_hash = generate_password_hash(password)

        # Create user
        user = User.create(email, password_hash, company_name, role)

        # Generate JWT
        payload = {
            "id": user["id"],
            "email": user["email"],
            "role": user["role"],
            "exp": datetime.now(timezone.utc) + timedelta(hours=JWT_EXPIRES_IN_HOURS),
        }
        token = jwt.encode(payload, JWT_SECRET, algorithm="HS256")

        # Store session token
        User.update_token(user["id"], token)

        return (
            jsonify(
                {
                    "message": "User registered successfully.",
                    "token": token,
                    "user": {
                        "id": user["id"],
                        "email": user["email"],
                        "company_name": user["company_name"],
                        "role": user["role"],
                    },
                }
            ),
            201,
        )

    except Exception as e:
        print(f"Signup error: {e}")
        return jsonify({"error": "Internal server error."}), 500


def login():
    """
    POST /api/v1/auth/login
    Authenticate user and return JWT.
    """
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "Request body is required."}), 400

        # Validate request body
        errors = validate_login(data)
        if errors:
            return jsonify({"errors": errors}), 400

        email = data["email"]
        password = data["password"]

        # Find user by email
        user = User.find_by_email(email)
        if not user:
            return jsonify({"error": "Invalid email or password."}), 401

        # Verify password using werkzeug
        if not check_password_hash(user["password_hash"], password):
            return jsonify({"error": "Invalid email or password."}), 401

        # Generate JWT
        payload = {
            "id": user["id"],
            "email": user["email"],
            "role": user["role"],
            "exp": datetime.now(timezone.utc) + timedelta(hours=JWT_EXPIRES_IN_HOURS),
        }
        token = jwt.encode(payload, JWT_SECRET, algorithm="HS256")

        # Store session token
        User.update_token(user["id"], token)

        return jsonify(
            {
                "message": "Login successful.",
                "token": token,
                "user": {
                    "id": user["id"],
                    "email": user["email"],
                    "company_name": user["company_name"],
                    "role": user["role"],
                },
            }
        )

    except Exception as e:
        print(f"Login error: {e}")
        return jsonify({"error": "Internal server error."}), 500
