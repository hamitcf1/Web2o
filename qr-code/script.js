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
    saveToHistory(text, apiUrl);
}

// QR History Management
const MAX_HISTORY_ITEMS = 10;

function saveToHistory(qrContent, qrImageUrl) {
    let history = JSON.parse(localStorage.getItem('qrHistory') || '[]');
    
    // Add new item at the beginning
    history.unshift({
        content: qrContent,
        imageUrl: qrImageUrl,
        timestamp: new Date().toISOString()
    });
    
    // Keep only the last MAX_HISTORY_ITEMS items
    history = history.slice(0, MAX_HISTORY_ITEMS);
    
    // Save to localStorage
    localStorage.setItem('qrHistory', JSON.stringify(history));
    
    // Update UI
    displayHistory();
}

function displayHistory() {
    const historyList = document.getElementById('history-list');
    const history = JSON.parse(localStorage.getItem('qrHistory') || '[]');
    
    historyList.innerHTML = '';
    
    history.forEach(item => {
        addHistoryItem(item.content, item.timestamp, item.imageUrl);
    });
}

function addHistoryItem(qrContent, timestamp, qrImageUrl) {
    const historyList = document.getElementById('history-list');
    const historyItem = document.createElement('div');
    historyItem.className = 'history-item';
    
    // Try to create URL object to get hostname
    let displayText = qrContent;
    let urlDisplay = '';
    try {
        const url = new URL(qrContent);
        displayText = url.hostname;
        urlDisplay = qrContent;
    } catch (e) {
        // Not a URL, use content as is
        displayText = qrContent;
    }
    
    historyItem.innerHTML = `
        <div class="history-qr-image">
            <img src="${qrImageUrl || `https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(qrContent)}`}" alt="QR Code" width="50" height="50">
        </div>
        <div class="history-content">
            <div class="history-content-text">${displayText}</div>
            ${urlDisplay ? `<div class="history-content-url">${urlDisplay}</div>` : ''}
        </div>
        <div class="history-time">${new Date(timestamp).toLocaleString()}</div>
        <button class="history-use" onclick="useQRCode('${qrContent.replace(/'/g, "\\'")}')">
            <i class="fas fa-redo"></i>
            <span data-translate="use_qr">Use QR Code</span>
        </button>
    `;
    
    historyList.insertBefore(historyItem, historyList.firstChild);
    updateTranslations();
}

// QR Code Scanner
const video = document.getElementById('preview');
const resultText = document.getElementById('result-text');
const startScanBtn = document.getElementById('start-scan');
const stopScanBtn = document.getElementById('stop-scan');
const videoContainer = document.querySelector('.video-container');
const scanResult = document.getElementById('scan-result');
const cameraSwitch = document.getElementById('camera-switch');

let scanner = null;
let currentCameraIndex = 0;
let cameras = [];

startScanBtn.addEventListener('click', startScanner);
stopScanBtn.addEventListener('click', stopScanner);
cameraSwitch.addEventListener('click', switchCamera);

