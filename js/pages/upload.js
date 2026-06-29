const UploadPage = {
    async render() {
        return `
            <div class="page-header">
                <h1>Circular Upload Center</h1>
                <p>Upload regulatory circulars for AI-powered analysis and MAP generation.</p>
            </div>

            <div class="upload-container">
                <div class="section-card">
                    <div class="drop-zone" id="drop-zone">
                        <i class="fas fa-cloud-upload-alt"></i>
                        <h3>Drag and Drop Circular PDF</h3>
                        <p>or click to browse from your computer</p>
                        <input type="file" id="file-input" hidden accept=".pdf">
                        <button class="btn btn-primary" style="margin-top: 20px;">Select File</button>
                    </div>

                    <div id="processing-status" class="hidden" style="margin-top: 30px;">
                        <h4 style="margin-bottom: 15px;">Workflow Status</h4>
                        <div class="workflow-steps" style="display: flex; justify-content: space-between; position: relative;">
                            <div style="position: absolute; top: 15px; left: 0; right: 0; height: 2px; background: #eee; z-index: 1;"></div>
                            ${['Upload', 'Verification', 'Extraction', 'AI Analysis', 'MAP Generation'].map((step, i) => `
                                <div class="step" style="z-index: 2; background: white; text-align: center; width: 80px;">
                                    <div class="step-circle" style="width: 32px; height: 32px; border-radius: 50%; background: ${i === 0 ? 'var(--primary-blue)' : '#eee'}; color: ${i === 0 ? 'white' : '#999'}; display: flex; align-items: center; justify-content: center; margin: 0 auto 8px; font-weight: bold; font-size: 0.8rem;">${i + 1}</div>
                                    <span style="font-size: 0.7rem; font-weight: 600; color: ${i === 0 ? 'var(--primary-blue)' : '#999'};">${step}</span>
                                </div>
                            `).join('')}
                        </div>
                        <div id="status-message" style="text-align: center; margin-top: 20px; font-style: italic; color: var(--text-muted);">
                            Uploading Circular...
                        </div>
                    </div>
                </div>

                <div class="section-card">
                    <div class="section-title">
                        <span>Circular History</span>
                    </div>
                    <div class="table-responsive">
                        <table class="data-table">
                            <thead>
                                <tr>
                                    <th>Circular ID</th>
                                    <th>Title</th>
                                    <th>Date</th>
                                    <th>Department</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${mockData.circulars.map(c => `
                                    <tr>
                                        <td><strong>${c.id}</strong></td>
                                        <td>${c.title}</td>
                                        <td>${c.date}</td>
                                        <td>${c.department}</td>
                                        <td><span class="status-badge ${c.status === 'Processed' ? 'status-low' : 'status-medium'}">${c.status}</span></td>
                                        <td><button class="btn btn-outline" style="padding: 4px 8px; font-size: 0.75rem;">View</button></td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
    },

    init() {
        const dropZone = document.getElementById('drop-zone');
        const fileInput = document.getElementById('file-input');
        const processingStatus = document.getElementById('processing-status');

        if (!dropZone) return;

        dropZone.addEventListener('click', () => fileInput.click());

        dropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropZone.classList.add('drag-over');
        });

        dropZone.addEventListener('dragleave', () => {
            dropZone.classList.remove('drag-over');
        });

        dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropZone.classList.remove('drag-over');
            if (e.dataTransfer.files.length) {
                this.handleFileUpload(e.dataTransfer.files[0]);
            }
        });

        fileInput.addEventListener('change', (e) => {
            if (e.target.files.length) {
                this.handleFileUpload(e.target.files[0]);
            }
        });
    },

    handleFileUpload(file) {
        const statusDiv = document.getElementById('processing-status');
        const statusMsg = document.getElementById('status-message');
        statusDiv.classList.remove('hidden');

        let steps = ['Uploading...', 'Verifying PDF...', 'Extracting Text...', 'AI Analysis...', 'Generating MAPs...', 'Complete!'];
        let currentStep = 0;

        const interval = setInterval(() => {
            statusMsg.textContent = steps[currentStep];

            // Update UI circles
            const circles = document.querySelectorAll('.step-circle');
            const labels = document.querySelectorAll('.step span');

            if (currentStep < 5) {
                circles[currentStep].style.background = 'var(--success-green)';
                circles[currentStep].style.color = 'white';
                circles[currentStep].innerHTML = '<i class="fas fa-check"></i>';

                if (currentStep + 1 < 5) {
                    circles[currentStep + 1].style.background = 'var(--primary-blue)';
                    circles[currentStep + 1].style.color = 'white';
                    labels[currentStep + 1].style.color = 'var(--primary-blue)';
                }
            }

            currentStep++;
            if (currentStep >= steps.length) {
                clearInterval(interval);
                setTimeout(() => {
                    alert('Circular processed successfully! MAPs have been generated.');
                }, 500);
            }
        }, 1500);
    }
};
