import mysql.connector
import os

def get_connection():
    # Use environment variables for production, fallback to local for development
    return mysql.connector.connect(
        host=os.getenv("DB_HOST", "localhost"),
        user=os.getenv("DB_USER", "root"),
        password=os.getenv("DB_PASSWORD", "RkjM@1969"),
        database=os.getenv("DB_NAME", "regmapai"),
        port=int(os.getenv("DB_PORT", 3306))
    )