function startScanner() {
    videoContainer.style.display = 'block';
    scanResult.style.display = 'block';
    resultText.textContent = '';

    scanner = new Instascan.Scanner({ 
        video: video,
        mirror: false  // Prevent mirroring of camera
    });

    scanner.addListener('scan', function (content) {
        resultText.textContent = content;
        saveToHistory(content, null);
        
        // Function to check if string looks like a domain
        function isValidDomain(str) {
            // Match common domain patterns (e.g., example.com, sub.example.co.uk)
            const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9](\.[a-zA-Z]{2,})+$/;
            return domainRegex.test(str);
        }

        let urlToUse = content;
        
        // If content doesn't start with a protocol but looks like a domain, add https://
        if (!content.match(/^[a-zA-Z]+:\/\//) && isValidDomain(content)) {
            urlToUse = 'https://' + content;
        }

        // Try to create a URL object to check if content is a valid URL
        try {
            new URL(urlToUse);
            // If no error is thrown, it's a valid URL
            resultText.innerHTML = `<a href="${urlToUse}" target="_blank">${content}</a>`;
        } catch (e) {
            // If error is thrown, it's not a valid URL
            resultText.textContent = content;
        }
    });

    Instascan.Camera.getCameras()
        .then(function (availableCameras) {
            cameras = availableCameras;
            if (cameras.length > 0) {
                scanner.start(cameras[currentCameraIndex])
                    .then(() => {
                        startScanBtn.style.display = 'none';
                        stopScanBtn.style.display = 'inline-flex';
                        if (cameras.length > 1) {
                            cameraSwitch.style.display = 'inline-flex';
                        }
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
    scanResult.style.display = 'none';
    startScanBtn.style.display = 'inline-flex';
    stopScanBtn.style.display = 'none';
    cameraSwitch.style.display = 'none';
}

async function switchCamera() {
    if (cameras.length <= 1) return;
    
    currentCameraIndex = (currentCameraIndex + 1) % cameras.length;
    
    if (scanner) {
        await scanner.stop();
        try {
            await scanner.start(cameras[currentCameraIndex]);
        } catch (err) {
            handleError(err);
        }
    }
}

function handleError(error) {
    console.error(error);
    resultText.textContent = typeof error === 'string' ? error : 'Error accessing camera: ' + error.message;
    stopScanner();
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Initialize language selector
    new LanguageSelector();
    
    // Initialize history toggle
    const toggleHistoryBtn = document.getElementById('toggle-history');
    const historyContent = document.getElementById('history-content');
    
    // Set initial state (closed by default)
    historyContent.style.maxHeight = '0px';
    
    toggleHistoryBtn.addEventListener('click', () => {
        toggleHistoryBtn.classList.toggle('active');
        historyContent.classList.toggle('active');
        
        if (historyContent.classList.contains('active')) {
            historyContent.style.maxHeight = historyContent.scrollHeight + 'px';
        } else {
            historyContent.style.maxHeight = '0px';
        }
    });
    
    // Display existing history
    displayHistory();
    
    // Clear history button
    const clearHistoryBtn = document.getElementById('clear-history');
    if (clearHistoryBtn) {
        clearHistoryBtn.addEventListener('click', clearHistory);
    }
    
    const qrText = document.getElementById('qr-text');
    const generateBtn = document.getElementById('generate-btn');
    
    // Handle enter key press
    qrText.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault(); // Prevent default form submission
            generateQRCode();
        }
    });
    
    // Handle mobile keyboard "Go" or "Done" button
    qrText.addEventListener('keyup', (event) => {
        if (event.key === 'Enter') {
            // Close mobile keyboard
            qrText.blur();
        }
    });
});

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
        console.log('🌐 Initializing LanguageSelector');
        
        this.selector = document.querySelector('.language-selector');
        this.selectedLang = this.selector.querySelector('.selected-language');
        this.currentLangText = this.selector.querySelector('.current-lang');
        
        // Define the order of languages
        this.languageData = [
            { code: 'en', name: 'English' },
            { code: 'tr', name: 'Türkçe' },
            { code: 'ru', name: 'Русский' }
        ];
        
        // Get saved language or default to 'en'
        this.currentLang = localStorage.getItem('language') || 'en';
        
        // Initialize
        this.init();
        this.bindEvents();
    }
    
    init() {
        console.log('🚀 Initializing Language Settings');
        
        // Validate current language
        if (!window.translations[this.currentLang]) {
            console.warn(`⚠️ Saved language ${this.currentLang} not found. Defaulting to English.`);
            this.currentLang = 'en';
            localStorage.setItem('language', 'en');
        }

        // Set initial language
        document.documentElement.lang = this.currentLang;
        
        // Update UI
        this.updateLanguageUI();
        
        // Translate page
        this.translatePage();
    }

    bindEvents() {
        console.log('🔗 Binding Language Selector Events');
        
        // Cycle languages on click
        this.selectedLang.addEventListener('click', () => {
            const currentIndex = this.languageData.findIndex(lang => lang.code === this.currentLang);
            const nextIndex = (currentIndex + 1) % this.languageData.length;
            const newLang = this.languageData[nextIndex].code;
            
            // Add rotation animation
            this.selectedLang.classList.add('rotating');
            setTimeout(() => {
                this.selectedLang.classList.remove('rotating');
            }, 500);
            
            this.changeLanguage(newLang);
        });
    }

    changeLanguage(lang) {
        console.log(`🔄 Changing Language to: ${lang}`);
        
        // Extensive validation
        if (!lang) {
            console.error('❌ Invalid language: No language provided');
            return;
        }

        if (!window.translations) {
            console.error('❌ Translations object is undefined');
            return;
        }

        if (!window.translations[lang]) {
            console.error(`❌ Translations not found for language: ${lang}`);
            return;
        }

        // Update current language
        this.currentLang = lang;
        localStorage.setItem('language', lang);
        document.documentElement.lang = lang;
        
        // Update UI and translations
        this.updateLanguageUI();
        this.translatePage();

        console.log(`✅ Language Changed to ${lang} Successfully`);
    }

    updateLanguageUI() {
        console.log('🖌️ Updating Language UI');
        
        // Update current language text
        if (this.currentLangText) {
            const languageNames = {
                'en': 'English',
                'tr': 'Türkçe',
                'ru': 'Русский'
            };
            const displayName = languageNames[this.currentLang] || this.currentLang;
            this.currentLangText.textContent = displayName;
        }
    }

    translatePage() {
        console.log('📝 Translating Page');
        
        if (!window.translations) {
            console.error('❌ Translations object is undefined');
            return;
        }

        if (!window.translations[this.currentLang]) {
            console.error(`❌ Translations not found for language: ${this.currentLang}`);
            return;
        }

        // Get all elements with data-translate attribute
        const translateElements = document.querySelectorAll('[data-translate]');
        
        translateElements.forEach(element => {
            const translationKey = element.getAttribute('data-translate');
            
            try {
                const translatedText = window.translations[this.currentLang][translationKey] 
                    || window.translations['en'][translationKey] 
                    || `[${translationKey}]`;
                
                if (translatedText) {
                    // Handle different element types
                    if (element.tagName === 'INPUT' && element.type === 'text') {
                        element.placeholder = translatedText;
                    } else {
                        element.textContent = translatedText;
                    }
                } else {
                    console.warn(`❓ No translation found for key: ${translationKey}`);
                }
            } catch (error) {
                console.error(`❌ Error translating element with key ${translationKey}:`, error);
            }
        });
    }
}

function updateTranslations() {
    const elements = document.querySelectorAll('[data-translate]');
    elements.forEach(element => {
        const key = element.dataset.translate;
        const translation = window.translations[document.documentElement.lang][key];
        
        if (translation) {
            if (element.tagName === 'INPUT' && element.type === 'text') {
                element.placeholder = translation;
            } else {
                element.textContent = translation;
            }
        }
    });
}

function clearHistory() {
    localStorage.removeItem('qrHistory');
    displayHistory();
}

function useQRCode(content) {
    const qrInput = document.getElementById('qr-text');
    qrInput.value = content;
    generateQRCode();
}
