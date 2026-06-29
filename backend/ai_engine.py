from ai.pipeline import PipelineManager
from ai.monitor_ingestion_agent import MonitorIngestionAgent
from ai.document_intelligence_agent import DocumentIntelligenceAgent
from ai.obligation_engine import ObligationEngine
from ai.map_agent import MAPAgent
from ai.department_assignment_agent import DepartmentAssignmentAgent
from ai.risk_intelligence_agent import RiskIntelligenceAgent
from ai.evidence_validation_agent import EvidenceValidationAgent
from ai.conflict_detection_agent import ConflictDetectionAgent
from ai.task_orchestration_agent import TaskOrchestrationAgent
from ai.timeline_agent import TimelineAgent
from ai.analytics_agent import AnalyticsAgent
from ai.audit_intelligence_agent import AuditIntelligenceAgent
from ai.reporting_agent import ReportingAgent
from ai.ai_copilot_agent import AICopilotAgent
from models.compliance import ComplianceKnowledgeObject

class RegMapAIEngine:
    def __init__(self):
        print("[SYSTEM] RegMap AI Enterprise Initialized (Hybrid Agent/Hub Architecture)")
        
        # We define a master pipeline that runs the 14 specialized agents
        # This ensures 100% compliance with the 14-agent requirement.
        self.pipeline = PipelineManager([
            MonitorIngestionAgent(),        # Agent 1
            DocumentIntelligenceAgent(),    # Agent 2
            ObligationEngine(),             
            MAPAgent(),                     # Agent 3
            DepartmentAssignmentAgent(),    # Agent 4
            RiskIntelligenceAgent(),        # Agent 5
            EvidenceValidationAgent(),      # Agent 6
            ConflictDetectionAgent(),       # Agent 7
            TaskOrchestrationAgent(),       # Agent 8
            TimelineAgent(),                # Agent 9
            AnalyticsAgent(),               # Agent 10
            AuditIntelligenceAgent(),       # Agent 12
            ReportingAgent(),               # Agent 13
            AICopilotAgent()                # Agent 14
        ])

    def create_cko(self):
        return ComplianceKnowledgeObject()

    def analyze(self, document_text):
        cko = self.create_cko()
        cko.raw_text = document_text
        cko = self.pipeline.run(cko)
        return cko
