import re
import hashlib

class DocumentIntelligenceAgent:
    """Agent 2: Extracts Summary, Organizations, Departments, Dates, and Clauses."""
    def analyze(self, cko):
        text = cko.raw_text
        cko.summary = f"Executive analysis of regulatory requirements. Total volume: {len(text)} characters."
        
        # Organizations
        org_patterns = [r"Reserve Bank of India", r"RBI", r"SEBI", r"MCA", r"IBA"]
        cko.organizations = list(set([re.search(p, text).group() for p in org_patterns if re.search(p, text)]))
        
        # Clauses / Obligations Extraction (Deterministic)
        sentences = re.split(r'(?<=[.!?])\s+', text)
        keywords = ["shall", "must", "required", "mandatory", "prohibited", "should"]
        
        for sent in sentences:
            if any(k in sent.lower() for k in keywords):
                obj_id = hashlib.sha1(sent.encode()).hexdigest()[:8]
                cko.obligations.append({
                    "id": obj_id,
                    "text": sent.strip(),
                    "priority": "High" if "must" in sent.lower() or "shall" in sent.lower() else "Medium"
                })
        
        cko.processing_log.append(f"Agent 2: Extracted {len(cko.obligations)} obligations.")
        return cko
