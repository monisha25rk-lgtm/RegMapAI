const DashboardPage = {
    async render() {
        const data = mockData.dashboard;

        return `
            <div class="page-header">
                <h1>Executive Compliance Dashboard</h1>
                <p>Real-time regulatory health and risk posture across the enterprise.</p>
            </div>

            <div class="kpi-container">
                <div class="kpi-card">
                    <div class="progress-circle" style="--percent: ${data.complianceScore}%">
                        <div class="progress-circle-inner">${data.complianceScore}%</div>
                    </div>
                    <div class="kpi-label">Overall Compliance Score</div>
                </div>
                <div class="kpi-card">
                    <div class="progress-circle" style="--percent: ${data.auditReadiness}%; --accent-blue: var(--success-green)">
                        <div class="progress-circle-inner">${data.auditReadiness}%</div>
                    </div>
                    <div class="kpi-label">Audit Readiness Score</div>
                </div>
                <div class="kpi-card">
                    <div class="kpi-icon"><i class="fas fa-tasks"></i></div>
                    <div class="kpi-value">${data.activeMAPs}</div>
                    <div class="kpi-label">Active MAPs</div>
                </div>
                <div class="kpi-card">
                    <div class="kpi-icon" style="color: var(--risk-high); background: #fee2e2;"><i class="fas fa-exclamation-triangle"></i></div>
                    <div class="kpi-value" style="color: var(--risk-high);">${data.criticalRisks}</div>
                    <div class="kpi-label">Critical Risks</div>
                </div>
            </div>

            <div class="dashboard-grid">
                <div class="section-card">
                    <div class="section-title">
                        <span>Department Compliance Health</span>
                        <button class="btn btn-outline" style="padding: 5px 10px; font-size: 0.8rem;">View Detailed Report</button>
                    </div>
                    <div class="table-responsive">
                        <table class="data-table">
                            <thead>
                                <tr>
                                    <th>Department</th>
                                    <th>Compliance Score</th>
                                    <th>Status</th>
                                    <th>Trend</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${data.departmentHealth.map(dept => `
                                    <tr>
                                        <td><strong>${dept.name}</strong></td>
                                        <td>
                                            <div style="display: flex; align-items: center; gap: 10px;">
                                                <div style="flex: 1; height: 8px; background: #eee; border-radius: 4px; overflow: hidden;">
                                                    <div style="width: ${dept.score}%; height: 100%; background: ${this.getScoreColor(dept.score)};"></div>
                                                </div>
                                                <span>${dept.score}%</span>
                                            </div>
                                        </td>
                                        <td><span class="status-badge ${this.getStatusClass(dept.status)}">${dept.status}</span></td>
                                        <td><i class="fas fa-arrow-up" style="color: var(--success-green);"></i></td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div class="section-card">
                    <div class="section-title">
                        <span>Critical Alerts & AI Insights</span>
                    </div>
                    <div class="alerts-list">
                        ${data.recentAlerts.map(alert => `
                            <div style="padding: 15px; border-left: 4px solid ${alert.type === 'Critical' ? 'var(--risk-high)' : 'var(--warning-yellow)'}; background: #fcfcfc; margin-bottom: 15px; border-radius: 0 8px 8px 0; box-shadow: var(--shadow-sm);">
                                <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                                    <span style="font-weight: 700; font-size: 0.8rem; color: ${alert.type === 'Critical' ? 'var(--risk-high)' : '#856404'};">${alert.type.toUpperCase()}</span>
                                    <span style="font-size: 0.75rem; color: var(--text-muted);">${alert.time}</span>
                                </div>
                                <p style="font-size: 0.9rem; margin: 0;">${alert.message}</p>
                            </div>
                        `).join('')}
                    </div>
                    <div style="background: #eef6ff; padding: 15px; border-radius: 8px; margin-top: 20px;">
                        <div style="display: flex; gap: 10px; align-items: flex-start;">
                            <i class="fas fa-robot" style="color: var(--primary-blue); margin-top: 3px;"></i>
                            <div>
                                <h4 style="font-size: 0.9rem; margin-bottom: 5px; color: var(--secondary-blue);">AI Recommendation</h4>
                                <p style="font-size: 0.85rem; color: #444; margin: 0;">Based on recent IT infrastructure score dip, we recommend immediate review of "Data Privacy Framework" implementation in IT Department.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    init() {
        console.log('Dashboard initialized');
    },

    getScoreColor(score) {
        if (score >= 90) return 'var(--success-green)';
        if (score >= 75) return 'var(--warning-yellow)';
        return 'var(--risk-high)';
    },

    getStatusClass(status) {
        switch(status) {
            case 'Compliant': return 'status-low'; // Using low risk style for compliant
            case 'Warning': return 'status-medium';
            case 'High Risk': return 'status-high';
            default: return '';
        }
    }
};
