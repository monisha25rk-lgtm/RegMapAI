from flask import Blueprint, jsonify, request, Response
from db import get_connection
from datetime import datetime, timedelta
import csv
import io

regulation_bp = Blueprint('regulation', __name__)


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


def _map_progress(map_data, evidence):
    steps = [
        {"step": "Created", "status": "Completed"},
        {"step": "Assigned", "status": map_data.get('owner') and "Completed" or "Pending"},
        {"step": "AI Validation", "status": map_data.get('status') in ['Assigned', 'In Review', 'Completed'] and "Completed" or "In Progress"},
        {"step": "Evidence Collection", "status": evidence and len(evidence) > 0 and "Completed" or "Pending"}
    ]
    return steps

@regulation_bp.route('/api/dashboard/stats', methods=['GET'])
def get_dashboard_stats():
    try:
        conn = get_connection()
        cursor = conn.cursor(dictionary=True)
        
        # 1. Basic Stats
        cursor.execute("SELECT COUNT(*) as count FROM maps WHERE status != 'Completed'")
        active_maps = cursor.fetchone()['count']
        
        cursor.execute("SELECT COUNT(*) as count FROM maps WHERE priority = 'Critical'")
        critical_risks = cursor.fetchone()['count']
        
        cursor.execute("SELECT AVG(compliance_score) as avg_score FROM maps")
        res = cursor.fetchone()
        inst_score = round(float(res['avg_score']), 1) if res['avg_score'] is not None else 85.0
        
        cursor.execute("SELECT COUNT(*) as count FROM maps WHERE status = 'Pending'")
        pending_reviews = cursor.fetchone()['count']
        
        today = datetime.now().date()
        next_week = today + timedelta(days=7)
        cursor.execute("SELECT COUNT(*) as count FROM maps WHERE deadline BETWEEN %s AND %s", (today, next_week))
        upcoming = cursor.fetchone()['count']

        # 2. Department Performance
        cursor.execute("""
            SELECT department as name, AVG(compliance_score) as score, COUNT(*) as active_count
            FROM maps 
            GROUP BY department
        """)
        dept_perf = cursor.fetchall()
        for dept in dept_perf:
            dept['score'] = round(float(dept['score']), 1) if dept['score'] is not None else 0.0
            dept['trend'] = 'up' # Placeholder for trend logic
            
        # 3. Regulatory Feed (Recent circulars)
        cursor.execute("SELECT id, title, issuer, upload_date as date, authenticity_status as status FROM circulars ORDER BY upload_date DESC LIMIT 5")
        raw_feed = cursor.fetchall()
        reg_feed = []
        for item in raw_feed:
            reg_feed.append({
                "id": item['id'],
                "title": item['title'],
                "date": item['date'].strftime('%d %b %Y'),
                "impact": "High" if "Master" in item['title'] or "Governance" in item['title'] else "Medium",
                "department": "All Departments"
            })

        # 4. AI Assistant Alerts (Dynamic based on data)
        ai_alerts = []
        if critical_risks > 0:
            ai_alerts.append({
                "title": "Critical Risk Exposure",
                "message": f"Found {critical_risks} critical MAPs that require immediate board attention to prevent non-compliance penalties.",
                "type": "risk",
                "action": "view risks"
            })
        if pending_reviews > 5:
            ai_alerts.append({
                "title": "Review Bottleneck",
                "message": f"There are {pending_reviews} pending compliance reviews. Departmental delays might impact audit readiness.",
                "type": "warning",
                "action": "prioritize"
            })
        if inst_score > 80:
             ai_alerts.append({
                "title": "Compliance Strength",
                "message": f"Current Institutional Score is {inst_score}%. Performance is trending above the peer group average.",
                "type": "info",
                "action": "view report"
            })

        cursor.close()
        conn.close()
        
        return jsonify({
            "institutionalScore": inst_score,
            "auditReadiness": min(100, inst_score + 5),
            "activeMAPs": active_maps,
            "criticalRisks": critical_risks,
            "pendingReviews": pending_reviews,
            "upcomingDeadlines": upcoming,
            "deptPerformance": dept_perf if dept_perf else [
                {"name": "IT", "score": 92, "trend": "up", "active_count": 5},
                {"name": "Compliance", "score": 88, "trend": "up", "active_count": 3}
            ],
            "regIntelligenceFeed": reg_feed,
            "aiAssistant": ai_alerts if ai_alerts else [
                {"title": "System Ready", "message": "All compliance streams are synchronized. No immediate action required.", "type": "info", "action": "run check"}
            ],
            "complianceTrend": [75, 78, 82, 80, 85, 88] # Placeholder trend data
        })
    except Exception as e:
        print(f"Stats Error: {e}")
        return jsonify({"error": str(e)}), 500

