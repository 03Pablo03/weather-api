# Skill: Consumo de API Externa (Open-Meteo)

## Configuracion de la API

- **URL base:** `https://api.open-meteo.com/v1/forecast`
- **Parametros requeridos:**
  - `latitude=39.47` (Valencia, Spain)
  - `longitude=-0.38`
  - `current=temperature_2m,wind_speed_10m,wind_direction_10m,weather_code`

## URL completa

```
https://api.open-meteo.com/v1/forecast?latitude=39.47&longitude=-0.38&current=temperature_2m,wind_speed_10m,wind_direction_10m,weather_code
```

## Estructura de la respuesta

```json
{
  "current": {
    "time": "2026-04-07T12:00",
    "interval": 900,
    "temperature_2m": 22.5,
    "wind_speed_10m": 15.0,
    "wind_direction_10m": 180,
    "weather_code": 1
  }
}
```

## Manejo de errores

| Escenario | Accion | HTTP Response |
|-----------|--------|---------------|
| API responde 200 | Parsear JSON, extraer `current` | 200 OK |
| API responde 4xx/5xx | Lanzar error descriptivo | 502 Bad Gateway |
| Timeout de red | Lanzar error de timeout | 502 Bad Gateway |
| Respuesta no es JSON | Lanzar error de parseo | 502 Bad Gateway |
| Campos faltantes en respuesta | Usar valores por defecto o lanzar error | 500 Internal Server Error |

## Parametros de prevision horaria

- **Parametros adicionales para forecast:**
  - `hourly=temperature_2m,wind_speed_10m,wind_direction_10m,weather_code`
  - `forecast_days=1`

### URL completa (forecast horario)

```
https://api.open-meteo.com/v1/forecast?latitude=39.47&longitude=-0.38&current=temperature_2m,wind_speed_10m,wind_direction_10m,weather_code&hourly=temperature_2m,wind_speed_10m,wind_direction_10m,weather_code&forecast_days=1
```

### Estructura de la respuesta horaria

La API devuelve arrays paralelos dentro de `hourly`:

```json
{
  "hourly": {
    "time": ["2026-04-07T00:00", "2026-04-07T01:00", "..."],
    "temperature_2m": [18.2, 17.5, "..."],
    "wind_speed_10m": [12.0, 14.3, "..."],
    "wind_direction_10m": [180, 190, "..."],
    "weather_code": [0, 1, "..."]
  }
}
```

### Normalizacion (zip de arrays paralelos)

Los arrays paralelos deben combinarse en un array de objetos por hora:

```js
// hourly.time.map((t, i) => ({ time: t, temperature: hourly.temperature_2m[i], ... }))
[
  { "time": "2026-04-07T00:00", "temperature_2m": 18.2, "wind_speed_10m": 12.0, "wind_direction_10m": 180, "weather_code": 0 },
  { "time": "2026-04-07T01:00", "temperature_2m": 17.5, "wind_speed_10m": 14.3, "wind_direction_10m": 190, "weather_code": 1 }
]
```

La funcion `fetchForecast()` debe retornar este array normalizado.

## Reglas de implementacion

- El cliente HTTP (fetch) debe estar abstraido para poder mockearlo en tests
- Configurar timeout (5 segundos por defecto)
- La URL y coordenadas vienen del modulo de configuracion, nunca hardcodeadas
- La funcion `fetchWeather()` retorna un objeto normalizado, no la respuesta cruda
- La funcion `fetchForecast()` retorna un array de objetos por hora (zip de arrays paralelos)
