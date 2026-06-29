const EvidencePage = {
    async render() {
        return `
            <div class="page-header">
                <h1>Evidence Validation Center</h1>
                <p>Verify uploaded evidence against regulatory requirements using AI.</p>
            </div>

            <div class="section-card">
                <div class="evidence-split">
                    <div class="requirement-pane">
                        <div style="padding: 15px; background: #f8f9fa; border-radius: 8px; border-left: 4px solid var(--primary-blue); margin-bottom: 20px;">
                            <h4 style="font-size: 0.9rem; color: var(--secondary-blue); margin-bottom: 8px;">Selected Requirement</h4>
                            <p style="font-weight: 600; font-size: 1.1rem; margin-bottom: 10px;">MAP-101: Implement Multi-factor Authentication</p>
                            <p style="font-size: 0.9rem; color: var(--text-muted);">"All external facing applications must require at least two forms of authentication for user login, adhering to ISO 27001 standards."</p>
                        </div>

                        <div class="section-title"><span>Required Attributes</span></div>
                        <ul style="list-style: none; padding-left: 0;">
                            <li style="padding: 8px 0; border-bottom: 1px solid #eee; font-size: 0.9rem;"><i class="fas fa-check-circle" style="color: var(--success-green); margin-right: 10px;"></i> Evidence of 2FA configuration</li>
                            <li style="padding: 8px 0; border-bottom: 1px solid #eee; font-size: 0.9rem;"><i class="fas fa-check-circle" style="color: var(--success-green); margin-right: 10px;"></i> User log showing successful 2FA challenges</li>
                            <li style="padding: 8px 0; border-bottom: 1px solid #eee; font-size: 0.9rem;"><i class="fas fa-circle" style="color: #eee; margin-right: 10px;"></i> Architecture diagram showing MFA placement</li>
                        </ul>
                    </div>

                    <div class="evidence-pane">
                        <div class="section-title"><span>Uploaded Evidence</span></div>
                        <div style="border: 1px solid var(--border-color); border-radius: 8px; overflow: hidden; margin-bottom: 20px;">
                            <div style="background: #f1f5f9; padding: 10px; display: flex; justify-content: space-between; align-items: center;">
                                <span style="font-size: 0.85rem; font-weight: 600;"><i class="fas fa-file-pdf" style="color: #e11d48; margin-right: 8px;"></i> Security_Config_Q3.pdf</span>
                                <button class="btn btn-outline" style="padding: 4px 8px; font-size: 0.75rem;">View Full</button>
                            </div>
                            <div style="height: 300px; background: #fafafa; display: flex; align-items: center; justify-content: center; position: relative;">
                                <img src="https://via.placeholder.com/400x300?text=PDF+Preview+Content" alt="Evidence Preview" style="max-width: 100%; max-height: 100%;">
                                <div style="position: absolute; bottom: 20px; right: 20px; background: rgba(0,74,153,0.9); color: white; padding: 10px 15px; border-radius: 8px; font-size: 0.85rem; box-shadow: var(--shadow);">
                                    <i class="fas fa-robot" style="margin-right: 8px;"></i> AI Scanning...
                                </div>
                            </div>
                        </div>

                        <div class="section-card" style="background: #f0fdf4; border: 1px solid #bbf7d0; margin-bottom: 0;">
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                                <h4 style="color: #166534; font-size: 1rem;">Validation Result</h4>
                                <span class="status-badge status-low" style="background: #166534; color: white;">95% CONFIDENCE</span>
                            </div>
                            <p style="font-size: 0.9rem; color: #166534; font-weight: 600; margin-bottom: 10px;">Compliance Score: 85%</p>
                            <p style="font-size: 0.85rem; color: #166534; margin-bottom: 15px;">AI suggests that the document provides sufficient proof of MFA configuration for the Admin portal, but lacks evidence for the Customer portal.</p>
                            <div style="display: flex; gap: 10px;">
                                <button class="btn btn-primary" style="background: #166534;">Approve Validation</button>
                                <button class="btn btn-outline" style="border-color: #166534; color: #166534;">Request More Evidence</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    init() {
        console.log('Evidence Validation initialized');
    }
};
