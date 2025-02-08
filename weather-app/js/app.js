document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    const locationBtn = document.getElementById('location-btn');
    const clearSearchBtn = document.getElementById('clear-search');
    const popularCitiesList = document.getElementById('popular-cities');
    const weatherCard = document.getElementById('weather-card');
    //const localTimeDisplay = document.querySelector('.local-time-display');
    //const localDateDisplay = document.querySelector('.local-date-display');
    
    let currentSound = null;
    let isSoundPlaying = false;
    const MAX_CARDS = 6;
    const activeCards = new Set();

    /*
    // Yerel saat ve tarih gösterimi için
    function updateLocalTime() {
        const now = new Date();
        const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        const dateStr = now.toLocaleDateString('en-US', { 
            day: 'numeric', 
            month: 'long', 
            year: 'numeric' 
        });
        
        localTimeDisplay.textContent = timeStr;
        localDateDisplay.textContent = dateStr;
    }

    // Saatleri güncelleyen interval
    setInterval(updateLocalTime, 1000);
    updateLocalTime();

    // Hava durumu ses efektini çal/durdur
    function toggleWeatherSound(weatherType) {
        const soundToggleBtn = document.querySelector('.sound-toggle');
        const audioElement = document.getElementById('weather-sound');
        
        if (currentSound === weatherType && isSoundPlaying) {
            audioElement.pause();
            isSoundPlaying = false;
            soundToggleBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
            soundToggleBtn.classList.remove('active');
        } else {
            if (currentSound !== weatherType) {
                const soundConfig = WEATHER_SOUNDS[weatherType] || WEATHER_SOUNDS.cloudy;
                audioElement.src = soundConfig.url;
                currentSound = weatherType;
            }
            
            audioElement.play().catch(error => {
                console.error('Ses oynatılamadı:', error);
            });
            
            isSoundPlaying = true;
            soundToggleBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
            soundToggleBtn.classList.add('active');
        }
    }
*/
    // Hava durumu emojisini al
    function getWeatherEmoji(condition) {
        const conditionLower = condition.toLowerCase();
        for (const [key, emoji] of Object.entries(WEATHER_EMOJIS)) {
            if (conditionLower.includes(key)) {
                return emoji;
            }
        }
        return WEATHER_EMOJIS.default;
    }

    // Dinamik arka plan efektleri
    function updateBackground(condition, locationTime) {
        const weatherBg = document.querySelector('.weather-background') || createWeatherBackground();
        const hour = new Date(locationTime).getHours();
        
        // Gün zamanına göre renk paleti
        let bgColors;
        if (hour >= 5 && hour < 7) { // Gün doğumu
            bgColors = {
                clear: ['#FF7F50', '#FFD700'],
                cloudy: ['#708090', '#B8860B'],
                rain: ['#4682B4', '#708090'],
                snow: ['#87CEEB', '#B0C4DE'],
                default: ['#FF7F50', '#FFD700']
            };
        } else if (hour >= 7 && hour < 12) { // Sabah
            bgColors = {
                clear: ['#87CEEB', '#00BFFF'],
                cloudy: ['#778899', '#A9A9A9'],
                rain: ['#4682B4', '#778899'],
                snow: ['#B0C4DE', '#F0F8FF'],
                default: ['#87CEEB', '#00BFFF']
            };
        } else if (hour >= 12 && hour < 16) { // Öğlen
            bgColors = {
                clear: ['#00BFFF', '#1E90FF'],
                cloudy: ['#A9A9A9', '#D3D3D3'],
                rain: ['#4169E1', '#6495ED'],
                snow: ['#F0F8FF', '#F5F5F5'],
                default: ['#00BFFF', '#1E90FF']
            };
        } else if (hour >= 16 && hour < 19) { // İkindi
            bgColors = {
                clear: ['#FF8C00', '#FFD700'],
                cloudy: ['#CD853F', '#DEB887'],
                rain: ['#4682B4', '#B8860B'],
                snow: ['#B8860B', '#DEB887'],
                default: ['#FF8C00', '#FFD700']
            };
        } else if (hour >= 19 && hour < 21) { // Gün batımı
            bgColors = {
                clear: ['#FF4500', '#FF8C00'],
                cloudy: ['#8B4513', '#DEB887'],
                rain: ['#4682B4', '#8B4513'],
                snow: ['#8B4513', '#CD853F'],
                default: ['#FF4500', '#FF8C00']
            };
        } else { // Gece
            bgColors = {
                clear: ['#191970', '#000080'],
                cloudy: ['#2F4F4F', '#696969'],
                rain: ['#1a1a1a', '#2F4F4F'],
                snow: ['#4A4A4A', '#696969'],
                default: ['#191970', '#000080']
            };
        }
        
        // Hava durumuna göre renk seç
        let colors;
        if (condition.toLowerCase().includes('clear') || condition.toLowerCase().includes('sunny')) {
            colors = bgColors.clear;
        } else if (condition.toLowerCase().includes('cloud') || condition.toLowerCase().includes('overcast')) {
            colors = bgColors.cloudy;
        } else if (condition.toLowerCase().includes('rain') || condition.toLowerCase().includes('drizzle') || condition.toLowerCase().includes('thunder')) {
            colors = bgColors.rain;
        } else if (condition.toLowerCase().includes('snow') || condition.toLowerCase().includes('sleet') || condition.toLowerCase().includes('ice')) {
            colors = bgColors.snow;
        } else {
            colors = bgColors.default;
        }
        
        // Gradient arka planı ayarla
        weatherBg.style.background = `linear-gradient(135deg, ${colors[0]}, ${colors[1]})`;
        weatherBg.style.transition = 'background 1s ease-in-out';
        
        // Parçacık efektlerini güncelle
        updateParticles(condition, hour);
    }

    function updateParticles(condition, hour) {
        const isNight = hour < 6 || hour > 18;
        
        if (condition.toLowerCase().includes('rain')) {
            createRainParticles(isNight);
        } else if (condition.toLowerCase().includes('snow')) {
            createSnowParticles(isNight);
        } else if ((condition.toLowerCase().includes('clear') || condition.toLowerCase().includes('sunny')) && !isNight) {
            createSunParticles();
        } else if (condition.toLowerCase().includes('cloud')) {
            createCloudParticles(isNight);
        }
    }

    function createRainParticles(isNight) {
        createParticles('rain', 50);
        const particles = document.querySelectorAll('.particle.rain');
        const color = isNight ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.5)';
        
        particles.forEach(particle => {
            particle.style.background = `linear-gradient(transparent, ${color})`;
            particle.style.width = '2px';
            particle.style.height = '20px';
        });
    }

    function createSnowParticles(isNight) {
        createParticles('snow', 30);
        const particles = document.querySelectorAll('.particle.snow');
        const color = isNight ? 'rgba(255, 255, 255, 0.5)' : 'rgba(255, 255, 255, 0.8)';
        
        particles.forEach(particle => {
            particle.style.background = color;
            particle.style.width = '5px';
            particle.style.height = '5px';
            particle.style.borderRadius = '50%';
        });
    }

    function createSunParticles() {
        createParticles('sun', 5);
        const particles = document.querySelectorAll('.particle.sun');
        
        particles.forEach(particle => {
            particle.style.background = 'radial-gradient(circle, rgba(255,215,0,0.3) 0%, rgba(255,215,0,0) 70%)';
            particle.style.width = '100px';
            particle.style.height = '100px';
            particle.style.borderRadius = '50%';
        });
    }

    function createCloudParticles(isNight) {
        createParticles('cloud', 8);
        const particles = document.querySelectorAll('.particle.cloud');
        const color = isNight ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.2)';
        
        particles.forEach(particle => {
            particle.style.background = color;
            particle.style.width = '80px';
            particle.style.height = '40px';
            particle.style.borderRadius = '20px';
        });
    }

    function createWeatherBackground() {
        const bg = document.createElement('div');
        bg.className = 'weather-background';
        document.body.insertBefore(bg, document.body.firstChild);
        return bg;
    }

    function createParticles(type, count) {
        const bg = document.querySelector('.weather-background');
        bg.innerHTML = '';
        
        for (let i = 0; i < count; i++) {
            const particle = document.createElement('div');
            particle.className = `particle ${type}`;
            
            // Rastgele pozisyon
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.top = `${Math.random() * 100}%`;
            
            // Rastgele animasyon gecikmesi
            particle.style.animationDelay = `${Math.random() * 3}s`;
            
            bg.appendChild(particle);
        }
    }

    // Hava durumu kartını güncelle
    function updateWeatherCard(data) {
        const city = data.location.name;
        const country = data.location.country;
        const temp = Math.round(data.current.temp_c);
        const condition = data.current.condition.text;
        const feelsLike = Math.round(data.current.feelslike_c);
        const humidity = data.current.humidity;
        const windSpeed = Math.round(data.current.wind_kph);
        const localTime = new Date(data.location.localtime);
        
        // Kart başlığını güncelle
        weatherCard.querySelector('.city').textContent = `${city}, ${country}`;
        
        // Tarih ve saati güncelle
        const timeStr = localTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        const dateStr = localTime.toLocaleDateString('en-US', { 
            day: 'numeric', 
            month: 'long', 
            year: 'numeric' 
        });
        
        weatherCard.querySelector('.time').textContent = timeStr;
        weatherCard.querySelector('.date').textContent = dateStr;
        weatherCard.querySelector('.date').dataset.fullDate = data.location.localtime;
        
        // Emoji ve sıcaklık bilgisini güncelle
        weatherCard.querySelector('.weather-emoji').textContent = getWeatherEmoji(condition);
        weatherCard.querySelector('.temperature h1').textContent = `${temp}°C`;
        weatherCard.querySelector('.description').textContent = condition;
        
        // Detayları güncelle
        weatherCard.querySelector('.feels-like').textContent = `${feelsLike}°C`;
        weatherCard.querySelector('.humidity').textContent = `${humidity}%`;
        weatherCard.querySelector('.wind-speed').textContent = `${windSpeed} km/h`;
        
        // Dinamik arka plan efektini güncelle
        updateBackground(condition, data.location.localtime);
        
        // Kartı göster
        weatherCard.style.display = 'block';
        
        // Ses efektini sıfırla
        const soundToggleBtn = weatherCard.querySelector('.sound-toggle');
        soundToggleBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
        soundToggleBtn.classList.remove('active');
        isSoundPlaying = false;
    }

    // Hava durumu verilerini getir
    async function getWeatherData(city) {
        try {
            // First check if API key is available
            if (!API_KEY) {
                throw new Error('API key is not defined. Please check config.js');
            }

            const url = `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${city}&days=3&aqi=no`;
            console.log('Attempting to fetch weather data...');
            
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                mode: 'cors' // Explicitly set CORS mode
            });
            
            if (!response.ok) {
                if (response.status === 401) {
                    throw new Error('Invalid API key. Please check your WeatherAPI.com credentials.');
                } else if (response.status === 403) {
                    throw new Error('API key has expired or reached its limit.');
                } else {
                    throw new Error(`Weather API error: ${response.status} ${response.statusText}`);
                }
            }
            
            const data = await response.json();
            if (!data || !data.location) {
                throw new Error('Invalid data received from weather API');
            }

            console.log('Weather data received successfully:', data);
            updateWeatherCard(data);
            updateHourlyForecast(data.forecast.forecastday[0].hour);
            updateDailyForecast(data.forecast.forecastday);
            
        } catch (error) {
            console.error('Weather API Error:', error);
            
            if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
                alert('Network error: Please check your internet connection or try again later');
            } else if (error.message.includes('API key')) {
                alert(error.message);
            } else {
                alert(`Error getting weather data: ${error.message}`);
            }
        }
    }

    // Saatlik tahmini güncelle
    function updateHourlyForecast(hourlyData) {
        const hourlyContainer = document.querySelector('.hourly-items');
        hourlyContainer.innerHTML = '';
        
        const currentHour = new Date().getHours();
        const next24Hours = [...hourlyData.slice(currentHour), ...hourlyData.slice(0, currentHour)].slice(0, 24);
        
        next24Hours.forEach(hour => {
            const time = new Date(hour.time).getHours();
            const temp = Math.round(hour.temp_c);
            const condition = hour.condition.text;
            
            const hourlyItem = document.createElement('div');
            hourlyItem.className = 'hourly-item';
            hourlyItem.innerHTML = `
                <div class="time">${time}:00</div>
                <div class="emoji">${getWeatherEmoji(condition)}</div>
                <div class="temp">${temp}°C</div>
            `;
            
            hourlyContainer.appendChild(hourlyItem);
        });
    }

    // Günlük tahmini güncelle
    function updateDailyForecast(dailyData) {
        const dailyContainer = document.querySelector('.daily-items');
        if (!dailyContainer) {
            console.log('Daily forecast container not found - feature is disabled');
            return;
        }
        
        dailyContainer.innerHTML = '';
        
        dailyData.forEach((day, index) => {
            const date = new Date(day.date);
            const dayName = index === 0 ? 'Today' : 
                           index === 1 ? 'Tomorrow' : 
                           date.toLocaleDateString('en-US', { weekday: 'long' });
            
            const dailyItem = document.createElement('div');
            dailyItem.className = 'daily-item';
            dailyItem.innerHTML = `
                <span class="day">${dayName}</span>
                <span class="emoji">${getWeatherEmoji(day.day.condition.text)}</span>
                <div class="temp-range">
                    <span class="max-temp">${Math.round(day.day.maxtemp_c)}°</span>
                    <span class="min-temp">${Math.round(day.day.mintemp_c)}°</span>
                </div>
            `;
            
            dailyContainer.appendChild(dailyItem);
        });
    }

    // Popüler şehirleri listele
    function showPopularCities() {
        popularCitiesList.innerHTML = '';
        POPULAR_CITIES.forEach(city => {
            const div = document.createElement('div');
            div.className = 'city-item';
            div.textContent = city;
            div.addEventListener('click', () => {
                searchInput.value = city;
                getWeatherData(city);
                popularCitiesList.classList.remove('show');
            });
            popularCitiesList.appendChild(div);
        });
        popularCitiesList.classList.add('show');
    }

    // Event listeners
    searchInput.addEventListener('focus', showPopularCities);
    searchInput.addEventListener('input', () => {
        if (searchInput.value) {
            clearSearchBtn.style.display = 'flex';
        } else {
            clearSearchBtn.style.display = 'none';
            showPopularCities();
        }
    });

    document.addEventListener('click', (e) => {
        if (!searchInput.contains(e.target) && !popularCitiesList.contains(e.target)) {
            popularCitiesList.classList.remove('show');
        }
    });

    searchBtn.addEventListener('click', () => {
        const location = searchInput.value.trim();
        if (location) {
            getWeatherData(location);
            popularCitiesList.classList.remove('show');
        }
    });

    locationBtn.addEventListener('click', () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                position => {
                    const { latitude, longitude } = position.coords;
                    getWeatherData(`${latitude},${longitude}`);
                },
                error => {
                    console.error('Konum alınamadı:', error);
                }
            );
        }
    });

    clearSearchBtn.addEventListener('click', () => {
        searchInput.value = '';
        clearSearchBtn.style.display = 'none';
        showPopularCities();
    });

    // Search input event listener for Enter key
    searchInput.addEventListener('keypress', (e) => {
        // Check if the pressed key is Enter (key code 13)
        if (e.key === 'Enter') {
            const location = searchInput.value.trim();
            if (location) {
                getWeatherData(location);
                popularCitiesList.classList.remove('show');
                
                // Optional: Blur the input to dismiss mobile keyboard
                searchInput.blur();
            }
        }
    });

    // Ses kontrolü
    document.querySelector('.sound-toggle').addEventListener('click', function() {
        this.classList.toggle('active');
        const icon = this.querySelector('i');
        if (this.classList.contains('active')) {
            icon.className = 'fas fa-volume-up';
        } else {
            icon.className = 'fas fa-volume-mute';
        }
        
        const description = document.querySelector('.description').textContent.toLowerCase();
        let soundType = 'cloudy';
        
        if (description.includes('rain') || description.includes('drizzle')) {
            soundType = 'rain';
        } else if (description.includes('thunder') || description.includes('storm')) {
            soundType = 'storm';
        } else if (description.includes('snow') || description.includes('sleet')) {
            soundType = 'snow';
        } else if (description.includes('clear') || description.includes('sunny')) {
            soundType = 'sunny';
        }
        
        toggleWeatherSound(soundType);
    });

    // Başlangıçta kullanıcının konumunun hava durumunu göster
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            position => {
                const { latitude, longitude } = position.coords;
                getWeatherData(`${latitude},${longitude}`);
            },
            error => {
                console.error('Konum alınamadı:', error);
                // Fallback to a default city if geolocation fails
                getWeatherData('Antalya');
            }
        );
    } else {
        // Fallback for browsers that don't support geolocation
        getWeatherData('Antalya');
    }
});
