window.MAPDetailPage = {
    async render(params) {
        let mapId = null;
        if (params) {
            mapId = typeof params === 'object' ? params.id || params.circularId : params;
        }
        if (!mapId && window.location.hash.includes('mapDetail')) {
            const hash = window.location.hash.replace('#', '');
            const [, query] = hash.split('?');
            if (query) {
                query.split('&').forEach(pair => {
                    const [key, value] = pair.split('=');
                    if ((key === 'id' || key === 'mapId') && value) {
                        mapId = decodeURIComponent(value);
                    }
                });
            } else {
                const parts = window.location.hash.split('=');
                if (parts.length > 1) {
                    mapId = decodeURIComponent(parts[1]);
                }
            }
        }

        if (!mapId && window.location.search) {
            new URLSearchParams(window.location.search).forEach((value, key) => {
                if (key === 'id' || key === 'mapId') {
                    mapId = value;
                }
            });
        }

        let map = null;
        let circularTitle = 'Uploaded Document';
        if (mapId) {
            try {
                console.log('Fetching MAP details for id:', mapId);
                const response = await fetch(`/api/maps/${mapId}`);
                if (response.ok) {
                    map = await response.json();
                    if (map.circular_id) {
                        const circularResponse = await fetch(`/api/circulars/${map.circular_id}`);
                        if (circularResponse.ok) {
                            const circularData = await circularResponse.json();
                            circularTitle = circularData.title || circularTitle;
                        }
                    }
                } else {
                    const errText = await response.text();
                    console.error(`MAP details request failed: ${response.status} ${response.statusText}`, errText);
                }
            } catch (e) {
                console.error("Failed to fetch MAP details", e);
            }
        }

        if (!map) {
            return `<div class="section-card"><h2>MAP Not Found</h2><button class="btn" onclick="app.navigateTo('dashboard')">Back to Dashboard</button></div>`;
        }

        return `
            <div class="page-header">
                <div style="display: flex; align-items: center; gap: 15px;">
                    <button class="btn btn-outline" onclick="window.history.back()" style="padding: 5px 10px;"><i class="fas fa-arrow-left"></i></button>
                    <h1>MAP Detail: MAP-${map.id}</h1>
                </div>
            </div>

            <div class="dashboard-grid">
                <div class="section-card">
                    <div class="section-title"><span>Requirement Details</span></div>
                    <h2 style="margin-bottom: 15px; color: var(--secondary-blue);">${map.title}</h2>
                    <p style="color: var(--text-muted); margin-bottom: 25px;">${map.description || 'No detailed description available.'}</p>

                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px;">
                        <div>
                            <label style="display: block; font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; font-weight: bold;">Department</label>
                            <p style="font-weight: 600;">${map.department || 'Unassigned'}</p>
                        </div>
                        <div>
                            <label style="display: block; font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; font-weight: bold;">Owner</label>
                            <p style="font-weight: 600;">${map.owner || 'Auto-assigned'}</p>
                        </div>
                        <div>
                            <label style="display: block; font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; font-weight: bold;">Deadline</label>
                            <p style="font-weight: 600; color: var(--risk-high);">${map.deadline || 'TBD'}</p>
                        </div>
                        <div>
                            <label style="display: block; font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; font-weight: bold;">Priority</label>
                            <span class="status-badge ${this.getRiskClass(map.priority)}">${map.priority}</span>
                        </div>
                        <div>
                            <label style="display: block; font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; font-weight: bold;">Status</label>
                            <p style="font-weight: 600;">${map.status || 'Assigned'}</p>
                        </div>
                        <div>
                            <label style="display: block; font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; font-weight: bold;">Compliance Score</label>
                            <p style="font-weight: 600;">${map.compliance_score || 0}%</p>
                        </div>
                        <div>
                            <label style="display: block; font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; font-weight: bold;">Risk Score</label>
                            <p style="font-weight: 600;">${map.risk_score || 0}/100</p>
                        </div>
                    </div>
                    <div class="section-card" style="margin-bottom: 25px;">
                        <div class="section-title"><span>MAP Progress</span></div>
                        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-top: 15px;">
                            ${['Created','Assigned','AI Validation','Evidence Collection'].map(step => {
                                const completed = step === 'Created' || (step === 'Assigned' && map.owner) || (step === 'AI Validation' && ['Completed','Action Required'].includes(map.status)) || (step === 'Evidence Collection' && map.evidence && map.evidence.length > 0);
                                return `
                                    <div style="padding: 12px; border-radius: 8px; background: ${completed ? '#e6faf0' : '#f7f8fa'}; border: 1px solid ${completed ? 'var(--success-green)' : '#e1e4e8'}; text-align: center;">
                                        <div style="font-size: 0.75rem; font-weight: 700; color: ${completed ? 'var(--success-green)' : 'var(--text-muted)'}; margin-bottom: 8px;">${step}</div>
                                        <div style="font-size: 1rem; font-weight: 800; color: ${completed ? 'var(--success-green)' : 'var(--text-muted)'};">${completed ? 'Done' : 'Pending'}</div>
                                    </div>
                                `;
                            }).join('')}
                        </div>
                    </div>

                    <div class="section-title"><span>Evidence & Validation</span></div>
                    ${map.evidence && map.evidence.length > 0 ? map.evidence.map(ev => `
                        <div style="border: 1px solid var(--border-color); border-radius: 8px; padding: 15px; margin-bottom: 15px;">
                            <div style="display: flex; justify-content: space-between; align-items: center;">
                                <div>
                                    <div style="font-weight: 600;">${ev.file_name}</div>
                                    <div style="font-size: 0.8rem; color: var(--text-muted);">Uploaded on ${ev.upload_date}</div>
                                </div>
                                <div style="display: flex; align-items: center; gap: 10px;">
                                    <span class="status-badge ${ev.manual_verification_status === 'Accepted' ? 'status-low' : (ev.manual_verification_status === 'Rejected' ? 'status-high' : 'status-medium')}">
                                        ${ev.manual_verification_status || 'Processing'}
                                    </span>
                                    <span class="status-badge" style="background: #f0f0f0; color: #666;">Score: ${ev.compliance_score || 0}%</span>
                                    <button class="btn btn-outline" onclick="alert('Evidence Reasoning: ' + '${(ev.validation_reason || "AI is analyzing...").replace(/'/g, "\\'")}')">View AI Logic</button>
                                </div>
                            </div>
                        </div>
                    `).join('') : '<p style="color: var(--text-muted); margin-bottom: 15px;">No evidence submitted yet.</p>'}

                    <div style="margin-top: 20px; display: flex; gap: 10px; flex-wrap: wrap; background: #f8f9fa; padding: 20px; border-radius: 8px; border: 1px dashed #dee2e6;">
                        <div style="width: 100%; margin-bottom: 10px;">
                            <h4 style="margin: 0; color: var(--primary-blue);">Submit Compliance Evidence</h4>
                            <p style="font-size: 0.8rem; color: var(--text-muted);">Upload your implementation proof for AI validation.</p>
                        </div>
                        <input type="file" id="evidenceUploadInput" style="display: none;" onchange="window.MAPDetailPage.handleFileUpload(event, ${map.id})">
                        <button class="btn btn-action" id="uploadBtn" onclick="document.getElementById('evidenceUploadInput').click()">
                            <i class="fas fa-upload"></i> UPLOAD EVIDENCE & VALIDATE NOW
                        </button>
                        <button class="btn btn-success" id="downloadAuditBtn" onclick="window.MAPDetailPage.downloadAuditReport(${map.id})" ${map.status === 'Completed' ? '' : 'disabled'} style="${map.status === 'Completed' ? '' : 'opacity: 0.5; cursor: not-allowed;'}">
                            <i class="fas fa-file-invoice"></i> DOWNLOAD AUDIT REPORT
                        </button>
                        <button class="btn btn-outline" onclick="window.MAPDetailPage.exportMap(${map.id})"><i class="fas fa-file-export"></i> EXPORT MAP</button>
                    </div>
                </div>

                <div>
                    <div class="section-card" style="text-align: center;">
                        <div class="section-title"><span>Compliance Status</span></div>
                        <div class="progress-circle" style="--percent: ${map.compliance_score || 0}%; margin: 0 auto 15px; width: 120px; height: 120px;">
                            <div class="progress-circle-inner" style="width: 100px; height: 100px; font-size: 1.5rem;">${map.compliance_score || 0}%</div>
                        </div>
                        <p style="font-weight: 600; color: ${map.compliance_score === 100 ? 'var(--success-green)' : 'var(--primary-blue)'};">
                            ${map.compliance_score === 100 ? 'Fully Compliant' : (map.compliance_score > 0 ? 'In Progress' : 'Pending')}
                        </p>
                        <div style="margin-top: 10px; font-size: 0.85rem; color: var(--text-muted);">Status: ${map.status || 'Assigned'}</div>
                    </div>

                    <div class="section-card">
                        <div class="section-title"><span>Risk Analysis</span></div>
                        <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                            <span>Risk Score:</span>
                            <span class="status-badge ${this.getRiskClass(map.priority)}">${map.risk_score || 0}/100</span>
                        </div>
                        <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 15px;"><strong>Reason:</strong> ${map.risk_reason || 'AI analyzing risk vectors...'}</p>
                    </div>
                </div>
            </div>
        `;
    },

    async handleFileUpload(event, mapId) {
        const file = event.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);
        formData.append('map_id', mapId);

        try {
            const uploadBtn = document.getElementById('uploadBtn');
            const originalContent = uploadBtn.innerHTML;
            uploadBtn.disabled = true;
            uploadBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> UPLOADING...';

            const response = await fetch('/api/evidence/upload', {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                const result = await response.json();
                uploadBtn.innerHTML = '<i class="fas fa-robot fa-spin"></i> AI VALIDATING...';

                // Start polling for results
                this.pollEvidenceStatus(result.evidence_id, mapId);
            } else {
                uploadBtn.disabled = false;
                uploadBtn.innerHTML = originalContent;
                const err = await response.json();
                alert('Failed to upload evidence: ' + (err.error || 'Unknown error'));
            }
        } catch (e) {
            console.error('Upload error', e);
            alert('Upload error occurred.');
        }
    },

    pollEvidenceStatus(evidenceId, mapId) {
        let attempts = 0;
        const maxAttempts = 30; // 60 seconds max
        const interval = setInterval(async () => {
            attempts++;
            try {
                const response = await fetch(`/api/evidence/status/${evidenceId}`);
                if (response.ok) {
                    const data = await response.json();

                        // AI Finished
                        if (data.status !== 'Pending' && data.compliance_score !== null) {
                            clearInterval(interval);

                            const isAccepted = data.manual_verification_status === 'Accepted';
                            const feedbackMsg = isAccepted
                                ? `ACCEPTED (${data.compliance_score}% Valid): Well done! The evidence meets the regulatory requirement.`
                                : `NOT ACCEPTED (${data.compliance_score}% Valid): Try it better immediately. The evidence match is too low.`;

                            // Visual feedback
                            const feedbackDiv = document.createElement('div');
                            feedbackDiv.style.cssText = `
                                position: fixed; top: 20px; right: 20px; padding: 20px; border-radius: 8px; z-index: 9999;
                                background: ${isAccepted ? '#e6faf0' : '#feecef'};
                                color: ${isAccepted ? '#1e7e34' : '#d9534f'};
                                border: 2px solid ${isAccepted ? '#1e7e34' : '#d9534f'};
                                box-shadow: 0 4px 12px rgba(0,0,0,0.15); font-weight: bold; font-size: 1.1rem;
                                animation: slideIn 0.5s ease-out;
                            `;
                            feedbackDiv.innerHTML = `
                                <div style="display: flex; align-items: center; gap: 15px;">
                                    <i class="fas ${isAccepted ? 'fa-check-circle' : 'fa-times-circle'}" style="font-size: 2rem;"></i>
                                    <div>${feedbackMsg}</div>
                                </div>
                            `;
                            document.body.appendChild(feedbackDiv);

                            setTimeout(() => {
                                feedbackDiv.remove();
                                app.renderPage('mapDetail', {id: mapId});
                            }, 4000);
                        }
                }
            } catch (e) {
                console.error("Polling error:", e);
                clearInterval(interval);
            }

            if (attempts >= maxAttempts) {
                clearInterval(interval);
                console.log("Polling timed out.");
            }
        }, 2000); // Check every 2 seconds
    },

    async reassignOwner(mapId) {
        try {
            const response = await fetch(`/api/maps/${mapId}/reassign`, { method: 'POST' });
            if (response.ok) {
                const data = await response.json();
                alert('Owner reassigned to ' + data.owner);
                app.navigateTo('mapDetail', {id: mapId});
            } else {
                const err = await response.json();
                alert('Reassignment failed: ' + (err.error || 'Unknown error'));
            }
        } catch (e) {
            console.error('Reassign error', e);
            alert('Activity failed.');
        }
    },

    exportMap(mapId) {
        window.location = `/api/maps/${mapId}/export`;
    },

    downloadAuditReport(mapId) {
        window.location = `/api/maps/${mapId}/audit-report`;
    },

    init() {
        console.log('MAP Detail initialized');
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
