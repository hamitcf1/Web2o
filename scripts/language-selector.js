class LanguageSelector {
    constructor() {
        this.selector = document.querySelector('.language-selector');
        this.selectedLang = this.selector.querySelector('.selected-language');
        this.currentLangText = this.selector.querySelector('.current-lang');
        this.globeIcon = this.selector.querySelector('.fa-globe');
        
        // Define the order of languages with additional info
        this.languageData = [
            { code: 'en', name: 'English', color: '#3498db', soundFile: 'en_select.mp3' },
            { code: 'tr', name: 'Türkçe', color: '#e74c3c', soundFile: 'en_select2.mp3' },
            { code: 'ru', name: 'Русский', color: '#2ecc71', soundFile: 'en_select3.mp3' },
            { code: 'es', name: 'Español', color: '#9b59b6', soundFile: 'en_select.mp3' },
            { code: 'az', name: 'Azerbaijani', color: '#f1c40f', soundFile: 'en_select2.mp3'}
        ];
        
        // Get saved language or default to 'en'
        this.currentLang = localStorage.getItem('language') || 'en';
        
        // Create audio element for language selection sound
        this.createAudioElement();
        
        // Initialize
        this.init();
        this.bindEvents();
    }
    
    createAudioElement() {
        this.audioElement = new Audio();
        this.audioElement.volume = 0.3; // Soft volume
    }
    
    playLanguageSound(langCode) {
        try {
            // Attempt to play a language-specific sound
            const selectedLang = this.languageData.find(lang => lang.code === langCode);
            if (selectedLang && selectedLang.soundFile) {
                this.audioElement.src = `sounds/${selectedLang.soundFile}`;
                this.audioElement.play().catch(e => console.log('Audio play failed:', e));
            }
        } catch (error) {
            console.error('Error playing language sound:', error);
        }
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
        // Cycle languages on click with enhanced interaction
        this.selectedLang.addEventListener('click', () => {
            const currentIndex = this.languageData.findIndex(lang => lang.code === this.currentLang);
            const nextIndex = (currentIndex + 1) % this.languageData.length;
            const newLang = this.languageData[nextIndex].code;
            
            // Add rotation animation
            this.selectedLang.classList.add('rotating');
            setTimeout(() => {
                this.selectedLang.classList.remove('rotating');
            }, 500);
            
            // Play language selection sound
            this.playLanguageSound(newLang);
            
            this.currentLang = newLang;
            localStorage.setItem('language', newLang);
            document.documentElement.lang = newLang;
            this.updateLanguageUI();
            this.translatePage();
        });
    }
    
    updateLanguageUI() {
        // Remove previous language classes
        this.selector.classList.remove('en', 'tr', 'ru', 'es', 'az');
        
        // Add current language class
        this.selector.classList.add(this.currentLang);
        
        // Update selected language text
        const selectedLang = this.languageData.find(lang => lang.code === this.currentLang);
        if (selectedLang) {
            this.currentLangText.textContent = selectedLang.name;
        }
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
