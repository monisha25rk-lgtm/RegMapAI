window.AICommandPage = {
    async render() {
        let alerts = [
            { type: 'risk', title: 'Critical: Regulatory Breach Forecast', message: 'High probability of missing RBI hard deadlines in IT department.' }
        ];
        let predictedBreaches = [];
        let deptRisks = [
            { department: 'IT Infrastructure', risk_index: 8.4 },
            { department: 'Retail Banking', risk_index: 5.2 },
            { department: 'Risk Management', risk_index: 1.8 }
        ];

        try {
            const response = await fetch('/api/ai/command-center');
            if (response.ok) {
                const data = await response.json();
                alerts = data.alerts || alerts;
                predictedBreaches = data.predictedBreaches || [];
                if (data.deptRisks && data.deptRisks.length > 0) {
                    deptRisks = data.deptRisks;
                }
            }
        } catch (e) {
            console.error("Failed to fetch AI Command data", e);
        }

        return `
            <div class="page-header">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <h1 style="color: var(--primary-blue); font-weight: 800; font-size: 1.5rem;">AI INTELLIGENCE COMMAND CENTER</h1>
                        <p style="font-size: 0.85rem; color: var(--text-muted);">Autonomous analysis of regulatory landscape and institutional compliance risk.</p>
                    </div>
                    <div class="status-badge status-low" style="padding: 8px 15px;">
                        <i class="fas fa-microchip" style="margin-right: 8px;"></i> AI ENGINE ACTIVE: V4.2.0
                    </div>
                </div>
            </div>

            <div style="display: grid; grid-template-columns: 1.5fr 1fr; gap: 20px;">
                <div style="display: flex; flex-direction: column; gap: 20px;">
                    <div class="section-card" style="border-top: 4px solid var(--primary-blue);">
                        <div class="section-header">
                            <span class="section-title">Institutional Risk Surface (AI Analysis)</span>
                        </div>
                        <div class="section-body">
                             <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px;">
                                <div style="background: #fff0f0; padding: 20px; border-radius: 4px; border-top: 3px solid var(--risk-high);">
                                    <div style="font-size: 0.7rem; color: #8b0000; font-weight: 800; margin-bottom: 5px;">REGULATORY EXPOSURE</div>
                                    <div style="font-size: 1.8rem; font-weight: 800; color: #8b0000;">HIGH</div>
                                    <div style="font-size: 0.7rem; color: #8b0000; margin-top: 5px;">Index: 7.2/10</div>
                                </div>
                                <div style="background: #f0faff; padding: 20px; border-radius: 4px; border-top: 3px solid var(--primary-blue);">
                                    <div style="font-size: 0.7rem; color: var(--primary-blue); font-weight: 800; margin-bottom: 5px;">MITIGATION RATE</div>
                                    <div style="font-size: 1.8rem; font-weight: 800; color: var(--primary-blue);">84%</div>
                                    <div style="font-size: 0.7rem; color: var(--primary-blue); margin-top: 5px;">+12% vs LY</div>
                                </div>
                                <div style="background: #f0fff0; padding: 20px; border-radius: 4px; border-top: 3px solid var(--success-green);">
                                    <div style="font-size: 0.7rem; color: var(--success-green); font-weight: 800; margin-bottom: 5px;">AI CONFIDENCE</div>
                                    <div style="font-size: 1.8rem; font-weight: 800; color: var(--success-green);">96%</div>
                                    <div style="font-size: 0.7rem; color: var(--success-green); margin-top: 5px;">Deep Analysis Active</div>
                                </div>
                             </div>
                        </div>
                    </div>

                    <div class="section-card">
                        <div class="section-header">
                            <span class="section-title">Department Risk Rankings</span>
                        </div>
                        <div class="section-body" style="padding: 0;">
                            <table class="data-table">
                                <thead>
                                    <tr>
                                        <th>Department</th>
                                        <th>Risk Index</th>
                                        <th>Exposure</th>
                                        <th>Remediation Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${deptRisks.map(dept => `
                                        <tr>
                                            <td><strong>${dept.department}</strong></td>
                                            <td><span style="color: ${dept.risk_index > 7 ? 'var(--risk-high)' : dept.risk_index > 4 ? 'var(--warning-yellow)' : 'var(--success-green)'}; font-weight: 800;">${parseFloat(dept.risk_index).toFixed(1)}/10</span></td>
                                            <td>$${(dept.risk_index * 0.5).toFixed(1)}M Est. Penalty</td>
                                            <td><span class="status-badge ${dept.risk_index > 7 ? 'status-high' : dept.risk_index > 4 ? 'status-medium' : 'status-low'}">${dept.risk_index > 7 ? 'CRITICAL GAPS' : dept.risk_index > 4 ? 'MONITORING' : 'OPTIMIZED'}</span></td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div style="display: flex; flex-direction: column; gap: 20px;">
                    <div class="section-card">
                        <div class="section-header">
                            <span class="section-title">Risk Probability Distribution</span>
                        </div>
                        <div class="section-body">
                            <div style="padding: 10px;">
                                <div style="margin-bottom: 12px;">
                                    <div style="display: flex; justify-content: space-between; font-size: 0.75rem; margin-bottom: 4px;">
                                        <span>OPERATIONAL</span>
                                        <span style="font-weight: 800;">65%</span>
                                    </div>
                                    <div style="height: 4px; background: #eee; border-radius: 2px;"><div style="width: 65%; height: 100%; background: var(--primary-blue);"></div></div>
                                </div>
                                <div style="margin-bottom: 12px;">
                                    <div style="display: flex; justify-content: space-between; font-size: 0.75rem; margin-bottom: 4px;">
                                        <span>LEGAL</span>
                                        <span style="font-weight: 800;">59%</span>
                                    </div>
                                    <div style="height: 4px; background: #eee; border-radius: 2px;"><div style="width: 59%; height: 100%; background: var(--primary-blue);"></div></div>
                                </div>
                                <div style="margin-bottom: 12px;">
                                    <div style="display: flex; justify-content: space-between; font-size: 0.75rem; margin-bottom: 4px;">
                                        <span>FINANCIAL</span>
                                        <span style="font-weight: 800;">90%</span>
                                    </div>
                                    <div style="height: 4px; background: #eee; border-radius: 2px;"><div style="width: 90%; height: 100%; background: var(--risk-high);"></div></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="section-card">
                        <div class="section-header">
                            <span class="section-title">High Priority MAPs (Predicted Breaches)</span>
                        </div>
                        <div class="section-body" style="padding: 10px;">
                            ${predictedBreaches.length > 0 ? predictedBreaches.map(map => `
                                <div style="padding: 10px; border-bottom: 1px solid #eee;">
                                    <div style="display: flex; justify-content: space-between; align-items: center;">
                                        <span style="font-weight: 800; font-size: 0.8rem;">MAP-${map.id}</span>
                                        <span class="status-badge status-high">HIGH RISK</span>
                                    </div>
                                    <div style="font-size: 0.75rem; margin-top: 5px;">${map.title}</div>
                                    <div style="font-size: 0.65rem; color: var(--risk-high); margin-top: 5px;">Deadline: ${map.deadline}</div>
                                </div>
                            `).join('') : '<p style="padding: 20px; text-align: center; color: var(--text-muted); font-size: 0.8rem;">No immediate breaches predicted.</p>'}
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
