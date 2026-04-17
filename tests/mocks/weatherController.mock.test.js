import { jest } from '@jest/globals';
import { getWeather } from '../../src/controllers/weatherController.js';

const mockWeatherData = {
  temperature: 22.5,
  windspeed: 15.0,
  winddirection: 180,
  weathercode: 1,
  time: '2026-04-07T12:00',
};

function createMockRes() {
  const res = {
    json: jest.fn(),
    status: jest.fn().mockReturnThis(),
  };
  return res;
}

describe('getWeather', () => {
  it('should return 200 with formatted weather data', async () => {
    const mockFetchWeather = jest.fn().mockResolvedValue(mockWeatherData);
    const res = createMockRes();

    await getWeather({}, res, mockFetchWeather);

    expect(res.json).toHaveBeenCalledTimes(1);

    const response = res.json.mock.calls[0][0];

    // location block
    expect(response).toHaveProperty('location');
    expect(response.location).toHaveProperty('latitude');
    expect(response.location).toHaveProperty('longitude');
    expect(response.location).toHaveProperty('city');

    // temperature block
    expect(response).toHaveProperty('temperature');
    expect(response.temperature.celsius).toBe(22.5);
    expect(response.temperature).toHaveProperty('fahrenheit');

    // wind_speed block
    expect(response).toHaveProperty('wind_speed');
    expect(response.wind_speed.kmh).toBe(15.0);
    expect(response.wind_speed).toHaveProperty('mph');

    // metadata
    expect(response).toHaveProperty('timestamp');
    expect(response).toHaveProperty('source');
  });

  it('should return temperature in at least 2 units', async () => {
    const mockFetchWeather = jest.fn().mockResolvedValue(mockWeatherData);
    const res = createMockRes();

    await getWeather({}, res, mockFetchWeather);

    const response = res.json.mock.calls[0][0];

    expect(response.temperature).toHaveProperty('celsius');
    expect(response.temperature).toHaveProperty('fahrenheit');
  });

  it('should return wind speed in at least 2 units', async () => {
    const mockFetchWeather = jest.fn().mockResolvedValue(mockWeatherData);
    const res = createMockRes();

    await getWeather({}, res, mockFetchWeather);

    const response = res.json.mock.calls[0][0];

    expect(response.wind_speed).toHaveProperty('kmh');
    expect(response.wind_speed).toHaveProperty('mph');
  });

  it('should return 502 when external API fails', async () => {
    const mockFetchWeather = jest
      .fn()
      .mockRejectedValue(new Error('External API unavailable'));
    const res = createMockRes();

    await getWeather({}, res, mockFetchWeather);

    expect(res.status).toHaveBeenCalledWith(502);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        error: expect.any(String),
      }),
    );
  });
});
