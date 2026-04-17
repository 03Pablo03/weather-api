import fetch from 'node-fetch';
import config from '../config/index.js';

export async function fetchWeather(fetchFn = fetch) {
  const url = `${config.apiBaseUrl}?latitude=${config.latitude}&longitude=${config.longitude}&current=temperature_2m,wind_speed_10m,wind_direction_10m,weather_code`;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);

  try {
    const response = await fetchFn(url, { signal: controller.signal });

    if (!response.ok) {
      throw new Error(`Open-Meteo API error: ${response.status}`);
    }

    const data = await response.json();
    const current = data.current;

    return {
      temperature: current.temperature_2m,
      windspeed: current.wind_speed_10m,
      winddirection: current.wind_direction_10m,
      weathercode: current.weather_code,
      time: current.time,
    };
  } finally {
    clearTimeout(timeout);
  }
}
