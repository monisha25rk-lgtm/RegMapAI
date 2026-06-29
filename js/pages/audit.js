const AuditPage = {
    async render() {
        return `
            <div class="page-header">
                <h1>Audit Trail Center</h1>
                <p>Comprehensive logs of all actions and changes within the platform.</p>
            </div>

            <div class="section-card">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; gap: 15px; flex-wrap: wrap;">
                    <div style="flex: 1; min-width: 250px;">
                        <input type="text" placeholder="Search logs..." style="width: 100%; padding: 10px; border-radius: 6px; border: 1px solid var(--border-color);">
                    </div>
                    <div style="display: flex; gap: 10px;">
                        <input type="date" style="padding: 10px; border-radius: 6px; border: 1px solid var(--border-color);">
                        <select style="padding: 10px; border-radius: 6px; border: 1px solid var(--border-color); background: white;">
                            <option>All Modules</option>
                            <option>Upload Center</option>
                            <option>MAP Workspace</option>
                            <option>Evidence Center</option>
                        </select>
                        <button class="btn btn-outline"><i class="fas fa-download"></i> Export</button>
                    </div>
                </div>

                <div class="table-responsive">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Timestamp</th>
                                <th>User</th>
                                <th>Action</th>
                                <th>Module</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${mockData.auditTrail.map(log => `
                                <tr>
                                    <td style="font-family: monospace; font-size: 0.85rem;">${log.timestamp}</td>
                                    <td>
                                        <div style="display: flex; align-items: center; gap: 8px;">
                                            <img src="https://ui-avatars.com/api/?name=${log.user}&size=24&background=random" class="avatar" style="width: 24px; height: 24px;">
                                            <span>${log.user}</span>
                                        </div>
                                    </td>
                                    <td>${log.action}</td>
                                    <td><span style="color: var(--text-muted); font-size: 0.85rem;">${log.module}</span></td>
                                    <td><span class="status-badge status-low">${log.status}</span></td>
                                </tr>
                            `).join('')}
                            <!-- Additional dummy rows for visual completeness -->
                            <tr>
                                <td style="font-family: monospace; font-size: 0.85rem;">2023-10-25 09:15:00</td>
                                <td>
                                    <div style="display: flex; align-items: center; gap: 8px;">
                                        <img src="https://ui-avatars.com/api/?name=System&size=24" class="avatar" style="width: 24px; height: 24px;">
                                        <span>System</span>
                                    </div>
                                </td>
                                <td>Daily Risk Prediction Updated</td>
                                <td><span style="color: var(--text-muted); font-size: 0.85rem;">Risk Center</span></td>
                                <td><span class="status-badge status-low">Success</span></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    },

    init() {
        console.log('Audit Center initialized');
    }
};
