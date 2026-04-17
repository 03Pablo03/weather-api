const config = {
  port: process.env.PORT || 3000,
  apiBaseUrl: process.env.API_BASE_URL || 'https://api.open-meteo.com/v1/forecast',
  latitude: process.env.LATITUDE || 39.47,
  longitude: process.env.LONGITUDE || -0.38,
  forecastDays: 1,
  alertThresholds: [
    { type: 'EXTREME_HEAT', parameter: 'temperature', operator: '>', value: 40, unit: '°C', severity: 'danger', message: 'Temperatura extrema prevista' },
    { type: 'HIGH_HEAT', parameter: 'temperature', operator: '>', value: 35, unit: '°C', severity: 'warning', message: 'Calor intenso previsto' },
    { type: 'FREEZING', parameter: 'temperature', operator: '<', value: 0, unit: '°C', severity: 'warning', message: 'Helada prevista' },
    { type: 'EXTREME_COLD', parameter: 'temperature', operator: '<', value: -10, unit: '°C', severity: 'danger', message: 'Frio extremo previsto' },
    { type: 'HIGH_WIND', parameter: 'windspeed', operator: '>', value: 60, unit: 'km/h', severity: 'warning', message: 'Viento fuerte previsto' },
    { type: 'STORM_WIND', parameter: 'windspeed', operator: '>', value: 90, unit: 'km/h', severity: 'danger', message: 'Viento de tormenta previsto' },
  ]
};

export default config;
