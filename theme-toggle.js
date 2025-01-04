document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Function to update theme
    const updateTheme = (isDark) => {
        document.documentElement.classList.toggle('dark-theme', isDark);
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        
        // Update meta theme-color
        const metaThemeColor = document.querySelector('meta[name="theme-color"]');
        if (metaThemeColor) {
            metaThemeColor.content = isDark ? '#000000' : '#ffffff';
        }
    };
    
    // Initialize theme based on system preference
    const savedTheme = localStorage.getItem('theme');
    if (!savedTheme) {
        // No saved preference, use system preference
        updateTheme(prefersDarkScheme.matches);
    } else {
        // Use saved preference
        updateTheme(savedTheme === 'dark');
    }
    
    // Listen for theme toggle clicks
    themeToggle.addEventListener('click', () => {
        const isDark = document.documentElement.classList.toggle('dark-theme');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });
    
    // Listen for system theme changes
    prefersDarkScheme.addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            updateTheme(e.matches);
        }
    });
}); 