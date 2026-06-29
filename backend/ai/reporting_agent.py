class ReportingAgent:
    """Agent 13: Synthesizes final enterprise and executive reports."""
    def analyze(self, cko):
        cko.reports['executive_summary'] = {
            "title": "Regulatory Compliance Analysis Report",
            "score": cko.compliance_score,
            "risk_level": cko.priority,
            "total_actions": len(cko.maps)
        }
        cko.processing_log.append("Agent 13: Final reports synthesized.")
        return cko
