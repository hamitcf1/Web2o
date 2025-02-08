document.addEventListener('DOMContentLoaded', () => {
    const TIME_DIFFERENCE = 8; // Hours between New York and Istanbul

    // DOM Elements
    const istDigitalClock = document.getElementById('istDigitalClock');
    const nyDigitalClock = document.getElementById('nyDigitalClock');
    const istDateDisplay = document.getElementById('istDateDisplay');
    const nyDateDisplay = document.getElementById('nyDateDisplay');
    const syncTimeBtn = document.getElementById('syncTimeBtn');
    const timeDifferenceDisplay = document.getElementById('timeDifferenceDisplay');
    const adjustTimeButtons = document.querySelectorAll('.adjust-time');

    // Direct Input Elements
    const istDirectTime = document.getElementById('istDirectTime');
    const istDirectDate = document.getElementById('istDirectDate');
    const nyDirectTime = document.getElementById('nyDirectTime');
    const nyDirectDate = document.getElementById('nyDirectDate');
    const istDirectInputContainer = document.getElementById('istDirectInputContainer');
    const nyDirectInputContainer = document.getElementById('nyDirectInputContainer');

    // Global Toggle Elements
    const globalDirectInputToggle = document.getElementById('directInputToggle');
    const global24HourToggle = document.getElementById('24HourToggle');

    // Time management
    let istanbulTime = new Date();
    let timeFormat = {
        ist: { is24Hour: false, directInputEnabled: false },
        ny: { is24Hour: false, directInputEnabled: false }
    };

    function formatTime(date, is24Hour) {
        if (is24Hour) {
            return date.toLocaleTimeString('en-US', {
                hour: '2-digit', 
                minute: '2-digit',
                hour12: false
            });
        }
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit', 
            minute: '2-digit',
            hour12: true
        });
    }

    function formatDate(date) {
        // Use the current language from localStorage or default to 'en'
        const currentLang = localStorage.getItem('language') || 'en';
        const dateFormatOptions = window.translations[currentLang].date_format;
        
        return date.toLocaleDateString(currentLang, dateFormatOptions);
    }

    function formatInputDate(date) {
        return date.toISOString().split('T')[0];
    }

    function formatInputTime(date) {
        return date.toTimeString().slice(0, 5);
    }

    function calculateNewYorkTime(istTime) {
        return new Date(istTime.getTime() - (TIME_DIFFERENCE * 60 * 60 * 1000));
    }

    function updateDisplay() {
        const nyTime = calculateNewYorkTime(istanbulTime);

        // Update digital clocks
        istDigitalClock.textContent = formatTime(istanbulTime, timeFormat.ist.is24Hour);
        nyDigitalClock.textContent = formatTime(nyTime, timeFormat.ist.is24Hour);

        // Update date displays
        istDateDisplay.textContent = formatDate(istanbulTime);
        nyDateDisplay.textContent = formatDate(nyTime);

        // Update direct input fields
        istDirectTime.value = formatInputTime(istanbulTime);
        istDirectDate.value = formatInputDate(istanbulTime);
        nyDirectTime.value = formatInputTime(nyTime);
        nyDirectDate.value = formatInputDate(nyTime);
    }

    function adjustTime(city, unit, adjustment) {
        if (city === 'ist') {
            if (unit === 'hour') {
                istanbulTime.setHours(istanbulTime.getHours() + adjustment);
            } else if (unit === 'minute') {
                istanbulTime.setMinutes(istanbulTime.getMinutes() + adjustment);
            }
        } else if (city === 'ny') {
            const nyTime = calculateNewYorkTime(istanbulTime);
            
            if (unit === 'hour') {
                nyTime.setHours(nyTime.getHours() + adjustment);
            } else if (unit === 'minute') {
                nyTime.setMinutes(nyTime.getMinutes() + adjustment);
            }
            
            // Recalculate Istanbul time based on adjusted New York time
            istanbulTime = new Date(nyTime.getTime() + (TIME_DIFFERENCE * 60 * 60 * 1000));
        }
        updateDisplay();
    }

    function handleDirectInput(city) {
        let newTime;
        if (city === 'ist') {
            const inputDate = new Date(istDirectDate.value);
            const [hours, minutes] = istDirectTime.value.split(':');
            
            inputDate.setHours(parseInt(hours), parseInt(minutes));
            istanbulTime = inputDate;
        } else if (city === 'ny') {
            const inputDate = new Date(nyDirectDate.value);
            const [hours, minutes] = nyDirectTime.value.split(':');
            
            inputDate.setHours(parseInt(hours), parseInt(minutes));
            istanbulTime = new Date(inputDate.getTime() + (TIME_DIFFERENCE * 60 * 60 * 1000));
        }
        
        updateDisplay();
    }

    function toggleGlobalDirectInput() {
        const isChecked = globalDirectInputToggle.checked;

        // Update direct input containers
        istDirectInputContainer.style.display = isChecked ? 'flex' : 'none';
        nyDirectInputContainer.style.display = isChecked ? 'flex' : 'none';

        // Update time format state
        timeFormat.ist.directInputEnabled = isChecked;
        timeFormat.ny.directInputEnabled = isChecked;
    }

    function toggleGlobal24HourFormat() {
        const isChecked = global24HourToggle.checked;

        // Update time format
        timeFormat.ist.is24Hour = isChecked;
        timeFormat.ny.is24Hour = isChecked;

        updateDisplay();
    }

    function syncTimes() {
        istanbulTime = new Date();
        updateDisplay();
    }

    // Mobile Menu Toggle
    function toggleMobileMenu() {
        const mobileMenu = document.getElementById('mobileMenu');
        mobileMenu.classList.toggle('active');
        document.body.classList.toggle('mobile-menu-open');
    }

    // Responsive Controls Placement
    function updateControlsPlacement() {
        const navControls = document.querySelector('.nav-controls');
        const mobileThemeToggle = document.querySelector('.mobile-theme-toggle');
        const mobileLanguageSelector = document.querySelector('.mobile-language-selector');
        const themeToggle = document.getElementById('theme-toggle');
        const languageSelector = document.querySelector('.language-selector');

        if (window.innerWidth <= 768) {
            // Move to mobile menu
            if (themeToggle && mobileThemeToggle) {
                mobileThemeToggle.innerHTML = '';
                mobileThemeToggle.appendChild(themeToggle.cloneNode(true));
            }
            if (languageSelector && mobileLanguageSelector) {
                mobileLanguageSelector.innerHTML = '';
                mobileLanguageSelector.appendChild(languageSelector.cloneNode(true));
            }
            navControls.style.display = 'none';
        } else {
            // Restore to original nav controls
            navControls.style.display = 'flex';
            if (mobileMenu) {
                mobileMenu.classList.remove('active');
                document.body.classList.remove('mobile-menu-open');
            }
        }
    }

    // Expose toggleMobileMenu globally
    window.toggleMobileMenu = toggleMobileMenu;

    // Initial placement and responsive updates
    window.addEventListener('load', updateControlsPlacement);
    window.addEventListener('resize', updateControlsPlacement);

    // Event Listeners
    adjustTimeButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const city = e.currentTarget.dataset.city;
            const unit = e.currentTarget.dataset.unit;
            const adjustment = parseInt(e.currentTarget.dataset.adjustment);
            adjustTime(city, unit, adjustment);
        });
    });

    // Direct Input Event Listeners
    istDirectTime.addEventListener('change', () => handleDirectInput('ist'));
    istDirectDate.addEventListener('change', () => handleDirectInput('ist'));
    nyDirectTime.addEventListener('change', () => handleDirectInput('ny'));
    nyDirectDate.addEventListener('change', () => handleDirectInput('ny'));

    // Global Toggle Event Listeners
    globalDirectInputToggle.addEventListener('change', toggleGlobalDirectInput);
    global24HourToggle.addEventListener('change', toggleGlobal24HourFormat);

    syncTimeBtn.addEventListener('click', syncTimes);

    // Initial setup
    updateDisplay();
    setInterval(updateDisplay, 1000);

    // Set time difference display
    timeDifferenceDisplay.textContent = `+${TIME_DIFFERENCE} hours`;
});
