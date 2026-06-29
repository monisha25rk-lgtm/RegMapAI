import mysql.connector
import sqlite3
import os

class SQLiteCursor:
    def __init__(self, cursor):
        self.cursor = cursor
    def execute(self, query, params=None):
        if params:
            # Convert MySQL %s to SQLite ?
            query = query.replace('%s', '?')
            return self.cursor.execute(query, params)
        return self.cursor.execute(query)
    def fetchone(self):
        row = self.cursor.fetchone()
        return dict(row) if row else None
    def fetchall(self):
        rows = self.cursor.fetchall()
        return [dict(row) for row in rows]
    def close(self):
        return self.cursor.close()
    @property
    def lastrowid(self):
        return self.cursor.lastrowid

class SQLiteConnection:
    def __init__(self, conn):
        self.conn = conn
    def cursor(self, dictionary=False):
        return SQLiteCursor(self.conn.cursor())
    def commit(self):
        return self.conn.commit()
    def close(self):
        return self.conn.close()

def init_sqlite_db(conn):
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS circulars (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT, issuer TEXT, upload_date TIMESTAMP,
            text_content TEXT, authenticity_status TEXT DEFAULT 'Pending'
        )
    """)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS maps (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            circular_id INTEGER, title TEXT, description TEXT,
            department TEXT, owner TEXT, deadline DATE,
            priority TEXT, compliance_score REAL, risk_score REAL,
            risk_reason TEXT, status TEXT DEFAULT 'Assigned',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS evidence (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            map_id INTEGER, file_name TEXT, file_path TEXT,
            upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            compliance_score REAL, validation_result TEXT,
            needs_manual_verification INTEGER DEFAULT 0,
            manual_verification_status TEXT DEFAULT 'Awaiting Review'
        )
    """)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS auditlogs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            user_id INTEGER, action TEXT, module TEXT, details TEXT
        )
    """)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT, email TEXT, role TEXT
        )
    """)
    conn.commit()

def get_connection():
    db_host = os.getenv("DB_HOST")
    if db_host:
        return mysql.connector.connect(
            host=db_host,
            user=os.getenv("DB_USER", "root"),
            password=os.getenv("DB_PASSWORD", "RkjM@1969"),
            database=os.getenv("DB_NAME", "regmapai")
        )
    else:
        db_path = os.path.join(os.path.dirname(__file__), 'database.db')
        is_new = not os.path.exists(db_path)
        conn = sqlite3.connect(db_path, check_same_thread=False)
        conn.row_factory = sqlite3.Row
        if is_new:
            init_sqlite_db(conn)
        return SQLiteConnection(conn)
