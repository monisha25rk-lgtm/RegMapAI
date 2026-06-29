from db import get_connection

def check():
    try:
        conn = get_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM maps")
        rows = cursor.fetchall()
        print(f"Total MAPs: {len(rows)}")
        for row in rows:
            print(f"ID: {row['id']}, Title: {row['title']}")
        cursor.close()
        conn.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    check()
