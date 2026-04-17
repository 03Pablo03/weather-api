import {
  celsiusToFahrenheit,
  celsiusToKelvin,
  kmhToMph,
  kmhToMs,
  kmhToKnots,
} from '../../src/utils/conversions.js';

describe('celsiusToFahrenheit', () => {
  it('should convert 0°C to 32°F', () => {
    expect(celsiusToFahrenheit(0)).toBeCloseTo(32, 2);
  });

  it('should convert 100°C to 212°F', () => {
    expect(celsiusToFahrenheit(100)).toBeCloseTo(212, 2);
  });

  it('should convert -40°C to -40°F (crossover point)', () => {
    expect(celsiusToFahrenheit(-40)).toBeCloseTo(-40, 2);
  });

  it('should convert 25°C to 77°F', () => {
    expect(celsiusToFahrenheit(25)).toBeCloseTo(77, 2);
  });
});

describe('celsiusToKelvin', () => {
  it('should convert 0°C to 273.15K', () => {
    expect(celsiusToKelvin(0)).toBeCloseTo(273.15, 2);
  });

  it('should convert -273.15°C to 0K (absolute zero)', () => {
    expect(celsiusToKelvin(-273.15)).toBeCloseTo(0, 2);
  });

  it('should convert 100°C to 373.15K', () => {
    expect(celsiusToKelvin(100)).toBeCloseTo(373.15, 2);
  });
});

describe('kmhToMph', () => {
  it('should convert 0 km/h to 0 mph', () => {
    expect(kmhToMph(0)).toBeCloseTo(0, 2);
  });

  it('should convert 100 km/h to 62.14 mph', () => {
    expect(kmhToMph(100)).toBeCloseTo(62.14, 2);
  });

  it('should convert 1.60934 km/h to 1 mph', () => {
    expect(kmhToMph(1.60934)).toBeCloseTo(1, 2);
  });
});

describe('kmhToMs', () => {
  it('should convert 0 km/h to 0 m/s', () => {
    expect(kmhToMs(0)).toBeCloseTo(0, 2);
  });

  it('should convert 36 km/h to 10 m/s', () => {
    expect(kmhToMs(36)).toBeCloseTo(10, 2);
  });

  it('should convert 3.6 km/h to 1 m/s', () => {
    expect(kmhToMs(3.6)).toBeCloseTo(1, 2);
  });
});

describe('kmhToKnots', () => {
  it('should convert 0 km/h to 0 knots', () => {
    expect(kmhToKnots(0)).toBeCloseTo(0, 2);
  });

  it('should convert 1.852 km/h to 1 knot', () => {
    expect(kmhToKnots(1.852)).toBeCloseTo(1, 2);
  });

  it('should convert 100 km/h to approximately 53.996 knots', () => {
    expect(kmhToKnots(100)).toBeCloseTo(53.996, 2);
  });
});
