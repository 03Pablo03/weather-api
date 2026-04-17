import config from '../config/index.js';
import { evaluateAlerts } from '../utils/alerts.js';

export async function getAlerts(req, res, fetchForecastFn) {
  try {
    const lat = req.query?.lat ? parseFloat(req.query.lat) : config.latitude;
    const lon = req.query?.lon ? parseFloat(req.query.lon) : config.longitude;
    const city = req.query?.city || 'Valencia';

    const forecast = await fetchForecastFn(undefined, lat, lon);
    const alerts = evaluateAlerts(forecast, config.alertThresholds);

    const response = {
      location: {
        latitude: lat,
        longitude: lon,
        city
      },
      alerts,
      evaluated_hours: forecast.length,
      timestamp: new Date().toISOString()
    };

    res.json(response);
  } catch (_error) {
    res.status(502).json({
      error: 'Failed to fetch forecast data for alert evaluation',
      status: 502
    });
  }
}
