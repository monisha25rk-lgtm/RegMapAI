window.DashboardPage = {
    async render() {
        let data = mockData.dashboard;

        try {
            const response = await fetch('/api/dashboard/stats');
            if (response.ok) {
                const stats = await response.json();
                data = { ...data, ...stats };
            }
        } catch (e) {
            console.error("Failed to fetch dashboard stats", e);
        }

        return `
            <div class="page-header" style="margin-bottom: 20px;">
                <div style="display: flex; justify-content: space-between; align-items: flex-end;">
                    <div>
                        <h1 style="color: var(--primary-blue); font-weight: 800; font-size: 1.5rem;">EXECUTIVE COMPLIANCE DASHBOARD</h1>
                        <p style="font-size: 0.85rem; color: var(--text-muted);">Real-time institutional health and regulatory risk posture.</p>
                    </div>
                    <div style="text-align: right;">
                        <div style="font-size: 0.75rem; color: var(--text-muted); font-weight: 600;">LAST AUDIT SYNC</div>
                        <div style="font-size: 0.85rem; font-weight: 700;">20 NOV 2023 | 14:30 IST</div>
                    </div>
                </div>
            </div>

            <!-- Top Metrics Row -->
            <div class="metric-grid">
                <div class="metric-widget">
                    <div class="metric-label">Institutional Score</div>
                    <div class="metric-value">${data.institutionalScore}%</div>
                    <div class="metric-trend" style="color: var(--success-green);">
                        <i class="fas fa-caret-up"></i> +1.2% vs last month
                    </div>
                </div>
                <div class="metric-widget" style="border-left-color: var(--accent-teal);">
                    <div class="metric-label">Audit Readiness</div>
                    <div class="metric-value">${data.auditReadiness}%</div>
                    <div class="metric-trend" style="color: var(--success-green);">
                        <i class="fas fa-caret-up"></i> +4.5% vs last month
                    </div>
                </div>
                <div class="metric-widget" style="border-left-color: var(--secondary-blue);">
                    <div class="metric-label">Active MAPs</div>
                    <div class="metric-value">${data.activeMAPs}</div>
                    <div class="metric-trend">8 New this week</div>
                </div>
                <div class="metric-widget" style="border-left-color: var(--risk-high);">
                    <div class="metric-label">Critical Risks</div>
                    <div class="metric-value" style="color: var(--risk-high);">${data.criticalRisks}</div>
                    <div class="metric-trend" style="color: var(--risk-high);">
                        <i class="fas fa-exclamation-triangle"></i> Action Required
                    </div>
                </div>
                <div class="metric-widget" style="border-left-color: var(--warning-yellow);">
                    <div class="metric-label">Pending Reviews</div>
                    <div class="metric-value">${data.pendingReviews}</div>
                    <div class="metric-trend">Due < 48 hours</div>
                </div>
                <div class="metric-widget" style="border-left-color: var(--charcoal);">
                    <div class="metric-label">Upcoming Deadlines</div>
                    <div class="metric-value">${data.upcomingDeadlines}</div>
                    <div class="metric-trend">Next: 22 Nov 2023</div>
                </div>
            </div>

            <div class="dashboard-grid">
                <!-- Main Analytics Section -->
                <div style="display: flex; flex-direction: column; gap: 20px;">
                    <div class="section-card">
                        <div class="section-header">
                            <span class="section-title">Institutional Compliance Health</span>
                        </div>
                        <div class="section-body">
                            <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px;">
                                <div style="background: #f8f9fa; padding: 15px; border-radius: 4px; border-left: 4px solid var(--success-green);">
                                    <div style="font-size: 0.7rem; color: var(--text-muted); font-weight: 700; margin-bottom: 5px;">REGULATORY UPTIME</div>
                                    <div style="font-size: 1.2rem; font-weight: 800; color: var(--primary-blue);">99.8%</div>
                                </div>
                                <div style="background: #f8f9fa; padding: 15px; border-radius: 4px; border-left: 4px solid var(--warning-yellow);">
                                    <div style="font-size: 0.7rem; color: var(--text-muted); font-weight: 700; margin-bottom: 5px;">AVG. RESPONSE TIME</div>
                                    <div style="font-size: 1.2rem; font-weight: 800; color: var(--primary-blue);">4.2 Days</div>
                                </div>
                                <div style="background: #f8f9fa; padding: 15px; border-radius: 4px; border-left: 4px solid var(--accent-teal);">
                                    <div style="font-size: 0.7rem; color: var(--text-muted); font-weight: 700; margin-bottom: 5px;">EVIDENCE VALIDATION</div>
                                    <div style="font-size: 1.2rem; font-weight: 800; color: var(--primary-blue);">86.5%</div>
                                </div>
                                <div style="background: #f8f9fa; padding: 15px; border-radius: 4px; border-left: 4px solid var(--risk-high);">
                                    <div style="font-size: 0.7rem; color: var(--text-muted); font-weight: 700; margin-bottom: 5px;">BREACH PROBABILITY</div>
                                    <div style="font-size: 1.2rem; font-weight: 800; color: var(--risk-high);">2.1%</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="section-card">
                        <div class="section-header">
                            <span class="section-title">Department Compliance Health</span>
                        </div>
                        <div class="section-body" style="padding: 0; overflow-x: auto;">
                            <table class="data-table">
                                <thead>
                                    <tr>
                                        <th>Department</th>
                                        <th>Score</th>
                                        <th>Trend</th>
                                        <th>Active MAPs</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${data.deptPerformance.map(dept => `
                                        <tr>
                                            <td style="font-weight: 700;">${dept.name}</td>
                                            <td>
                                                <div style="display: flex; align-items: center; gap: 10px;">
                                                    <div style="flex: 1; height: 6px; background: #eee; border-radius: 3px;">
                                                        <div style="width: ${dept.score}%; height: 100%; background: ${dept.score > 80 ? 'var(--success-green)' : dept.score > 70 ? 'var(--warning-yellow)' : 'var(--risk-high)'}; border-radius: 3px;"></div>
                                                    </div>
                                                    <span style="font-weight: 700; width: 35px;">${dept.score}%</span>
                                                </div>
                                            </td>
                                            <td><i class="fas fa-arrow-${dept.trend}" style="color: ${dept.trend === 'up' ? 'var(--success-green)' : dept.trend === 'down' ? 'var(--risk-high)' : 'var(--text-muted)'}"></i></td>
                                            <td>${Math.floor(Math.random() * 30) + 5}</td>
                                            <td><span class="status-badge ${dept.score > 85 ? 'status-low' : dept.score > 70 ? 'status-medium' : 'status-high'}">${dept.score > 85 ? 'Compliant' : dept.score > 70 ? 'In Review' : 'High Risk'}</span></td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <!-- AI Assistant & Reg Feed Sidebar -->
                <div style="display: flex; flex-direction: column; gap: 20px;">
                    <div class="section-card" style="border-top: 4px solid var(--accent-teal);">
                        <div class="section-header">
                            <span class="section-title"><i class="fas fa-robot" style="margin-right: 8px;"></i> AI Executive Assistant</span>
                        </div>
                        <div class="section-body">
                            ${data.aiAssistant.map(alert => `
                                <div class="ai-alert-card">
                                    <div class="ai-alert-icon">
                                        <i class="fas fa-${alert.type === 'risk' ? 'exclamation-circle' : alert.type === 'warning' ? 'shield-halved' : 'info-circle'}"></i>
                                    </div>
                                    <div>
                                        <div style="font-size: 0.8rem; font-weight: 800; color: var(--primary-blue); margin-bottom: 4px; text-transform: uppercase;">${alert.title}</div>
                                        <p style="font-size: 0.75rem; color: #444; margin-bottom: 8px; line-height: 1.3;">${alert.message}</p>
                                        <button class="btn btn-action" style="padding: 3px 8px; font-size: 0.65rem;">${alert.action.toUpperCase()}</button>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    <div class="section-card">
                        <div class="section-header">
                            <span class="section-title">Regulatory Intelligence Feed</span>
                        </div>
                        <div class="section-body" style="padding: 10px;">
                            ${data.regIntelligenceFeed.map(item => `
                                <div style="padding: 10px; border-bottom: 1px solid #f0f0f0;">
                                    <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                                        <span style="font-size: 0.65rem; font-weight: 700; color: var(--text-muted);">${item.date}</span>
                                        <span class="status-badge ${item.impact === 'High' ? 'status-high' : 'status-medium'}" style="font-size: 0.6rem;">${item.impact} IMPACT</span>
                                    </div>
                                    <div style="font-size: 0.8rem; font-weight: 700; color: var(--charcoal); cursor: pointer;" onclick="app.navigateTo('workspace', {circularId: '${item.id}'})">${item.title}</div>
                                    <div style="font-size: 0.7rem; color: var(--text-muted); margin-top: 4px;">Affects: ${item.department}</div>
                                </div>
                            `).join('')}
                            <button class="btn" style="width: 100%; margin-top: 15px; font-size: 0.7rem; border-style: dashed;">VIEW ALL REGULATORY ACTIVITY</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },
    init() {
        // No charts to render
    }
};
