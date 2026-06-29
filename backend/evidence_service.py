import time
from db import get_connection
from pdf_reader import extract_text
from llm import analyze_evidence_match

def validate_evidence_async(evidence_id):
    """
    Background worker to validate evidence against MAP requirements using AI.
    """
    try:
        # 1. Fetch evidence and MAP details
        conn = get_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("""
            SELECT e.file_path, m.title, m.description, m.id as map_id
            FROM evidence e 
            JOIN maps m ON e.map_id = m.id 
            WHERE e.id = %s
        """, (evidence_id,))
        data = cursor.fetchone()
        
        if not data:
            cursor.close()
            conn.close()
            return

        # 2. Extract text from PDF
        text = extract_text(data['file_path'])
        
        # 3. Analyze with LLM
        analysis = analyze_evidence_match(text, data['title'], data['description'])
        
        validation_result = "Compliant" if analysis.get('compliant') else "Non-Compliant"
        validation_reason = analysis.get('reason', "No reason provided by AI.")
        compliance_score = analysis.get('score', 0)
        
        # Simplified Logic for Acceptance as per User Request:
        # If score >= 70: Auto-Accept (Well Done)
        # If score < 70: Auto-Reject (Try Better)
        
        if compliance_score >= 70:
            acceptance_status = "Accepted"
            needs_manual = False
            map_status = 'Completed'
        else:
            acceptance_status = "Rejected"
            needs_manual = False
            map_status = 'Action Required'

        # 4. Update evidence table
        cursor.execute("""
            UPDATE evidence 
            SET validation_result = %s, 
                validation_reason = %s, 
                compliance_score = %s,
                manual_verification_status = %s,
                needs_manual_verification = %s
            WHERE id = %s
        """, (validation_result, validation_reason, compliance_score, acceptance_status, needs_manual, evidence_id))
        
        # 5. Update maps status
        cursor.execute("""
            UPDATE maps 
            SET compliance_score = %s, status = %s 
            WHERE id = %s
        """, (compliance_score, map_status, data['map_id']))
        
        # COMMIT IMMEDIATELY so results are visible even if logging fails
        conn.commit()

        # 6. Log the action (Optional - don't crash if this fails)
        try:
            cursor.execute("""
                INSERT INTO auditlogs (module, action, details) 
                VALUES (%s, %s, %s)
            """, ("EVIDENCE", "AI_VALIDATION", f"AI Validated Evidence ID {evidence_id} for MAP ID {data['map_id']}: {validation_result} (Score: {compliance_score}%). Status: {acceptance_status}"))
            conn.commit()
        except Exception as log_err:
            print(f"Logging Error: {log_err}")
        cursor.close()
        conn.close()
        
    except Exception as e:
        print(f"Evidence Validation Error: {e}")
