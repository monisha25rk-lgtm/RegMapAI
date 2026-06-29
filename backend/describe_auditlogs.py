from db import get_connection

def describe():
    try:
        conn = get_connection()
        cursor = conn.cursor()
        print("\n--- auditlogs ---")
        cursor.execute(f"DESCRIBE auditlogs")
        for row in cursor.fetchall():
            print(row)
        cursor.close()
        conn.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    describe()
