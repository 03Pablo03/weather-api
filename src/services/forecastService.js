import fetch from 'node-fetch';
import config from '../config/index.js';

export async function fetchForecast(fetchFn = fetch) {
  const url = `${config.apiBaseUrl}?latitude=${config.latitude}&longitude=${config.longitude}&hourly=temperature_2m,wind_speed_10m,wind_direction_10m,weather_code&forecast_days=${config.forecastDays}`;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);

  try {
    const response = await fetchFn(url, { signal: controller.signal });

    if (!response.ok) {
      throw new Error(`Open-Meteo API error: ${response.status}`);
    }

    const data = await response.json();
    const hourly = data.hourly;

    return hourly.time.map((time, i) => ({
      time,
      temperature: hourly.temperature_2m[i],
      windspeed: hourly.wind_speed_10m[i],
      winddirection: hourly.wind_direction_10m[i],
      weathercode: hourly.weather_code[i],
    }));
  } finally {
    clearTimeout(timeout);
  }
}
