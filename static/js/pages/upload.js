window.UploadPage = {
    currentCircularId: null,
    pollingInterval: null,

    async render() {
        let circulars = [];
        try {
            const response = await fetch('/api/circulars');
            if (response.ok) {
                circulars = await response.json();
            }
        } catch (e) {
            console.error("Failed to fetch circulars", e);
        }

        return `
            <div class="page-header">
                <h1 style="color: var(--primary-blue); font-weight: 800; font-size: 1.5rem;">REGULATORY UPLOAD & VERIFICATION</h1>
                <p style="font-size: 0.85rem; color: var(--text-muted);">Secure gateway for RBI/SEBI circular ingestion and autonomous task extraction.</p>
            </div>

            <div style="display: grid; grid-template-columns: 1.5fr 1fr; gap: 25px;">
                <div style="display: flex; flex-direction: column; gap: 25px;">
                    <!-- Drag & Drop Zone -->
                    <div class="section-card" style="border: 2px dashed var(--border-gray); background: #fafafa;">
                        <div class="section-body" style="text-align: center; padding: 60px 40px;">
                            <i class="fas fa-file-invoice" style="font-size: 3.5rem; color: var(--primary-blue); margin-bottom: 20px;"></i>
                            <h2 style="font-weight: 800; color: var(--primary-blue); margin-bottom: 10px;">DEPOSIT REGULATORY INSTRUMENT</h2>
                            <p style="font-size: 0.9rem; color: var(--text-muted); margin-bottom: 25px;">Drag and drop PDF, DOCX or XML circulars here for AI processing.</p>
                            <input type="file" id="fileInput" style="display: none;" accept=".pdf,.docx,.xml">
                            <button class="btn btn-action" id="uploadBtn" style="padding: 12px 30px; font-size: 0.9rem;">SELECT FILE FROM SECURE STORAGE</button>
                            <div id="uploadStatus" style="margin-top: 15px; font-size: 0.8rem; font-weight: 600;"></div>
                        </div>
                    </div>

                    <!-- Processing Timeline -->
                    <div class="section-card" id="timelineContainer">
                        ${this.renderTimeline('Idle')}
                    </div>
                </div>

                <div style="display: flex; flex-direction: column; gap: 25px;">
                    <!-- Recent Circulars -->
                    <div class="section-card">
                        <div class="section-header">
                            <span class="section-title">Recent Ingestions</span>
                        </div>
                        <div class="section-body" style="padding: 0;">
                            ${circulars.length > 0 ? circulars.map(circ => `
                                <div style="padding: 12px 20px; border-bottom: 1px solid #eee; display: flex; justify-content: space-between; align-items: center; cursor: pointer;" onclick="app.navigateTo('workspace', {circularId: '${circ.id}'})">
                                    <div style="flex: 1; min-width: 0; padding-right: 10px;">
                                        <div style="font-size: 0.75rem; font-weight: 800; color: var(--primary-blue);">ID: ${circ.id}</div>
                                        <div style="font-size: 0.65rem; color: var(--text-muted); text-overflow: ellipsis; white-space: nowrap; overflow: hidden;">${circ.title}</div>
                                    </div>
                                    <span class="status-badge ${this.getStatusClass(circ.status)}" style="font-size: 0.6rem; flex-shrink: 0;">${(circ.status || 'PENDING').toUpperCase()}</span>
                                </div>
                            `).join('') : '<div style="padding: 20px; text-align: center; color: #999;">No circulars uploaded yet.</div>'}
                        </div>
                    </div>
                </div>
            </div>

            <style>
                @keyframes pulse {
                    0% { box-shadow: 0 0 0 0 rgba(0, 31, 63, 0.4); }
                    70% { box-shadow: 0 0 0 10px rgba(0, 31, 63, 0); }
                    100% { box-shadow: 0 0 0 0 rgba(0, 31, 63, 0); }
                }
            </style>
        `;
    },

    renderTimeline(status) {
        const stages = [
            { id: 'Upload', label: 'UPLOAD', icon: 'check', doneStatuses: ['Uploaded', 'Extracting', 'Analyzing', 'Generating MAPs', 'Processed'] },
            { id: 'Verify', label: 'VERIFY', icon: 'shield-check', doneStatuses: ['Extracting', 'Analyzing', 'Generating MAPs', 'Processed'] },
            { id: 'Extract', label: 'EXTRACT', icon: 'microchip', doneStatuses: ['Analyzing', 'Generating MAPs', 'Processed'], currentStatuses: ['Extracting'] },
            { id: 'Analyze', label: 'ANALYZE', icon: 'brain', doneStatuses: ['Generating MAPs', 'Processed'], currentStatuses: ['Analyzing'] },
            { id: 'MapGen', label: 'MAP GEN', icon: 'layer-group', doneStatuses: ['Processed'], currentStatuses: ['Generating MAPs'] }
        ];

        let currentAction = "Waiting for upload...";
        let progressPercent = 0;

        if (status === 'Uploaded') { currentAction = "File received. Starting extraction..."; progressPercent = 20; }
        else if (status === 'Extracting') { currentAction = "Extracting text content from PDF..."; progressPercent = 40; }
        else if (status === 'Analyzing') { currentAction = "AI is analyzing regulatory obligations..."; progressPercent = 60; }
        else if (status === 'Generating MAPs') { currentAction = "Generating Management Action Plans..."; progressPercent = 80; }
        else if (status === 'Processed') { currentAction = "Processing complete. MAPs generated!"; progressPercent = 100; }
        else if (status.includes('Failed') || status === 'Error') { currentAction = "❌ Processing failed: " + status; progressPercent = 0; }

        return `
            <div class="section-header">
                <span class="section-title">Ingestion Workflow Status</span>
            </div>
            <div class="section-body">
                <div style="display: flex; justify-content: space-between; position: relative; margin-bottom: 40px; padding: 0 20px;">
                    <div style="position: absolute; top: 12px; left: 40px; right: 40px; height: 2px; background: #eee; z-index: 0;"></div>
                    <div style="position: absolute; top: 12px; left: 40px; width: ${progressPercent}%; height: 2px; background: var(--success-green); transition: width 0.5s; z-index: 1;"></div>

                    ${stages.map(stage => {
                        const isDone = stage.doneStatuses.includes(status);
                        const isCurrent = stage.currentStatuses && stage.currentStatuses.includes(status);
                        let bgColor = '#eee';
                        let textColor = '#999';
                        let icon = `fas fa-${stage.icon}`;
                        let animation = '';

                        if (isDone) {
                            bgColor = 'var(--success-green)';
                            textColor = 'var(--text-main)';
                            icon = 'fas fa-check';
                        } else if (isCurrent) {
                            bgColor = '#fff';
                            textColor = 'var(--primary-blue)';
                            animation = 'animation: pulse 2s infinite; border: 2px solid var(--primary-blue);';
                        }

                        return `
                            <div style="z-index: 2; text-align: center;">
                                <div style="width: 25px; height: 25px; background: ${bgColor}; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: ${isDone ? 'white' : textColor}; margin: 0 auto 8px; ${animation}">
                                    <i class="${icon}" style="font-size: 0.7rem;"></i>
                                </div>
                                <div style="font-size: 0.7rem; font-weight: 700; color: ${textColor};">${stage.label}</div>
                            </div>
                        `;
                    }).join('')}
                </div>
                <div style="background: ${status.includes('Failed') ? '#fff0f0' : '#eef6ff'}; padding: 15px; border-radius: 4px; border-left: 4px solid ${status.includes('Failed') ? 'var(--risk-high)' : 'var(--primary-blue)'};">
                    <div style="font-weight: 800; font-size: 0.8rem; color: ${status.includes('Failed') ? 'var(--risk-high)' : 'var(--primary-blue)'}; margin-bottom: 5px;">
                        STATUS: ${status.toUpperCase()}
                    </div>
                    <p style="font-size: 0.75rem; color: #444; margin: 0;">${currentAction}</p>
                </div>
            </div>
        `;
    },

    getStatusClass(status) {
        if (!status) return 'status-medium';
        status = status.toLowerCase();
        if (status === 'processed' || status === 'verified') return 'status-low';
        if (status.includes('failed') || status === 'error') return 'status-high';
        return 'status-medium';
    },

    init() {
        const uploadBtn = document.getElementById('uploadBtn');
        const fileInput = document.getElementById('fileInput');
        const statusDiv = document.getElementById('uploadStatus');
        const timelineContainer = document.getElementById('timelineContainer');

        if (uploadBtn && fileInput) {
            uploadBtn.addEventListener('click', () => fileInput.click());

            fileInput.addEventListener('change', async (e) => {
                const file = e.target.files[0];
                if (!file) return;

                const formData = new FormData();
                formData.append('file', file);
                formData.append('title', file.name);

                statusDiv.innerText = 'Uploading...';
                statusDiv.style.color = 'var(--primary-blue)';

                try {
                    const response = await fetch('/api/upload', {
                        method: 'POST',
                        body: formData
                    });

                    if (response.ok) {
                        const data = await response.json();
                        this.currentCircularId = data.circular_id;
                        statusDiv.innerText = 'Upload Successful! Initializing AI...';
                        statusDiv.style.color = 'var(--success-green)';

                        // Start polling for status updates
                        this.startPolling(this.currentCircularId);
                    } else {
                        const err = await response.json();
                        statusDiv.innerText = 'Error: ' + (err.error || 'Upload failed');
                        statusDiv.style.color = 'var(--risk-high)';
                    }
                } catch (error) {
                    statusDiv.innerText = 'Network error during upload.';
                    statusDiv.style.color = 'var(--risk-high)';
                }
            });
        }
    },

    startPolling(id) {
        if (this.pollingInterval) clearInterval(this.pollingInterval);

        const poll = async () => {
            try {
                const res = await fetch(`/api/upload/status/${id}`);
                if (res.ok) {
                    const { status } = await res.json();
                    const container = document.getElementById('timelineContainer');
                    if (container) {
                        container.innerHTML = this.renderTimeline(status);
                    }

                    if (status === 'Processed' || status.includes('Failed') || status === 'Error') {
                        clearInterval(this.pollingInterval);
                        // Refresh recent list after completion
                        setTimeout(() => app.navigateTo('upload'), 2000);
                    }
                }
            } catch (e) {
                console.error("Polling error", e);
            }
        };

        this.pollingInterval = setInterval(poll, 2000);
        poll(); // Initial check
    },

    renderCharts() {
        // Charts removed in favor of high-density text panels
    }
};
