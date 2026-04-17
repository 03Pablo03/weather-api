export function celsiusToFahrenheit(celsius) {
  return parseFloat(((celsius * 9 / 5) + 32).toFixed(2));
}

export function celsiusToKelvin(celsius) {
  return parseFloat((celsius + 273.15).toFixed(2));
}

export function kmhToMph(kmh) {
  return parseFloat((kmh / 1.60934).toFixed(2));
}

export function kmhToMs(kmh) {
  return parseFloat((kmh / 3.6).toFixed(2));
}

export function kmhToKnots(kmh) {
  return parseFloat((kmh / 1.852).toFixed(2));
}
