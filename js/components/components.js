/**
 * Reusable UI Components for RegMap AI
 */
const Components = {
    /**
     * Renders a KPI Card
     */
    KPICard(label, value, icon, color = 'var(--primary-blue)') {
        return `
            <div class="kpi-card">
                <div class="kpi-icon" style="color: ${color}; background: ${color}15;"><i class="${icon}"></i></div>
                <div class="kpi-value" style="color: ${color};">${value}</div>
                <div class="kpi-label">${label}</div>
            </div>
        `;
    },

    /**
     * Renders a Progress Circle
     */
    ProgressCircle(percent, label, color = 'var(--accent-blue)') {
        return `
            <div class="kpi-card">
                <div class="progress-circle" style="--percent: ${percent}%; --accent-blue: ${color}">
                    <div class="progress-circle-inner">${percent}%</div>
                </div>
                <div class="kpi-label">${label}</div>
            </div>
        `;
    },

    /**
     * Renders a Status Badge
     */
    StatusBadge(text, type) {
        let className = '';
        switch(type.toLowerCase()) {
            case 'high': case 'critical': case 'delayed': className = 'status-high'; break;
            case 'medium': case 'warning': case 'in progress': className = 'status-medium'; break;
            case 'low': case 'compliant': case 'completed': case 'success': className = 'status-low'; break;
            default: className = '';
        }
        return `<span class="status-badge ${className}">${text}</span>`;
    },

    /**
     * Renders a Section Header
     */
    SectionHeader(title, actionHtml = '') {
        return `
            <div class="section-title">
                <span>${title}</span>
                ${actionHtml}
            </div>
        `;
    },

    /**
     * Renders a Loading State
     */
    Loader(message = 'Processing...') {
        return `
            <div id="loader">
                <div class="spinner"></div>
                <p>${message}</p>
            </div>
        `;
    },

    /**
     * Renders an Empty State
     */
    EmptyState(icon, title, message) {
        return `
            <div style="text-align: center; padding: 60px 20px;">
                <i class="${icon}" style="font-size: 3rem; color: #e2e8f0; margin-bottom: 20px;"></i>
                <h3 style="color: var(--secondary-blue); margin-bottom: 10px;">${title}</h3>
                <p style="color: var(--text-muted);">${message}</p>
            </div>
        `;
    }
};
