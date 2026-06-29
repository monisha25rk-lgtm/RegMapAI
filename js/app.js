document.addEventListener('DOMContentLoaded', () => {
    const app = {
        currentPage: 'dashboard',
        currentParams: {},

        init() {
            window.app = this; // Make app globally accessible for inline onclick handlers
            this.bindEvents();
            this.loadPage(this.currentPage);
        },

        bindEvents() {
            // Sidebar Navigation
            document.querySelectorAll('.sidebar-nav li').forEach(item => {
                item.addEventListener('click', (e) => {
                    const page = e.currentTarget.getAttribute('data-page');
                    if (page) {
                        this.navigateTo(page);
                    }
                });
            });

            // Sidebar Toggle for Mobile
            const toggleBtn = document.getElementById('sidebar-toggle');
            const sidebar = document.getElementById('sidebar');
            if (toggleBtn) {
                toggleBtn.addEventListener('click', () => {
                    sidebar.classList.toggle('active');
                });
            }

            // Close sidebar when clicking outside on mobile
            document.addEventListener('click', (e) => {
                if (window.innerWidth <= 768 &&
                    sidebar && toggleBtn &&
                    !sidebar.contains(e.target) &&
                    !toggleBtn.contains(e.target) &&
                    sidebar.classList.contains('active')) {
                    sidebar.classList.remove('active');
                }
            });
        },

        navigateTo(pageId, params = {}) {
            // Update UI state for sidebar
            document.querySelectorAll('.sidebar-nav li').forEach(li => li.classList.remove('active'));
            const activeNav = document.querySelector(`.sidebar-nav li[data-page="${pageId}"]`);
            if (activeNav) activeNav.classList.add('active');

            this.currentPage = pageId;
            this.currentParams = params;
            this.loadPage(pageId, params);

            // Close sidebar on mobile after navigation
            if (window.innerWidth <= 768) {
                const sidebar = document.getElementById('sidebar');
                if (sidebar) sidebar.classList.remove('active');
            }

            // Scroll to top
            window.scrollTo(0, 0);
        },

        async loadPage(pageId, params = {}) {
            const container = document.getElementById('page-container');
            const pageTitle = document.getElementById('page-title');

            // Show loader
            document.getElementById('loader').classList.remove('hidden');

            try {
                // Determine which page module to call
                let pageContent = '';
                switch(pageId) {
                    case 'dashboard':
                        pageTitle.textContent = 'Executive Dashboard';
                        pageContent = await DashboardPage.render();
                        break;
                    case 'upload':
                        pageTitle.textContent = 'Circular Upload Center';
                        pageContent = await UploadPage.render();
                        break;
                    case 'workspace':
                        pageTitle.textContent = 'MAP Workspace';
                        pageContent = await WorkspacePage.render();
                        break;
                    case 'risk':
                        pageTitle.textContent = 'Risk Intelligence Center';
                        pageContent = await RiskPage.render();
                        break;
                    case 'evidence':
                        pageTitle.textContent = 'Evidence Validation Center';
                        pageContent = await EvidencePage.render();
                        break;
                    case 'audit':
                        pageTitle.textContent = 'Audit Trail Center';
                        pageContent = await AuditPage.render();
                        break;
                    case 'monitor':
                        pageTitle.textContent = 'Task Compliance Monitor';
                        pageContent = await MonitorPage.render();
                        break;
                    case 'viewer':
                        pageTitle.textContent = 'Circular Viewer';
                        pageContent = await ViewerPage.render(params.id);
                        break;
                    case 'mapDetail':
                        pageTitle.textContent = 'MAP Detail Page';
                        pageContent = await MAPDetailPage.render(params.id);
                        break;
                    default:
                        pageContent = '<h1>Page Not Found</h1>';
                }

                container.innerHTML = pageContent;

                // Initialize page specific scripts
                this.initPageScripts(pageId);

            } catch (error) {
                console.error('Error loading page:', error);
                container.innerHTML = '<div class="card"><h2>Error</h2><p>Failed to load the page. Please try again.</p></div>';
            } finally {
                // Hide loader
                document.getElementById('loader').classList.add('hidden');
            }
        },

        initPageScripts(pageId) {
            const pages = {
                dashboard: DashboardPage,
                upload: UploadPage,
                workspace: WorkspacePage,
                risk: RiskPage,
                evidence: EvidencePage,
                audit: AuditPage,
                viewer: ViewerPage,
                mapDetail: MAPDetailPage
            };

            if (pages[pageId] && pages[pageId].init) {
                pages[pageId].init();
            }
        }
    };

    app.init();
});
