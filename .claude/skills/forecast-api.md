# Skill: Consumo de API de Prevision (Open-Meteo Hourly)

## Parametros de la API

- **URL base:** `https://api.open-meteo.com/v1/forecast`
- **Parametros adicionales para prevision:**
  - `hourly=temperature_2m,wind_speed_10m,wind_direction_10m,weather_code`
  - `forecast_days=1` (proximas 24 horas)

## URL completa de ejemplo

```
https://api.open-meteo.com/v1/forecast?latitude=39.47&longitude=-0.38&hourly=temperature_2m,wind_speed_10m,wind_direction_10m,weather_code&forecast_days=1
```

## Estructura de respuesta de Open-Meteo

La API devuelve **arrays paralelos** bajo `data.hourly`:

```json
{
  "hourly": {
    "time": ["2026-04-16T00:00", "2026-04-16T01:00", ...],
    "temperature_2m": [14.3, 13.8, ...],
    "wind_speed_10m": [3.7, 4.2, ...],
    "wind_direction_10m": [299, 305, ...],
    "weather_code": [0, 0, ...]
  }
}
```

## Normalizacion

Los arrays paralelos se **zipean** en un array de objetos por hora:

```js
hourly.time.map((time, i) => ({
  time,
  temperature: hourly.temperature_2m[i],
  windspeed: hourly.wind_speed_10m[i],
  winddirection: hourly.wind_direction_10m[i],
  weathercode: hourly.weather_code[i],
}))
```

## Reglas

- Fetch inyectable como parametro `fetchFn` para testing
- Timeout de 5 segundos con `AbortController`
- Si `response.ok === false`, lanzar error con codigo HTTP
- El servicio esta en `src/services/forecastService.js`
