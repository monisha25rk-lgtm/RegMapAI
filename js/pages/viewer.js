const ViewerPage = {
    async render(circularId = 'C-2023-001') {
        const circular = mockData.circulars.find(c => c.id === circularId) || mockData.circulars[0];

        return `
            <div class="page-header">
                <div style="display: flex; align-items: center; gap: 15px;">
                    <button class="btn btn-outline" onclick="app.navigateTo('upload')" style="padding: 5px 10px;"><i class="fas fa-arrow-left"></i></button>
                    <h1>Circular Viewer</h1>
                </div>
            </div>

            <div class="dashboard-grid" style="grid-template-columns: 1fr 2fr;">
                <div class="section-card">
                    <div class="section-title"><span>Metadata</span></div>
                    <div style="margin-bottom: 20px;">
                        <label style="display: block; font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; font-weight: bold;">Title</label>
                        <p style="font-weight: 600;">${circular.title}</p>
                    </div>
                    <div style="margin-bottom: 20px;">
                        <label style="display: block; font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; font-weight: bold;">ID</label>
                        <p>${circular.id}</p>
                    </div>
                    <div style="margin-bottom: 20px;">
                        <label style="display: block; font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; font-weight: bold;">Department</label>
                        <p>${circular.department}</p>
                    </div>
                    <div style="margin-bottom: 20px;">
                        <label style="display: block; font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; font-weight: bold;">Priority</label>
                        <span class="status-badge status-high">High</span>
                    </div>
                    <button class="btn btn-primary" style="width: 100%;"><i class="fas fa-download"></i> Download Original PDF</button>
                </div>

                <div class="section-card">
                    <div class="section-title">
                        <span>Extracted Intelligence</span>
                        <span class="status-badge status-low">AI PROCESSED</span>
                    </div>
                    <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; border: 1px solid #eee; font-family: 'Georgia', serif; line-height: 1.8; max-height: 500px; overflow-y: auto;">
                        <h3 style="margin-bottom: 15px;">Regulatory Obligation Summary</h3>
                        <p>Pursuant to Section 45 of the Banking Regulation Act, all scheduled commercial banks are hereby directed to implement the following cybersecurity measures...</p>
                        <h4 style="margin-top: 20px; margin-bottom: 10px;">Key Requirements:</h4>
                        <ol style="padding-left: 20px;">
                            <li>Implementation of 24/7 Security Operations Center (SOC).</li>
                            <li>Real-time reporting of cyber incidents within 2 to 6 hours.</li>
                            <li>Mandatory multi-factor authentication for all administrative access.</li>
                            <li>Quarterly vulnerability assessment and penetration testing (VAPT).</li>
                        </ol>
                        <p style="margin-top: 20px;"><strong>Compliance Deadline:</strong> 31st December 2023</p>
                    </div>

                    <div style="margin-top: 25px;">
                        <h4>Generated MAPs (4)</h4>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-top: 15px;">
                            <div style="padding: 12px; border: 1px solid var(--border-color); border-radius: 8px;">
                                <div style="font-weight: 600; font-size: 0.9rem;">SOC Implementation</div>
                                <div style="font-size: 0.75rem; color: var(--text-muted);">ID: MAP-201</div>
                            </div>
                            <div style="padding: 12px; border: 1px solid var(--border-color); border-radius: 8px;">
                                <div style="font-weight: 600; font-size: 0.9rem;">MFA Rollout</div>
                                <div style="font-size: 0.75rem; color: var(--text-muted);">ID: MAP-202</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },
    init() {}
};
