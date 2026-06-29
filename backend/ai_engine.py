import sys
import os

# Ensure backend directory is in path for imports
sys.path.append(os.path.dirname(__file__))

from models.compliance import ComplianceKnowledgeObject

class RegMapAIEngine:
    def __init__(self):
        self._pipeline = None
        print("[SYSTEM] RegMap AI Enterprise Initialized (Memory Optimized for Render)")

    @property
    def pipeline(self):
        if self._pipeline is None:
            print("[SYSTEM] Loading 14-Agent Pipeline (this may take a moment)...")
            # Local imports to prevent memory crash on startup
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

            self._pipeline = PipelineManager([
                MonitorIngestionAgent(),
                DocumentIntelligenceAgent(),
                ObligationEngine(),
                MAPAgent(),
                DepartmentAssignmentAgent(),
                RiskIntelligenceAgent(),
                EvidenceValidationAgent(),
                ConflictDetectionAgent(),
                TaskOrchestrationAgent(),
                TimelineAgent(),
                AnalyticsAgent(),
                AuditIntelligenceAgent(),
                ReportingAgent(),
                AICopilotAgent()
            ])
        return self._pipeline

    def create_cko(self):
        return ComplianceKnowledgeObject()

    def analyze(self, document_text):
        cko = self.create_cko()
        cko.raw_text = document_text
        cko = self.pipeline.run(cko)
        return cko
