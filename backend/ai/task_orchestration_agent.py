class TaskOrchestrationAgent:
    """Agent 8: Creates and assigns tasks based on MAPs."""
    def analyze(self, cko):
        for map_item in cko.maps:
            for dept in map_item['departments']:
                cko.tasks.append({
                    "task_id": f"TASK-{map_item['id']}-{dept}",
                    "map_ref": map_item['id'],
                    "department": dept,
                    "title": f"Implement Compliance for {map_item['id'][:10]}",
                    "status": "Pending Review",
                    "due_date": "2024-12-31" # Placeholder
                })
        cko.processing_log.append(f"Agent 8: Orchestrated {len(cko.tasks)} tasks.")
        return cko