@regulation_bp.route('/api/circulars/<int:circular_id>', methods=['GET'])
def get_circular_details(circular_id):
    try:
        conn = get_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT id, title, issuer, upload_date, text_content, authenticity_status FROM circulars WHERE id = %s", (circular_id,))
        circular = cursor.fetchone()
        cursor.close()
        conn.close()
        
        if circular:
            if circular['upload_date']:
                circular['upload_date'] = circular['upload_date'].strftime('%Y-%m-%d %H:%M:%S')
            return jsonify(circular)
        return jsonify({"error": "Circular not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@regulation_bp.route('/api/ai/command-center', methods=['GET'])
def get_ai_command_center():
    try:
        conn = get_connection()
        cursor = conn.cursor(dictionary=True)

        cursor.execute("SELECT COUNT(*) as count FROM maps WHERE priority = 'Critical'")
        critical_risks = cursor.fetchone()['count']

        cursor.execute("SELECT COUNT(*) as count FROM maps WHERE status = 'Action Required' OR status = 'Pending'")
        pending_actions = cursor.fetchone()['count']

        cursor.execute("SELECT department, AVG(compliance_score) as score FROM maps GROUP BY department")
        dept_raw = cursor.fetchall()
        dept_risks = []
        for dept in dept_raw:
            dept_risks.append({
                'department': dept['department'] or 'General',
                'risk_index': round(10 - (dept['score'] or 50) / 10, 1)
            })

        cursor.execute("SELECT id, title, deadline, risk_score FROM maps WHERE priority = 'Critical' OR status = 'Action Required' ORDER BY risk_score DESC LIMIT 5")
        top_maps = cursor.fetchall()
        predicted_breaches = []
        for m in top_maps:
            predicted_breaches.append({
                'id': m['id'],
                'title': m['title'],
                'deadline': m['deadline'].strftime('%Y-%m-%d') if m['deadline'] else 'TBD',
                'riskScore': m['risk_score'] or 0
            })

        cursor.close()
        conn.close()

        return jsonify({
            'alerts': [
                {
                    'type': 'risk',
                    'title': 'Critical: Regulatory Breach Forecast',
                    'message': f'{critical_risks} MAPs are in critical status and require immediate attention.',
                }
            ],
            'predictedBreaches': predicted_breaches,
            'deptRisks': dept_risks
        })
    except Exception as e:
        return jsonify({'alerts': [{ 'type': 'warning', 'title': 'AI command unavailable', 'message': 'AI insights are temporarily unavailable.'}] , 'predictedBreaches': [], 'deptRisks': []})


@regulation_bp.route('/api/circulars/<int:circular_id>/export', methods=['GET'])
def export_circular_maps_data(circular_id):
    try:
        conn = get_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM maps WHERE circular_id = %s ORDER BY created_at DESC", (circular_id,))
        maps = cursor.fetchall()
        cursor.close()
        conn.close()

        output = io.StringIO()
        writer = csv.writer(output)
        writer.writerow(["MAP ID", "Title", "Description", "Department", "Owner", "Deadline", "Priority", "Compliance Score", "Risk Score", "Status", "Created At"])
        for m in maps:
            writer.writerow([
                m['id'], m['title'], m['description'], m['department'], m['owner'],
                m['deadline'].strftime('%Y-%m-%d') if m['deadline'] else '',
                m['priority'], m['compliance_score'] or 0, m['risk_score'] or 0,
                m['status'], m['created_at'].strftime('%Y-%m-%d %H:%M:%S') if m['created_at'] else ''
            ])

        response = Response(output.getvalue(), mimetype='text/csv')
        response.headers['Content-Disposition'] = f'attachment; filename=circular_{circular_id}_maps.csv'
        return response
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@regulation_bp.route('/api/maps/<int:map_id>/export', methods=['GET'])
def export_map(map_id):
    try:
        conn = get_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM maps WHERE id = %s", (map_id,))
        m = cursor.fetchone()
        cursor.close()
        conn.close()

        if not m:
            return jsonify({"error": "MAP not found"}), 404

        output = io.StringIO()
        writer = csv.writer(output)
        writer.writerow(["MAP ID", "Title", "Description", "Department", "Owner", "Deadline", "Priority", "Compliance Score", "Risk Score", "Status", "Created At"])
        writer.writerow([
            m['id'], m['title'], m['description'], m['department'], m['owner'],
            m['deadline'].strftime('%Y-%m-%d') if m['deadline'] else '',
            m['priority'], m['compliance_score'] or 0, m['risk_score'] or 0,
            m['status'], m['created_at'].strftime('%Y-%m-%d %H:%M:%S') if m['created_at'] else ''
        ])

        response = Response(output.getvalue(), mimetype='text/csv')
        response.headers['Content-Disposition'] = f'attachment; filename=map_{map_id}.csv'
        return response
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@regulation_bp.route('/api/maps/<int:map_id>/audit-report', methods=['GET'])
def download_map_audit_report(map_id):
    try:
        conn = get_connection()
        cursor = conn.cursor(dictionary=True)
        
        # 1. Get MAP details
        cursor.execute("SELECT * FROM maps WHERE id = %s", (map_id,))
        m = cursor.fetchone()
        if not m:
            cursor.close()
            conn.close()
            return jsonify({"error": "MAP not found"}), 404
            
        # 2. Check if evidence is accepted
        if m['status'] != 'Completed':
             # Check if there's any accepted evidence
             cursor.execute("SELECT COUNT(*) as count FROM evidence WHERE map_id = %s AND (validation_result = 'Accepted' OR manual_verification_status = 'Accepted')", (map_id,))
             count_res = cursor.fetchone()
             if not count_res or count_res['count'] == 0:
                 cursor.close()
                 conn.close()
                 return jsonify({"error": "Audit report only available for Accepted/Completed MAPs"}), 403

        # 3. Get Logs related to this MAP
        cursor.execute("SELECT * FROM auditlogs WHERE details LIKE %s ORDER BY timestamp ASC", (f"%MAP ID {map_id}%",))
        logs = cursor.fetchall()
        
        cursor.close()
        conn.close()

        output = io.StringIO()
        writer = csv.writer(output)
        writer.writerow(["AUDIT REPORT FOR MAP", m['title']])
        writer.writerow([])
        writer.writerow(["MAP DETAILS"])
        writer.writerow(["Field", "Value"])
        writer.writerow(["ID", m['id']])
        writer.writerow(["Department", m['department']])
        writer.writerow(["Owner", m['owner']])
        writer.writerow(["Status", m['status']])
        writer.writerow(["Compliance Score", f"{m['compliance_score']}%"])
        writer.writerow([])
        writer.writerow(["EXECUTION AUDIT TRAIL"])
        writer.writerow(["Timestamp", "Module", "Action", "Details"])
        for l in logs:
            writer.writerow([
                l['timestamp'].strftime('%Y-%m-%d %H:%M:%S') if l['timestamp'] else '',
                l['module'],
                l['action'],
                l['details']
            ])

        response = Response(output.getvalue(), mimetype='text/csv')
        response.headers['Content-Disposition'] = f'attachment; filename=audit_report_MAP_{map_id}.csv'
        return response
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@regulation_bp.route('/api/maps/manual', methods=['POST'])
def create_manual_map():
    data = request.json or {}
    required_fields = ['circular_id', 'title', 'description']
    if not all(data.get(field) for field in required_fields):
        return jsonify({"error": "Missing required manual map fields."}), 400

    owner = data.get('owner') or choose_owner(data.get('department', 'General'), data.get('risk_score', 50))
    priority = data.get('priority', 'Medium')
    deadline = data.get('deadline')
    compliance_score = data.get('compliance_score', 0)
    risk_score = data.get('risk_score', 50)
    department = data.get('department', 'General')

    try:
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO maps (circular_id, title, description, department, owner, deadline, priority, compliance_score, risk_score, risk_reason, status)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """, (
            data['circular_id'], data['title'], data['description'], department, owner, deadline,
            priority, compliance_score, risk_score, data.get('risk_reason', 'Manually created MAP'), 'Assigned'
        ))
        map_id = cursor.lastrowid
        # Log assignment
        cursor.execute("""
            INSERT INTO auditlogs (module, action, details) 
            VALUES (%s, %s, %s)
        """, ("GOVERNANCE", "OWNER_ASSIGN", f"Assigned {owner} to MAP ID {map_id}"))

        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({"status": "success", "map_id": map_id}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@regulation_bp.route('/api/maps/<int:map_id>/assign', methods=['POST'])
def assign_map_owner(map_id):
    data = request.json or {}
    owner = data.get('owner')
    if not owner:
        return jsonify({"error": "Missing owner."}), 400

    try:
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute("UPDATE maps SET owner = %s, status = %s WHERE id = %s", (owner, data.get('status', 'Assigned'), map_id))
        # Log assignment
        cursor.execute("""
            INSERT INTO auditlogs (module, action, details) 
            VALUES (%s, %s, %s)
        """, ("GOVERNANCE", "OWNER_ASSIGN", f"Assigned {owner} to MAP ID {map_id}"))

        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({"status": "success", "owner": owner})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@regulation_bp.route('/api/maps/<int:map_id>/reassign', methods=['POST'])
def reassign_map(map_id):
    try:
        conn = get_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT department, risk_score FROM maps WHERE id = %s", (map_id,))
        row = cursor.fetchone()
        if not row:
            cursor.close()
            conn.close()
            return jsonify({"error": "MAP not found"}), 404

        owner = choose_owner(row['department'] or 'General', row['risk_score'] or 50)
        cursor.execute("UPDATE maps SET owner = %s, status = %s WHERE id = %s", (owner, 'Reassigned', map_id))
        # Log assignment
        cursor.execute("""
            INSERT INTO auditlogs (module, action, details) 
            VALUES (%s, %s, %s)
        """, ("GOVERNANCE", "OWNER_ASSIGN", f"Assigned {owner} to MAP ID {map_id}"))

        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({"status": "success", "owner": owner})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@regulation_bp.route('/api/risk/stats', methods=['GET'])
def get_risk_stats():
    try:
        conn = get_connection()
        cursor = conn.cursor(dictionary=True)
        
        # Risk distribution
        cursor.execute("SELECT priority, COUNT(*) as count FROM maps GROUP BY priority")
        dist_raw = cursor.fetchall()
        dist = {"Critical": 0, "High": 0, "Medium": 0, "Low": 0}
        for item in dist_raw:
            if item['priority'] in dist:
                dist[item['priority']] = item['count']
        
        # High risk maps
        cursor.execute("SELECT id, department, risk_score, deadline FROM maps WHERE risk_score > 50 ORDER BY risk_score DESC LIMIT 10")
        high_risk_maps = cursor.fetchall()
        for m in high_risk_maps:
            if m['deadline']:
                m['deadline'] = m['deadline'].strftime('%Y-%m-%d')

        cursor.close()
        conn.close()
        
        return jsonify({
            "distribution": dist,
            "highRiskMaps": high_risk_maps,
            "avgRiskIndex": 6.8, # Placeholder
            "breachForecast": "12%" # Placeholder
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@regulation_bp.route('/api/evidence/export/accepted', methods=['GET'])
def export_accepted_evidence():
    try:
        conn = get_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("""
            SELECT e.*, m.title as map_title 
            FROM evidence e 
            JOIN maps m ON e.map_id = m.id 
            WHERE e.validation_result = 'Compliant' OR e.manual_verification_status = 'Accepted'
        """)
        evidence_list = cursor.fetchall()
        cursor.close()
        conn.close()

        output = io.StringIO()
        writer = csv.writer(output)
        writer.writerow(["ID", "File Name", "MAP Title", "Score", "Validation Result", "Verification Status", "Date"])
        for e in evidence_list:
            writer.writerow([
                e['id'],
                e['file_name'],
                e['map_title'],
                e['compliance_score'],
                e['validation_result'],
                e['manual_verification_status'],
                e['upload_date'].strftime('%Y-%m-%d %H:%M:%S') if e['upload_date'] else ''
            ])

        return Response(
            output.getvalue(),
            mimetype="text/csv",
            headers={"Content-disposition": "attachment; filename=accepted_evidence.csv"}
        )
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@regulation_bp.route('/api/evidence/pending', methods=['GET'])
def get_pending_evidence():
    try:
        conn = get_connection()
        cursor = conn.cursor(dictionary=True)
        # Show evidence that is either still being processed by AI 
        # OR has been processed but requires manual oversight.
        cursor.execute("""
            SELECT e.*, m.title as map_title, m.priority 
            FROM evidence e 
            JOIN maps m ON e.map_id = m.id 
            WHERE (e.validation_result IS NULL OR e.validation_result = 'Pending')
               OR (e.needs_manual_verification = 1 AND e.manual_verification_status = 'Awaiting Review')
        """)
        evidence = cursor.fetchall()
        for e in evidence:
            if e['upload_date']:
                e['upload_date'] = e['upload_date'].strftime('%Y-%m-%d %H:%M:%S')
        
        cursor.close()
        conn.close()
        return jsonify(evidence)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@regulation_bp.route('/api/audit/logs', methods=['GET'])
def get_audit_logs():
    try:
        conn = get_connection()
        cursor = conn.cursor(dictionary=True)
        # Fetching expanded audit fields
        cursor.execute("""
            SELECT a.*, u.name as user_name 
            FROM auditlogs a 
            LEFT JOIN users u ON a.user_id = u.id 
            ORDER BY a.timestamp DESC LIMIT 100
        """)
        logs = cursor.fetchall()
        for l in logs:
            if l['timestamp']:
                l['timestamp'] = l['timestamp'].strftime('%Y-%m-%d %H:%M:%S')
            l['user'] = l['user_name'] if l['user_name'] else 'SYSTEM_AI'
        cursor.close()
        conn.close()
        return jsonify(logs)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@regulation_bp.route('/api/audit/export', methods=['GET'])
def export_audit_logs():
    try:
        conn = get_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("""
            SELECT a.timestamp, u.name as user_name, a.action, a.module, a.details
            FROM auditlogs a 
            LEFT JOIN users u ON a.user_id = u.id 
            ORDER BY a.timestamp DESC
        """)
        logs = cursor.fetchall()
        cursor.close()
        conn.close()

        output = io.StringIO()
        writer = csv.writer(output)
        writer.writerow(["Timestamp", "Actor", "Action", "Module", "Details"])
        for l in logs:
            writer.writerow([
                l['timestamp'].strftime('%Y-%m-%d %H:%M:%S') if l['timestamp'] else '',
                l['user_name'] if l['user_name'] else 'SYSTEM_AI',
                l['action'],
                l['module'],
                l['details']
            ])

        return Response(
            output.getvalue(),
            mimetype="text/csv",
            headers={"Content-disposition": "attachment; filename=audit_logs.csv"}
        )
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@regulation_bp.route('/api/workspace/maps/<int:circular_id>', methods=['GET'])
def get_workspace_maps(circular_id):
    try:
        conn = get_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM maps WHERE circular_id = %s", (circular_id,))
        maps = cursor.fetchall()
        for m in maps:
            if m['deadline']:
                m['deadline'] = m['deadline'].strftime('%Y-%m-%d')
            if not m.get('owner'):
                m['owner'] = choose_owner(m.get('department', 'General'), m.get('risk_score', 50))
            if not m.get('status'):
                m['status'] = 'Assigned'
        cursor.close()
        conn.close()
        return jsonify(maps)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@regulation_bp.route('/api/maps/export/all', methods=['GET'])
def export_all_maps():
    try:
        conn = get_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM maps")
        maps = cursor.fetchall()
        cursor.close()
        conn.close()

        output = io.StringIO()
        writer = csv.writer(output)
        writer.writerow(["ID", "Requirement", "Priority", "Department", "Owner", "Status", "Deadline", "Compliance Score", "Risk Score", "Reason"])
        for m in maps:
            writer.writerow([
                f"MAP-{m['id']}",
                m['title'],
                m.get('priority', 'Medium'),
                m.get('department', 'General'),
                m.get('owner', 'Unassigned'),
                m.get('status', 'Assigned'),
                m.get('deadline', ''),
                m.get('compliance_score', 0),
                m.get('risk_score', 0),
                m.get('risk_reason', '')
            ])

        return Response(
            output.getvalue(),
            mimetype="text/csv",
            headers={"Content-disposition": "attachment; filename=all_institutional_maps.csv"}
        )
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@regulation_bp.route('/api/maps/all', methods=['GET'])
def get_all_maps():
    try:
        conn = get_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM maps ORDER BY created_at DESC")
        maps = cursor.fetchall()
        for m in maps:
            if m['deadline']:
                m['deadline'] = m['deadline'].strftime('%Y-%m-%d')
        cursor.close()
        conn.close()
        return jsonify(maps)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@regulation_bp.route('/api/conflicts/<int:circular_id>', methods=['GET'])
def get_circular_conflicts(circular_id):
    try:
        conn = get_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM conflicts WHERE circular_id = %s", (circular_id,))
        conflicts = cursor.fetchall()
        cursor.close()
        conn.close()
        return jsonify(conflicts)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@regulation_bp.route('/api/maps/<int:map_id>', methods=['GET'])
def get_map_details(map_id):
    try:
        conn = get_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM maps WHERE id = %s", (map_id,))
        map_data = cursor.fetchone()
        
        if map_data:
            if map_data['deadline']:
                map_data['deadline'] = map_data['deadline'].strftime('%Y-%m-%d')
            if not map_data.get('owner'):
                map_data['owner'] = choose_owner(map_data.get('department', 'General'), map_data.get('risk_score', 50))
            if not map_data.get('status'):
                map_data['status'] = 'Assigned'

            # Fetch associated evidence
            cursor.execute("SELECT * FROM evidence WHERE map_id = %s", (map_id,))
            evidence = cursor.fetchall()
            for e in evidence:
                if e['upload_date']:
                    e['upload_date'] = e['upload_date'].strftime('%Y-%m-%d %H:%M:%S')
            map_data['evidence'] = evidence
            
            cursor.close()
            conn.close()
            return jsonify(map_data)
        
        cursor.close()
        conn.close()
        return jsonify({"error": "MAP not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500
