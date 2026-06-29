from ai_engine import RegMapAIEngine

def test():
    engine = RegMapAIEngine()
    test_text = """
    Reserve Bank of India (RBI) Notification:
    All commercial banks must maintain a record of all transactions for 5 years.
    Banks shall report any suspicious activity to the IBA within 24 hours.
    The IT department must ensure data security protocols are implemented.
    """
    
    print("\n[TEST] Running AI Engine Analysis...")
    cko = engine.analyze(test_text)
    
    print("\n[RESULT] CKO Analysis Summary:")
    print(f"- Summary: {cko.summary}")
    print(f"- Organizations: {cko.organizations}")
    print(f"- Obligations Found: {len(cko.obligations)}")
    print(f"- Action Points (MAPs): {len(cko.maps)}")
    print(f"- Compliance Score: {cko.compliance_score}%")
    print(f"- Risk Score: {cko.risk_score}")
    print(f"- Departments: {cko.departments}")
    print(f"- Tasks Generated: {len(cko.tasks)}")
    
    print("\n[LOG] Processing Steps:")
    for log in cko.processing_log:
        print(f"  > {log}")
        
    if len(cko.maps) > 0 and cko.compliance_score < 100:
        print("\n✅ TEST PASSED: AI Engine is functioning and populating CKO correctly.")
    else:
        print("\n❌ TEST FAILED: AI Engine output is incomplete.")

if __name__ == "__main__":
    test()
