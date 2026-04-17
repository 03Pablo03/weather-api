import config from '../config/index.js';
import {
  celsiusToFahrenheit,
  celsiusToKelvin,
  kmhToMph,
  kmhToMs,
  kmhToKnots
} from '../utils/conversions.js';

export async function getWeather(req, res, fetchWeatherFn) {
  try {
    const weather = await fetchWeatherFn();

    const response = {
      location: {
        latitude: config.latitude,
        longitude: config.longitude,
        city: 'Valencia'
      },
      timestamp: weather.time,
      source: 'Open-Meteo API',
      temperature: {
        celsius: weather.temperature,
        fahrenheit: celsiusToFahrenheit(weather.temperature),
        kelvin: celsiusToKelvin(weather.temperature)
      },
      wind_speed: {
        kmh: weather.windspeed,
        mph: kmhToMph(weather.windspeed),
        ms: kmhToMs(weather.windspeed),
        knots: kmhToKnots(weather.windspeed)
      },
      wind_direction: weather.winddirection,
      weather_code: weather.weathercode
    };

    res.json(response);
  } catch (_error) {
    res.status(502).json({
      error: 'Failed to fetch weather data from external API',
      status: 502
    });
  }
}
