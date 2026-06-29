window.WorkspacePage = {
    async render(circularId) {
        if (typeof circularId === 'object' && circularId !== null) {
            circularId = circularId.circularId || circularId.id;
        }
        let maps = [];
        let conflicts = [];
        let circularTitle = "Loading...";
        let circularStatus = "Processing";
        let docPreview = "No preview available yet. The uploaded document will appear here once the text extraction is complete.";

        if (!circularId && window.location.hash.includes('workspace')) {
            const hash = window.location.hash.replace('#', '');
            const [, query] = hash.split('?');
            if (query) {
                query.split('&').forEach(pair => {
                    const [key, value] = pair.split('=');
                    if ((key === 'circularId' || key === 'id') && value) {
                        circularId = parseInt(decodeURIComponent(value), 10) || circularId;
                    }
                });
            } else {
                const parts = window.location.hash.split('=');
                if (parts.length > 1) {
                    circularId = parseInt(parts[1], 10) || circularId;
                }
            }
        }

        if (circularId) {
            try {
                const response = await fetch(`/api/workspace/maps/${circularId}`);
                if (response.ok) {
                    const dbMaps = await response.json();
                    maps = dbMaps.map(m => ({
                        id: `MAP-${m.id}`,
                        dbId: m.id,
                        requirement: m.title,
                        priority: m.priority,
                        dept: m.department,
                        owner: m.owner,
                        status: m.status,
                        deadline: m.deadline,
                        compliance: m.compliance_score || 0,
                        riskScore: m.risk_score || 0,
                        reason: m.risk_reason || "AI generated from database records."
                    }));
                }

                const conflictRes = await fetch(`/api/conflicts/${circularId}`);
                if (conflictRes.ok) {
                    conflicts = await conflictRes.json();
                }

                const circRes = await fetch(`/api/circulars/${circularId}`);
                if (circRes.ok) {
                    const circData = await circRes.json();
                    circularTitle = circData.title;
                    circularStatus = circData.authenticity_status || 'Uploaded';
                    docPreview = circData.text_content && circData.text_content.length > 0
                        ? circData.text_content.replace(/\s+/g, ' ').trim().slice(0, 1500) + '...'
                        : docPreview;
                }
            } catch (e) {
                console.error("Failed to fetch workspace maps", e);
            }
        }

        return `
            <div class="page-header" style="margin-bottom: 15px;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <h1 style="color: var(--primary-blue); font-weight: 800; font-size: 1.5rem;">REGULATORY MAP WORKSPACE</h1>
                        <p style="font-size: 0.85rem; color: var(--text-muted);">Split-screen intelligence environment for circular analysis and MAP generation.</p>
                    </div>
                    <div style="display: flex; gap: 10px;">
                        <button class="btn" onclick="window.WorkspacePage.exportMaps(${circularId || 0})"><i class="fas fa-file-export"></i> EXPORT MAPS</button>
                        <button class="btn btn-action" onclick="window.WorkspacePage.createManualMap(${circularId || 0})"><i class="fas fa-plus"></i> NEW MANUAL MAP</button>
                    </div>
                </div>
            </div>

            <div class="split-workspace">
                <!-- Left Pane: Original Circular -->
                <div class="workspace-pane" style="border-right: 2px solid var(--border-gray); background: #f8f9fa;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                        <span style="font-weight: 800; font-size: 0.75rem; text-transform: uppercase; color: var(--secondary-blue);">ORIGINAL INSTRUMENT: ${circularTitle}</span>
                        <div class="status-badge ${circularStatus === 'Processed' ? 'status-low' : circularStatus.includes('Failed') || circularStatus === 'Error' ? 'status-high' : 'status-medium'}">${circularStatus}</div>
                    </div>
                    <div style="background: #fff; padding: 30px; box-shadow: var(--shadow-sm); border: 1px solid var(--border-gray); font-family: 'Times New Roman', Times, serif; line-height: 1.6; color: #000;">
                        <div style="margin-bottom: 20px; font-size: 0.85rem; color: var(--text-muted);">
                            ${docPreview.split(' ').slice(0, 30).join(' ')}
                        </div>
                        <pre style="white-space: pre-wrap; font-family: inherit; font-size: 0.86rem; color: #333;">${docPreview}</pre>
                        <div style="text-align: center; margin-top: 30px;">
                            <h2 style="font-size: 1.2rem; font-weight: bold;">RESERVE BANK OF INDIA</h2>
                            <p style="font-size: 0.9rem;">www.rbi.org.in</p>
                        </div>
                        <p style="margin-bottom: 20px;">RBI/2023-24/107<br>DoS.CO.PPG./SEC.7/11.01.005/2023-24</p>
                        <p style="margin-bottom: 20px; font-weight: bold;">November 07, 2023</p>
                        <p style="margin-bottom: 20px;">The Chairman/ Managing Director/ Chief Executive Officer<br>All Scheduled Commercial Banks (excluding RRBs)</p>
                        <h3 style="text-align: center; margin-bottom: 25px; text-decoration: underline;">Master Direction on IT Governance, Risk, Controls and Assurance</h3>
                        <p style="margin-bottom: 15px;">1. Introduction: As the banking landscape becomes increasingly digital, the resilience of Information Technology (IT) systems is paramount...</p>
                        <div style="background: #fffbe6; padding: 10px; border: 1px dashed #d48806; margin-bottom: 15px;">
                            <p style="font-size: 0.85rem; font-style: italic;"><strong>AI Highlight (Para 4.2):</strong> "Banks shall implement a robust Multi-Factor Authentication (MFA) framework for all internal and external access to critical systems by April 1, 2024."</p>
                        </div>
                        <p style="margin-bottom: 15px;">2. Governance Framework: The Board of Directors shall be responsible for the overall IT strategy and governance...</p>
                        <p style="margin-bottom: 15px;">4.2 Multi-Factor Authentication: Implementation of MFA is mandatory for all privileged accounts and remote access...</p>
                    </div>
                </div>

                <!-- Right Pane: Generated MAPs -->
                <div class="workspace-pane">
                    <div style="margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center;">
                        <span style="font-weight: 800; font-size: 0.75rem; text-transform: uppercase; color: var(--secondary-blue);">GENERATED MANAGEMENT ACTION PLANS (MAPS)</span>
                        ${conflicts.length > 0 ? `
                            <div class="status-badge status-high" style="cursor: pointer; font-size: 0.7rem;" onclick="window.WorkspacePage.showConflictResolution()">
                                <i class="fas fa-exclamation-triangle"></i> ${conflicts.length} REDUNDANCY ALERTS
                            </div>
                        ` : ''}
                    </div>

                    <div id="conflict-resolution-overlay" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 1000; justify-content: center; align-items: center;">
                        <div class="section-card" style="width: 80%; max-width: 800px; max-height: 80%; overflow-y: auto; position: relative; padding: 30px;">
                            <button class="btn btn-outline" style="position: absolute; top: 15px; right: 15px; padding: 5px 10px;" onclick="document.getElementById('conflict-resolution-overlay').style.display='none'"><i class="fas fa-times"></i></button>
                            <h2 style="color: var(--risk-high); margin-bottom: 20px;"><i class="fas fa-shield-alt"></i> Conflict Resolution Center</h2>
                            <p style="color: var(--text-muted); margin-bottom: 20px;">AI has detected potential redundancies or resource overloads in this circular. Resolve them to optimize your compliance workflow.</p>

                            <table class="data-table">
                                <thead>
                                    <tr>
                                        <th>Type</th>
                                        <th>Description</th>
                                        <th>Severity</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${conflicts.map(c => `
                                        <tr>
                                            <td><span class="status-badge ${c.severity === 'High' ? 'status-high' : 'status-medium'}">${c.type}</span></td>
                                            <td style="font-size: 0.85rem;">${c.description}</td>
                                            <td><strong>${c.severity}</strong></td>
                                            <td>
                                                <button class="btn btn-action" style="padding: 5px 10px; font-size: 0.7rem;" onclick="alert('Resolving conflict: ${c.type}. Strategy: Merge requirements and re-assign tasks.'); document.getElementById('conflict-resolution-overlay').style.display='none';">RESOLVE</button>
                                            </td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                            <div style="margin-top: 25px; text-align: right;">
                                <button class="btn btn-success" onclick="alert('All conflicts resolved. Optimized MAPs generated.'); document.getElementById('conflict-resolution-overlay').style.display='none';">RESOLVE ALL & OPTIMIZE</button>
                            </div>
                        </div>
                    </div>

                    ${maps.map(map => `
                        <div class="section-card" style="margin-bottom: 15px; border-left: 4px solid ${map.priority === 'Critical' ? 'var(--risk-high)' : 'var(--primary-blue)'};">
                            <div class="section-body" style="padding: 15px;">
                                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px;">
                                    <div>
                                        <span style="font-size: 0.7rem; font-weight: 800; color: var(--text-muted);">${map.id}</span>
                                        <h3 style="font-size: 0.95rem; font-weight: 700; color: var(--primary-blue); margin: 2px 0;">${map.requirement}</h3>
                                    </div>
                                    <span class="status-badge ${map.priority === 'Critical' ? 'status-high' : 'status-medium'}" style="font-size: 0.6rem;">${map.priority}</span>
                                </div>

                                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 15px;">
                                    <div style="font-size: 0.75rem;"><strong>Owner:</strong> ${map.owner || 'Auto-assigned'}</div>
                                    <div style="font-size: 0.75rem;"><strong>Status:</strong> <span class="status-badge ${map.status === 'Completed' ? 'status-low' : (map.status === 'In Review' ? 'status-medium' : 'status-pending')}">${map.status || 'Assigned'}</span></div>
                                    <div style="font-size: 0.75rem;"><strong>Dept:</strong> ${map.dept}</div>
                                    <div style="font-size: 0.75rem;"><strong>Deadline:</strong> ${map.deadline}</div>
                                    <div style="font-size: 0.75rem;"><strong>Compliance:</strong> ${map.compliance}%</div>
                                    <div style="font-size: 0.75rem;"><strong>Risk Score:</strong> <span style="color: ${map.riskScore > 70 ? 'var(--risk-high)' : 'inherit'}; font-weight: 700;">${map.riskScore}/100</span></div>
                                </div>

                                <div style="background: #f0f5ff; padding: 10px; border-radius: 4px; margin-bottom: 10px;">
                                    <div style="font-size: 0.7rem; font-weight: 800; color: var(--primary-blue); margin-bottom: 4px;"><i class="fas fa-robot"></i> AI REASONING SUMMARY</div>
                                    <p style="font-size: 0.75rem; color: #444; line-height: 1.3;">${map.reason}</p>
                                </div>

                                <div style="display: flex; gap: 10px; justify-content: flex-end;">
                                    <button class="btn" style="font-size: 0.7rem;" onclick="app.navigateTo('mapDetail', {id: '${map.dbId}'})">VIEW DETAILS</button>
                                    <button class="btn btn-action" style="font-size: 0.7rem;" onclick="window.WorkspacePage.assignOwner(${map.dbId})">ASSIGN OWNER</button>
                                </div>
                            </div>
                        </div>
                    `).join('')}

                        <div style="padding: 20px; border: 2px dashed #eee; text-align: center; border-radius: 4px;">
                        <p style="font-size: 0.8rem; color: var(--text-muted);">AI is processing 4 more potential MAPs from this circular...</p>
                        <div class="spinner" style="width: 20px; height: 20px; margin: 10px auto;"></div>
                    </div>
                </div>
            </div>
        `;
    },
    init() {
        // Workspace initialized
    },

    showConflictResolution() {
        document.getElementById('conflict-resolution-overlay').style.display = 'flex';
    },

    async exportMaps(circularId) {
        if (!circularId) return alert('Circular ID is required to export maps.');
        window.location = `/api/circulars/${circularId}/export`;
    },

    async createManualMap(circularId) {
        if (!circularId) return alert('Circular ID is required.');
        const title = prompt('Enter manual map title:');
        if (!title) return;
        const description = prompt('Enter manual map description:');
        if (!description) return;

        const payload = {
            circular_id: circularId,
            title,
            description,
            department: 'Compliance',
            priority: 'Medium',
            risk_score: 45,
            compliance_score: 10,
            risk_reason: 'Manual map created by user.'
        };

        try {
            const response = await fetch('/api/maps/manual', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });
            if (response.ok) {
                alert('Manual MAP created successfully.');
                app.navigateTo('workspace', {circularId});
            } else {
                const err = await response.json();
                alert('Failed to create manual MAP: ' + (err.error || 'Unknown error'));
            }
        } catch (e) {
            console.error('Manual MAP error', e);
            alert('Manual MAP creation failed.');
        }
    },

    async assignOwner(mapId) {
        const owner = prompt('Enter owner name for this MAP:');
        if (!owner) return;
        try {
            const response = await fetch(`/api/maps/${mapId}/assign`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ owner, status: 'Assigned' })
            });
            if (response.ok) {
                alert('Owner assigned successfully.');
                let circularId = 0;
                const hash = window.location.hash.replace('#', '');
                const [path, query] = hash.split('?');
                if (query) {
                    query.split('&').forEach(pair => {
                        const [key, value] = pair.split('=');
                        if ((key === 'circularId' || key === 'id') && value) {
                            circularId = decodeURIComponent(value);
                        }
                    });
                }
                app.navigateTo('workspace', {circularId});
            } else {
                const err = await response.json();
                alert('Assignment failed: ' + (err.error || 'Unknown error'));
            }
        } catch (e) {
            console.error('Owner assignment error', e);
            alert('Owner assignment failed.');
        }
    }
};
