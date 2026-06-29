class EvidenceValidationAgent:
    """Agent 6: Validates evidence requirements for each obligation."""
    def analyze(self, cko):
        evidence_types = {
            "IT": "System Configuration Log / Security Audit Report",
            "Legal": "Signed Agreement / Legal Opinion",
            "Compliance": "Regulatory Filing Receipt / Compliance Certificate",
            "Risk": "Risk Assessment Document / Board Approval"
        }
        
        for map_item in cko.maps:
            dept = map_item['departments'][0] if map_item['departments'] else "General"
            cko.evidence.append({
                "map_id": map_item['id'],
                "required_type": evidence_types.get(dept, "Process Document"),
                "status": "Missing"
            })
        cko.processing_log.append("Agent 6: Evidence requirements mapped.")
        return cko
