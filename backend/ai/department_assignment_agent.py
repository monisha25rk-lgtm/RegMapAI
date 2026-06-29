class DepartmentAssignmentAgent:
    """Agent 4: Maps obligations to specific departments."""
    def analyze(self, cko):
        dept_keywords = {
            "IT": ["system", "data", "software", "technology", "security", "digital"],
            "Legal": ["legal", "contract", "agreement", "law", "litigation"],
            "Compliance": ["report", "rbi", "sebi", "circular", "statutory"],
            "Risk": ["risk", "mitigation", "exposure", "credit", "market"]
        }
        
        for map_item in cko.maps:
            assigned = []
            text = map_item['action_point'].lower()
            for dept, keys in dept_keywords.items():
                if any(k in text for k in keys):
                    assigned.append(dept)
            
            map_item['departments'] = assigned if assigned else ["General"]
            for d in map_item['departments']:
                if d not in cko.departments:
                    cko.departments.append(d)
                    
        cko.processing_log.append("Agent 4: Department assignment complete.")
        return cko
