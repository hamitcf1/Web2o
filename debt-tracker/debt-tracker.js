// Theme toggle functionality
const themeToggle = document.getElementById('theme-toggle');
themeToggle.addEventListener('click', () => {
    document.documentElement.setAttribute('data-theme',
        document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'
    );
});

// Debt tracking functionality
let debts = JSON.parse(localStorage.getItem('debts')) || [];
let monthlySalary = parseFloat(localStorage.getItem('monthlySalary')) || 0;
let currentCurrency = localStorage.getItem('currency') || 'TRY';
let exchangeRates = {
    TRY: 1,
    USD: 0,
    EUR: 0
};

// Initialize currency selector
document.getElementById('currencySelect').value = currentCurrency;

// Fetch exchange rates
async function fetchExchangeRates() {
    try {
        const response = await fetch('https://api.exchangerate-api.com/v4/latest/TRY');
        const data = await response.json();
        exchangeRates.USD = data.rates.USD;
        exchangeRates.EUR = data.rates.EUR;
        updateDebtList();
        updateSummary();
    } catch (error) {
        console.error('Error fetching exchange rates:', error);
    }
}

// Convert amount to selected currency
function convertAmount(amount, fromCurrency, toCurrency) {
    if (fromCurrency === toCurrency) return amount;
    if (fromCurrency === 'TRY') {
        return amount * exchangeRates[toCurrency];
    } else if (toCurrency === 'TRY') {
        return amount / exchangeRates[fromCurrency];
    } else {
        const amountInTRY = amount / exchangeRates[fromCurrency];
        return amountInTRY * exchangeRates[toCurrency];
    }
}

// Currency formatting
function formatCurrency(amount) {
    const currencySymbols = {
        'TRY': '₺',
        'USD': '$',
        'EUR': '€'
    };
    return `${currencySymbols[currentCurrency]}${amount.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })}`;
}

// Initialize language selector
const languageSelector = document.querySelector('.language-selector');
const selectedLanguage = languageSelector.querySelector('.selected-language');
const languageDropdown = languageSelector.querySelector('.language-dropdown');
const languageOptions = languageSelector.querySelectorAll('.language-option');

selectedLanguage.addEventListener('click', () => {
    languageDropdown.style.display = languageDropdown.style.display === 'block' ? 'none' : 'block';
});

languageOptions.forEach(option => {
    option.addEventListener('click', () => {
        const lang = option.dataset.lang;
        document.documentElement.setAttribute('data-lang', lang);
        selectedLanguage.querySelector('.current-lang').textContent = 
            option.querySelector('span').textContent;
        languageDropdown.style.display = 'none';
        localStorage.setItem('language', lang);
        translatePage(lang);
    });
});

// Translation function
function translatePage(lang) {
    const elements = document.querySelectorAll('[data-translate]');
    elements.forEach(element => {
        const key = element.dataset.translate;
        if (debtTrackerTranslations[lang] && debtTrackerTranslations[lang][key]) {
            element.textContent = debtTrackerTranslations[lang][key];
        }
    });

    const placeholders = document.querySelectorAll('[data-translate-placeholder]');
    placeholders.forEach(element => {
        const key = element.dataset.translatePlaceholder;
        if (debtTrackerTranslations[lang] && debtTrackerTranslations[lang][key]) {
            element.placeholder = debtTrackerTranslations[lang][key];
        }
    });
}

// Initialize with saved language
const savedLanguage = localStorage.getItem('language') || 'en';
document.documentElement.setAttribute('data-lang', savedLanguage);
selectedLanguage.querySelector('.current-lang').textContent = 
    document.querySelector(`[data-lang="${savedLanguage}"]`).querySelector('span').textContent;
translatePage(savedLanguage);

document.getElementById('monthlySalary').value = monthlySalary;

document.getElementById('monthlySalary').addEventListener('input', (e) => {
    monthlySalary = parseFloat(e.target.value) || 0;
    localStorage.setItem('monthlySalary', monthlySalary);
    updateSummary();
});

document.getElementById('currencySelect').addEventListener('change', (e) => {
    currentCurrency = e.target.value;
    localStorage.setItem('currency', currentCurrency);
    updateDebtList();
    updateSummary();
});

