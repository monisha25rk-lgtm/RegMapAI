import os
import threading
from db import get_connection
from pdf_reader import extract_text
from ai_engine import RegMapAIEngine

# Initialize the AI Engine once
ai_engine = RegMapAIEngine()

def update_status(circular_id, status):
    """Utility to update circular status in DB"""
    try:
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute("UPDATE circulars SET authenticity_status = %s WHERE id = %s", (status, circular_id))
        conn.commit()
        cursor.close()
        conn.close()
    except Exception as e:
        print(f"❌ Status Update Error: {e}")

def process_existing_circular(circular_id, filepath, title, issuer):
    """
    Background pipeline that uses the multi-agent AI Engine and updates DB.
    """
    try:
        # 1. Extraction
        update_status(circular_id, 'Extracting')
        text = extract_text(filepath)
        if not text or len(text.strip()) == 0:
            update_status(circular_id, 'Extraction Failed')
            return
        
        # Save text content
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute("UPDATE circulars SET text_content = %s WHERE id = %s", (text, circular_id))
        conn.commit()
        
        # 2. AI Multi-Agent Analysis (CKO Driven)
        update_status(circular_id, 'AI Analyzing (14-Agents)')
        cko = ai_engine.analyze(text)
        
        # 3. Synchronize AI Output (CKO) to Database
        update_status(circular_id, 'Syncing Knowledge Object')
        
        # Update circular with CKO summary
        cursor.execute("UPDATE circulars SET text_content = %s, authenticity_status = %s WHERE id = %s", 
                       (text, 'Syncing...', circular_id))
        
        # Insert generated maps
        query_map = """
            INSERT INTO maps (circular_id, title, description, department, owner, deadline, priority, compliance_score, risk_score, risk_reason, status)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """
        
        for m in cko.maps:
            # Match departments assigned by Agent 4
            dept = m['departments'][0] if m['departments'] else 'General'
            owner = choose_owner(dept, cko.risk_score)
            
            # Find related risk info from Agent 5
            risk_reason = f"Agentic Risk: {cko.priority}"
            
            cursor.execute(query_map, (
                circular_id,
                m['id'][:100], # Title
                m['action_point'],
                dept,
                owner,
                "2024-12-31", # Default deadline if not extracted
                m['priority'],
                cko.compliance_score,
                cko.risk_score,
                risk_reason,
                'Assigned'
            ))
        
        # 4. Save Conflicts
        query_conflict = """
            INSERT INTO conflicts (circular_id, type, source_id, target_id, department, description, severity)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
        """
        for c in cko.conflicts:
            cursor.execute(query_conflict, (
                circular_id,
                c.get('type'),
                str(c.get('source_id')),
                str(c.get('target_id')),
                c.get('department'),
                c.get('description'),
                c.get('severity')
            ))

        # 5. Finalize
        cursor.execute("UPDATE circulars SET authenticity_status = %s WHERE id = %s", ('Processed', circular_id))
        conn.commit()
        cursor.close()
        conn.close()
        print(f"✅ RegMap AI Engine successfully processed circular {circular_id}.")
        
    except Exception as e:
        print(f"❌ AI Pipeline Error: {e}")
        import traceback
        traceback.print_exc()
        update_status(circular_id, 'AI Error')

def choose_owner(department, risk_score=0):
    if risk_score >= 85:
        return "Aditi Bose"
    owner_map = {
        "Compliance": "Priya Shah",
        "IT": "Rohit Verma",
        "Risk": "Ananya Singh",
        "Legal": "Neha Patel",
        "General": "Arjun Khanna"
    }
    return owner_map.get(department, owner_map['General'])

def process_circular(pdf_path):
    """Bridge for existing calls to process_circular"""
    print(f"🚀 Starting legacy bridge for: {pdf_path}")
    filename = os.path.basename(pdf_path)
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("INSERT INTO circulars (title, issuer, source, authenticity_status) VALUES (%s, %s, %s, %s)", 
                   (filename, "RBI", pdf_path, "Uploading"))
    circular_id = cursor.lastrowid
    conn.commit()
    cursor.close()
    conn.close()
    process_existing_circular(circular_id, pdf_path, filename, "RBI")
    return True

def process_new_circular(filepath, title, issuer):
    """Mainly for testing or synchronous needs"""
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("INSERT INTO circulars (title, issuer, source, authenticity_status) VALUES (%s, %s, %s, %s)", 
                   (title, issuer, filepath, 'Processing'))
    circular_id = cursor.lastrowid
    conn.commit()
    cursor.close()
    conn.close()
    process_existing_circular(circular_id, filepath, title, issuer)
    return circular_id

def save_circular(title, issuer, source, text):
    """Simple save for backward compatibility"""
    try:
        conn = get_connection()
        cursor = conn.cursor()
        query = "INSERT INTO circulars (title, issuer, source, text_content, authenticity_status) VALUES (%s, %s, %s, %s, %s)"
        cursor.execute(query, (title, issuer, source, text, "Verified"))
        conn.commit()
        cursor.close()
        conn.close()
    except Exception as e:
        print(f"❌ Error in save_circular: {e}")
