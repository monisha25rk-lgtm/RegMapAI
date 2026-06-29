from db import get_connection

def create():
    try:
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS conflicts (
                id INT AUTO_INCREMENT PRIMARY KEY,
                circular_id INT,
                type VARCHAR(50),
                source_id VARCHAR(50),
                target_id VARCHAR(50),
                department VARCHAR(100),
                description TEXT,
                severity VARCHAR(20),
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (circular_id) REFERENCES circulars(id)
            )
        """)
        conn.commit()
        print("Conflicts table checked/created.")
        cursor.close()
        conn.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    create()
