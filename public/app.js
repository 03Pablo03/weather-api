// DOM Elements
const stateLoading = document.getElementById('state-loading');
const stateError = document.getElementById('state-error');
const stateData = document.getElementById('state-data');
const errorMessage = document.getElementById('error-message');
const weatherCard = document.getElementById('weather-card');

const cityName = document.getElementById('city-name');
const coordsText = document.getElementById('coords-text');
const sourceText = document.getElementById('source-text');
const tempCelsius = document.getElementById('temp-celsius');
const tempFahrenheit = document.getElementById('temp-fahrenheit');
const tempKelvin = document.getElementById('temp-kelvin');
const windKmh = document.getElementById('wind-kmh');
const windMph = document.getElementById('wind-mph');
const windMs = document.getElementById('wind-ms');
const timestampText = document.getElementById('timestamp-text');

const btnRefresh = document.getElementById('btn-refresh');
const btnRetry = document.getElementById('btn-retry');

// State management
function showState(state) {
  stateLoading.classList.add('hidden');
  stateError.classList.add('hidden');
  stateData.classList.add('hidden');

  if (state === 'loading') stateLoading.classList.remove('hidden');
  if (state === 'error') stateError.classList.remove('hidden');
  if (state === 'data') stateData.classList.remove('hidden');
}

// Temperature theme
function applyTemperatureTheme(celsius) {
  weatherCard.classList.remove('theme-cold', 'theme-cool', 'theme-mild', 'theme-warm', 'theme-hot');

  if (celsius < 5) weatherCard.classList.add('theme-cold');
  else if (celsius < 15) weatherCard.classList.add('theme-cool');
  else if (celsius < 25) weatherCard.classList.add('theme-mild');
  else if (celsius < 35) weatherCard.classList.add('theme-warm');
  else weatherCard.classList.add('theme-hot');
}

// Format timestamp
function formatTimestamp(isoString) {
  const date = new Date(isoString);
  return date.toLocaleString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

// Render weather data
function renderWeather(data) {
  cityName.textContent = data.location.city;
  coordsText.textContent = `${data.location.latitude}°N, ${Math.abs(data.location.longitude)}°W`;
  sourceText.textContent = `Fuente: ${data.source}`;

  tempCelsius.textContent = `${data.temperature.celsius}°C`;
  tempFahrenheit.textContent = `${data.temperature.fahrenheit}°F`;
  tempKelvin.textContent = `${data.temperature.kelvin} K`;

  windKmh.textContent = `${data.wind_speed.kmh} km/h`;
  windMph.textContent = `${data.wind_speed.mph} mph`;
  windMs.textContent = `${data.wind_speed.ms} m/s`;

  timestampText.textContent = formatTimestamp(data.timestamp);

  applyTemperatureTheme(data.temperature.celsius);
  showState('data');
}

// Fetch weather data
async function fetchWeatherData() {
  showState('loading');

  try {
    const response = await fetch('/api/weather');

    if (!response.ok) {
      throw new Error(`Error del servidor: ${response.status}`);
    }

    const data = await response.json();
    renderWeather(data);
  } catch (error) {
    errorMessage.textContent = error.message.includes('fetch')
      ? 'Error de conexion. Comprueba tu red.'
      : 'No se pudieron obtener los datos meteorologicos';
    showState('error');
  }
}

// Forecast elements
const forecastTimeline = document.getElementById('forecast-timeline');
const alertsSection = document.getElementById('alerts-section');
const alertsContainer = document.getElementById('alerts-container');

// Weather code descriptions
const weatherDescriptions = {
  0: '&#9728;&#65039; Despejado',
  1: '&#127780;&#65039; Mayormente despejado',
  2: '&#9925; Parcialmente nublado',
  3: '&#9729;&#65039; Nublado',
  45: '&#127787;&#65039; Niebla',
  48: '&#127787;&#65039; Niebla con escarcha',
  51: '&#127782;&#65039; Llovizna ligera',
  53: '&#127782;&#65039; Llovizna moderada',
  55: '&#127782;&#65039; Llovizna intensa',
  61: '&#127783;&#65039; Lluvia ligera',
  63: '&#127783;&#65039; Lluvia moderada',
  65: '&#127783;&#65039; Lluvia intensa',
  71: '&#127784;&#65039; Nevada ligera',
  73: '&#127784;&#65039; Nevada moderada',
  75: '&#127784;&#65039; Nevada intensa',
  80: '&#127783;&#65039; Chubascos ligeros',
  81: '&#127783;&#65039; Chubascos moderados',
  82: '&#127783;&#65039; Chubascos fuertes',
  95: '&#9889; Tormenta',
  96: '&#9889; Tormenta con granizo',
  99: '&#9889; Tormenta fuerte con granizo',
};

function getWeatherDescription(code) {
  return weatherDescriptions[code] || `&#127780;&#65039; Codigo ${code}`;
}

// Render forecast timeline
function renderForecast(data) {
  if (!data || !data.forecast || data.forecast.length === 0) {
    forecastTimeline.innerHTML = '<p>No hay datos de prevision disponibles</p>';
    return;
  }

  forecastTimeline.innerHTML = data.forecast.map(hour => {
    const time = new Date(hour.time);
    const hourStr = time.toLocaleString('es-ES', { hour: '2-digit', minute: '2-digit' });
    return `
      <div class="forecast-hour">
        <span class="forecast-time">${hourStr}</span>
        <span class="forecast-icon">${getWeatherDescription(hour.weather_code)}</span>
        <span class="forecast-temp">${hour.temperature.celsius}°C</span>
        <span class="forecast-wind">${hour.wind_speed.kmh} km/h</span>
      </div>
    `;
  }).join('');
}

// Render alerts
function renderAlerts(data) {
  if (!data || !data.alerts || data.alerts.length === 0) {
    alertsSection.classList.add('hidden');
    return;
  }

  alertsSection.classList.remove('hidden');
  alertsContainer.innerHTML = data.alerts.map(alert => `
    <div class="alert-banner alert-banner--${alert.severity}">
      <span class="alert-icon">${alert.severity === 'danger' ? '&#128680;' : '&#9888;&#65039;'}</span>
      <div class="alert-content">
        <strong>${alert.message}</strong>
        <span class="alert-time">Previsto: ${new Date(alert.triggered_at).toLocaleString('es-ES', { hour: '2-digit', minute: '2-digit' })}</span>
      </div>
    </div>
  `).join('');
}

// Fetch forecast data
async function fetchForecastData() {
  try {
    const response = await fetch('/api/forecast');
    if (!response.ok) throw new Error('Error al obtener prevision');
    const data = await response.json();
    renderForecast(data);
  } catch (_error) {
    forecastTimeline.innerHTML = '<p>Error al cargar la prevision</p>';
  }
}

// Fetch alerts data
async function fetchAlertsData() {
  try {
    const response = await fetch('/api/alerts');
    if (!response.ok) throw new Error('Error al obtener alertas');
    const data = await response.json();
    renderAlerts(data);
  } catch (_error) {
    alertsSection.classList.add('hidden');
  }
}

// Fetch all data
async function fetchAllData() {
  await Promise.all([fetchWeatherData(), fetchForecastData(), fetchAlertsData()]);
}

// Event listeners
btnRefresh.addEventListener('click', fetchAllData);
btnRetry.addEventListener('click', fetchAllData);

// Initial load
fetchAllData();
