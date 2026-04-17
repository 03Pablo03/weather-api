import { jest } from '@jest/globals';
import { getForecast } from '../../src/controllers/forecastController.js';

const mockForecastData = [
  { time: '2026-04-16T12:00', temperature: 25, windspeed: 15, winddirection: 220, weathercode: 2 },
  { time: '2026-04-16T13:00', temperature: 27, windspeed: 18, winddirection: 230, weathercode: 3 },
];

function createMockRes() {
  const res = {
    json: jest.fn(),
    status: jest.fn().mockReturnThis(),
  };
  return res;
}

describe('getForecast', () => {
  it('should return 200 with formatted forecast data', async () => {
    const mockFetchForecast = jest.fn().mockResolvedValue(mockForecastData);
    const res = createMockRes();

    await getForecast({}, res, mockFetchForecast);

    expect(res.json).toHaveBeenCalledTimes(1);
    const response = res.json.mock.calls[0][0];

    expect(response).toHaveProperty('location');
    expect(response.location).toHaveProperty('city', 'Valencia');
    expect(response).toHaveProperty('source', 'Open-Meteo API');
    expect(response).toHaveProperty('forecast');
    expect(response.forecast).toHaveLength(2);
  });

  it('should include temperature conversions for each hour', async () => {
    const mockFetchForecast = jest.fn().mockResolvedValue(mockForecastData);
    const res = createMockRes();

    await getForecast({}, res, mockFetchForecast);

    const hour = res.json.mock.calls[0][0].forecast[0];
    expect(hour.temperature).toHaveProperty('celsius', 25);
    expect(hour.temperature).toHaveProperty('fahrenheit');
    expect(hour.temperature).toHaveProperty('kelvin');
  });

  it('should include wind speed conversions for each hour', async () => {
    const mockFetchForecast = jest.fn().mockResolvedValue(mockForecastData);
    const res = createMockRes();

    await getForecast({}, res, mockFetchForecast);

    const hour = res.json.mock.calls[0][0].forecast[0];
    expect(hour.wind_speed).toHaveProperty('kmh', 15);
    expect(hour.wind_speed).toHaveProperty('mph');
    expect(hour.wind_speed).toHaveProperty('ms');
    expect(hour.wind_speed).toHaveProperty('knots');
  });

  it('should include time, wind_direction and weather_code for each hour', async () => {
    const mockFetchForecast = jest.fn().mockResolvedValue(mockForecastData);
    const res = createMockRes();

    await getForecast({}, res, mockFetchForecast);

    const hour = res.json.mock.calls[0][0].forecast[0];
    expect(hour).toHaveProperty('time', '2026-04-16T12:00');
    expect(hour).toHaveProperty('wind_direction', 220);
    expect(hour).toHaveProperty('weather_code', 2);
  });

  it('should return 502 when forecast service fails', async () => {
    const mockFetchForecast = jest.fn().mockRejectedValue(new Error('API error'));
    const res = createMockRes();

    await getForecast({}, res, mockFetchForecast);

    expect(res.status).toHaveBeenCalledWith(502);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ error: expect.any(String) }),
    );
  });
});
