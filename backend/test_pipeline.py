import os
import sys
from circularservice import process_new_circular
from db import get_connection

def run_test():
    """
    Phase 5: Test Script
    Runs the full pipeline on a sample PDF and prints statistics.
    """
    sample_pdf = os.path.join("uploads", "sample1.pdf")
    
    # Ensure uploads directory exists
    if not os.path.exists("uploads"):
        os.makedirs("uploads")
        print("📁 Created 'uploads' directory.")

    if not os.path.exists(sample_pdf):
        print(f"❌ Error: {sample_pdf} not found.")
        print("Please place a sample RBI circular PDF at 'backend/uploads/sample1.pdf' before running this test.")
        return

    print("--- 🏁 STARTING FULL PIPELINE TEST ---")
    
    # Call the correct function name: process_new_circular
    circular_id = process_new_circular(sample_pdf, "Test RBI Circular", "RBI")
    
    if circular_id:
        print("\n--- 📊 TEST RESULTS ---")
        try:
            conn = get_connection()
            cursor = conn.cursor(dictionary=True)
            
            # Count MAPs generated
            cursor.execute("SELECT COUNT(*) as count FROM MAPs WHERE circular_id = %s", (circular_id,))
            count = cursor.fetchone()['count']
            
            # Get departments assigned
            cursor.execute("SELECT DISTINCT department FROM MAPs WHERE circular_id = %s", (circular_id,))
            depts = [row['department'] for row in cursor.fetchall()]
            
            print(f"✅ Success: Pipeline processed circular ID: {circular_id}")
            print(f"📦 MAPs Generated: {count}")
            print(f"🏢 Departments Assigned: {', '.join(depts) if depts else 'None'}")
            
            cursor.close()
            conn.close()
        except Exception as e:
            print(f"❌ Error fetching test results: {e}")
    else:
        print("\n❌ Pipeline Test Failed. Check logs above for details.")

if __name__ == "__main__":
    run_test()
