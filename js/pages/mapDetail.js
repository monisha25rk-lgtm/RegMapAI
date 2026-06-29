const MAPDetailPage = {
    async render(mapId = 'MAP-101') {
        const map = mockData.maps.find(m => m.id === mapId) || mockData.maps[0];

        return `
            <div class="page-header">
                <div style="display: flex; align-items: center; gap: 15px;">
                    <button class="btn btn-outline" onclick="app.navigateTo('workspace')" style="padding: 5px 10px;"><i class="fas fa-arrow-left"></i></button>
                    <h1>MAP Detail: ${map.id}</h1>
                </div>
            </div>

            <div class="dashboard-grid">
                <div class="section-card">
                    <div class="section-title"><span>Requirement Details</span></div>
                    <h2 style="margin-bottom: 15px; color: var(--secondary-blue);">${map.requirement}</h2>
                    <p style="color: var(--text-muted); margin-bottom: 25px;">This action plan was generated from Circular C-2023-001. It addresses the critical need for multi-factor authentication across all banking applications to mitigate unauthorized access risks.</p>

                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px;">
                        <div>
                            <label style="display: block; font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; font-weight: bold;">Department</label>
                            <p style="font-weight: 600;">${map.department}</p>
                        </div>
                        <div>
                            <label style="display: block; font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; font-weight: bold;">Owner</label>
                            <p style="font-weight: 600;">${map.owner}</p>
                        </div>
                        <div>
                            <label style="display: block; font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; font-weight: bold;">Deadline</label>
                            <p style="font-weight: 600; color: var(--risk-high);">${map.deadline}</p>
                        </div>
                        <div>
                            <label style="display: block; font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; font-weight: bold;">Priority</label>
                            <span class="status-badge status-high">High</span>
                        </div>
                    </div>

                    <div class="section-title"><span>Evidence & Validation</span></div>
                    <div style="border: 1px solid var(--border-color); border-radius: 8px; padding: 15px; margin-bottom: 15px;">
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <div>
                                <div style="font-weight: 600;">MFA_Config_Screenshots.zip</div>
                                <div style="font-size: 0.8rem; color: var(--text-muted);">Uploaded by ${map.owner} on 2023-10-20</div>
                            </div>
                            <button class="btn btn-outline" onclick="app.navigateTo('evidence')">View Validation</button>
                        </div>
                    </div>
                    <button class="btn btn-primary"><i class="fas fa-upload"></i> Upload New Evidence</button>
                </div>

                <div>
                    <div class="section-card" style="text-align: center;">
                        <div class="section-title"><span>Compliance Status</span></div>
                        <div class="progress-circle" style="--percent: ${map.compliance}%; margin: 0 auto 15px; width: 120px; height: 120px;">
                            <div class="progress-circle-inner" style="width: 100px; height: 100px; font-size: 1.5rem;">${map.compliance}%</div>
                        </div>
                        <p style="font-weight: 600; color: ${map.compliance === 100 ? 'var(--success-green)' : 'var(--primary-blue)'};">
                            ${map.compliance === 100 ? 'Fully Compliant' : 'In Progress'}
                        </p>
                    </div>

                    <div class="section-card">
                        <div class="section-title"><span>Risk Analysis</span></div>
                        <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                            <span>Risk Score:</span>
                            <span class="status-badge ${this.getRiskClass(map.risk)}">${map.risk}</span>
                        </div>
                        <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 15px;"><strong>Reason:</strong> High dependency on 3rd party vendor for authentication module update.</p>
                        <div style="background: #fff3cd; padding: 12px; border-radius: 6px; border-left: 4px solid var(--warning-yellow);">
                            <p style="font-size: 0.85rem; color: #856404; margin: 0;"><strong>Recommended Action:</strong> Escalate to Vendor Management for expedited delivery.</p>
                        </div>
                    </div>

                    <div class="section-card">
                        <div class="section-title"><span>Audit History</span></div>
                        <div style="font-size: 0.85rem;">
                            <div style="padding: 8px 0; border-bottom: 1px solid #eee;">
                                <div style="font-weight: 600;">Evidence Validated</div>
                                <div style="color: var(--text-muted);">2023-10-21 14:20 - AI Validator</div>
                            </div>
                            <div style="padding: 8px 0; border-bottom: 1px solid #eee;">
                                <div style="font-weight: 600;">Evidence Uploaded</div>
                                <div style="color: var(--text-muted);">2023-10-20 11:45 - ${map.owner}</div>
                            </div>
                            <div style="padding: 8px 0;">
                                <div style="font-weight: 600;">MAP Created</div>
                                <div style="color: var(--text-muted);">2023-10-15 09:00 - System</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    init() {
        console.log('MAP Detail initialized');
    },

    getRiskClass(risk) {
        switch(risk) {
            case 'High': return 'status-high';
            case 'Medium': return 'status-medium';
            case 'Low': return 'status-low';
            case 'Critical': return 'status-critical';
            default: return '';
        }
    }
};
