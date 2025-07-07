/**
 * GitHub Pages Index Web App
 * Discovers and categorizes GitHub repositories with Pages deployments
 * Now uses pre-generated data from GitHub Actions for better performance
 */

class GitHubPagesIndex {
    constructor() {
        this.repositories = [];
        this.filteredRepositories = [];
        this.currentCategory = 'all';
        this.currentSearch = '';
        this.metadata = null;
        this.config = null;

        // Initialize the app
        this.init();
    }

    async init() {
        this.setupEventListeners();
        this.initializeTheme();
        await this.loadConfiguration();
        await this.loadRepositories();
        this.setupSearch();
        this.setupFilters();
    }

    async loadConfiguration() {
        try {
            const response = await fetch('./config.json');
            if (response.ok) {
                this.config = await response.json();
                this.applyConfiguration();
            } else {
                console.warn('Could not load configuration, using defaults');
                this.applyDefaultConfiguration();
            }
        } catch (error) {
            console.warn('Could not load configuration, using defaults:', error);
            this.applyDefaultConfiguration();
        }
    }

    applyConfiguration() {
        if (!this.config || !this.config.site) {
            this.applyDefaultConfiguration();
            return;
        }

        const site = this.config.site;

        // Update page title
        document.title = site.title || 'GitHub Pages Index';
        const pageTitle = document.getElementById('page-title');
        if (pageTitle) pageTitle.textContent = site.title || 'GitHub Pages Index';

        // Update header title
        const headerTitle = document.getElementById('header-title');
        if (headerTitle) headerTitle.textContent = site.title || 'GitHub Pages Index';

        // Update header icon and favicon
        const headerIcon = document.getElementById('header-icon');
        if (headerIcon) headerIcon.textContent = site.favicon || '🚀';

        const favicon = document.getElementById('page-favicon');
        if (favicon && site.favicon) {
            favicon.href = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">${site.favicon}</text></svg>`;
        }

        // Update meta description
        const metaDescription = document.getElementById('page-description');
        if (metaDescription) metaDescription.content = site.description || 'Centralized index for GitHub Pages deployments, Terraform modules, and documentation sites';

        // Update welcome section
        const welcomeTitle = document.getElementById('welcome-title');
        if (welcomeTitle) {
            const titleText = site.title || 'My Portfolio';
            welcomeTitle.textContent = `Welcome to ${titleText}`;
        }

        const welcomeDescription = document.getElementById('welcome-description');
        if (welcomeDescription) welcomeDescription.textContent = site.description || 'A centralized hub for all my GitHub Pages deployments, Terraform modules, and documentation sites. This index automatically discovers and categorizes repositories across multiple organizations.';

        // Update footer
        this.updateFooter(site.title, site.author);
    }

    applyDefaultConfiguration() {
        // Apply default values if config is not available
        const defaultTitle = 'GitHub Pages Index';
        const defaultAuthor = 'GitHub Pages Index';

        document.title = defaultTitle;
        const pageTitle = document.getElementById('page-title');
        if (pageTitle) pageTitle.textContent = defaultTitle;

        const headerTitle = document.getElementById('header-title');
        if (headerTitle) headerTitle.textContent = defaultTitle;

        this.updateFooter(defaultTitle, defaultAuthor);
    }

    updateFooter(siteTitle, author) {
        const footer = document.getElementById('footer-text');
        if (footer) {
            const year = new Date().getFullYear();
            const authorText = author || siteTitle;

            if (this.metadata && this.metadata.lastUpdated) {
                const lastUpdated = new Date(this.metadata.lastUpdated);
                const timeAgo = this.getTimeAgo(lastUpdated);
                footer.innerHTML = `&copy; ${year} ${authorText}. Last updated ${timeAgo} via GitHub Actions.`;
            } else {
                footer.innerHTML = `&copy; ${year} ${authorText}. Auto-updated via GitHub Actions.`;
            }
        }
    }

