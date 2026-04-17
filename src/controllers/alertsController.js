import config from '../config/index.js';
import { evaluateAlerts } from '../utils/alerts.js';

export async function getAlerts(req, res, fetchForecastFn) {
  try {
    const forecast = await fetchForecastFn();
    const alerts = evaluateAlerts(forecast, config.alertThresholds);

    const response = {
      location: {
        latitude: config.latitude,
        longitude: config.longitude,
        city: 'Valencia'
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
