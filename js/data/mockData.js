const mockData = {
    dashboard: {
        complianceScore: 88,
        auditReadiness: 92,
        activeMAPs: 45,
        criticalRisks: 12,
        upcomingDeadlines: 8,
        departmentHealth: [
            { name: 'Corporate Banking', score: 95, status: 'Compliant' },
            { name: 'Retail Operations', score: 78, status: 'Warning' },
            { name: 'Risk Management', score: 91, status: 'Compliant' },
            { name: 'IT Infrastructure', score: 62, status: 'High Risk' }
        ],
        recentAlerts: [
            { id: 1, type: 'Critical', message: 'Liquidity Coverage Ratio report overdue for Q2', time: '2h ago' },
            { id: 2, type: 'Warning', message: 'AML Policy update required by end of month', time: '5h ago' }
        ]
    },
    circulars: [
        { id: 'C-2023-001', title: 'New AML/CFT Guidelines 2023', status: 'Processed', date: '2023-10-15', department: 'Compliance' },
        { id: 'C-2023-002', title: 'Cybersecurity Framework for Banks', status: 'Analyzing', date: '2023-10-20', department: 'IT' }
    ],
    maps: [
        { id: 'MAP-101', requirement: 'Implement Multi-factor Authentication', department: 'IT', owner: 'John Doe', deadline: '2023-12-01', compliance: 85, risk: 'Medium', status: 'In Progress' },
        { id: 'MAP-102', requirement: 'Update KYC Documentation', department: 'Operations', owner: 'Jane Smith', deadline: '2023-11-15', compliance: 100, risk: 'Low', status: 'Completed' },
        { id: 'MAP-103', requirement: 'Daily Liquidity Reporting', department: 'Finance', owner: 'Robert Brown', deadline: '2023-10-30', compliance: 40, risk: 'High', status: 'Delayed' }
    ],
    auditTrail: [
        { timestamp: '2023-10-25 10:30:15', user: 'Admin', action: 'Uploaded Circular', module: 'Circular Center', status: 'Success' },
        { timestamp: '2023-10-25 11:45:22', user: 'Jane Smith', action: 'Validated Evidence', module: 'Evidence Center', status: 'Success' }
    ]
};
