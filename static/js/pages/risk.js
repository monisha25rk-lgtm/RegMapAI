window.RiskPage = {
    async render() {
        let maps = mockData.maps;
        let distribution = { Critical: 15, High: 25, Medium: 40, Low: 20 };
        let avgRiskIndex = 6.8;
        let breachForecast = "12%";

        try {
            const response = await fetch('/api/risk/stats');
            if (response.ok) {
                const data = await response.json();
                if (data.highRiskMaps && data.highRiskMaps.length > 0) {
                    maps = data.highRiskMaps.map(m => ({
                        id: `MAP-${m.id}`,
                        dept: m.department,
                        riskScore: m.risk_score,
                        deadline: m.deadline
                    }));
                }
                distribution = data.distribution || distribution;
                avgRiskIndex = data.avgRiskIndex || avgRiskIndex;
                breachForecast = data.breachForecast || breachForecast;
            }
        } catch (e) {
            console.error("Failed to fetch risk stats", e);
        }

        const totalDist = Object.values(distribution).reduce((a, b) => a + b, 0) || 1;

        return `
            <div class="page-header">
                <div style="display: flex; justify-content: space-between; align-items: flex-end;">
                    <div>
                        <h1 style="color: var(--primary-blue); font-weight: 800; font-size: 1.5rem;">RISK INTELLIGENCE COMMAND</h1>
                        <p style="font-size: 0.85rem; color: var(--text-muted);">Predictive risk modeling and regulatory exposure forecasting.</p>
                    </div>
                    <div style="display: flex; gap: 15px;">
                        <div class="metric-widget" style="border-left-color: var(--risk-high);">
                            <div class="metric-label">Avg. Risk Index</div>
                            <div class="metric-value">${avgRiskIndex}</div>
                        </div>
                        <div class="metric-widget" style="border-left-color: var(--risk-critical);">
                            <div class="metric-label">Breach Forecast</div>
                            <div class="metric-value">${breachForecast}</div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="stats-grid" style="grid-template-columns: 400px 1fr;">
                <div class="section-card">
                    <div class="section-header">
                        <span class="section-title">Institutional Risk Summary</span>
                    </div>
                    <div class="section-body">
                        <div style="display: flex; flex-direction: column; gap: 15px;">
                            <div style="padding: 12px; border: 1px solid #eee; border-radius: 4px;">
                                <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                                    <span style="font-weight: 700; font-size: 0.75rem;">CRITICAL EXPOSURE</span>
                                    <span style="color: var(--risk-high); font-weight: 800;">12%</span>
                                </div>
                                <div style="height: 6px; background: #eee; border-radius: 3px;">
                                    <div style="width: 12%; height: 100%; background: var(--risk-high); border-radius: 3px;"></div>
                                </div>
                            </div>
                            <div style="padding: 12px; border: 1px solid #eee; border-radius: 4px;">
                                <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                                    <span style="font-weight: 700; font-size: 0.75rem;">REGULATORY ADHERENCE</span>
                                    <span style="color: var(--success-green); font-weight: 800;">88%</span>
                                </div>
                                <div style="height: 6px; background: #eee; border-radius: 3px;">
                                    <div style="width: 88%; height: 100%; background: var(--success-green); border-radius: 3px;"></div>
                                </div>
                            </div>
                            <div style="padding: 12px; border: 1px solid #eee; border-radius: 4px;">
                                <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                                    <span style="font-weight: 700; font-size: 0.75rem;">PENDING ACTIONS</span>
                                    <span style="color: var(--warning-yellow); font-weight: 800;">34</span>
                                </div>
                                <div style="height: 6px; background: #eee; border-radius: 3px;">
                                    <div style="width: 34%; height: 100%; background: var(--warning-yellow); border-radius: 3px;"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Top High Risk MAPs -->
                <div class="section-card">
                    <div class="section-header">
                        <span class="section-title">Top High Risk Exposure MAPs</span>
                    </div>
                    <div class="section-body" style="padding: 0; overflow-x: auto;">
                        <table class="data-table">
                            <thead>
                                <tr>
                                    <th>MAP ID</th>
                                    <th>Risk Driver</th>
                                    <th>Prediction</th>
                                    <th>Confidence</th>
                                    <th>Recommended Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${maps.map(map => `
                                    <tr>
                                        <td><strong>${map.id}</strong></td>
                                        <td style="font-size: 0.75rem;">
                                            <div style="font-weight: 700;">Deadline Proximity</div>
                                            <div style="color: var(--text-muted);">${map.dept} Resource Gap</div>
                                        </td>
                                        <td>
                                            <span style="color: var(--risk-high); font-weight: 700;">Likely Breach</span>
                                            <div style="font-size: 0.7rem;">Est. Delay: 4.2 Days</div>
                                        </td>
                                        <td>
                                            <div style="font-weight: 700;">${map.riskScore}%</div>
                                            <div style="width: 50px; height: 4px; background: #eee; border-radius: 2px;">
                                                <div style="width: ${map.riskScore}%; height: 100%; background: var(--primary-blue);"></div>
                                            </div>
                                        </td>
                                        <td>
                                            <button class="btn btn-action" style="padding: 4px 10px; font-size: 0.7rem;" onclick="RiskPage.reallocateStaff('${map.id}')">REALLOCATE STAFF</button>
                                        </td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <div class="stats-grid">
                <div class="section-card">
                    <div class="section-header">
                        <span class="section-title">Risk Forecasting & Drivers</span>
                    </div>
                    <div class="section-body">
                        <div style="padding: 15px; background: #f0f5ff; border-left: 4px solid var(--primary-blue); margin-bottom: 15px;">
                            <h4 style="font-size: 0.8rem; margin-bottom: 5px;">Primary Risk Driver: Resource Overload</h4>
                            <p style="font-size: 0.75rem; color: #444;">AI analysis of task velocity in the IT department indicates a mismatch between assigned MAPs and available head-count. 3 concurrent circulars are driving this bottleneck.</p>
                        </div>
                        <div style="padding: 15px; background: #fffbe6; border-left: 4px solid var(--warning-yellow);">
                            <h4 style="font-size: 0.8rem; margin-bottom: 5px;">Secondary Driver: Evidence Latency</h4>
                            <p style="font-size: 0.75rem; color: #444;">Average time to upload evidence has increased by 18% in the last 30 days, primarily in Retail Operations.</p>
                        </div>
                    </div>
                </div>

                <div class="section-card">
                    <div class="section-header">
                        <span class="section-title">Institutional Exposure (Financial Forecast)</span>
                    </div>
                    <div class="section-body">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                            <div class="metric-label">Estimated Potential Penalties</div>
                            <div style="font-size: 1.5rem; font-weight: 800; color: var(--risk-critical);">$2.4M</div>
                        </div>
                        <div style="font-size: 0.75rem; color: var(--text-muted); line-height: 1.4;">
                            Calculation based on:
                            <ul style="margin-top: 10px; padding-left: 20px;">
                                <li>4 Overdue RBI Master Direction clauses</li>
                                <li>12 Pending high-priority evidence submissions</li>
                                <li>Historical fine patterns for Tier-1 Banks (2021-2023)</li>
                            </ul>
                        </div>
                        <button class="btn" style="width: 100%; margin-top: 20px;">GENERATE DETAILED RISK EXPOSURE REPORT</button>
                    </div>
                </div>
            </div>
        `;
    },
    async reallocateStaff(mapId) {
        const id = mapId.replace('MAP-', '');
        try {
            const response = await fetch(`/api/maps/${id}/reassign`, { method: 'POST' });
            if (response.ok) {
                const data = await response.json();
                alert(`Staff reallocated! New owner: ${data.owner}`);
                app.renderPage('risk');
            } else {
                alert("Failed to reallocate staff.");
            }
        } catch (e) {
            console.error("Error reallocating staff", e);
        }
    },
    init() {
        // No charts to render
    }
};
