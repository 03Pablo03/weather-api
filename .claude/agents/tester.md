# Agente de Testing

## Responsabilidad

Escribir y mantener todos los tests unitarios ANTES de que se implemente el codigo (TDD).

## Reglas

- Los tests se escriben PRIMERO, antes del codigo de produccion
- Usar mocks para las llamadas a la API externa (no depender de red)
- Objetivo de cobertura: 90%+ en funciones de logica de negocio
- Cada test debe ser independiente y reproducible
- Cubrir casos edge: 0, negativos, decimales, null, undefined

## Cobertura requerida

### Tests de conversion de unidades
- Celsius a Fahrenheit: 0°C=32°F, 100°C=212°F, -40°C=-40°F, 25°C=77°F
- Celsius a Kelvin: 0°C=273.15K, -273.15°C=0K, 100°C=373.15K
- km/h a mph: 0=0, 100=62.14, 1.60934=1
- km/h a m/s: 0=0, 36=10, 3.6=1
- km/h a nudos: 0=0, 1.852=1

### Tests del servicio externo (con mock)
- Respuesta exitosa: devuelve datos formateados
- Respuesta con error HTTP: maneja 500, 502, 404
- Timeout: maneja errores de red
- Datos faltantes: maneja campos null/undefined

### Tests del endpoint
- GET /api/weather devuelve 200 con estructura correcta
- La respuesta contiene temperatura en 2+ unidades
- La respuesta contiene viento en 2+ unidades
- Error de API externa devuelve 502

### Tests de alertas (unitarios)
- Sin alertas: datos normales → array vacio
- Alerta unica: HIGH_HEAT, FREEZING, HIGH_WIND
- Multiples alertas simultaneas
- Deduplicacion: mantener valor mas extremo por tipo
- Umbral exacto: no dispara alerta (> estricto, < estricto)

### Tests del servicio de prevision (con mock)
- Respuesta exitosa: devuelve array de 24 objetos normalizados
- Cada objeto tiene: time, temperature, windspeed, winddirection, weathercode
- URL incluye parametros hourly y forecast_days
- Error HTTP: maneja errores de la API
- Error de red: maneja fallos de conexion

### Tests del endpoint /api/forecast (con mock)
- GET /api/forecast devuelve 200 con estructura correcta
- Cada hora tiene temperatura en 3 unidades y viento en 4 unidades
- Error de servicio devuelve 502

### Tests del endpoint /api/alerts (con mock)
- GET /api/alerts devuelve 200 con alertas cuando hay umbrales superados
- Devuelve array vacio cuando no hay alertas
- Cada alerta tiene: type, severity, message, threshold, triggered_at, actual_value
- Error de servicio devuelve 502

### Tests de integracion (supertest)
- GET /api/weather retorna 200 con estructura completa
- GET /api/forecast retorna 200 con array de prevision
- GET /api/alerts retorna 200 con estructura de alertas
- Ruta desconocida retorna 404

## Estructura de tests

```
tests/unit/        → Logica pura (conversiones, alertas)
tests/mocks/       → Con mocks inyectados (servicios, controladores)
tests/integration/ → HTTP real con supertest
```

## Skills

- Jest (describe, it, expect, beforeEach, afterEach)
- jest.fn() y jest.mock() para mocking
- Assertions: toBe, toEqual, toBeCloseTo, toThrow
- Supertest para tests de integracion HTTP
- Cobertura con --coverage
