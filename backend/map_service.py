from db import get_connection
import json

def store_maps(llm_json):
    """
    Phase 3: MAP Storage Layer
    Validates LLM output and inserts MAPs into the database.
    """
    if not llm_json or "maps" not in llm_json:
        print("❌ Error: Invalid JSON input for MAP storage.")
        return False

    circular_id = llm_json.get("circular_id")
    maps = llm_json.get("maps", [])
    
    conn = get_connection()
    cursor = conn.cursor()
    
    success_count = 0
    try:
        for m in maps:
            # Map LLM fields to DB schema (MAPs table)
            title = m.get("title", "Untitled Task")
            description = m.get("description", "")
            department = m.get("department", "General")
            priority = m.get("priority", "Medium")
            deadline = m.get("deadline")
            risk_reason = m.get("risk_reason", "") 
            risk_score = m.get("risk_score", 50)
            
            # Handle empty/invalid deadline
            if not deadline or deadline.lower() == "null":
                deadline = None

            query = """
                INSERT INTO MAPs (
                    circular_id, title, description, department, 
                    deadline, priority, risk_reason, risk_score, status
                ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
            """
            values = (
                circular_id, title, description, department,
                deadline, priority, risk_reason, risk_score, "Pending"
            )
            
            cursor.execute(query, values)
            success_count += 1
            
        conn.commit()
        print(f"✅ Successfully stored {success_count} MAPs in the database.")
        return True
    except Exception as e:
        conn.rollback()
        print(f"❌ Database Insert Error: {str(e)}")
        return False
    finally:
        cursor.close()
        conn.close()
