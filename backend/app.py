from flask import Flask, render_template, send_from_directory
import os
from db import get_connection
from routes.upload_routes import upload_bp
from routes.regulation_routes import regulation_bp
from routes.evidence_routes import evidence_bp

# Initialize Flask with standard templates and static folders
app = Flask(__name__, 
            template_folder='../templates', 
            static_folder='../static')

app.register_blueprint(upload_bp)
app.register_blueprint(regulation_bp)
app.register_blueprint(evidence_bp)

@app.route('/')
def index():
    return render_template('index.html')

# Ensure all static files are served correctly
@app.route('/js/<path:path>')
def send_js(path):
    return send_from_directory(os.path.join(app.static_folder, 'js'), path)

@app.route('/css/<path:path>')
def send_css(path):
    return send_from_directory(os.path.join(app.static_folder, 'css'), path)

@app.route('/assets/<path:path>')
def send_assets(path):
    return send_from_directory(os.path.join(app.static_folder, 'assets'), path)

if __name__ == '__main__':
    app.run(debug=True, port=5000)
