from flask import Blueprint, request, jsonify
import os
from werkzeug.utils import secure_filename
from db import get_connection
import threading
# We will create evidence_service.py
from evidence_service import validate_evidence_async

evidence_bp = Blueprint('evidence', __name__)

UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), '..', 'uploads', 'evidence')
ALLOWED_EXTENSIONS = {'pdf', 'png', 'jpg', 'jpeg', 'docx'}

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@evidence_bp.route('/api/evidence/upload', methods=['POST'])
def upload_evidence():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    
    file = request.files['file']
    map_id = request.form.get('map_id')
    needs_manual = request.form.get('needs_manual', 'false').lower() == 'true'

    if not map_id:
        return jsonify({"error": "Missing map_id"}), 400
        
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
    
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        filepath = os.path.join(UPLOAD_FOLDER, filename)
        file.save(filepath)
        
        try:
            conn = get_connection()
            cursor = conn.cursor()
            query = """
                INSERT INTO evidence (map_id, file_path, file_name, validation_result, needs_manual_verification, manual_verification_status) 
                VALUES (%s, %s, %s, %s, %s, %s)
            """
            cursor.execute(query, (map_id, filepath, filename, 'Pending', needs_manual, 'Pending' if needs_manual else None))
            evidence_id = cursor.lastrowid
            conn.commit()
            cursor.close()
            conn.close()

            # Start AI validation in background
            thread = threading.Thread(target=validate_evidence_async, args=(evidence_id,))
            thread.start()

            # Log evidence upload
            try:
                conn_audit = get_connection()
                curr_audit = conn_audit.cursor()
                curr_audit.execute("""
                    INSERT INTO auditlogs (module, action, details) 
                    VALUES (%s, %s, %s)
                """, ("EVIDENCE", "EVIDENCE_UPLOAD", f"Uploaded evidence: {filename} for MAP ID {map_id}"))
                conn_audit.commit()
                curr_audit.close()
                conn_audit.close()
            except Exception as audit_err:
                print(f"Audit Logging Error: {audit_err}")
            
            return jsonify({
                "message": "Evidence uploaded successfully. AI validation started.", 
                "evidence_id": evidence_id,
                "status": "Pending"
            }), 202
        except Exception as e:
            return jsonify({"error": str(e)}), 500
            
    return jsonify({"error": "File type not allowed"}), 400

@evidence_bp.route('/api/evidence/status/<int:evidence_id>', methods=['GET'])
def get_evidence_status(evidence_id):
    try:
        conn = get_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("""
            SELECT validation_result as status, compliance_score, manual_verification_status 
            FROM evidence 
            WHERE id = %s
        """, (evidence_id,))
        result = cursor.fetchone()
        cursor.close()
        conn.close()
        if result:
            return jsonify(result)
        return jsonify({"error": "Not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@evidence_bp.route('/api/evidence/verify/<int:evidence_id>', methods=['POST'])
def verify_evidence_manually(evidence_id):
    data = request.json
    status = data.get('status') # 'Accepted' or 'Rejected' (Changed from Verified to match logic)

    try:
        conn = get_connection()
        cursor = conn.cursor(dictionary=True)
        
        # Get map_id for status update
        cursor.execute("SELECT map_id FROM evidence WHERE id = %s", (evidence_id,))
        row = cursor.fetchone()
        if not row:
            return jsonify({"error": "Evidence not found"}), 404
        
        map_id = row['map_id']

        # Update Evidence Status
        cursor.execute("""
            UPDATE evidence 
            SET manual_verification_status = %s, needs_manual_verification = %s
            WHERE id = %s
        """, (status, False, evidence_id))

        # Update MAP Status based on manual decision
        map_status = 'Completed' if status == 'Accepted' else 'Action Required'
        cursor.execute("UPDATE maps SET status = %s WHERE id = %s", (map_status, map_id))

        # Log manual verification
        cursor.execute("""
            INSERT INTO auditlogs (module, action, details) 
            VALUES (%s, %s, %s)
        """, ("EVIDENCE", "MANUAL_VERIFY", f"Evidence ID {evidence_id} marked as {status} (MAP ID: {map_id})"))

        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({"status": "success", "map_status": map_status})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
