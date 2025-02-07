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

class LanguageSelector {
    constructor() {
        this.selector = document.querySelector('.language-selector');
        this.selectedLang = this.selector.querySelector('.selected-language');
        this.currentLangText = this.selector.querySelector('.current-lang');
        this.dropdown = this.selector.querySelector('.language-dropdown');
        this.options = this.selector.querySelectorAll('.language-option');
        
        // Get saved language or default to 'en'
        this.currentLang = localStorage.getItem('language') || 'en';
        
        // Initialize
        this.init();
        this.bindEvents();
    }
    
    init() {
        // Set initial language
        document.documentElement.lang = this.currentLang;
        
        // Update UI
        this.updateLanguageUI();
        
        // Translate page
        this.translatePage();
    }
    
    bindEvents() {
        // Toggle dropdown
        this.selectedLang.addEventListener('click', () => {
            this.selector.classList.toggle('active');
        });
        
        // Handle language selection
        this.options.forEach(option => {
            option.addEventListener('click', () => {
                const newLang = option.dataset.lang;
                if (newLang !== this.currentLang) {
                    this.currentLang = newLang;
                    localStorage.setItem('language', newLang);
                    document.documentElement.lang = newLang;
                    this.updateLanguageUI();
                    this.translatePage();
                }
                this.selector.classList.remove('active');
            });
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.selector.contains(e.target)) {
                this.selector.classList.remove('active');
            }
        });
    }
    
    updateLanguageUI() {
        // Update selected language text
        const selectedOption = this.selector.querySelector(`[data-lang="${this.currentLang}"]`);
        if (selectedOption) {
            this.currentLangText.textContent = selectedOption.querySelector('span').textContent;
        }
        
        // Update checkmarks
        this.options.forEach(option => {
            if (option.dataset.lang === this.currentLang) {
                option.classList.add('selected');
            } else {
                option.classList.remove('selected');
            }
        });
    }
    
    translatePage() {
        if (!window.translations || !window.translations[this.currentLang]) {
            console.error(`Translations not found for language: ${this.currentLang}`);
            return;
        }
        
        const elements = document.querySelectorAll('[data-translate]');
        elements.forEach(element => {
            const key = element.dataset.translate;
            const translation = window.translations[this.currentLang][key];
            
            if (translation) {
                if (element.tagName === 'INPUT' && element.type === 'text') {
                    element.placeholder = translation;
                } else {
                    element.textContent = translation;
                }
            }
        });
    }
}

// Initialize language selector when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new LanguageSelector();
});
