import re
import hashlib

class ObligationEngine:
    """Consolidated Hub for Obligation Extraction and NLP Intelligence."""
    def analyze(self, cko):
        text = cko.raw_text
        sentences = re.split(r'(?<=[.!?])\s+', text)
        keywords = ["shall", "must", "required", "mandatory", "should", "requirement", "data", "report", "compliance"]
        
        for sent in sentences:
            if any(k in sent.lower() for k in keywords):
                obj_id = hashlib.sha1(sent.encode()).hexdigest()[:8]
                cko.obligations.append({
                    "id": obj_id,
                    "text": sent.strip(),
                    "priority": "High" if "must" in sent.lower() or "shall" in sent.lower() else "Medium"
                })
        
        cko.processing_log.append(f"Obligation Engine: Extracted {len(cko.obligations)} items.")
        return cko
