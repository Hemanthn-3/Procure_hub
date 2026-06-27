import mysql.connector
from mysql.connector import pooling
import os
from dotenv import load_dotenv

load_dotenv()

# Connection pool configuration
db_config = {
    "host": os.getenv("DB_HOST", "localhost"),
    "user": os.getenv("DB_USER", "root"),
    "password": os.getenv("DB_PASSWORD", ""),
    "database": os.getenv("DB_NAME", "procurehub"),
    "port": int(os.getenv("DB_PORT", 3306)),
    "use_pure": True,
}

# Create a connection pool
try:
    connection_pool = pooling.MySQLConnectionPool(
        pool_name="procurehub_pool",
        pool_size=10,
        pool_reset_session=True,
        **db_config
    )
    print("MySQL connection pool created successfully")
except mysql.connector.Error as err:
    print(f"MySQL connection pool error: {err}")
    connection_pool = None


def get_connection():
    """Get a connection from the pool."""
    if connection_pool is None:
        raise Exception("Database connection pool is not available")
    return connection_pool.get_connection()


def test_connection():
    """Test if the database connection is working."""
    try:
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT 1")
        cursor.fetchone()
        cursor.close()
        conn.close()
        print("MySQL connected successfully")
        return True
    except Exception as e:
        print(f"MySQL connection failed: {e}")
        return False
