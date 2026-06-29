window.DeptOpsPage = {
    async render() {
        const departments = [
            { id: 'it', name: 'Information Technology', head: 'Rajesh Kumar', maps: 42, compliance: 68, risk: 'High', pending: 12, deadline: '15 Dec 2023' },
            { id: 'comp', name: 'Compliance & Legal', head: 'Sarah D\'Souza', maps: 28, compliance: 92, risk: 'Low', pending: 3, deadline: '30 Nov 2023' },
            { id: 'risk', name: 'Risk Management', head: 'Michael Chen', maps: 15, compliance: 95, risk: 'Low', pending: 1, deadline: '10 Dec 2023' },
            { id: 'ops', name: 'Operations', head: 'Ananya Rao', maps: 35, compliance: 76, risk: 'Medium', pending: 8, deadline: '05 Dec 2023' }
        ];

        return `
            <div class="page-header">
                <h1 style="color: var(--primary-blue); font-weight: 800; font-size: 1.5rem;">DEPARTMENT OPERATIONS CENTER</h1>
                <p style="font-size: 0.85rem; color: var(--text-muted);">Operational oversight and resource allocation for regulatory task execution.</p>
            </div>

            <div class="dept-grid">
                ${departments.map(dept => `
                    <div class="section-card" style="border-top: 3px solid ${dept.risk === 'High' ? 'var(--risk-high)' : dept.risk === 'Medium' ? 'var(--warning-yellow)' : 'var(--success-green)'};">
                        <div class="section-body">
                            <div style="font-size: 0.7rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">${dept.name}</div>
                            <div style="font-size: 1.2rem; font-weight: 800; color: var(--primary-blue); margin: 5px 0;">${dept.compliance}%</div>
                            <div style="display: flex; justify-content: space-between; font-size: 0.75rem; margin-top: 10px;">
                                <span>Active MAPs:</span>
                                <span style="font-weight: 700;">${dept.maps}</span>
                            </div>
                            <div style="display: flex; justify-content: space-between; font-size: 0.75rem; margin-top: 5px;">
                                <span>Pending Evidence:</span>
                                <span style="font-weight: 700; color: ${dept.pending > 5 ? 'var(--risk-high)' : 'inherit'};">${dept.pending}</span>
                            </div>
                            <div style="margin-top: 15px; padding-top: 10px; border-top: 1px solid #eee;">
                                <div style="font-size: 0.65rem; color: var(--text-muted);">DEPARTMENT HEAD</div>
                                <div style="font-size: 0.8rem; font-weight: 700;">${dept.head}</div>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>

            <div class="dashboard-grid">
                <div class="section-card">
                    <div class="section-header">
                        <span class="section-title">Departmental Risk Distribution Summary</span>
                    </div>
                    <div class="section-body" style="overflow-x: auto;">
                         <table class="data-table">
                            <thead>
                                <tr>
                                    <th>Department</th>
                                    <th>Risk Rating</th>
                                    <th>Exposure Score</th>
                                    <th>Resource Delta</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td style="font-weight: 700;">Information Technology</td>
                                    <td><span class="status-badge status-high">CRITICAL</span></td>
                                    <td>8.5/10</td>
                                    <td style="color: var(--risk-high); font-weight: 700;">-4 FTE</td>
                                </tr>
                                <tr>
                                    <td style="font-weight: 700;">Compliance & Legal</td>
                                    <td><span class="status-badge status-low">STABLE</span></td>
                                    <td>4.0/10</td>
                                    <td style="color: var(--success-green); font-weight: 700;">OPTIMAL</td>
                                </tr>
                                <tr>
                                    <td style="font-weight: 700;">Risk Management</td>
                                    <td><span class="status-badge status-low">STABLE</span></td>
                                    <td>2.0/10</td>
                                    <td style="color: var(--success-green); font-weight: 700;">OPTIMAL</td>
                                </tr>
                                <tr>
                                    <td style="font-weight: 700;">Operations</td>
                                    <td><span class="status-badge status-medium">OBSERVATION</span></td>
                                    <td>6.5/10</td>
                                    <td style="color: var(--warning-yellow); font-weight: 700;">-2 FTE</td>
                                </tr>
                            </tbody>
                         </table>
                    </div>
                </div>

                <div class="section-card">
                    <div class="section-header">
                        <span class="section-title">Task Aging Report</span>
                    </div>
                    <div class="section-body">
                         <div style="padding: 10px;">
                            <div style="margin-bottom: 15px;">
                                <div style="font-size: 0.7rem; color: var(--text-muted); font-weight: 700;">0-7 DAYS (ON SCHEDULE)</div>
                                <div style="font-size: 1.2rem; font-weight: 800;">45 Tasks</div>
                                <div style="height: 4px; background: var(--success-green); border-radius: 2px; width: 100%;"></div>
                            </div>
                            <div style="margin-bottom: 15px;">
                                <div style="font-size: 0.7rem; color: var(--text-muted); font-weight: 700;">8-15 DAYS (AT RISK)</div>
                                <div style="font-size: 1.2rem; font-weight: 800;">30 Tasks</div>
                                <div style="height: 4px; background: var(--warning-yellow); border-radius: 2px; width: 66%;"></div>
                            </div>
                            <div style="margin-bottom: 15px;">
                                <div style="font-size: 0.7rem; color: var(--text-muted); font-weight: 700;">16-30 DAYS (LATE)</div>
                                <div style="font-size: 1.2rem; font-weight: 800;">15 Tasks</div>
                                <div style="height: 4px; background: var(--risk-high); border-radius: 2px; width: 33%;"></div>
                            </div>
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
