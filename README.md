# RegMap AI Enterprise – Autonomous Regulatory Intelligence Platform

RegMap AI is a high-performance agentic compliance ecosystem designed for the modern banking sector. It transforms static regulatory circulars into a synchronized Compliance Knowledge Object (CKO), enabling real-time risk mitigation and automated evidence validation.

## 🚀 Key Features

- **High-Speed Evidence Validation**: Sub-100ms local scoring engine using keyword-density and sequence-matching (`llm.py`) for instant compliance feedback.
- **Forensic Audit Center**: Downloadable CSV audit reports that provide a full execution trail for every Accepted requirement.
- **Executive Dashboard**: Real-time Institutional Compliance Scores, Audit Readiness metrics, and Department Performance heatmaps.
- **Agentic Orchestration**: 14-agent logic for circular ingestion, risk prioritization, and owner assignment.
- **Motivational UI**: Instant "Try Again" workflow for rejected evidence with real-time AI reasoning feedback.
- **Hardened Audit Trail**: System-wide event tracking with detailed forensic fields (`module`, `details`) in a robust MySQL/MariaDB backend.

## 🛠️ Enterprise Technology Stack

- **Frontend**: Vanilla JavaScript (ES6+), HTML5, Semantic CSS3.
- **Backend**: Flask (Python 3.10+).
- **Database**: MySQL / MariaDB (Hardened schema for forensic auditing).
- **AI Engine**: Local-first high-speed validation (No external API latency).
- **Design**: Professional banking aesthetic, high-density layout for compliance professionals.

## 📂 Project Structure

```text
RegMapAI/
├── backend/
│   ├── routes/          # Enterprise API endpoints (Regulation, Evidence, Dashboard)
│   ├── uploads/         # Hardened storage for circulars and evidence
│   ├── llm.py           # High-speed local validation engine (Core AI)
│   ├── evidence_service.py # AI validation orchestrator & state manager
│   ├── circular_service.py # 14-agent orchestration logic
│   ├── db.py            # Optimized database connection pooling
│   └── app.py           # Flask entry point
├── static/
│   ├── js/
│   │   ├── app.js       # SPA Router & global state
│   │   └── pages/       # Workspace (workspace.js), Audit (audit.js), etc.
│   └── css/             # System-wide enterprise styles
├── templates/           # HTML Container (index.html)
└── generate_evidence_pdf.py # Utility for compliant evidence generation
```

## 🏁 Deployment & Usage

### 1. Database Setup
Ensure MariaDB/MySQL is running and the schema is synchronized.

### 2. Launch the Platform
```bash
# Start the Flask backend
python backend/app.py
```

### 3. Evidence Validation Workflow
1. Upload a regulatory circular.
2. View generated MAPs in the **Workspace**.
3. Upload evidence (PDF/Image) for a MAP.
4. If score >= 70% (Accepted), the **Audit Report** is immediately unlocked for download.

## 📊 Compliance Vision
RegMap AI aims to eliminate the "compliance lag" in banking by providing a synchronized ecosystem where every regulatory update is instantly mapped to departmental actions and verified by forensic-grade AI agents.
