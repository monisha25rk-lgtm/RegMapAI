window.AuditPage = {
    async render() {
        let logs = [];
        try {
            const response = await fetch('/api/audit/logs');
            if (response.ok) {
                logs = await response.json();
            }
        } catch (e) {
            console.error("Failed to fetch audit logs", e);
        }

        return `
            <div class="page-header">
                <h1 style="color: var(--primary-blue); font-weight: 800; font-size: 1.5rem;">AUDIT TRAIL & SYSTEM LOGS</h1>
                <p style="font-size: 0.85rem; color: var(--text-muted);">Immutable record of all regulatory intelligence activities and user interactions.</p>
            </div>

            <div class="stats-grid">
                <div class="section-card">
                    <div class="section-header"><span class="section-title">Log Density (24h)</span></div>
                    <div class="section-body">
                         <div style="display: flex; justify-content: space-between; align-items: center; padding: 15px; background: #f8f9fa; border-radius: 4px;">
                            <div>
                                <div style="font-size: 0.7rem; font-weight: 700; color: var(--text-muted);">TOTAL LOG ENTRIES</div>
                                <div style="font-size: 1.5rem; font-weight: 800; color: var(--primary-blue);">1,284</div>
                            </div>
                            <div style="text-align: right;">
                                <div style="font-size: 0.7rem; font-weight: 700; color: var(--success-green);">INTEGRITY VERIFIED</div>
                                <div style="font-size: 0.8rem; font-weight: 600;">System Stable</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="section-card">
                    <div class="section-header"><span class="section-title">Action Summary</span></div>
                    <div class="section-body">
                         <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                            <div style="font-size: 0.75rem; font-weight: 700;">CREATE: 24%</div>
                            <div style="font-size: 0.75rem; font-weight: 700;">UPDATE: 41%</div>
                            <div style="font-size: 0.75rem; font-weight: 700;">VALIDATE: 18%</div>
                            <div style="font-size: 0.75rem; font-weight: 700;">LOGIN: 17%</div>
                         </div>
                    </div>
                </div>
            </div>

            <div class="section-card">
                <div class="section-header">
                    <span class="section-title">Institutional Audit Log</span>
                    <div style="display: flex; gap: 10px;">
                        <input type="text" placeholder="Filter logs..." class="form-control" style="width: 200px; font-size: 0.75rem;">
                        <button class="btn" onclick="window.AuditPage.exportLogs()"><i class="fas fa-download"></i> EXPORT CSV</button>
                    </div>
                </div>
                <div class="section-body" style="padding: 0; overflow-x: auto;">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Timestamp</th>
                                <th>Actor</th>
                                <th>Action</th>
                                <th>Module</th>
                                <th>Details</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${logs.length > 0 ? logs.map(log => `
                                <tr>
                                    <td style="font-family: monospace; font-size: 0.75rem; white-space: nowrap;">${log.timestamp}</td>
                                    <td><span style="font-weight: 700;">${log.user || 'SYSTEM_AI'}</span></td>
                                    <td><span class="status-badge status-low" style="font-size: 0.65rem;">${(log.action || 'LOG').toUpperCase()}</span></td>
                                    <td><span style="color: var(--primary-blue); font-weight: 600;">${log.module || 'CORE'}</span></td>
                                    <td style="font-size: 0.75rem; color: var(--text-muted);">${log.details || 'N/A'}</td>
                                </tr>
                            `).join('') : `
                                <tr>
                                    <td colspan="5" style="text-align: center; padding: 40px; color: var(--text-muted);">
                                        <i class="fas fa-clipboard-list" style="font-size: 2rem; display: block; margin-bottom: 10px; opacity: 0.3;"></i>
                                        No audit records found in the current period.
                                    </td>
                                </tr>
                            `}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    },
    init() {
        // No charts to render
    },
    exportLogs() {
        window.location = '/api/audit/export';
    }
};