document.getElementById('debtForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const bankName = document.getElementById('bankName').value;
    const amount = parseFloat(document.getElementById('debtAmount').value);
    const interestRate = parseFloat(document.getElementById('interestRate').value);

    if (bankName && amount && interestRate) {
        debts.push({ 
            bankName, 
            amount, 
            interestRate,
            currency: currentCurrency 
        });
        localStorage.setItem('debts', JSON.stringify(debts));
        updateDebtList();
        updateSummary();
        e.target.reset();
    }
});

function updateDebtList() {
    const debtItems = document.getElementById('debtItems');
    debtItems.innerHTML = '';

    debts.forEach((debt, index) => {
        const debtItem = document.createElement('div');
        debtItem.className = 'debt-item';
        const amountInCurrentCurrency = convertAmount(
            debt.amount,
            debt.currency,
            currentCurrency
        );
        debtItem.innerHTML = `
            <div>
                <strong>${debt.bankName}</strong>
                <p><span data-translate="amount">Amount</span>: ${formatCurrency(amountInCurrentCurrency)}</p>
                <p><span data-translate="interest_rate">Interest Rate</span>: ${debt.interestRate}%</p>
            </div>
            <button class="delete-btn" onclick="deleteDebt(${index})">
                <i class="fas fa-trash"></i>
            </button>
        `;
        debtItems.appendChild(debtItem);
    });
    translatePage(document.documentElement.getAttribute('data-lang'));
}

function deleteDebt(index) {
    debts.splice(index, 1);
    localStorage.setItem('debts', JSON.stringify(debts));
    updateDebtList();
    updateSummary();
}

function updateSummary() {
    const totalDebt = debts.reduce((sum, debt) => {
        return sum + convertAmount(debt.amount, debt.currency, currentCurrency);
    }, 0);
    
    const monthlyPaymentPercentage = 0.3;
    const monthlyPayment = monthlySalary * monthlyPaymentPercentage;
    
    const weightedInterestRate = debts.reduce((sum, debt) => {
        const debtInCurrentCurrency = convertAmount(debt.amount, debt.currency, currentCurrency);
        return sum + (debtInCurrentCurrency / totalDebt) * (debt.interestRate / 100);
    }, 0);
    
    let monthsToDebtFree = 0;
    if (monthlyPayment > 0 && totalDebt > 0) {
        const monthlyRate = weightedInterestRate / 12;
        if (monthlyPayment > totalDebt * monthlyRate) {
            monthsToDebtFree = Math.ceil(
                Math.log(monthlyPayment / (monthlyPayment - totalDebt * monthlyRate)) /
                Math.log(1 + monthlyRate)
            );
        } else {
            monthsToDebtFree = Infinity;
        }
    }

    const debtToIncomeRatio = monthlySalary ? (totalDebt / (monthlySalary * 12)) * 100 : 0;

    document.getElementById('totalDebt').textContent = formatCurrency(totalDebt);
    document.getElementById('monthlyPayment').textContent = formatCurrency(monthlyPayment);
    document.getElementById('timeToDebtFree').textContent = 
        monthsToDebtFree === Infinity 
            ? debtTrackerTranslations[document.documentElement.getAttribute('data-lang')].insufficient_payment 
            : (monthsToDebtFree > 0 
                ? `${monthsToDebtFree} ${debtTrackerTranslations[document.documentElement.getAttribute('data-lang')].months}` 
                : debtTrackerTranslations[document.documentElement.getAttribute('data-lang')].not_applicable);
    document.getElementById('debtToIncome').textContent = `${debtToIncomeRatio.toFixed(1)}%`;
}

// Clear data functionality
document.getElementById('clearDataBtn').addEventListener('click', () => {
    if (confirm(debtTrackerTranslations[document.documentElement.getAttribute('data-lang')].clear_data_confirm)) {
        localStorage.removeItem('debts');
        localStorage.removeItem('monthlySalary');
        localStorage.removeItem('currency');
        debts = [];
        monthlySalary = 0;
        currentCurrency = 'TRY';
        document.getElementById('monthlySalary').value = '';
        document.getElementById('currencySelect').value = 'TRY';
        updateDebtList();
        updateSummary();
    }
});

// Initial load
fetchExchangeRates();
updateDebtList();
updateSummary();

// Refresh exchange rates every hour
setInterval(fetchExchangeRates, 3600000);
