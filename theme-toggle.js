class ThemeManager {
    constructor() {
        // Wait for DOM to be ready before initializing
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            this.init();
        }
    }

    init() {
        this.themeToggle = document.getElementById('theme-toggle');
        this.storageKey = 'theme-preference';
        this.moonMask = document.querySelector('.moon');
        this.sunBeams = document.querySelector('.sun-beams');

        // Apply theme immediately
        this.applyInitialTheme();
        
        if (this.themeToggle) {
            this.setupEventListeners();
            this.updateToggleAppearance(document.documentElement.getAttribute('data-theme'));
        }
    }

    applyInitialTheme() {
        const storedTheme = localStorage.getItem(this.storageKey);
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const themeToApply = storedTheme || (systemPrefersDark ? 'dark' : 'light');
        
        document.documentElement.setAttribute('data-theme', themeToApply);
        this.updateToggleAppearance(themeToApply);
    }

    setupEventListeners() {
        document.addEventListener('DOMContentLoaded', () => {
            const toggle = document.getElementById('theme-toggle');
            const html = document.documentElement;

            // Get the current theme from localStorage or default to 'dark'
            const currentTheme = localStorage.getItem('theme') || 'dark';
            html.setAttribute('data-theme', currentTheme);

            toggle.addEventListener('click', () => {
                const newTheme = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
                html.setAttribute('data-theme', newTheme);
                localStorage.setItem('theme', newTheme);

                // Add animation class
                toggle.classList.add('theme-toggle--toggling');
                setTimeout(() => {
                    toggle.classList.remove('theme-toggle--toggling');
                }, 500);
            });
        });

        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
            if (!localStorage.getItem(this.storageKey)) {
                this.setTheme(e.matches ? 'dark' : 'light');
            }
        });
    }

    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        this.setTheme(newTheme);
        localStorage.setItem(this.storageKey, newTheme);
        this.animateToggle();
    }

    setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        if (this.themeToggle) {
            this.themeToggle.setAttribute('aria-label', theme);
            this.updateToggleAppearance(theme);
        }
    }

    updateToggleAppearance(theme) {
        if (!this.moonMask || !this.sunBeams) return;

        if (theme === 'dark') {
            this.moonMask.style.transform = 'translateX(0)';
            this.sunBeams.style.opacity = '0';
        } else {
            this.moonMask.style.transform = 'translateX(-100%)';
            this.sunBeams.style.opacity = '1';
        }
    }

    animateToggle() {
        if (!this.themeToggle) return;
        
        this.themeToggle.classList.add('theme-toggle--toggling');
        setTimeout(() => {
            this.themeToggle.classList.remove('theme-toggle--toggling');
        }, 500);
    }
}

// Create and initialize theme manager
const themeManager = new ThemeManager(); 