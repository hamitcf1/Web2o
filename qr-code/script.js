// QR Code Generator
const qrText = document.getElementById('qr-text');
const generateBtn = document.getElementById('generate-btn');
const qrCode = document.getElementById('qr-code');
const downloadLink = document.getElementById('download-link');
const qrPlaceholder = document.querySelector('.qr-placeholder');

generateBtn.addEventListener('click', generateQRCode);

function generateQRCode() {
    const text = qrText.value.trim();
    if (!text) {
        qrPlaceholder.style.display = 'flex';
        qrCode.style.display = 'none';
        downloadLink.style.display = 'none';
        return;
    }

    const apiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(text)}`;
    
    // Show loading state
    qrPlaceholder.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
    qrPlaceholder.style.display = 'flex';
    qrCode.style.display = 'none';
    downloadLink.style.display = 'none';

    // Load the QR code
    qrCode.onload = function() {
        qrPlaceholder.style.display = 'none';
        qrCode.style.display = 'block';
        downloadLink.style.display = 'inline-flex';
    };

    qrCode.onerror = function() {
        qrPlaceholder.innerHTML = `
            <i class="fas fa-exclamation-circle"></i>
            <span>Error generating QR code</span>
        `;
        qrPlaceholder.style.display = 'flex';
        qrCode.style.display = 'none';
        downloadLink.style.display = 'none';
    };

    qrCode.src = apiUrl;
    downloadLink.href = apiUrl;
}

// QR Code Scanner
const video = document.getElementById('preview');
const resultText = document.getElementById('result-text');
const startScanBtn = document.getElementById('start-scan');
const stopScanBtn = document.getElementById('stop-scan');
const videoContainer = document.querySelector('.video-container');
const scanResult = document.getElementById('scan-result');

let scanner = null;

startScanBtn.addEventListener('click', startScanner);
stopScanBtn.addEventListener('click', stopScanner);

function startScanner() {
    videoContainer.style.display = 'block';
    scanResult.style.display = 'block';
    resultText.textContent = '';

    // Initialize scanner
    scanner = new Instascan.Scanner({ video: video });

    scanner.addListener('scan', function (content) {
        resultText.textContent = content;
        // If the content is a URL, make it clickable
        if (content.startsWith('http://') || content.startsWith('https://')) {
            resultText.innerHTML = `<a href="${content}" target="_blank">${content}</a>`;
        }
    });

    // Start camera
    Instascan.Camera.getCameras()
        .then(function (cameras) {
            if (cameras.length > 0) {
                scanner.start(cameras[0])
                    .then(() => {
                        startScanBtn.style.display = 'none';
                        stopScanBtn.style.display = 'inline-flex';
                    })
                    .catch(handleError);
            } else {
                handleError('No cameras found on your device.');
            }
        })
        .catch(handleError);
}

function stopScanner() {
    if (scanner) {
        scanner.stop();
        scanner = null;
    }
    videoContainer.style.display = 'none';
    startScanBtn.style.display = 'inline-flex';
    stopScanBtn.style.display = 'none';
}

function handleError(error) {
    console.error(error);
    resultText.textContent = typeof error === 'string' ? error : 'Error accessing camera: ' + error.message;
    stopScanner();
}

// Theme Toggle
const themeToggle = document.getElementById('theme-toggle');
themeToggle.addEventListener('click', () => {
    const html = document.documentElement;
    if (html.getAttribute('data-theme') === 'dark') {
        html.setAttribute('data-theme', 'light');
    } else {
        html.setAttribute('data-theme', 'dark');
    }
});

// Language Selector
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
