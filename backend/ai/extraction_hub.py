import re

class ExtractionHub:
    """Consolidated Hub for Structural Extraction (Dates, Entities, Organizations)."""
    def analyze(self, cko):
        text = cko.raw_text
        
        # Organizations
        org_patterns = [r"Reserve Bank of India", r"RBI", r"SEBI", r"MCA", r"IBA"]
        cko.organizations = list(set([re.search(p, text).group() for p in org_patterns if re.search(p, text)]))
        
        # Deadlines (Simple regex)
        date_pattern = r'\d{1,2}[/-]\d{1,2}[/-]\d{2,4}|\d{1,2}\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{2,4}'
        cko.metadata['dates_found'] = re.findall(date_pattern, text)
        
        cko.processing_log.append("Extraction Hub: Structural parsing complete.")
        return cko
