# testllm.py

from pdf_reader import extract_text
from llm import analyze_circular
import json
import os

def test_pipeline():
    sample_path = "uploads/sample1.pdf"
    
    if not os.path.exists(sample_path):
        print(f"❌ Error: {sample_path} not found. Please place a sample PDF in the uploads folder.")
        return

    print(f"📖 Extracting text from {sample_path}...")
    text = extract_text(sample_path)
    
    if not text:
        print("❌ Failed to extract text.")
        return

    print("🧠 Analyzing circular with AI (Llama 3)...")
    result = analyze_circular(text)
    
    print("\n✅ AI Extraction Result:")
    print(json.dumps(result, indent=4))

if __name__ == "__main__":
    test_pipeline()
