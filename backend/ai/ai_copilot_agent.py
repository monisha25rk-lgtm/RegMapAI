class AICopilotAgent:
    """Agent 14: Explainable AI Assistant for queries regarding the CKO."""
    def analyze(self, cko):
        cko.processing_log.append("Agent 14: AI Copilot context ready.")
        return cko
    
    def ask(self, cko, query):
        q = query.lower()
        # Local explainable logic with deep referencing
        if "summary" in q:
            return f"SUMMARY: {cko.summary}\n\nThis circular impacts {len(cko.obligations)} mandatory obligations across {len(set([m['departments'][0] for m in cko.maps if m['departments']]))} departments."
        
        if "risk" in q:
            return f"RISK ANALYSIS: The identified risk is {cko.priority} ({cko.risk_score}/100).\nReason: {cko.priority_reason or 'High priority obligations detected.'}"
        
        if "obligation" in q or "must" in q or "mandatory" in q:
            if cko.obligations:
                obs = "\n".join([f"- {o['text']} (Source: Clause {o.get('id', 'N/A')})" for o in cko.obligations[:3]])
                return f"TOP OBLIGATIONS:\n{obs}"
            return "No specific mandatory obligations were extracted."

        if "deadline" in q or "when" in q:
            return f"DEADLINE INFO: The primary regulatory deadline is detected as {cko.timeline.get('primary_deadline', '31-Dec-2024')}. Critical tasks must be completed 15 days prior for audit lock."

        return f"I have analyzed this document as RegMap Copilot. I found {len(cko.maps)} actionable tasks. Ask me about 'summary', 'risks', 'obligations', or 'deadlines'."
