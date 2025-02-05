document.addEventListener('DOMContentLoaded', () => {
    // Get all input elements
    const nyHours = document.getElementById('nyHours');
    const nyMinutes = document.getElementById('nyMinutes');
    const nyPeriod = document.getElementById('nyPeriod');
    const istHours = document.getElementById('istHours');
    const istMinutes = document.getElementById('istMinutes');
    const istPeriod = document.getElementById('istPeriod');
    const nyDateElement = document.getElementById('nyDate');
    const istDateElement = document.getElementById('istDate');
    const currentTimeBtn = document.getElementById('currentTimeBtn');
    const switchTimesBtn = document.getElementById('switchTimesBtn');

    // Time difference between Istanbul and New York (8 hours)
    const TIME_DIFFERENCE = 8;

    function validateTimeInput(input, max) {
        let value = input.value.replace(/\D/g, '');
        value = Math.min(parseInt(value) || 0, max).toString().padStart(2, '0');
        input.value = value;
        return value;
    }

    function animateUpdate(element) {
        element.style.transform = 'scale(1.05)';
        element.style.transition = 'transform 0.2s ease';
        
        setTimeout(() => {
            element.style.transform = 'scale(1)';
        }, 200);
    }

    function updateDates(hours24, minutes, isNYTime) {
        const date = new Date();
        date.setHours(hours24);
        date.setMinutes(minutes);

        const nyDate = isNYTime ? date : new Date(date.getTime() - TIME_DIFFERENCE * 60 * 60 * 1000);
        const istDate = isNYTime ? new Date(date.getTime() + TIME_DIFFERENCE * 60 * 60 * 1000) : date;

        const options = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            timeZone: 'UTC'
        };

        const nyDateStr = nyDate.toLocaleDateString('en-US', options);
        const istDateStr = istDate.toLocaleDateString('en-US', options);

        if (nyDateElement.textContent !== nyDateStr) {
            animateUpdate(nyDateElement);
            nyDateElement.textContent = nyDateStr;
        }

        if (istDateElement.textContent !== istDateStr) {
            animateUpdate(istDateElement);
            istDateElement.textContent = istDateStr;
        }
    }

    function convertTo24Hour(hours, period) {
        // Validate input
        hours = parseInt(hours);
        if (isNaN(hours) || hours < 1 || hours > 12) {
            console.error('Invalid hours input');
            return null;
        }

        // Convert to 24-hour format
        if (period === 'PM' && hours !== 12) return hours + 12;
        if (period === 'AM' && hours === 12) return 0;
        return period === 'PM' ? hours + 12 : hours;
    }

    function convertTo12Hour(hours24) {
        // Validate input
        hours24 = parseInt(hours24);
        if (isNaN(hours24) || hours24 < 0 || hours24 > 23) {
            console.error('Invalid 24-hour time');
            return null;
        }

        // Convert to 12-hour format
        const hours12 = hours24 % 12 || 12;
        const period = hours24 < 12 ? 'AM' : 'PM';

        return {
            hours: hours12.toString().padStart(2, '0'),
            period: period
        };
    }

    function convertTime(hours12, minutes, period, isNYTime) {
        console.log(`Converting time: ${hours12}:${minutes} ${period}, isNYTime: ${isNYTime}`);
        
        // Convert to 24-hour format
        let hours24 = convertTo24Hour(hours12, period);

        if (hours24 === null) {
            console.error('Invalid time conversion');
            return null;
        }

        if (isNYTime) {
            // Convert NY time to Istanbul time (add 8 hours)
            hours24 = (hours24 + TIME_DIFFERENCE) % 24;
        } else {
            // Convert Istanbul time to NY time (subtract 8 hours)
            hours24 = (hours24 - TIME_DIFFERENCE + 24) % 24;
        }

        console.log(`24-hour time after conversion: ${hours24}`);

        // Convert back to 12-hour format
        let time12 = convertTo12Hour(hours24);

        if (time12 === null) {
            console.error('Failed to convert times');
            return null;
        }

        console.log(`Converted time: ${time12.hours}:${minutes} ${time12.period}`);

        return {
            hours: time12.hours,
            minutes: minutes,
            period: time12.period
        };
    }

    function setCurrentTime() {
        // Get local device time
        const now = new Date();
        const localHours = now.getHours();
        const localMinutes = now.getMinutes();
        const period = localHours >= 12 ? 'PM' : 'AM';
        const hours12 = (localHours % 12) || 12;

        // Animate all time inputs
        [nyHours, nyMinutes, istHours, istMinutes].forEach(input => {
            animateUpdate(input.parentElement);
        });

        // Set NY time (local time)
        nyHours.value = hours12.toString().padStart(2, '0');
        nyMinutes.value = localMinutes.toString().padStart(2, '0');
        nyPeriod.value = period;

        // Calculate and set Istanbul time
        const istTime = convertTime(hours12, localMinutes, period, true);
        if (istTime === null) return;

        istHours.value = istTime.hours;
        istMinutes.value = istTime.minutes;
        istPeriod.value = istTime.period;

        updateDates(localHours, localMinutes, true);
    }

    function switchTimes() {
        // Animate all time inputs
        [nyHours, nyMinutes, istHours, istMinutes].forEach(input => {
            animateUpdate(input.parentElement);
        });

        // Convert NY time to 24-hour format
        const nyHours24 = convertTo24Hour(nyHours.value, nyPeriod.value);
        const istHours24 = convertTo24Hour(istHours.value, istPeriod.value);

        if (nyHours24 === null || istHours24 === null) {
            console.error('Invalid time conversion');
            return;
        }

        // Adjust times based on time zone difference
        // Ensure the hours are different by adding/subtracting 1 hour
        const nyTimeAdjusted = (istHours24 + TIME_DIFFERENCE + 1) % 24;
        const istTimeAdjusted = (nyHours24 - TIME_DIFFERENCE - 1 + 24) % 24;

        // Convert back to 12-hour format
        const nyTime12 = convertTo12Hour(nyTimeAdjusted);
        const istTime12 = convertTo12Hour(istTimeAdjusted);

        if (nyTime12 === null || istTime12 === null) {
            console.error('Failed to convert times');
            return;
        }

        // Update inputs with swapped minutes
        nyHours.value = nyTime12.hours;
        nyMinutes.value = istMinutes.value;
        nyPeriod.value = nyTime12.period;

        istHours.value = istTime12.hours;
        istMinutes.value = nyMinutes.value;
        istPeriod.value = istTime12.period;

        // Determine which city's time to use for date update
        const isNYTime = nyTimeAdjusted < 12;
        updateDates(nyTimeAdjusted, parseInt(istMinutes.value), isNYTime);
    }

    // Set initial time
    setCurrentTime();

    // Add click handler for current time button
    currentTimeBtn.addEventListener('click', () => {
        setCurrentTime();
        currentTimeBtn.classList.add('clicked');
        setTimeout(() => {
            currentTimeBtn.classList.remove('clicked');
        }, 200);
    });

    // Add click handler for switch times button
    switchTimesBtn.addEventListener('click', () => {
        switchTimes();
        switchTimesBtn.classList.add('clicked');
        setTimeout(() => {
            switchTimesBtn.classList.remove('clicked');
        }, 200);
    });

    // Event listeners for NY time
    nyHours.addEventListener('input', () => {
        const hours = validateTimeInput(nyHours, 12);
        const minutes = nyMinutes.value;
        const period = nyPeriod.value;
        const hours24 = convertTo24Hour(hours, period);

        if (hours24 === null) {
            console.error('Invalid time conversion');
            return;
        }

        const istTime = convertTime(hours, minutes, period, true);
        if (istTime === null) return;

        istHours.value = istTime.hours;
        istMinutes.value = istTime.minutes;
        istPeriod.value = istTime.period;
        
        updateDates(hours24, parseInt(minutes), true);
    });

    nyMinutes.addEventListener('input', () => {
        const minutes = validateTimeInput(nyMinutes, 59);
        const hours = nyHours.value;
        const period = nyPeriod.value;
        const hours24 = convertTo24Hour(hours, period);

        if (hours24 === null) {
            console.error('Invalid time conversion');
            return;
        }

        const istTime = convertTime(hours, minutes, period, true);
        if (istTime === null) return;

        istHours.value = istTime.hours;
        istMinutes.value = istTime.minutes;
        istPeriod.value = istTime.period;
        
        updateDates(hours24, parseInt(minutes), true);
    });

    nyPeriod.addEventListener('change', () => {
        const hours = nyHours.value;
        const minutes = nyMinutes.value;
        const period = nyPeriod.value;
        const hours24 = convertTo24Hour(hours, period);

        if (hours24 === null) {
            console.error('Invalid time conversion');
            return;
        }

        const istTime = convertTime(hours, minutes, period, true);
        if (istTime === null) return;

        istHours.value = istTime.hours;
        istMinutes.value = istTime.minutes;
        istPeriod.value = istTime.period;
        
        updateDates(hours24, parseInt(minutes), true);
    });

    // Event listeners for Istanbul time
    istHours.addEventListener('input', () => {
        const hours = validateTimeInput(istHours, 12);
        const minutes = istMinutes.value;
        const period = istPeriod.value;
        const hours24 = convertTo24Hour(hours, period);

        if (hours24 === null) {
            console.error('Invalid time conversion');
            return;
        }

        const nyTime = convertTime(hours, minutes, period, false);
        if (nyTime === null) return;

        nyHours.value = nyTime.hours;
        nyMinutes.value = nyTime.minutes;
        nyPeriod.value = nyTime.period;
        
        updateDates(hours24, parseInt(minutes), false);
    });

    istMinutes.addEventListener('input', () => {
        const minutes = validateTimeInput(istMinutes, 59);
        const hours = istHours.value;
        const period = istPeriod.value;
        const hours24 = convertTo24Hour(hours, period);

        if (hours24 === null) {
            console.error('Invalid time conversion');
            return;
        }

        const nyTime = convertTime(hours, minutes, period, false);
        if (nyTime === null) return;

        nyHours.value = nyTime.hours;
        nyMinutes.value = nyTime.minutes;
        nyPeriod.value = nyTime.period;
        
        updateDates(hours24, parseInt(minutes), false);
    });

    istPeriod.addEventListener('change', () => {
        const hours = istHours.value;
        const minutes = istMinutes.value;
        const period = istPeriod.value;
        const hours24 = convertTo24Hour(hours, period);

        if (hours24 === null) {
            console.error('Invalid time conversion');
            return;
        }

        const nyTime = convertTime(hours, minutes, period, false);
        if (nyTime === null) return;

        nyHours.value = nyTime.hours;
        nyMinutes.value = nyTime.minutes;
        nyPeriod.value = nyTime.period;
        
        updateDates(hours24, parseInt(minutes), false);
    });
});
