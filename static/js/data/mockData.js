window.mockData = {
    dashboard: {
        institutionalScore: 84,
        auditReadiness: 91,
        activeMAPs: 156,
        criticalRisks: 8,
        pendingReviews: 24,
        upcomingDeadlines: 15,
        complianceTrend: [82, 83, 85, 84, 86, 88, 87, 84],
        deptPerformance: [
            { name: 'Corporate Banking', score: 92, trend: 'up' },
            { name: 'Retail Operations', score: 76, trend: 'down' },
            { name: 'IT Infrastructure', score: 68, trend: 'stable' },
            { name: 'Risk Management', score: 95, trend: 'up' },
            { name: 'Human Resources', score: 88, trend: 'up' }
        ],
        aiAssistant: [
            { id: 1, type: 'risk', title: 'MFA implementation risk detected', message: 'IT department likely to miss deadline for MAP-101. Resource gap identified in security team.', action: 'Escalate to CTO' },
            { id: 2, type: 'warning', title: 'Evidence incomplete for MAP-102', message: 'The uploaded "Privacy Policy.pdf" does not contain mandatory SEBI clauses regarding data localization.', action: 'Request Update' },
            { id: 3, type: 'info', title: 'New RBI Circular Detected', message: 'RBI/2023-24/105: Master Direction on Cyber Resilience. 12 new actionable tasks predicted.', action: 'Generate MAP' }
        ],
        regIntelligenceFeed: [
            { date: '2023-11-20', title: 'RBI Master Direction: Information Technology Governance', impact: 'High', department: 'IT' },
            { date: '2023-11-18', title: 'SEBI Circular: Cybersecurity Framework for Stock Brokers', impact: 'Medium', department: 'Compliance' },
            { date: '2023-11-15', title: 'FEMA Guidelines: Liberalised Remittance Scheme Update', impact: 'Low', department: 'Forex' }
        ]
    },
    maps: [
        {
            id: 'MAP-101',
            requirement: 'Multi-Factor Authentication Deployment',
            owner: 'Amit Sharma',
            dept: 'IT',
            deadline: '2023-12-15',
            compliance: 45,
            riskScore: 78,
            evidence: 'Pending',
            priority: 'Critical',
            reason: 'Mandated by RBI Cyber Security Framework (Para 4.2). Failure results in Category A non-compliance.',
            prediction: 'High probability of deadline breach (82%) due to concurrent system migration.'
        },
        {
            id: 'MAP-102',
            requirement: 'Data Localization Framework Implementation',
            owner: 'Priya Verma',
            dept: 'Compliance',
            deadline: '2023-11-30',
            compliance: 82,
            riskScore: 34,
            evidence: 'Under Review',
            priority: 'High',
            reason: 'Section 12 of Payment and Settlement Systems Act. Mandatory for all transaction data.',
            prediction: 'Likely to complete on time. Minor gaps in metadata tagging identified.'
        },
        {
            id: 'MAP-103',
            requirement: 'Quarterly AML Pattern Analysis',
            owner: 'Vikram Singh',
            dept: 'Risk',
            deadline: '2023-11-15',
            compliance: 100,
            riskScore: 12,
            evidence: 'Validated',
            priority: 'Medium',
            reason: 'KYC/AML Master Direction (2016) - Periodic reporting requirement.',
            prediction: 'Successfully completed. AI validated matching with PMLA requirements.'
        }
    ],
    riskMatrix: [
        [5, 8, 12, 3, 2],
        [4, 15, 22, 10, 5],
        [2, 35, 48, 15, 8],
        [1, 12, 25, 30, 12],
        [0, 5, 10, 15, 20]
    ],
    circulars: [
        {
            id: 'RBI/2023/102',
            title: 'Outsourcing of Financial Services',
            date: '15 Nov 2023',
            status: 'Verified',
            type: 'RBI Master Direction',
            metadata: { pages: 45, items: 112, entities: 'Banks, NBFCs' }
        },
        {
            id: 'SEBI/CIR/2023/45',
            title: 'Business Responsibility and Sustainability Reporting',
            date: '10 Nov 2023',
            status: 'Processing',
            type: 'SEBI Notification',
            metadata: { pages: 12, items: 24, entities: 'Listed Entities' }
        }
    ],
    auditLogs: [
        { timestamp: '2023-11-20 14:22:10', user: 'system_ai', action: 'Risk Level Escalated', module: 'MAP-101', details: 'Trend analysis predicted delay' },
        { timestamp: '2023-11-20 12:05:45', user: 'cco_admin', action: 'Evidence Validated', module: 'MAP-103', details: 'AML Report matched SEBI spec' },
        { timestamp: '2023-11-20 09:15:33', user: 'it_mgr_1', action: 'Document Uploaded', module: 'Circular Center', details: 'RBI Master Direction' }
    ]
};
