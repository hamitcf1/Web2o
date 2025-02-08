// WeatherAPI.com API configuration
window.API_KEY = 'aa391e7a30934e48b2a00827250402';
const BASE_URL = 'https://api.weatherapi.com/v1';
const POPULAR_CITIES = ['Istanbul', 'London', 'New York', 'Tokyo', 'Paris', 'Dubai', 'Singapore', 'Rome', 'Barcelona', 'Amsterdam'];

// Weather sounds configuration
const WEATHER_SOUNDS = {
    rain: {
        url: 'sounds/rain.wav'
    },
    storm: {
        url: 'sounds/thunder.wav'
    },
    snow: {
        url: 'sounds/snow.wav'
    },
    sunny: {
        url: 'sounds/sunny.wav'
    },
    cloudy: {
        url: 'sounds/wind.wav'
    }
};

const WEATHER_EMOJIS = {
    'clear': '☀️',
    'sunny': '☀️',
    'partly cloudy': '⛅',
    'cloudy': '☁️',
    'overcast': '☁️',
    'mist': '🌫️',
    'fog': '🌫️',
    'light rain': '🌦️',
    'moderate rain': '🌧️',
    'heavy rain': '⛈️',
    'light snow': '🌨️',
    'moderate snow': '❄️',
    'heavy snow': '⛄',
    'sleet': '🌨️',
    'light drizzle': '🌦️',
    'moderate drizzle': '🌧️',
    'heavy drizzle': '🌧️',
    'thunderstorm': '⛈️',
    'thunder': '⛈️',
    'blizzard': '🌨️',
    'default': '🌡️'
};
