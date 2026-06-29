class MAPAgent:
    """Agent 3: Converts obligations into Measurable Action Points (MAPs)."""
    def analyze(self, cko):
        for idx, obj in enumerate(cko.obligations):
            cko.maps.append({
                "id": f"MAP-{obj['id']}",
                "obligation_ref": obj['id'],
                "action_point": f"Actionable requirement from clause {idx+1}: {obj['text'][:100]}...",
                "status": "Draft",
                "priority": obj['priority']
            })
        cko.processing_log.append(f"Agent 3: Generated {len(cko.maps)} MAPs.")
        return cko
