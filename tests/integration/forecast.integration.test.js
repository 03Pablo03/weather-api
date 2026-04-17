import request from 'supertest';
import app from '../../src/index.js';

describe('GET /api/forecast (integration)', () => {
  it('should return 200 with forecast array', async () => {
    const res = await request(app)
      .get('/api/forecast')
      .timeout(10000);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('location');
    expect(res.body.location).toHaveProperty('city', 'Valencia');
    expect(res.body).toHaveProperty('source', 'Open-Meteo API');
    expect(res.body).toHaveProperty('forecast');
    expect(Array.isArray(res.body.forecast)).toBe(true);
    expect(res.body.forecast.length).toBeGreaterThan(0);
  }, 10000);

  it('each forecast entry should have temperature and wind conversions', async () => {
    const res = await request(app)
      .get('/api/forecast')
      .timeout(10000);

    const hour = res.body.forecast[0];
    expect(hour).toHaveProperty('time');
    expect(hour).toHaveProperty('temperature');
    expect(hour.temperature).toHaveProperty('celsius');
    expect(hour.temperature).toHaveProperty('fahrenheit');
    expect(hour).toHaveProperty('wind_speed');
    expect(hour.wind_speed).toHaveProperty('kmh');
    expect(hour).toHaveProperty('weather_code');
  }, 10000);
});
