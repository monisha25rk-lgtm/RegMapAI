class DigitalTwinAgent:
    """Agent 11: Creates Knowledge Graph and Digital Twin mappings."""
    def analyze(self, cko):
        nodes = []
        edges = []
        
        # Root Document Node
        nodes.append({"id": "DOC-1", "label": "Circular", "type": "root"})
        
        # Department Nodes
        for dept in cko.departments:
            nodes.append({"id": f"DEPT-{dept}", "label": dept, "type": "department"})
            edges.append({"source": "DOC-1", "target": f"DEPT-{dept}", "relation": "affects"})
            
        # MAP Nodes
        for m in cko.maps:
            nodes.append({"id": m['id'], "label": "Action Point", "type": "map"})
            for d in m['departments']:
                edges.append({"source": f"DEPT-{d}", "target": m['id'], "relation": "responsible_for"})
                
        cko.digital_twin = {
            "graph": {
                "nodes": nodes,
                "links": edges
            }
        }
        cko.processing_log.append("Agent 11: Digital Twin graph generated.")
        return cko
