import request from 'supertest';
import app from '../../src/index.js';

describe('GET /api/alerts (integration)', () => {
  it('should return 200 with alerts structure', async () => {
    const res = await request(app)
      .get('/api/alerts')
      .timeout(10000);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('location');
    expect(res.body.location).toHaveProperty('city', 'Valencia');
    expect(res.body).toHaveProperty('alerts');
    expect(Array.isArray(res.body.alerts)).toBe(true);
    expect(res.body).toHaveProperty('evaluated_hours');
    expect(res.body).toHaveProperty('timestamp');
  }, 10000);

  it('alerts should have correct structure when present', async () => {
    const res = await request(app)
      .get('/api/alerts')
      .timeout(10000);

    if (res.body.alerts.length > 0) {
      const alert = res.body.alerts[0];
      expect(alert).toHaveProperty('type');
      expect(alert).toHaveProperty('severity');
      expect(alert).toHaveProperty('message');
      expect(alert).toHaveProperty('threshold');
      expect(alert).toHaveProperty('triggered_at');
      expect(alert).toHaveProperty('actual_value');
    }
  }, 10000);
});
