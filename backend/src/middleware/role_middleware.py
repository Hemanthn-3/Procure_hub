from functools import wraps
from flask import request, jsonify


def require_role(*allowed_roles):
    """
    Role-based access control decorator factory.
    Usage: @require_role('procurement_manager') or @require_role('vendor')
    Must be used AFTER @auth_required.
    """

    def decorator(f):
        @wraps(f)
        def decorated(*args, **kwargs):
            user = getattr(request, "user", None)
            if not user:
                return jsonify({"error": "Authentication required."}), 401

            if user.get("role") not in allowed_roles:
                return (
                    jsonify(
                        {
                            "error": f"Access denied. Required role: {' or '.join(allowed_roles)}. "
                            f"Your role: {user.get('role')}"
                        }
                    ),
                    403,
                )

            return f(*args, **kwargs)

        return decorated

    return decorator
