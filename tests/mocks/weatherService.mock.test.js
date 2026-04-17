import { jest } from '@jest/globals';
import { fetchWeather } from '../../src/services/weatherService.js';

describe('fetchWeather', () => {
  test('should return normalized weather data on successful response', async () => {
    const mockData = {
      current: {
        temperature_2m: 22.5,
        wind_speed_10m: 15.0,
        wind_direction_10m: 180,
        weather_code: 1,
        time: '2026-04-07T12:00',
      },
    };

    const mockFetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockData),
      })
    );

    const result = await fetchWeather(mockFetch);

    expect(result).toEqual({
      temperature: 22.5,
      windspeed: 15.0,
      winddirection: 180,
      weathercode: 1,
      time: '2026-04-07T12:00',
    });

    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  test('should throw an error when API returns non-OK response', async () => {
    const mockFetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        status: 502,
      })
    );

    await expect(fetchWeather(mockFetch)).rejects.toThrow('502');
  });

  test('should throw an error when network fails', async () => {
    const mockFetch = jest.fn(() =>
      Promise.reject(new Error('Network error'))
    );

    await expect(fetchWeather(mockFetch)).rejects.toThrow();
  });

  test('should handle missing fields in API response', async () => {
    const mockData = {
      current: {
        temperature_2m: 20,
      },
    };

    const mockFetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockData),
      })
    );

    const result = await fetchWeather(mockFetch);

    expect(result.temperature).toBe(20);
    expect(result.windspeed).toBeUndefined();
    expect(result.winddirection).toBeUndefined();
    expect(result.weathercode).toBeUndefined();
  });
});
