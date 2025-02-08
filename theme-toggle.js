// Only create ThemeManager if it doesn't exist
if (!window.themeManager) {
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
            this.storageKey = 'theme';
            this.moonMask = document.querySelector('.moon');
            this.sunBeams = document.querySelector('.sun-beams');

            if (this.themeToggle) {
                // Apply initial theme
                this.applyInitialTheme();
                // Setup click handler
                this.themeToggle.addEventListener('click', () => this.toggleTheme());
            }
        }

        applyInitialTheme() {
            const storedTheme = localStorage.getItem(this.storageKey);
            const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            const themeToApply = storedTheme || (systemPrefersDark ? 'dark' : 'light');
            
            this.applyTheme(themeToApply);
        }

        applyTheme(theme) {
            document.documentElement.setAttribute('data-theme', theme);
            localStorage.setItem(this.storageKey, theme);
            
            // Add animation class
            if (this.themeToggle) {
                this.themeToggle.classList.add('theme-toggle--toggling');
                setTimeout(() => {
                    this.themeToggle.classList.remove('theme-toggle--toggling');
                }, 500);
            }
        }

        toggleTheme() {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            this.applyTheme(newTheme);
        }
    }

    // Create and initialize theme manager
    window.themeManager = new ThemeManager();
}