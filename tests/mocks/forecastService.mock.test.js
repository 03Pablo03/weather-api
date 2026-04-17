import { jest } from '@jest/globals';
import { fetchForecast } from '../../src/services/forecastService.js';

const mockHourlyResponse = {
  hourly: {
    time: [
      '2026-04-16T00:00', '2026-04-16T01:00', '2026-04-16T02:00', '2026-04-16T03:00',
      '2026-04-16T04:00', '2026-04-16T05:00', '2026-04-16T06:00', '2026-04-16T07:00',
      '2026-04-16T08:00', '2026-04-16T09:00', '2026-04-16T10:00', '2026-04-16T11:00',
      '2026-04-16T12:00', '2026-04-16T13:00', '2026-04-16T14:00', '2026-04-16T15:00',
      '2026-04-16T16:00', '2026-04-16T17:00', '2026-04-16T18:00', '2026-04-16T19:00',
      '2026-04-16T20:00', '2026-04-16T21:00', '2026-04-16T22:00', '2026-04-16T23:00',
    ],
    temperature_2m: [
      15, 14, 13, 13, 12, 12, 13, 15, 17, 19, 21, 23,
      25, 26, 27, 27, 26, 24, 22, 20, 18, 17, 16, 15,
    ],
    wind_speed_10m: [
      5, 4, 4, 3, 3, 4, 5, 7, 10, 12, 15, 18,
      20, 22, 23, 22, 20, 18, 15, 12, 10, 8, 6, 5,
    ],
    wind_direction_10m: [
      180, 180, 190, 190, 200, 200, 210, 210, 220, 220, 230, 230,
      240, 240, 250, 250, 260, 260, 270, 270, 280, 280, 290, 290,
    ],
    weather_code: [
      0, 0, 0, 0, 1, 1, 1, 2, 2, 2, 3, 3,
      3, 2, 2, 2, 1, 1, 1, 0, 0, 0, 0, 0,
    ],
  }
};

function createMockFetch(data, ok = true, status = 200) {
  return jest.fn().mockResolvedValue({
    ok,
    status,
    json: () => Promise.resolve(data),
  });
}

describe('forecastService', () => {
  test('fetches and returns normalized 24-entry array', async () => {
    const mockFetch = createMockFetch(mockHourlyResponse);
    const result = await fetchForecast(mockFetch);

    expect(result).toHaveLength(24);
    expect(result[0]).toEqual({
      time: '2026-04-16T00:00',
      temperature: 15,
      windspeed: 5,
      winddirection: 180,
      weathercode: 0,
    });
  });

  test('each entry has all required properties', async () => {
    const mockFetch = createMockFetch(mockHourlyResponse);
    const result = await fetchForecast(mockFetch);

    for (const entry of result) {
      expect(entry).toHaveProperty('time');
      expect(entry).toHaveProperty('temperature');
      expect(entry).toHaveProperty('windspeed');
      expect(entry).toHaveProperty('winddirection');
      expect(entry).toHaveProperty('weathercode');
    }
  });

  test('calls fetch with correct URL containing hourly params', async () => {
    const mockFetch = createMockFetch(mockHourlyResponse);
    await fetchForecast(mockFetch);

    const calledUrl = mockFetch.mock.calls[0][0];
    expect(calledUrl).toContain('hourly=temperature_2m,wind_speed_10m,wind_direction_10m,weather_code');
    expect(calledUrl).toContain('forecast_days=1');
  });

  test('throws error on non-ok response', async () => {
    const mockFetch = createMockFetch({}, false, 500);
    await expect(fetchForecast(mockFetch)).rejects.toThrow('Open-Meteo API error: 500');
  });

  test('throws error on network failure', async () => {
    const mockFetch = jest.fn().mockRejectedValue(new Error('Network error'));
    await expect(fetchForecast(mockFetch)).rejects.toThrow('Network error');
  });
});
