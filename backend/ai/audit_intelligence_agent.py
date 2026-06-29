from db import get_connection
import datetime

class AuditIntelligenceAgent:
    """Agent 12: Evaluates audit readiness and records the immutable CKO processing log to the database."""
    def analyze(self, cko):
        missing_evidence = [e for e in cko.evidence if e['status'] == "Missing"]
        cko.reports['audit_readiness'] = {
            "status": "Incomplete" if missing_evidence else "Ready",
            "gaps": len(missing_evidence),
            "recommendations": [
                "Complete evidence collection for all MAPs.",
                "Conduct internal department review for High priority items."
            ]
        }
        
        # Log to DB for "Immutable Audit Trail"
        try:
            conn = get_connection()
            cursor = conn.cursor()
            log_details = f"14-Agent Pipeline executed. Score: {cko.compliance_score}. Obligations: {len(cko.obligations)}."
            cursor.execute("""
                INSERT INTO AuditLogs (user, action, module, details) 
                VALUES (%s, %s, %s, %s)
            """, ('SYSTEM_AI', 'PROCESS_CKO', 'AI_ENGINE', log_details))
            conn.commit()
            cursor.close()
            conn.close()
        except Exception as e:
            print(f"Agent 12 Log Error: {e}")

        cko.processing_log.append("Agent 12: Audit readiness assessment & trail updated.")
        return cko
