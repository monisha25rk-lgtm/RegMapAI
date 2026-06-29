import mysql.connector
import os

def get_connection():
    # Using your original credentials with environment variable support for deployment
    return mysql.connector.connect(
        host=os.getenv("DB_HOST", "localhost"),
        user=os.getenv("DB_USER", "root"),
        password=os.getenv("DB_PASSWORD", "RkjM@1969"),
        database=os.getenv("DB_NAME", "regmapai")
    )
