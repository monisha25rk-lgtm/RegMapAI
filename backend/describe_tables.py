from db import get_connection

def describe():
    try:
        conn = get_connection()
        cursor = conn.cursor()
        for table in ['maps', 'evidence']:
            print(f"\n--- {table} ---")
            cursor.execute(f"DESCRIBE {table}")
            for row in cursor.fetchall():
                print(row)
        cursor.close()
        conn.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    describe()
