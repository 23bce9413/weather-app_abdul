
const apiKey = '542cea55981fb208a0e498586bd01906';  
const apiUrl = 'https://api.openweathermap.org/data/2.5/weather';
const forecastUrl = 'https://api.openweathermap.org/data/2.5/forecast';
function fetchWeatherData(location) {
    const url = `${apiUrl}?q=${location}&appid=${apiKey}&units=metric`; 
    fetch(url)
        .then(response => response.json())
        .then(data => {
            updateCurrentWeather(data);
            fetchHourlyForecast(data.coord);
            fetchFiveDayForecast1(data.coord);
        })
        .catch(error => alert('Error fetching weather data: ' + error));
}
function fetchWeatherData1(lat,lon) {
    const url = `${apiUrl}?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`; 
    fetch(url)
        .then(response => response.json())
        .then(data => {
            updateCurrentWeather(data);
            fetchHourlyForecast(data.coord);
            fetchFiveDayForecast1(data.coord);
        })
        .catch(error => alert('Error fetching weather data: ' + error));
}
function updateCurrentWeather(data) {
    document.getElementById('city-name').textContent = data.name;
    document.getElementById('weather-icon').src = `http://openweathermap.org/img/wn/${data.weather[0].icon}.png`;
    document.getElementById('temperature').textContent = `${data.main.temp}°C`;
    document.getElementById('weather-description').textContent = data.weather[0].description;
    document.getElementById('humidity').textContent = `Humidity: ${data.main.humidity}%`;
    document.getElementById('wind-speed').textContent = `Wind Speed: ${data.wind.speed} km/h`;
}
function fetchHourlyForecast(coord) {
    const url = `${forecastUrl}?lat=${coord.lat}&lon=${coord.lon}&appid=${apiKey}&units=metric`;
    fetch(url)
        .then(response => response.json())
        .then(data => {
            let hourlyHtml = '';
            for (let i = 0; i < 8; i++) {
                const hour = data.list[i];
                hourlyHtml += `
                    <div class="hour-card">
                        <img class="hour-icon" src="http://openweathermap.org/img/wn/${hour.weather[0].icon}.png" alt="Weather Icon">
                        <p class="hour">${new Date(hour.dt * 1000).getHours()}:00</p>
                        <p class="hour-temp">${hour.main.temp}°C</p>
                    </div>
                `;
            }
            document.querySelector('#hourly-forecast .hourly-list').innerHTML = hourlyHtml;
        });
}
function fetchFiveDayForecast1(coord) {
    const url = `${forecastUrl}?lat=${coord.lat}&lon=${coord.lon}&appid=${apiKey}&units=metric`;
    fetch(url)
        .then(response => response.json())
        .then(data => {
            let forecastHtml = '';
            for (let i = 0; i < data.list.length; i += 8) { 
                const day = data.list[i];
                forecastHtml += `
                    <div class="forecast-card">
                        <p class="day">${new Date(day.dt * 1000).toLocaleString('en', { weekday: 'long' })}</p>
                        <img class="forecast-icon" src="http://openweathermap.org/img/wn/${day.weather[0].icon}.png" alt="Weather Icon">
                        <p class="high-temp">${day.main.temp_max}°C</p>
                        <p class="low-temp">${day.main.temp_min}°C</p>
                    </div>
                `;
            }
            document.querySelector('#five-day-forecast .forecast-cards').innerHTML = forecastHtml;
        });
}
document.getElementById('location-input').addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        const location = event.target.value;
        if (location) {
            fetchWeatherData(location);
        }
    }
});
document.getElementById('geo-location-btn').addEventListener('click', () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            fetchWeatherData1(lat,lon);
        }, () => alert('Geolocation failed.'));
    } else {
        alert('Geolocation is not supported by this browser.');
    }
});
function convertTemperature(unit) {
    const currentTemp = document.getElementById('temperature').textContent;
    const tempValue = parseFloat(currentTemp);
    let convertedTemp;
    if (unit === 'Celsius') {
        convertedTemp = (tempValue - 32) * 5 / 9;  
    } else if (unit === 'Fahrenheit') {
        convertedTemp = (tempValue * 9 / 5) + 32;  
    } else if (unit === 'Kelvin') {
        convertedTemp = tempValue + 273.15;  
    }
    document.getElementById('temperature').textContent = `${convertedTemp.toFixed(2)}°${unit.charAt(0)}`;
}
document.getElementById('celsius-btn').addEventListener('click', () => convertTemperature('Celsius'));
document.getElementById('fahrenheit-btn').addEventListener('click', () => convertTemperature('Fahrenheit'));
document.getElementById('kelvin-btn').addEventListener('click', () => convertTemperature('Kelvin'));
fetchWeatherData('amaravati');