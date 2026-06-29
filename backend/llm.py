import re
from difflib import SequenceMatcher

# Optimized for Enterprise Speed - Removed all heavy/slow external model dependencies
STOP_WORDS = {
    "the", "and", "for", "with", "shall", "must", "be", "to", "in", "of", "on", "a", "an",
    "is", "are", "were", "was", "this", "that", "these", "those", "all", "each", "any",
    "from", "by", "as", "it", "its", "our", "their", "have", "has", "had", "been", "or",
    "at", "into", "during", "within", "between", "after", "before", "under", "over"
}

SYNONYMS = {
    "audit": ["audit", "audits", "auditing", "review", "reviews", "inspection", "inspections"],
    "trail": ["trail", "trails", "trace", "history", "histories", "log", "logs", "record", "records"],
    "maintain": ["maintain", "maintains", "maintained", "keep", "keeps", "kept", "retain", "retains", "retained", "preserve", "preserves", "preserved"],
    "transaction": ["transaction", "transactions", "payment", "payments", "activity", "activities", "operation", "operations", "event", "events"],
    "customer": ["customer", "customers", "client", "clients", "user", "users", "member", "members"],
    "report": ["report", "reports", "document", "documents", "evidence", "evidences", "submission", "submissions"],
    "policy": ["policy", "policies", "procedure", "procedures", "control", "controls", "standard", "standards"],
    "compliant": ["compliant", "compliance", "conformant", "conformity", "meeting"],
    "verify": ["verify", "verified", "verification", "validate", "validated", "validation", "check", "checks"],
    "implement": ["implement", "implemented", "deploy", "deployed", "establish", "established", "set", "setup"],
    "mfa": ["mfa", "multi-factor", "authentication", "2fa", "two-factor", "otp", "token"],
    "security": ["security", "protection", "safeguard", "cyber", "infosec"],
    "governance": ["governance", "oversight", "framework", "board", "committee"]
}

def _normalize_text(text):
    if not text: return ""
    text = text.lower()
    text = re.sub(r"[^a-z0-9]+", " ", text)
    return re.sub(r"\s+", " ", text).strip()

def _tokenize(text):
    normalized = _normalize_text(text)
    if not normalized: return []
    return [t for t in normalized.split() if t not in STOP_WORDS and len(t) > 2]

def analyze_evidence_match(evidence_text, map_title, map_description):
    """
    Super-fast evidence matching using optimized keyword overlap and synonym expansion.
    """
    if not evidence_text or not map_description:
        return {"compliant": False, "score": 0, "reason": "Missing evidence or requirement text."}

    req_text = f"{map_title} {map_description}"
    req_tokens = set(_tokenize(req_text))
    ev_tokens = set(_tokenize(evidence_text))

    if not req_tokens:
        return {"compliant": True, "score": 100, "reason": "Universal requirement."}

    # Match tokens and synonyms
    matches = 0
    matched_list = []
    for rt in req_tokens:
        if rt in ev_tokens:
            matches += 1
            matched_list.append(rt)
        else:
            # Check synonyms for fast semantic match
            syns = SYNONYMS.get(rt, [])
            if any(s in ev_tokens for s in syns):
                matches += 1
                matched_list.append(rt)

    coverage = (matches / len(req_tokens)) * 100
    
    # Calculate Sequence Similarity for phrase matching
    phrase_score = SequenceMatcher(None, _normalize_text(req_text)[:500], _normalize_text(evidence_text)[:500]).ratio() * 100
    
    # Final Score Blend (70% coverage, 30% phrase match)
    final_score = (coverage * 0.7) + (phrase_score * 0.3)
    
    # Positive/Negative impact
    if "no" in ev_tokens or "not" in ev_tokens or "none" in ev_tokens:
        final_score -= 20

    final_score = max(0, min(100, round(final_score)))
    compliant = final_score >= 70

    reason = f"Concept Coverage: {len(matched_list)}/{len(req_tokens)} key terms found. "
    if compliant:
        reason += "Well done! The evidence meets the regulatory requirement."
    else:
        reason += "Not accepted. Try it better immediately. The evidence match is too low."

    return {
        "compliant": compliant, 
        "score": final_score, 
        "reason": reason
    }

def analyze_circular_text(text, circular_id=None):
    # Compatibility fallback for ingestion
    return {"maps": []}
