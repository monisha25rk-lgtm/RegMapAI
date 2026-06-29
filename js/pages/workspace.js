const WorkspacePage = {
    async render() {
        return `
            <div class="page-header">
                <h1>MAP Workspace</h1>
                <p>Manage and track Regulatory Management Action Plans (MAPs) across departments.</p>
            </div>

            <div class="section-card">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; gap: 15px; flex-wrap: wrap;">
                    <div style="flex: 1; min-width: 300px; position: relative;">
                        <i class="fas fa-search" style="position: absolute; left: 15px; top: 12px; color: var(--text-muted);"></i>
                        <input type="text" placeholder="Search MAPs by ID, Requirement, or Owner..." style="width: 100%; padding: 10px 10px 10px 40px; border-radius: 6px; border: 1px solid var(--border-color);">
                    </div>
                    <div style="display: flex; gap: 10px;">
                        <select style="padding: 10px; border-radius: 6px; border: 1px solid var(--border-color); background: white;">
                            <option>All Departments</option>
                            <option>IT</option>
                            <option>Operations</option>
                            <option>Finance</option>
                        </select>
                        <select style="padding: 10px; border-radius: 6px; border: 1px solid var(--border-color); background: white;">
                            <option>All Statuses</option>
                            <option>Completed</option>
                            <option>In Progress</option>
                            <option>Delayed</option>
                        </select>
                    </div>
                </div>

                <div class="table-responsive">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>MAP ID</th>
                                <th>Requirement</th>
                                <th>Dept / Owner</th>
                                <th>Deadline</th>
                                <th>Compliance</th>
                                <th>Risk</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${mockData.maps.map(map => `
                                <tr>
                                    <td><strong>${map.id}</strong></td>
                                    <td style="max-width: 300px;">${map.requirement}</td>
                                    <td>
                                        <div style="font-weight: 600;">${map.department}</div>
                                        <div style="font-size: 0.8rem; color: var(--text-muted);">${map.owner}</div>
                                    </td>
                                    <td>${map.deadline}</td>
                                    <td>
                                        <div style="display: flex; align-items: center; gap: 8px;">
                                            <div style="flex: 1; min-width: 60px; height: 6px; background: #eee; border-radius: 3px; overflow: hidden;">
                                                <div style="width: ${map.compliance}%; height: 100%; background: var(--primary-blue);"></div>
                                            </div>
                                            <span style="font-size: 0.8rem; font-weight: 600;">${map.compliance}%</span>
                                        </div>
                                    </td>
                                    <td><span class="status-badge ${this.getRiskClass(map.risk)}">${map.risk}</span></td>
                                    <td><span style="font-weight: 600; font-size: 0.85rem;">${map.status}</span></td>
                                    <td><button class="btn btn-outline" style="padding: 5px 10px; font-size: 0.8rem;">Details</button></td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>

            <div id="map-empty-state" class="hidden" style="text-align: center; padding: 100px 0;">
                <i class="fas fa-tasks" style="font-size: 4rem; color: #eee; margin-bottom: 20px;"></i>
                <h3>No MAPs Available</h3>
                <p style="color: var(--text-muted);">Upload a circular to generate management action plans.</p>
            </div>
        `;
    },

    init() {
        console.log('Workspace initialized');
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
