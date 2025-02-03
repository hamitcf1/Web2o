const translations = {
    en: {
        projects: "Projects",
        experience: "Experience",
        education: "Education",
        reviews: "Reviews",
        getInTouch: "Get in Touch",
        upcoming: "Upcoming Project"
    },
    tr: {
        projects: "Projeler",
        experience: "Deneyim",
        education: "Eğitim",
        reviews: "Değerlendirmeler",
        getInTouch: "İletişime Geç",
        upcoming: "Gelecek Proje"
    },
    ru: {
        projects: "Проекты",
        experience: "Опыт",
        education: "Образование",
        reviews: "Отзывы",
        getInTouch: "Связаться",
        upcoming: "Предстоящий проект"
    }
};

// Get the saved language or use default
let currentLanguage = localStorage.getItem('selectedLanguage') || 'en';

// Function to update content based on selected language
function updateContent(lang) {
    if (!window.translations || !window.translations[lang]) {
        console.error('Translations not loaded or language not found:', lang);
        return;
    }

    currentLanguage = lang;
    localStorage.setItem('selectedLanguage', lang);
    document.documentElement.setAttribute('lang', lang);

    const elements = document.querySelectorAll('[data-translate]');
    elements.forEach(element => {
        const key = element.getAttribute('data-translate');
        if (window.translations[lang][key]) {
            element.textContent = window.translations[lang][key];
        }
    });
}

// Initialize language selector functionality
document.addEventListener('DOMContentLoaded', () => {
    const languageBtn = document.querySelector('.language-btn');
    const languageMenu = document.querySelector('.language-menu');
    const languageOptions = document.querySelectorAll('.language-option');

    if (!languageBtn || !languageMenu || !languageOptions.length) {
        console.error('Language selector elements not found');
        return;
    }

    // Toggle language menu
    languageBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        languageMenu.classList.toggle('show');
    });

    // Handle language selection
    languageOptions.forEach(option => {
        option.addEventListener('click', (e) => {
            e.stopPropagation();
            const lang = option.getAttribute('data-lang');
            if (lang) {
                updateContent(lang);
                languageMenu.classList.remove('show');

                // Update active state
                languageOptions.forEach(opt => opt.classList.remove('active'));
                option.classList.add('active');
            }
        });
    });

    // Close language menu when clicking outside
    document.addEventListener('click', () => {
        languageMenu.classList.remove('show');
    });

    // Set initial language and active state
    updateContent(currentLanguage);
    languageOptions.forEach(option => {
        if (option.getAttribute('data-lang') === currentLanguage) {
            option.classList.add('active');
        }
    });
});
