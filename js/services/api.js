/**
 * API Service for RegMap AI
 * This service handles all data fetching and future integration points.
 * Currently uses mockData, but structured for easy replacement with fetch() calls.
 */
const APIService = {
    async getDashboardData() {
        // Simulated API Delay
        return new Promise(resolve => {
            setTimeout(() => resolve(mockData.dashboard), 300);
        });
    },

    async getCirculars() {
        return new Promise(resolve => {
            setTimeout(() => resolve(mockData.circulars), 300);
        });
    },

    async getMAPs() {
        return new Promise(resolve => {
            setTimeout(() => resolve(mockData.maps), 300);
        });
    },

    async getAuditLogs() {
        return new Promise(resolve => {
            setTimeout(() => resolve(mockData.auditTrail), 300);
        });
    },

    async uploadCircular(file) {
        // Future integration: FormData and POST request
        console.log('Uploading file to backend...', file.name);
        return new Promise(resolve => {
            setTimeout(() => resolve({ success: true, circularId: 'C-' + Date.now() }), 2000);
        });
    },

    async validateEvidence(evidenceId, requirementId) {
        console.log('Validating evidence...', evidenceId, requirementId);
        return new Promise(resolve => {
            setTimeout(() => resolve({
                confidence: 0.95,
                score: 85,
                reason: 'Document validates MFA configuration for admin users.'
            }), 1500);
        });
    }
};
