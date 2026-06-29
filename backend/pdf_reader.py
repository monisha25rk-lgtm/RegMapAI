import fitz

def extract_text(pdf_path):
    """
    Extracts plain text from a PDF file.
    """
    try:
        doc = fitz.open(pdf_path)
        text = ""
        for page in doc:
            text += page.get_text()
        doc.close()
        return text
    except Exception as e:
        print(f"❌ PDF Extraction Error: {e}")
        return ""

if __name__ == "__main__":
    # Test script - independent of circularservice to avoid circular imports
    path = "uploads/sample1.pdf"
    text = extract_text(path)
    if text:
        print(f"Successfully extracted {len(text)} characters.")
    else:
        print("Failed to extract text.")
