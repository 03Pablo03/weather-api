# Skill: Diseno de API REST

## Endpoint: GET /api/weather

- **Metodo:** GET
- **Ruta:** `/api/weather`
- **Content-Type:** `application/json`

### Estructura de la respuesta (200 OK)

```json
{
  "location": {
    "latitude": 39.47,
    "longitude": -0.38,
    "city": "Valencia"
  },
  "timestamp": "2026-04-07T12:00:00Z",
  "source": "Open-Meteo API",
  "temperature": {
    "celsius": 22.5,
    "fahrenheit": 72.5,
    "kelvin": 295.65
  },
  "wind_speed": {
    "kmh": 15.0,
    "mph": 9.32,
    "ms": 4.17,
    "knots": 8.1
  },
  "wind_direction": 180,
  "weather_code": 1
}
```

## Endpoint: GET /api/forecast

- **Metodo:** GET
- **Ruta:** `/api/forecast`
- **Content-Type:** `application/json`

### Respuesta (200 OK)

```json
{
  "location": {
    "latitude": 39.47,
    "longitude": -0.38,
    "city": "Valencia"
  },
  "timestamp": "2026-04-07T12:00:00Z",
  "source": "Open-Meteo API",
  "forecast": [
    {
      "time": "2026-04-07T00:00",
      "temperature": { "celsius": 18.2, "fahrenheit": 64.76 },
      "wind_speed": { "kmh": 12.0, "mph": 7.46 },
      "wind_direction": 180,
      "weather_code": 0
    }
  ]
}
```

## Endpoint: GET /api/alerts

- **Metodo:** GET
- **Ruta:** `/api/alerts`
- **Content-Type:** `application/json`

### Respuesta (200 OK)

```json
{
  "location": {
    "latitude": 39.47,
    "longitude": -0.38,
    "city": "Valencia"
  },
  "timestamp": "2026-04-07T12:00:00Z",
  "alerts": [
    {
      "type": "HIGH_HEAT",
      "level": "warning",
      "message": "Temperatura alta: 37.2°C a las 14:00",
      "value": 37.2,
      "unit": "°C",
      "time": "2026-04-07T14:00"
    },
    {
      "type": "HIGH_WIND",
      "level": "danger",
      "message": "Viento fuerte: 95 km/h a las 16:00",
      "value": 95,
      "unit": "km/h",
      "time": "2026-04-07T16:00"
    }
  ]
}
```

Cuando no hay alertas: `"alerts": []`

## Respuesta de error

```json
{
  "error": "Failed to fetch weather data from external API",
  "status": 502
}
```

## Codigos HTTP (todos los endpoints)

| Codigo | Significado | Cuando |
|--------|-------------|--------|
| 200 | OK | Consulta exitosa |
| 502 | Bad Gateway | La API externa fallo o no respondio |
| 500 | Internal Server Error | Error interno del servidor |

## Reglas

- Siempre devolver JSON, incluso en errores
- Incluir metadata: timestamp, coordenadas, fuente de datos
- Temperatura en al menos 2 unidades (Celsius y Fahrenheit)
- Velocidad del viento en al menos 2 unidades (km/h y mph)
- No exponer stack traces ni detalles internos en errores
- Alertas: campo `level` con valores `"warning"` o `"danger"`
- Forecast: array de 24 objetos (uno por hora)
