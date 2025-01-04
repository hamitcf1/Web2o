// Create a new file: theme.js in the root directory
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;
const themeIcon = themeToggle.querySelector('i');

// Check for saved theme preference
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
    body.classList.add(savedTheme);
    updateThemeIcon();
}

themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-theme');
    updateThemeIcon();
    // Save theme preference
    localStorage.setItem('theme', body.classList.contains('dark-theme') ? 'dark-theme' : '');
});

function updateThemeIcon() {
    if (body.classList.contains('dark-theme')) {
        themeIcon.className = 'fas fa-sun';
    } else {
        themeIcon.className = 'fas fa-moon';
    }
} 