import mysql.connector
import sqlite3
import os

def get_connection():
    # Check if we should use MySQL (if host is provided)
    db_host = os.getenv("DB_HOST")
    
    if db_host:
        # Use MySQL (Production or Local with credentials)
        return mysql.connector.connect(
            host=db_host,
            user=os.getenv("DB_USER", "root"),
            password=os.getenv("DB_PASSWORD", "RkjM@1969"),
            database=os.getenv("DB_NAME", "regmapai"),
            port=int(os.getenv("DB_PORT", 3306))
        )
    else:
        # USE SQLITE (FREE, NO HOST NEEDED)
        # This creates a file called 'database.db' in the project folder
        db_path = os.path.join(os.path.dirname(__file__), 'database.db')
        conn = sqlite3.connect(db_path)
        conn.row_factory = sqlite3.Row  # This makes it behave like a dictionary
        return conn
