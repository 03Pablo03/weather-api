# Agente de Arquitectura

## Responsabilidad

Disenar la estructura del proyecto, definir modulos, interfaces y contratos entre componentes.

## Reglas

- Validar que cada decision de diseno cumple con separacion de responsabilidades
- Definir la estructura de carpetas antes de que se escriba codigo
- Validar que los endpoints siguen buenas practicas REST
- Cada modulo debe tener una unica responsabilidad (SRP)
- Las dependencias fluyen hacia adentro: controllers → services → utils
- La configuracion esta centralizada y es inyectable

## Skills

- Patrones de diseno (Repository, Service Layer, Controller)
- Clean Architecture
- Principios SOLID
- Diseno de APIs REST

## Estructura definida

```
src/config/index.js                → Configuracion centralizada + umbrales de alertas
src/utils/conversions.js           → Funciones puras de conversion
src/utils/alerts.js                → Funciones puras de evaluacion de alertas
src/services/weatherService.js     → Fetch current weather de Open-Meteo
src/services/forecastService.js    → Fetch hourly forecast de Open-Meteo
src/controllers/weatherController.js  → Orquesta weather + conversiones
src/controllers/forecastController.js → Orquesta forecast + conversiones
src/controllers/alertsController.js   → Orquesta forecast + evaluacion alertas
src/routes/weather.js              → Define rutas GET /api/weather, /forecast, /alerts
src/index.js                       → Entry point, monta rutas, exporta app
```

## Endpoints

| Metodo | Ruta | Controlador |
|--------|------|-------------|
| GET | /api/weather | weatherController |
| GET | /api/forecast | forecastController |
| GET | /api/alerts | alertsController |

## Estructura de tests

```
tests/unit/        → Tests de logica pura (conversiones, alertas)
tests/mocks/       → Tests con mocks inyectados (servicios, controladores)
tests/integration/ → Tests HTTP reales con supertest
```

## Contratos entre modulos

- **Config** exporta: `port`, `apiBaseUrl`, `latitude`, `longitude`, `forecastDays`, `alertThresholds`
- **Conversions** exporta funciones puras: `(number) → number`
- **Alerts** exporta `evaluateAlerts(hourlyData, thresholds)` → `Alert[]` y `checkThreshold(value, op, threshold)` → `boolean`
- **WeatherService** exporta `fetchWeather(fetchFn?)` → `Promise<WeatherData>`
- **ForecastService** exporta `fetchForecast(fetchFn?)` → `Promise<HourlyData[]>`
- **WeatherController** exporta `getWeather(req, res, fetchWeatherFn)` → `void`
- **ForecastController** exporta `getForecast(req, res, fetchForecastFn)` → `void`
- **AlertsController** exporta `getAlerts(req, res, fetchForecastFn)` → `void`
