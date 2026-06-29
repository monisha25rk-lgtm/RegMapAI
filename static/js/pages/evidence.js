window.EvidencePage = {
    async render() {
        let evidenceList = [];
        try {
            const response = await fetch('/api/evidence/pending');
            if (response.ok) {
                const pending = await response.json();
                evidenceList = pending.map(e => ({ ...e, isPending: true }));
            }
        } catch (e) {
            console.error("Failed to fetch pending evidence", e);
        }

        const selectedEvidence = evidenceList.length > 0 ? evidenceList[0] : null;

        const header = `
            <div class="page-header">
                <div style="display: flex; justify-content: space-between; align-items: flex-end;">
                    <div>
                        <h1 style="color: var(--primary-blue); font-weight: 800; font-size: 1.5rem;">AI EVIDENCE VALIDATION CENTER</h1>
                        <p style="font-size: 0.85rem; color: var(--text-muted);">Autonomous cross-referencing of institutional evidence against regulatory requirements.</p>
                    </div>
                    <div style="display: flex; gap: 10px;">
                        <button class="btn" onclick="window.EvidencePage.exportAcceptedEvidence()"><i class="fas fa-download"></i> EXPORT ACCEPTED</button>
                        <button class="btn btn-action"><i class="fas fa-file-shield"></i> VALIDATE NEW BATCH</button>
                    </div>
                </div>
            </div>
        `;

        if (!selectedEvidence) {
            return `${header}
                <div class="section-card">
                    <div class="section-body" style="text-align: center; padding: 100px;">
                        <i class="fas fa-check-circle" style="font-size: 4rem; color: var(--success-green); margin-bottom: 20px;"></i>
                        <h2>No Pending Evidence</h2>
                        <p style="color: var(--text-muted);">All submitted documents have been validated by AI.</p>
                    </div>
                </div>
            `;
        }

        const manualVerificationSection = selectedEvidence.needs_manual_verification ? `
            <div class="section-card" style="border-top: 4px solid var(--warning-yellow);">
                <div class="section-header"><span class="section-title">Manual Verification Required</span></div>
                <div class="section-body">
                    <p style="font-size: 0.85rem; color: #444; margin-bottom: 20px;">
                        This evidence was flagged for <strong>manual verification</strong> by the AI Agent (Confidence Score: ${selectedEvidence.compliance_score}%).
                        Please review the document and cross-reference with the requirement.
                    </p>
                    <div style="display: flex; gap: 10px;">
                        <button class="btn btn-action" style="flex: 1; background: var(--success-green);" onclick="window.EvidencePage.verifyManual(${selectedEvidence.id}, 'Accepted')">
                            <i class="fas fa-check"></i> ACCEPT & COMPLETE MAP
                        </button>
                        <button class="btn btn-outline" style="flex: 1; color: var(--risk-high); border-color: var(--risk-high);" onclick="window.EvidencePage.verifyManual(${selectedEvidence.id}, 'Rejected')">
                            <i class="fas fa-times"></i> REJECT
                        </button>
                    </div>
                </div>
            </div>
        ` : '';

        return `${header}
            <div style="display: flex; flex-direction: column; gap: 25px;">
                <div class="section-card">
                    <div class="section-header">
                        <span class="section-title">Submitted Evidence</span>
                        <span style="font-size: 0.7rem; color: var(--text-muted);">Uploaded: ${selectedEvidence.upload_date}</span>
                    </div>
                    <div class="section-body">
                        <div style="border: 1px solid var(--border-gray); border-radius: 4px; padding: 20px; background: #fff;">
                            <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 15px;">
                                <i class="fas fa-file-pdf" style="font-size: 2rem; color: #f40f0f;"></i>
                                <div>
                                    <div style="font-weight: 700; font-size: 0.9rem;">${selectedEvidence.file_name || 'evidence.pdf'}</div>
                                    <div style="font-size: 0.7rem; color: var(--text-muted);">Verified Secure</div>
                                </div>
                            </div>
                            <div style="font-family: 'Courier New', Courier, monospace; font-size: 0.8rem; background: #fafafa; padding: 15px; border: 1px solid #eee; min-height: 200px; color: #444;">
                                <p>AI Evidence Extraction from: ${selectedEvidence.file_path}</p>
                                <p style="margin-top: 10px;">[Extracting text content for analysis...]</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div style="display: grid; grid-template-columns: 1fr; gap: 20px;">
                    ${manualVerificationSection}
                    <div class="section-card">
                        <div class="section-header"><span class="section-title">Validation Confidence Summary</span></div>
                        <div class="section-body">
                             <div style="display: flex; justify-content: space-between; align-items: center; padding: 15px; background: #f8f9fa; border-radius: 4px; margin-bottom: 10px;">
                                <div style="font-size: 0.75rem; font-weight: 700;">INSTITUTIONAL CONFIDENCE</div>
                                <div style="font-size: 1.2rem; font-weight: 800; color: var(--accent-teal);">94.2%</div>
                             </div>
                             <div style="display: flex; justify-content: space-between; align-items: center; padding: 15px; background: #f8f9fa; border-radius: 4px;">
                                <div style="font-size: 0.75rem; font-weight: 700;">HISTORICAL MATCH RATE</div>
                                <div style="font-size: 1.2rem; font-weight: 800; color: var(--primary-blue);">88.5%</div>
                             </div>
                        </div>
                    </div>
                    <div class="section-card" style="border-top: 4px solid var(--accent-teal);">
                        <div class="section-header">
                            <span class="section-title">AI Analysis & Cross-Referencing</span>
                        </div>
                        <div class="section-body">
                            <div style="display: flex; justify-content: space-between; margin-bottom: 20px;">
                                <div style="text-align: center;">
                                    <div style="font-size: 1.5rem; font-weight: 800; color: var(--primary-blue);">${selectedEvidence.compliance_score || '--'}%</div>
                                    <div style="font-size: 0.65rem; font-weight: 700; color: var(--text-muted);">MATCH PERCENTAGE</div>
                                </div>
                                <div style="text-align: center;">
                                    <div style="font-size: 1.5rem; font-weight: 800; color: var(--accent-teal);">94%</div>
                                    <div style="font-size: 0.65rem; font-weight: 700; color: var(--text-muted);">AI CONFIDENCE</div>
                                </div>
                                <div style="text-align: center;">
                                    <div style="font-size: 1.5rem; font-weight: 800; color: ${selectedEvidence.validation_result === 'Compliant' ? 'var(--success-green)' : (selectedEvidence.needs_manual_verification ? 'var(--warning-yellow)' : 'var(--text-muted)')};">
                                        ${selectedEvidence.needs_manual_verification && selectedEvidence.manual_verification_status === 'Pending' ? 'MANUAL REQ' : (selectedEvidence.validation_result || 'PENDING')}
                                    </div>
                                    <div style="font-size: 0.65rem; font-weight: 700; color: var(--text-muted);">COMPLIANCE STATUS</div>
                                </div>
                            </div>

                            <div style="margin-bottom: 20px;">
                                <div style="font-weight: 800; font-size: 0.75rem; color: var(--primary-blue); margin-bottom: 10px;">VALIDATION EXPLANATION</div>
                                <p style="font-size: 0.8rem; color: #444; line-height: 1.4;">
                                    ${selectedEvidence.validation_reason || 'Evidence is queued for AI validation. The system will cross-reference the uploaded document against the specific regulatory clauses extracted in the MAP.'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },
    async verifyManual(evidenceId, status) {
        if (!confirm(`Are you sure you want to mark this evidence as ${status}?`)) return;

        try {
            const response = await fetch(`/api/evidence/verify/${evidenceId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: status })
            });
            if (response.ok) {
                alert(`Evidence successfully ${status.toLowerCase()}.`);
                app.navigateTo('evidence'); // Refresh
            } else {
                alert('Failed to update verification status.');
            }
        } catch (e) {
            console.error("Verification error", e);
            alert('An error occurred during verification.');
        }
    },
    exportAcceptedEvidence() {
        window.location = '/api/evidence/export/accepted';
    },
    init() {
        // No charts to render
    }
};
