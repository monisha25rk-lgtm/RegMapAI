class ConflictDetectionAgent:
    """Agent 7: Detects contradictory or duplicate obligations and resource overloads."""
    def analyze(self, cko):
        seen_texts = {}
        for obj in cko.obligations:
            # Semantic collision check (simplified for offline)
            text_norm = obj['text'].lower()[:100]
            if text_norm in seen_texts:
                conflict = {
                    "id": f"CONF-{obj['id']}",
                    "type": "Redundancy",
                    "source_id": seen_texts[text_norm],
                    "target_id": obj['id'],
                    "description": "Duplicate requirement detected within the same circular.",
                    "severity": "Low"
                }
                cko.conflicts.append(conflict)
            else:
                seen_texts[text_norm] = obj['id']

        # Resource Overload Conflict (Multiple high-priority tasks for one department)
        dept_load = {}
        for m in cko.maps:
            for dept in m.get('departments', []):
                dept_load[dept] = dept_load.get(dept, 0) + (2 if m['priority'] == "High" else 1)
        
        for dept, load in dept_load.items():
            cko.conflicts.append({
                "id": f"CONF-LOAD-{dept}",
                "type": "Resource Overload",
                "department": dept,
                "description": f"Department {dept} has mandatory workload from this circular.",
                "severity": "Low"
            })

        cko.processing_log.append(f"Agent 7: Detected {len(cko.conflicts)} conflicts.")
        return cko
