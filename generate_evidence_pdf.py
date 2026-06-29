import fitz  # PyMuPDF

def create_evidence_pdf():
    doc = fitz.open()
    page = doc.new_page()
    
    text = """
    REGMAP AI - COMPLIANCE EVIDENCE REPORT
    
    MAP ID: MAP-397b5451
    Requirement: FCNR (B) Deposit Data Submission
    
    EVIDENCE SUMMARY:
    As per the actionable requirement from clause 1, we confirm that the data has been 
    duly submitted in the format provided at Annex I for FCNR (B) deposits. 
    The submission was transmitted to fedcoepd@rbi as per the regulatory guidelines.
    
    COMPLIANCE STATUS:
    Internal verification shows that the document and records are maintained 
    within the governance framework, and the reporting process is fully compliant.
    All data fields as per Annex I have been verified for accuracy.
    
    DATED: June 29, 2026
    ISSUED BY: Compliance Operations Team
    """
    
    # Inserting text at point (50, 50)
    page.insert_text((50, 70), text, fontsize=11, fontname="helv")
    
    output_path = "backend/uploads/fcnr_evidence_accepted.pdf"
    doc.save(output_path)
    print(f"✅ Evidence PDF created at: {output_path}")

if __name__ == "__main__":
    create_evidence_pdf()
