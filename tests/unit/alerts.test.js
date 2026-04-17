import { evaluateAlerts, checkThreshold } from '../../src/utils/alerts.js';

const thresholds = [
  { type: 'EXTREME_HEAT', parameter: 'temperature', operator: '>', value: 40, unit: '°C', severity: 'danger', message: 'Temperatura extrema prevista' },
  { type: 'HIGH_HEAT', parameter: 'temperature', operator: '>', value: 35, unit: '°C', severity: 'warning', message: 'Calor intenso previsto' },
  { type: 'FREEZING', parameter: 'temperature', operator: '<', value: 0, unit: '°C', severity: 'warning', message: 'Helada prevista' },
  { type: 'EXTREME_COLD', parameter: 'temperature', operator: '<', value: -10, unit: '°C', severity: 'danger', message: 'Frio extremo previsto' },
  { type: 'HIGH_WIND', parameter: 'windspeed', operator: '>', value: 60, unit: 'km/h', severity: 'warning', message: 'Viento fuerte previsto' },
  { type: 'STORM_WIND', parameter: 'windspeed', operator: '>', value: 90, unit: 'km/h', severity: 'danger', message: 'Viento de tormenta previsto' },
];

describe('checkThreshold', () => {
  test('returns true when value exceeds > threshold', () => {
    expect(checkThreshold(41, '>', 40)).toBe(true);
  });

  test('returns false when value equals > threshold', () => {
    expect(checkThreshold(40, '>', 40)).toBe(false);
  });

  test('returns true when value is below < threshold', () => {
    expect(checkThreshold(-1, '<', 0)).toBe(true);
  });

  test('returns false when value equals < threshold', () => {
    expect(checkThreshold(0, '<', 0)).toBe(false);
  });

  test('returns false when value does not exceed > threshold', () => {
    expect(checkThreshold(30, '>', 40)).toBe(false);
  });
});

describe('evaluateAlerts', () => {
  test('returns empty array when no thresholds are triggered', () => {
    const hourlyData = [
      { time: '2026-04-16T12:00', temperature: 20, windspeed: 10 },
      { time: '2026-04-16T13:00', temperature: 22, windspeed: 15 },
    ];
    const alerts = evaluateAlerts(hourlyData, thresholds);
    expect(alerts).toEqual([]);
  });

  test('returns empty array for empty hourly data', () => {
    const alerts = evaluateAlerts([], thresholds);
    expect(alerts).toEqual([]);
  });

  test('detects a single high heat alert', () => {
    const hourlyData = [
      { time: '2026-04-16T12:00', temperature: 20, windspeed: 10 },
      { time: '2026-04-16T13:00', temperature: 37, windspeed: 10 },
    ];
    const alerts = evaluateAlerts(hourlyData, thresholds);
    const heatAlert = alerts.find(a => a.type === 'HIGH_HEAT');
    expect(heatAlert).toBeDefined();
    expect(heatAlert.severity).toBe('warning');
    expect(heatAlert.actual_value).toBe(37);
    expect(heatAlert.triggered_at).toBe('2026-04-16T13:00');
  });

  test('detects freezing alert', () => {
    const hourlyData = [
      { time: '2026-04-16T06:00', temperature: -3, windspeed: 10 },
      { time: '2026-04-16T07:00', temperature: 2, windspeed: 10 },
    ];
    const alerts = evaluateAlerts(hourlyData, thresholds);
    const freezeAlert = alerts.find(a => a.type === 'FREEZING');
    expect(freezeAlert).toBeDefined();
    expect(freezeAlert.actual_value).toBe(-3);
  });

  test('detects high wind alert', () => {
    const hourlyData = [
      { time: '2026-04-16T14:00', temperature: 25, windspeed: 70 },
    ];
    const alerts = evaluateAlerts(hourlyData, thresholds);
    const windAlert = alerts.find(a => a.type === 'HIGH_WIND');
    expect(windAlert).toBeDefined();
    expect(windAlert.actual_value).toBe(70);
  });

  test('deduplicates by type keeping the most extreme value (max for >)', () => {
    const hourlyData = [
      { time: '2026-04-16T12:00', temperature: 36, windspeed: 10 },
      { time: '2026-04-16T13:00', temperature: 38, windspeed: 10 },
      { time: '2026-04-16T14:00', temperature: 37, windspeed: 10 },
    ];
    const alerts = evaluateAlerts(hourlyData, thresholds);
    const heatAlerts = alerts.filter(a => a.type === 'HIGH_HEAT');
    expect(heatAlerts).toHaveLength(1);
    expect(heatAlerts[0].actual_value).toBe(38);
    expect(heatAlerts[0].triggered_at).toBe('2026-04-16T13:00');
  });

  test('deduplicates by type keeping the most extreme value (min for <)', () => {
    const hourlyData = [
      { time: '2026-04-16T04:00', temperature: -2, windspeed: 10 },
      { time: '2026-04-16T05:00', temperature: -5, windspeed: 10 },
      { time: '2026-04-16T06:00', temperature: -1, windspeed: 10 },
    ];
    const alerts = evaluateAlerts(hourlyData, thresholds);
    const freezeAlerts = alerts.filter(a => a.type === 'FREEZING');
    expect(freezeAlerts).toHaveLength(1);
    expect(freezeAlerts[0].actual_value).toBe(-5);
  });

  test('can trigger multiple different alert types at once', () => {
    const hourlyData = [
      { time: '2026-04-16T14:00', temperature: 42, windspeed: 95 },
    ];
    const alerts = evaluateAlerts(hourlyData, thresholds);
    const types = alerts.map(a => a.type);
    expect(types).toContain('EXTREME_HEAT');
    expect(types).toContain('HIGH_HEAT');
    expect(types).toContain('HIGH_WIND');
    expect(types).toContain('STORM_WIND');
  });

  test('alert contains correct threshold info', () => {
    const hourlyData = [
      { time: '2026-04-16T18:00', temperature: 25, windspeed: 65 },
    ];
    const alerts = evaluateAlerts(hourlyData, thresholds);
    const windAlert = alerts.find(a => a.type === 'HIGH_WIND');
    expect(windAlert.threshold).toEqual({
      parameter: 'windspeed',
      operator: '>',
      value: 60,
      unit: 'km/h'
    });
    expect(windAlert.message).toContain('65');
  });

  test('value exactly at threshold does not trigger that specific alert', () => {
    const singleThreshold = [
      { type: 'EXTREME_HEAT', parameter: 'temperature', operator: '>', value: 40, unit: '°C', severity: 'danger', message: 'Temperatura extrema prevista' },
    ];
    const hourlyData = [
      { time: '2026-04-16T12:00', temperature: 40, windspeed: 60 },
    ];
    const alerts = evaluateAlerts(hourlyData, singleThreshold);
    expect(alerts).toEqual([]);
  });
});
