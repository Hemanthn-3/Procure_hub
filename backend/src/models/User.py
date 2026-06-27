from src.config.db import get_connection


class User:
    """User model — maps to the users table."""

    @staticmethod
    def find_by_email(email):
        """Find a user by email."""
        conn = get_connection()
        cursor = conn.cursor(dictionary=True)
        try:
            cursor.execute("SELECT * FROM users WHERE email = %s", (email,))
            return cursor.fetchone()
        finally:
            cursor.close()
            conn.close()

    @staticmethod
    def find_by_id(user_id):
        """Find a user by ID (excludes password_hash)."""
        conn = get_connection()
        cursor = conn.cursor(dictionary=True)
        try:
            cursor.execute(
                "SELECT id, email, company_name, role, status, created_at "
                "FROM users WHERE id = %s",
                (user_id,),
            )
            return cursor.fetchone()
        finally:
            cursor.close()
            conn.close()

    @staticmethod
    def create(email, password_hash, company_name, role):
        """Create a new user."""
        conn = get_connection()
        cursor = conn.cursor()
        try:
            cursor.execute(
                "INSERT INTO users (email, password_hash, company_name, role) "
                "VALUES (%s, %s, %s, %s)",
                (email, password_hash, company_name, role),
            )
            conn.commit()
            user_id = cursor.lastrowid
            return {
                "id": user_id,
                "email": email,
                "company_name": company_name,
                "role": role,
            }
        finally:
            cursor.close()
            conn.close()

    @staticmethod
    def update_token(user_id, token):
        """Update user's session token."""
        conn = get_connection()
        cursor = conn.cursor()
        try:
            cursor.execute(
                "UPDATE users SET session_token = %s WHERE id = %s",
                (token, user_id),
            )
            conn.commit()
        finally:
            cursor.close()
            conn.close()