    setupEventListeners() {
        // Theme toggle
        const themeToggle = document.getElementById('theme-toggle');
        themeToggle?.addEventListener('click', () => this.toggleTheme());

        // Retry button
        const retryBtn = document.getElementById('retry-btn');
        retryBtn?.addEventListener('click', () => this.retryLoad());

        // Search input
        const searchInput = document.getElementById('search-input');
        searchInput?.addEventListener('input', (e) => this.handleSearch(e.target.value));

        // Filter buttons
        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => this.handleFilter(btn.dataset.category));
        });
    }

    initializeTheme() {
        // Check localStorage for saved theme preference
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

        // Set initial theme
        const theme = savedTheme || (prefersDark ? 'dark' : 'light');
        document.documentElement.setAttribute('data-theme', theme);

        // Listen for system theme changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!localStorage.getItem('theme')) {
                document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light');
            }
        });
    }

    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    }

    async loadRepositories() {
        try {
            this.showLoading();

            // Load pre-generated repository data
            const response = await fetch('./repositories.json');
            if (!response.ok) {
                throw new Error(`Failed to load repository data: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            this.repositories = data.repositories;
            this.metadata = data.metadata;

            // Use site config from metadata if we don't have it from config.json
            if (!this.config && this.metadata && this.metadata.site) {
                this.config = { site: this.metadata.site };
                this.applyConfiguration();
            }

            this.renderRepositories();
            this.showLastUpdated();

        } catch (error) {
            console.error('Error loading repositories:', error);
            this.showError(error.message);
        }
    }

    renderRepositories() {
        this.hideLoading();
        this.showContent();
        this.updateStats();
        this.renderByCategory();
    }

    showLastUpdated() {
        if (this.metadata && this.metadata.lastUpdated) {
            // Update footer with configuration
            const siteTitle = this.config?.site?.title || 'GitHub Pages Index';
            const author = this.config?.site?.author || siteTitle;
            this.updateFooter(siteTitle, author);
        }
    }

    getTimeAgo(date) {
        const now = new Date();
        const diffInMilliseconds = now - date;
        const diffInMinutes = Math.floor(diffInMilliseconds / (1000 * 60));
        const diffInHours = Math.floor(diffInMinutes / 60);
        const diffInDays = Math.floor(diffInHours / 24);

        if (diffInDays > 0) {
            return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
        } else if (diffInHours > 0) {
            return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
        } else if (diffInMinutes > 0) {
            return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
        } else {
            return 'just now';
        }
    }

    renderByCategory() {
        const categories = {
            'devcontainer-features': document.getElementById('devcontainer-features-grid'),
            'github-actions': document.getElementById('github-actions-grid'),
            'terraform-modules': document.getElementById('terraform-modules-grid'),
            'web-apps': document.getElementById('web-apps-grid')
        };

        // Clear existing content
        Object.values(categories).forEach(grid => {
            if (grid) grid.innerHTML = '';
        });

        // Filter repositories based on search and category
        this.filteredRepositories = this.repositories.filter(repo => {
            const matchesSearch = this.currentSearch === '' ||
                repo.name.toLowerCase().includes(this.currentSearch.toLowerCase()) ||
                (repo.description && repo.description.toLowerCase().includes(this.currentSearch.toLowerCase()));

            const matchesCategory = this.currentCategory === 'all' || (repo.category === this.currentCategory || (repo.category === 'docs' && this.currentCategory === 'web-apps'));

            return matchesSearch && matchesCategory;
        });

        // Group repositories by category
        const groupedRepos = this.filteredRepositories.reduce((acc, repo) => {
            if (!acc[repo.category]) acc[repo.category] = [];
            acc[repo.category].push(repo);
            return acc;
        }, {});

        // Sort repositories within each category by stars, then by name
        Object.values(groupedRepos).forEach(repos => {
            repos.sort((a, b) => {
                if (b.stargazers_count !== a.stargazers_count) {
                    return b.stargazers_count - a.stargazers_count;
                }
                return a.name.localeCompare(b.name);
            });
        });

        // Render repositories in each category
        Object.entries(groupedRepos).forEach(([category, repos]) => {
            const grid = categories[category];
            if (grid) {
                repos.forEach(repo => {
                    const card = this.createRepositoryCard(repo);
                    grid.appendChild(card);
                });
            }
        });

        // Hide empty categories
        Object.entries(categories).forEach(([category, grid]) => {
            const section = grid?.closest('.category-section');
            if (section) {
                section.style.display = groupedRepos[category] ? 'block' : 'none';
            }
        });
    }

    createRepositoryCard(repo) {
        const card = document.createElement('div');
        card.className = 'repo-card';

        const topics = repo.topics || [];
        const topicsHtml = topics.slice(0, 3).map(topic =>
            `<span class="repo-tag">${topic}</span>`
        ).join('');

        const languageHtml = repo.language ?
            `<span class="repo-tag repo-language">${repo.language}</span>` : '';

        const starsHtml = repo.stargazers_count > 0 ?
            `<div class="repo-stars">
                <svg class="star-icon" viewBox="0 0 24 24">
                    <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
                </svg>
                ${repo.stargazers_count}
            </div>` : '';

        const updatedDate = new Date(repo.updated_at).toLocaleDateString();

        const refHtml = repo.reference ? `<div class="repo-reference">${repo.reference}</div>` : '';
        const versionHtml = repo.latest_version ? `<span class="repo-tag">v${repo.latest_version}</span>` : '';

        // Determine site URL
        let siteUrl = null;
        if (repo.has_pages) {
            siteUrl = repo.pagesUrl;
        } else if (repo.category === 'terraform-modules' && repo.homepage) {
            siteUrl = repo.homepage;
        }

        card.innerHTML = `
            <div class="repo-card-header">
                <div>
                    <div class="repo-name">${repo.name}</div>
                    <div class="repo-owner">${repo.owner.login}</div>
                    <div class="repo-updated">Updated ${updatedDate}</div>
                </div>
                ${starsHtml}
            </div>
            <div class="repo-description">
                ${repo.description || 'No description available'}
            </div>
            <div class="repo-meta">
                ${languageHtml}
                ${topicsHtml}
                ${versionHtml}
            </div>
            ${refHtml}
            <div class="repo-links">
                ${siteUrl ?
                    `<a href="${siteUrl}" target="_blank" rel="noopener noreferrer" class="repo-link repo-link-primary">
                        View Site
                    </a>` : ''
                }
                <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer" class="repo-link repo-link-secondary">
                    View Code
                </a>
            </div>
        `;

        return card;
    }

    updateStats() {
        if (this.metadata) {
            // Use pre-calculated statistics from the metadata
            const safeSet = (id,value)=>{const el=document.getElementById(id);if(el)el.textContent=value;};
            safeSet('total-repos',this.metadata.totalCount);
            safeSet('web-apps-count',this.metadata.categories['web-apps']);
            safeSet('terraform-count',this.metadata.categories['terraform-modules']);
            safeSet('actions-count',this.metadata.categories['github-actions']);
            safeSet('features-count',this.metadata.categories['devcontainer-features']);
        } else {
            // Fallback to calculating stats from repositories
            const stats = this.repositories.reduce((acc, repo) => {
                // Convert legacy 'docs' to 'web-apps'
                const cat = repo.category === 'docs' ? 'web-apps' : repo.category;
                acc.total++;
                acc[cat] = (acc[cat] || 0) + 1;
                return acc;
            }, { total: 0, 'web-apps': 0, 'terraform-modules': 0, 'github-actions': 0, 'devcontainer-features': 0 });

            const safeSet = (id,value)=>{const el=document.getElementById(id);if(el)el.textContent=value;};
            safeSet('total-repos',stats.total);
            safeSet('web-apps-count',stats['web-apps']);
            safeSet('terraform-count',stats['terraform-modules']);
            safeSet('actions-count',stats['github-actions']);
            safeSet('features-count',stats['devcontainer-features']);
        }
    }

    setupSearch() {
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            // Debounce search input
            let timeout;
            searchInput.addEventListener('input', (e) => {
                clearTimeout(timeout);
                timeout = setTimeout(() => {
                    this.handleSearch(e.target.value);
                }, 300);
            });
        }
    }

    handleSearch(query) {
        this.currentSearch = query.trim();
        this.renderByCategory();
    }

    setupFilters() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                // Remove active class from all buttons
                filterButtons.forEach(b => b.classList.remove('active'));
                // Add active class to clicked button
                btn.classList.add('active');
                // Handle filter
                this.handleFilter(btn.dataset.category);
            });
        });
    }

    handleFilter(category) {
        this.currentCategory = category;
        this.renderByCategory();
    }

    showLoading() {
        document.getElementById('loading').style.display = 'block';
        document.getElementById('error').style.display = 'none';
        document.getElementById('stats').style.display = 'none';
        document.getElementById('content').style.display = 'none';
    }

    hideLoading() {
        document.getElementById('loading').style.display = 'none';
    }

    showContent() {
        document.getElementById('stats').style.display = 'block';
        document.getElementById('content').style.display = 'block';
    }

    showError(message) {
        this.hideLoading();
        document.getElementById('error').style.display = 'block';
        document.getElementById('error-message').textContent = message;
        document.getElementById('stats').style.display = 'none';
        document.getElementById('content').style.display = 'none';
    }

    async retryLoad() {
        await this.loadRepositories();
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new GitHubPagesIndex();
});

// Export for testing purposes
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GitHubPagesIndex;
}
