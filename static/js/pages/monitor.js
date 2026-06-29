window.MonitorPage = {
    async render() {
        let maps = [];
        try {
            const response = await fetch('/api/maps/all');
            if (response.ok) {
                const dbMaps = await response.json();
                if (dbMaps && dbMaps.length > 0) {
                    maps = dbMaps.map(m => ({
                        id: `MAP-${m.id}`,
                        dbId: m.id,
                        requirement: m.title,
                        owner: m.owner || 'Unassigned',
                        dept: m.department,
                        deadline: m.deadline || 'No Deadline',
                        compliance: m.compliance_score || 0,
                        riskScore: m.risk_score || 0,
                        evidence: m.status === 'Completed' ? 'Validated' : 'Pending',
                        priority: m.priority
                    }));
                }
            }
        } catch (e) {
            console.error("Failed to fetch monitor maps", e);
        }

        return `
            <div class="page-header">
                <div style="display: flex; justify-content: space-between; align-items: flex-end;">
                    <div>
                        <h1 style="color: var(--primary-blue); font-weight: 800; font-size: 1.5rem;">TASK COMPLIANCE MONITOR</h1>
                        <p style="font-size: 0.85rem; color: var(--text-muted);">Real-time tracking of Management Action Plans and execution velocity.</p>
                    </div>
                    <div style="display: flex; gap: 10px;">
                        <div class="metric-widget" style="padding: 5px 15px; border-left: 3px solid var(--success-green);">
                            <div style="font-size: 0.6rem; font-weight: 700;">ON-TIME DELIVERY</div>
                            <div style="font-size: 1rem; font-weight: 800;">92.4%</div>
                        </div>
                        <div class="metric-widget" style="padding: 5px 15px; border-left: 3px solid var(--risk-high);">
                            <div style="font-size: 0.6rem; font-weight: 700;">CRITICAL OVERDUE</div>
                            <div style="font-size: 1rem; font-weight: 800;">04</div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="stats-grid">
                <div class="section-card">
                    <div class="section-header"><span class="section-title">Execution Velocity Status</span></div>
                    <div class="section-body">
                        <div style="display: flex; justify-content: space-between; align-items: center; padding: 15px; background: #f8f9fa; border-radius: 4px;">
                            <div>
                                <div style="font-size: 0.7rem; font-weight: 700; color: var(--text-muted);">TASKS COMPLETED THIS WEEK</div>
                                <div style="font-size: 1.5rem; font-weight: 800; color: var(--primary-blue);">142</div>
                            </div>
                            <div style="text-align: right;">
                                <div style="font-size: 0.7rem; font-weight: 700; color: var(--success-green);">+14% VS LAST WEEK</div>
                                <div style="font-size: 0.8rem; font-weight: 600;">Velocity: High</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="section-card">
                    <div class="section-header"><span class="section-title">Department Distribution</span></div>
                    <div class="section-body">
                         <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                            <div style="font-size: 0.75rem; font-weight: 700;">IT: 40%</div>
                            <div style="font-size: 0.75rem; font-weight: 700;">Compliance: 25%</div>
                            <div style="font-size: 0.75rem; font-weight: 700;">Risk: 20%</div>
                            <div style="font-size: 0.75rem; font-weight: 700;">Operations: 15%</div>
                         </div>
                    </div>
                </div>
            </div>

            <div class="section-card">
                <div class="section-header">
                    <span class="section-title">Institutional MAP Registry</span>
                    <div style="display: flex; gap: 10px;">
                        <input type="text" placeholder="Filter by Requirement, ID or Owner..." class="form-control" style="width: 250px; font-size: 0.75rem;">
                        <button class="btn" onclick="window.MonitorPage.exportAllMaps()"><i class="fas fa-download"></i> EXPORT ALL</button>
                        <button class="btn"><i class="fas fa-filter"></i></button>
                    </div>
                </div>
                <div class="section-body" style="padding: 0; overflow-x: auto;">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>MAP ID</th>
                                <th>Requirement</th>
                                <th>Owner / Dept</th>
                                <th>Deadline</th>
                                <th>Compliance %</th>
                                <th>Risk Score</th>
                                <th>Evidence Status</th>
                                <th>AI Recommendation</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${maps.map(map => `
                                <tr>
                                    <td style="font-weight: 800; color: var(--primary-blue);">${map.id}</td>
                                    <td style="max-width: 200px; font-size: 0.8rem; line-height: 1.2;">
                                        <strong>${map.requirement}</strong>
                                    </td>
                                    <td>
                                        <div style="font-weight: 600;">${map.owner}</div>
                                        <div style="font-size: 0.7rem; color: var(--text-muted);">${map.dept}</div>
                                    </td>
                                    <td style="font-weight: 700;">${map.deadline}</td>
                                    <td>
                                        <div style="display: flex; align-items: center; gap: 8px;">
                                            <div style="flex: 1; height: 18px; width: 60px; background: #eee; position: relative; border-radius: 2px; overflow: hidden;">
                                                <div style="width: ${map.compliance}%; height: 100%; background: ${map.compliance > 80 ? 'var(--success-green)' : map.compliance > 50 ? 'var(--warning-yellow)' : 'var(--risk-high)'};"></div>
                                                <span style="position: absolute; width: 100%; text-align: center; font-size: 0.65rem; font-weight: 800; color: ${map.compliance > 50 ? '#fff' : '#000'}; line-height: 18px;">${map.compliance}%</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <span class="status-badge ${map.riskScore > 70 ? 'status-high' : map.riskScore > 30 ? 'status-medium' : 'status-low'}">
                                            ${map.riskScore}/100
                                        </span>
                                    </td>
                                    <td>
                                        <div style="display: flex; align-items: center; gap: 5px; font-weight: 700; font-size: 0.75rem; color: ${map.evidence === 'Validated' ? 'var(--success-green)' : 'var(--risk-high)'};">
                                            <i class="fas fa-${map.evidence === 'Validated' ? 'check-circle' : 'hourglass-half'}"></i>
                                            ${map.evidence.toUpperCase()}
                                        </div>
                                    </td>
                                    <td style="max-width: 180px;">
                                        <div style="font-size: 0.7rem; font-style: italic; color: var(--text-muted); border-left: 2px solid var(--accent-teal); padding-left: 8px;">
                                            ${map.riskScore > 50 ? 'Immediate evidence submission required to avoid breach.' : 'Process tracking normally. No intervention needed.'}
                                        </div>
                                    </td>
                                    <td>
                                        <button class="btn" style="padding: 4px 8px;" onclick="app.navigateTo('mapDetail', {id: '${map.dbId}'})"><i class="fas fa-eye"></i></button>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    },
    exportAllMaps() {
        window.location = '/api/maps/export/all';
    },
    init() {
        // No charts to render
    }
};
