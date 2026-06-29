import sys
sys.path.append('c:/Users/monis/RegMapAI/backend')
import llm
llm._semantic_similarity = lambda *args, **kwargs: None
examples = [
    ('positive', 'The institution keeps a complete log of every client payment activity for internal audits.', 'The bank must maintain an audit trail for all customer transactions.'),
    ('negative', 'No audit log or transaction history is available for review.', 'The bank must maintain an audit trail for all customer transactions.')
]
for name, evidence, req in examples:
    print(name, llm.analyze_evidence_match(evidence, 'Audit trail', req))
