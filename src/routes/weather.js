import { Router } from 'express';
import { getWeather } from '../controllers/weatherController.js';
import { getForecast } from '../controllers/forecastController.js';
import { getAlerts } from '../controllers/alertsController.js';
import { fetchWeather } from '../services/weatherService.js';
import { fetchForecast } from '../services/forecastService.js';

const router = Router();

router.get('/weather', (req, res) => {
  getWeather(req, res, fetchWeather);
});

router.get('/forecast', (req, res) => {
  getForecast(req, res, fetchForecast);
});

router.get('/alerts', (req, res) => {
  getAlerts(req, res, fetchForecast);
});

export default router;
