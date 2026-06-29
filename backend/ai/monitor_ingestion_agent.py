import os
import hashlib

class MonitorIngestionAgent:
    """Agent 1: Handles document OCR, parsing, and initial metadata extraction."""
    def analyze(self, cko):
        # In a real scenario, this would use pdfminer or Tesseract
        # For now, we assume raw_text is already populated or metadata is needed
        cko.metadata['doc_hash'] = hashlib.sha256(cko.raw_text.encode()).hexdigest()
        cko.metadata['char_count'] = len(cko.raw_text)
        cko.processing_log.append("Agent 1: Metadata extraction complete.")
        return cko
