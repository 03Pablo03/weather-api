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
    const lat = req.query?.lat ? parseFloat(req.query.lat) : config.latitude;
    const lon = req.query?.lon ? parseFloat(req.query.lon) : config.longitude;
    const city = req.query?.city || 'Valencia';

    const weather = await fetchWeatherFn(undefined, lat, lon);

    const response = {
      location: {
        latitude: lat,
        longitude: lon,
        city
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
