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
    
    historyItem.innerHTML = `
        <div class="history-qr-image">
            <img src="${qrImageUrl || `https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(qrContent)}`}" alt="QR Code" width="50" height="50">
        </div>
        <div class="history-content">${qrContent}</div>
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

    scanner = new Instascan.Scanner({ video: video });

    scanner.addListener('scan', function (content) {
        resultText.textContent = content;
        saveToHistory(content, null);
        
        if (content.startsWith('http://') || content.startsWith('https://')) {
            resultText.innerHTML = `<a href="${content}" target="_blank">${content}</a>`;
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
    
    // Display existing history
    displayHistory();
    
    // Clear history button
    const clearHistoryBtn = document.getElementById('clear-history');
    if (clearHistoryBtn) {
        clearHistoryBtn.addEventListener('click', clearHistory);
    }
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
