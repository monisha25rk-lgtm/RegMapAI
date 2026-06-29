from flask import Blueprint, request, jsonify
import os
import threading
from werkzeug.utils import secure_filename
from circularservice import process_existing_circular
from db import get_connection

upload_bp = Blueprint('upload', __name__)

UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), '..', 'uploads')
ALLOWED_EXTENSIONS = {'pdf', 'docx', 'xml'}

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@upload_bp.route('/api/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
    
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        filepath = os.path.join(UPLOAD_FOLDER, filename)
        file.save(filepath)
        
        title = request.form.get('title', filename)
        issuer = request.form.get('issuer', 'RBI')
        
        try:
            conn = get_connection()
            cursor = conn.cursor()
            query = "INSERT INTO circulars (title, issuer, source, authenticity_status) VALUES (%s, %s, %s, %s)"
            cursor.execute(query, (title, issuer, filepath, 'Uploaded'))
            circular_id = cursor.lastrowid
            conn.commit()
            cursor.close()
            conn.close()

            # Start background processing
            thread = threading.Thread(target=process_existing_circular, args=(circular_id, filepath, title, issuer))
            thread.start()

            # Log the upload
            try:
                conn_audit = get_connection()
                curr_audit = conn_audit.cursor()
                curr_audit.execute("""
                    INSERT INTO auditlogs (module, action, details) 
                    VALUES (%s, %s, %s)
                """, ("INGESTION", "CIRCULAR_UPLOAD", f"Uploaded: {title} (ID: {circular_id})"))
                conn_audit.commit()
                curr_audit.close()
                conn_audit.close()
            except Exception as audit_err:
                print(f"Audit Logging Error: {audit_err}")
            
            return jsonify({
                "message": "File uploaded successfully", 
                "circular_id": circular_id,
                "status": "Uploaded"
            }), 202
        except Exception as e:
            return jsonify({"error": str(e)}), 500
            
    return jsonify({"error": "File type not allowed"}), 400

@upload_bp.route('/api/upload/status/<int:circular_id>', methods=['GET'])
def get_upload_status(circular_id):
    try:
        conn = get_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT authenticity_status FROM circulars WHERE id = %s", (circular_id,))
        result = cursor.fetchone()
        cursor.close()
        conn.close()
        if result:
            return jsonify({"status": result['authenticity_status']})
        return jsonify({"error": "Not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@upload_bp.route('/api/circulars', methods=['GET'])
def get_circulars():
    try:
        conn = get_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT id, title, authenticity_status as status, upload_date FROM circulars ORDER BY upload_date DESC")
        circulars = cursor.fetchall()
        
        for c in circulars:
            if c['upload_date']:
                c['upload_date'] = c['upload_date'].strftime('%Y-%m-%d %H:%M:%S')

        cursor.close()
        conn.close()
        return jsonify(circulars)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
