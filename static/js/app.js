document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 REGMAP AI: Enterprise Environment Initialized');

    const app = {
        currentPage: 'dashboard',
        isLoggedIn: false,

        init() {
            window.app = this;
            this.handleLogin();
            this.bindGlobalEvents();

            // If already logged in (simulated session), show app
            const session = localStorage.getItem('regmap_session');
            if (session) {
                this.showApp();
            }
        },

        handleLogin() {
            const loginForm = document.getElementById('login-form');
            if (loginForm) {
                loginForm.addEventListener('submit', (e) => {
                    e.preventDefault();
                    console.log('🔑 Authenticating with Enterprise SSO...');

                    // Simulate login delay
                    const btn = loginForm.querySelector('.btn-primary');
                    const originalText = btn.textContent;
                    btn.textContent = 'AUTHENTICATING...';
                    btn.disabled = true;

                    setTimeout(() => {
                        this.isLoggedIn = true;
                        localStorage.setItem('regmap_session', 'true');
                        this.showApp();
                    }, 800);
                });
            }

            const logoutBtn = document.getElementById('logout-btn');
            if (logoutBtn) {
                logoutBtn.addEventListener('click', () => {
                    localStorage.removeItem('regmap_session');
                    location.reload();
                });
            }
        },

        showApp() {
            document.getElementById('login-screen').classList.add('hidden');
            document.getElementById('app-container').classList.remove('hidden');
            document.body.classList.remove('auth-hidden');

            this.initRouter();
        },

        initRouter() {
            this.bindNavigationEvents();
            const path = window.location.hash.replace('#', '') || 'dashboard';
            this.loadPage(path);
        },

        bindGlobalEvents() {
            // Sidebar Toggle
            const toggleBtn = document.getElementById('sidebar-toggle');
            const sidebar = document.getElementById('sidebar');
            if (toggleBtn && sidebar) {
                toggleBtn.addEventListener('click', () => {
                    sidebar.classList.toggle('active');
                });
            }
        },

        bindNavigationEvents() {
            const sidebarNav = document.querySelector('.sidebar-nav');
            if (sidebarNav) {
                sidebarNav.addEventListener('click', (e) => {
                    const li = e.target.closest('li');
                    if (li && li.hasAttribute('data-page')) {
                        const page = li.getAttribute('data-page');
                        this.navigateTo(page);
                    }
                });
            }
        },

        navigateTo(pageId, params = {}) {
            if (typeof params !== 'object' || params === null || Array.isArray(params)) {
                params = { id: params };
            }
            const query = Object.entries(params)
                .filter(([_, value]) => value !== undefined && value !== null)
                .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
                .join('&');
            const hash = query ? `#${pageId}?${query}` : `#${pageId}`;
            window.history.pushState({page: pageId, params: params}, '', hash);
            this.loadPage(pageId, params);
        },

        async loadPage(pageId, params = {}) {
            if (!params || Object.keys(params).length === 0) {
                const hash = window.location.hash.replace('#', '');
                const [path, query] = hash.split('?');
                if (path) {
                    pageId = path;
                }
                if (query) {
                    query.split('&').forEach(pair => {
                        const [key, value] = pair.split('=');
                        if (key && value !== undefined) {
                            params[key] = decodeURIComponent(value);
                        }
                    });
                }
            }
            console.log(`⏳ Accessing Module: ${pageId.toUpperCase()} with params`, params);
            const container = document.getElementById('page-container');

            // Show loader
            const loader = document.getElementById('loader');
            if (loader) loader.classList.remove('hidden');

            // Update Sidebar UI
            document.querySelectorAll('.sidebar-nav li').forEach(li => li.classList.remove('active'));
            const activeNav = document.querySelector(`.sidebar-nav li[data-page="${pageId}"]`);
            if (activeNav) activeNav.classList.add('active');

            try {
                let pageContent = '';
                const getPage = (name) => window[name];

                switch(pageId) {
                    case 'dashboard':
                        pageContent = await DashboardPage.render();
                        break;
                    case 'ai-command':
                        pageContent = await AICommandPage.render();
                        break;
                    case 'upload':
                        pageContent = await UploadPage.render();
                        break;
                    case 'workspace':
                        const circularId = params && typeof params === 'object' ? params.circularId || params.id : params;
                        pageContent = await WorkspacePage.render(circularId);
                        break;
                    case 'monitor':
                        pageContent = await MonitorPage.render();
                        break;
                    case 'risk':
                        pageContent = await RiskPage.render();
                        break;
                    case 'evidence':
                        pageContent = await EvidencePage.render();
                        break;
                    case 'audit':
                        pageContent = await AuditPage.render();
                        break;
                    case 'viewer':
                        pageContent = await ViewerPage.render(params.id);
                        break;
                    case 'mapDetail':
                        pageContent = await MAPDetailPage.render(params.id);
                        break;
                    default:
                        pageContent = '<div class="section-card"><div class="section-body"><h1>Module Under Construction</h1><p>This enterprise module is currently being calibrated.</p></div></div>';
                }

                container.innerHTML = pageContent;

                // Initialize page specific scripts
                const pageMap = {
                    dashboard: 'DashboardPage',
                    'ai-command': 'AICommandPage',
                    upload: 'UploadPage',
                    workspace: 'WorkspacePage',
                    monitor: 'MonitorPage',
                    risk: 'RiskPage',
                    evidence: 'EvidencePage',
                    audit: 'AuditPage',
                    'dept-ops': 'DeptOpsPage',
                    viewer: 'ViewerPage',
                    mapDetail: 'MAPDetailPage'
                };

                const obj = window[pageMap[pageId]];
                if (obj && obj.init) obj.init();

                window.scrollTo(0, 0);
            } catch (error) {
                console.error('Module Error:', error);
                container.innerHTML = '<div class="section-card"><div class="section-body"><h2>System Access Error</h2><p>Unable to initialize requested module. Please contact System Administrator.</p></div></div>';
            } finally {
                if (loader) loader.classList.add('hidden');
            }
        }
    };

    app.init();
});
