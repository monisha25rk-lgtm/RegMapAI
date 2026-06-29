import sys
import os
# Add the current directory to sys.path to find db, pdf_reader, llm
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from evidence_service import validate_evidence_async
from db import get_connection

def test():
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT id FROM evidence WHERE validation_result = 'Pending' LIMIT 1")
    row = cursor.fetchone()
    cursor.close()
    conn.close()

    if row:
        print(f"Testing validation for evidence ID: {row['id']}")
        validate_evidence_async(row['id'])
        print("Validation finished. Check database.")
    else:
        print("No pending evidence found.")

if __name__ == "__main__":
    test()
