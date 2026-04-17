import { jest } from '@jest/globals';
import { getAlerts } from '../../src/controllers/alertsController.js';

const mockForecastData = [
  { time: '2026-04-16T12:00', temperature: 42, windspeed: 95 },
  { time: '2026-04-16T13:00', temperature: 20, windspeed: 10 },
];

const mockForecastDataNoAlerts = [
  { time: '2026-04-16T12:00', temperature: 20, windspeed: 10 },
  { time: '2026-04-16T13:00', temperature: 22, windspeed: 12 },
];

function createMockRes() {
  const res = {
    json: jest.fn(),
    status: jest.fn().mockReturnThis(),
  };
  return res;
}

describe('getAlerts', () => {
  it('should return 200 with alerts when thresholds are triggered', async () => {
    const mockFetchForecast = jest.fn().mockResolvedValue(mockForecastData);
    const res = createMockRes();

    await getAlerts({}, res, mockFetchForecast);

    expect(res.json).toHaveBeenCalledTimes(1);
    const response = res.json.mock.calls[0][0];

    expect(response).toHaveProperty('location');
    expect(response.location).toHaveProperty('city', 'Valencia');
    expect(response).toHaveProperty('alerts');
    expect(response.alerts.length).toBeGreaterThan(0);
    expect(response).toHaveProperty('evaluated_hours');
    expect(response).toHaveProperty('timestamp');
  });

  it('should return empty alerts array when no thresholds triggered', async () => {
    const mockFetchForecast = jest.fn().mockResolvedValue(mockForecastDataNoAlerts);
    const res = createMockRes();

    await getAlerts({}, res, mockFetchForecast);

    const response = res.json.mock.calls[0][0];
    expect(response.alerts).toEqual([]);
  });

  it('each alert should have required properties', async () => {
    const mockFetchForecast = jest.fn().mockResolvedValue(mockForecastData);
    const res = createMockRes();

    await getAlerts({}, res, mockFetchForecast);

    const response = res.json.mock.calls[0][0];
    for (const alert of response.alerts) {
      expect(alert).toHaveProperty('type');
      expect(alert).toHaveProperty('severity');
      expect(alert).toHaveProperty('message');
      expect(alert).toHaveProperty('threshold');
      expect(alert).toHaveProperty('triggered_at');
      expect(alert).toHaveProperty('actual_value');
    }
  });

  it('should return 502 when forecast service fails', async () => {
    const mockFetchForecast = jest.fn().mockRejectedValue(new Error('API error'));
    const res = createMockRes();

    await getAlerts({}, res, mockFetchForecast);

    expect(res.status).toHaveBeenCalledWith(502);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ error: expect.any(String) }),
    );
  });
});
