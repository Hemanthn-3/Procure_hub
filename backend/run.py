"""
ProcureHub Backend — Entry Point
Run: python run.py
"""

import os
from dotenv import load_dotenv

load_dotenv()

from src.app import create_app
from src.config.db import test_connection

app = create_app()

if __name__ == "__main__":
    # Test database connection
    test_connection()

    port = int(os.getenv("PORT", 5000))
    print(f"ProcureHub API server running on http://localhost:{port}")
    print(f"Health check: http://localhost:{port}/api/v1/health")

    app.run(host="0.0.0.0", port=port, debug=True)
