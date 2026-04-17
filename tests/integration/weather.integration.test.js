import request from 'supertest';
import app from '../../src/index.js';

describe('GET /api/weather (integration)', () => {
  it('should return 200 with weather data structure', async () => {
    const res = await request(app)
      .get('/api/weather')
      .timeout(10000);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('location');
    expect(res.body.location).toHaveProperty('city');
    expect(res.body).toHaveProperty('temperature');
    expect(res.body.temperature).toHaveProperty('celsius');
    expect(res.body.temperature).toHaveProperty('fahrenheit');
    expect(res.body.temperature).toHaveProperty('kelvin');
    expect(res.body).toHaveProperty('wind_speed');
    expect(res.body).toHaveProperty('source', 'Open-Meteo API');
  }, 10000);

  it('should return 404 for unknown API routes', async () => {
    const res = await request(app)
      .get('/api/unknown')
      .timeout(10000);

    expect(res.status).toBe(404);
  }, 10000);
});
