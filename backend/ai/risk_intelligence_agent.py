class RiskIntelligenceAgent:
    """Agent 5: Computes Compliance and Risk Scores."""
    def analyze(self, cko):
        num_obligations = len(cko.obligations)
        if num_obligations == 0:
            cko.compliance_score = 100.0
            cko.risk_score = 0.0
            cko.priority = "Low"
            cko.priority_reason = "No mandatory obligations detected."
        else:
            # Scoring Logic: 100 - (mandatory obligations * 5)
            mandatory_count = len([o for o in cko.obligations if o['priority'] == "High"])
            cko.compliance_score = max(0, 100 - (mandatory_count * 5))
            cko.risk_score = min(100, mandatory_count * 10)
            cko.priority = "Critical" if cko.risk_score > 70 else ("High" if cko.risk_score > 40 else "Medium")
            cko.priority_reason = f"Based on {mandatory_count} high-priority mandatory obligations."
        
        cko.risks.append({
            "type": "Systemic Risk",
            "score": cko.risk_score,
            "description": f"Overall regulatory impact is {cko.priority} based on {num_obligations} identified clauses."
        })
        cko.processing_log.append(f"Agent 5: Risk analysis complete. Score: {cko.risk_score}")
        return cko
