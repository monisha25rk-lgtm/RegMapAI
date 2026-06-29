from dataclasses import dataclass, field
from typing import List, Dict, Any

@dataclass
class ComplianceKnowledgeObject:
    # 1. Metadata & Document Info
    metadata: Dict[str, Any] = field(default_factory=dict)
    raw_text: str = ""
    summary: str = ""
    entities: List[Dict] = field(default_factory=list)
    organizations: List[str] = field(default_factory=list)
    departments: List[str] = field(default_factory=list)

    # 2. Compliance Intelligence
    obligations: List[Dict] = field(default_factory=list)
    maps: List[Dict] = field(default_factory=list)
    risks: List[Dict] = field(default_factory=list)
    compliance_score: float = 100.0
    risk_score: float = 0.0
    priority: str = "Low"
    priority_reason: str = ""

    # 3. Execution & Workflow
    tasks: List[Dict] = field(default_factory=list)
    timeline: List[Dict] = field(default_factory=list)
    evidence: List[Dict] = field(default_factory=list)
    conflicts: List[Dict] = field(default_factory=list)

    # 4. Enterprise Outputs
    analytics: Dict[str, Any] = field(default_factory=dict)
    digital_twin: Dict[str, Any] = field(default_factory=dict)
    reports: Dict[str, Any] = field(default_factory=dict)
    audit_trail: List[Dict] = field(default_factory=list)

    # 5. System Metadata
    processing_log: List[str] = field(default_factory=list)
    engine_version: str = "1.0.0-ENTERPRISE"
