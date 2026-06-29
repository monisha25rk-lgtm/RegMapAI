const MonitorPage = {
    async render() {
        return `
            <div class="page-header">
                <h1>Task Compliance Monitor</h1>
                <p>Track execution status and evidence submission across all active tasks.</p>
            </div>

            <div class="kpi-container">
                <div class="kpi-card">
                    <div class="kpi-value">85%</div>
                    <div class="kpi-label">Average Compliance</div>
                </div>
                <div class="kpi-card">
                    <div class="kpi-value" style="color: var(--success-green);">32</div>
                    <div class="kpi-label">Tasks Completed</div>
                </div>
                <div class="kpi-card">
                    <div class="kpi-value" style="color: var(--warning-yellow);">15</div>
                    <div class="kpi-label">Pending Validation</div>
                </div>
                <div class="kpi-card">
                    <div class="kpi-value" style="color: var(--risk-high);">5</div>
                    <div class="kpi-label">Overdue Tasks</div>
                </div>
            </div>

            <div class="section-card">
                <div class="section-title"><span>Task Status Monitoring</span></div>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px;">
                    ${mockData.maps.map(map => `
                        <div class="card" style="margin-bottom: 0; border-top: 4px solid ${this.getRiskColor(map.risk)};">
                            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 15px;">
                                <h4 style="font-size: 0.95rem; margin: 0; flex: 1; padding-right: 10px;">${map.requirement}</h4>
                                <span class="status-badge ${this.getRiskClass(map.risk)}">${map.risk}</span>
                            </div>

                            <div style="margin-bottom: 15px;">
                                <div style="display: flex; justify-content: space-between; font-size: 0.8rem; margin-bottom: 5px;">
                                    <span>Compliance Progress</span>
                                    <span style="font-weight: bold;">${map.compliance}%</span>
                                </div>
                                <div style="height: 8px; background: #eee; border-radius: 4px; overflow: hidden;">
                                    <div style="width: ${map.compliance}%; height: 100%; background: var(--primary-blue);"></div>
                                </div>
                            </div>

                            <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.85rem;">
                                <div style="color: var(--text-muted);">
                                    <i class="far fa-clock"></i> ${map.deadline}
                                </div>
                                <button class="btn btn-outline" onclick="app.navigateTo('mapDetail', {id: '${map.id}'})" style="padding: 4px 10px; font-size: 0.75rem;">Monitor</button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    },

    init() {
        console.log('Monitor Page initialized');
    },

    getRiskColor(risk) {
        switch(risk) {
            case 'High': return 'var(--risk-high)';
            case 'Medium': return 'var(--warning-yellow)';
            case 'Low': return 'var(--success-green)';
            case 'Critical': return 'var(--risk-critical)';
            default: return 'var(--border-color)';
        }
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
