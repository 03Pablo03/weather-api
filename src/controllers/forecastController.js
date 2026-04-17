import config from '../config/index.js';
import {
  celsiusToFahrenheit,
  celsiusToKelvin,
  kmhToMph,
  kmhToMs,
  kmhToKnots
} from '../utils/conversions.js';

export async function getForecast(req, res, fetchForecastFn) {
  try {
    const forecast = await fetchForecastFn();

    const response = {
      location: {
        latitude: config.latitude,
        longitude: config.longitude,
        city: 'Valencia'
      },
      source: 'Open-Meteo API',
      forecast: forecast.map(hour => ({
        time: hour.time,
        temperature: {
          celsius: hour.temperature,
          fahrenheit: celsiusToFahrenheit(hour.temperature),
          kelvin: celsiusToKelvin(hour.temperature)
        },
        wind_speed: {
          kmh: hour.windspeed,
          mph: kmhToMph(hour.windspeed),
          ms: kmhToMs(hour.windspeed),
          knots: kmhToKnots(hour.windspeed)
        },
        wind_direction: hour.winddirection,
        weather_code: hour.weathercode
      }))
    };

    res.json(response);
  } catch (_error) {
    res.status(502).json({
      error: 'Failed to fetch forecast data from external API',
      status: 502
    });
  }
}
