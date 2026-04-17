# Prompts utilizados para el desarrollo del Weather API

## Prompt principal del usuario

> Crear un servicio REST API que consulte datos meteorologicos de Open-Meteo y los devuelva formateados con temperatura y velocidad del viento en multiples unidades de medida. El proyecto debe incluir un endpoint `GET /weather`, funciones de conversion de unidades y tests unitarios completos.

## Metodologia

Se utilizo un **sistema de subagentes** orquestado mediante un archivo `CLAUDE.md` que define la estructura del proyecto, las convenciones de codigo y el flujo de trabajo dividido en fases. Cada fase se ejecuto de forma secuencial, mientras que dentro de las fases se aprovecho el **paralelismo entre agentes independientes** para maximizar la eficiencia.

El enfoque seguido fue **TDD (Test-Driven Development)**: los tests se escribieron primero como especificacion del comportamiento esperado y luego se implemento el codigo de produccion para satisfacerlos.

---

## Fases del desarrollo

### Fase 1: Scaffolding

**Prompt:**
> Inicializar el proyecto npm con ES Modules y las dependencias necesarias: express, jest, node-fetch, eslint.

**Acciones realizadas:**
- Inicializacion de `package.json` con `"type": "module"` para soporte de ES Modules
- Instalacion de dependencias de produccion: `express`, `node-fetch`
- Instalacion de dependencias de desarrollo: `jest`, `eslint`
- Configuracion de scripts: `start`, `test`, `test:coverage`, `lint`
- Creacion de `eslint.config.js` con reglas basicas (flat config de ESLint 9)
- Creacion de la estructura de directorios: `src/`, `src/config/`, `src/utils/`, `src/services/`, `src/controllers/`, `src/routes/`, `tests/unit/`, `docs/`

---

### Fase 2: Implementacion paralela con 3 agentes

Esta fase se ejecuto con **3 agentes trabajando en paralelo**, ya que las tareas eran independientes entre si.

#### Agente 1 - Funciones de conversion (`src/utils/conversions.js`)

**Prompt:**
> Crear las funciones puras de conversion de unidades: celsiusToFahrenheit, celsiusToKelvin, kmhToMph, kmhToMs, kmhToKnots. Cada funcion debe devolver el resultado redondeado a 2 decimales.

**Resultado:**
- 5 funciones puras de conversion implementadas
- Conversion de temperatura: Celsius a Fahrenheit, Celsius a Kelvin
- Conversion de velocidad del viento: km/h a mph, km/h a m/s, km/h a nudos
- Todas con redondeo a 2 decimales via `parseFloat(value.toFixed(2))`

#### Agente 2 - Servicio meteorologico (`src/services/weatherService.js`)

**Prompt:**
> Crear el servicio que consulta la API de Open-Meteo con los parametros de latitud, longitud y campos current (temperature_2m, wind_speed_10m, wind_direction_10m, weather_code). Incluir timeout de 5 segundos con AbortController. Aceptar una funcion fetch inyectable para testing.

**Resultado:**
- Funcion `fetchWeather(fetchFn)` con inyeccion de dependencias para facilitar el testing
- URL construida dinamicamente desde la configuracion (`src/config/index.js`)
- Timeout de 5 segundos con `AbortController`
- Normalizacion de la respuesta de la API a un objeto plano
- Manejo de errores HTTP (respuestas no-OK)

#### Agente 3 - Tests unitarios (`tests/unit/`)

**Prompt:**
> Escribir tests unitarios completos para: (1) todas las funciones de conversion con casos limite, (2) el servicio weatherService con mocks de fetch, (3) el controlador weatherController con mocks de request/response.

**Resultado:**
- `conversions.test.js`: 14 tests cubriendo las 5 funciones de conversion con valores conocidos, puntos de cruce y cero absoluto
- `weatherService.test.js`: 4 tests cubriendo respuesta exitosa, error HTTP, error de red y campos faltantes
- `weatherController.test.js`: 4 tests cubriendo respuesta formateada, multiples unidades de temperatura, multiples unidades de viento y error 502

---

### Fase 3: Integracion

**Prompt:**
> Crear el controlador que une el servicio con las conversiones, las rutas Express y el punto de entrada del servidor.

**Acciones realizadas:**

1. **Configuracion** (`src/config/index.js`):
   - Variables de entorno: `PORT`, `API_BASE_URL`, `LATITUDE`, `LONGITUDE`
   - Valores por defecto para desarrollo local (Valencia: 39.47, -0.38)

2. **Controlador** (`src/controllers/weatherController.js`):
   - Funcion `getWeather(req, res, fetchWeatherFn)` con inyeccion de dependencias
   - Construccion de la respuesta JSON con todas las conversiones aplicadas
   - Bloque location con latitud, longitud y ciudad
   - Bloque temperature con celsius, fahrenheit y kelvin
   - Bloque wind_speed con kmh, mph, m/s y nudos
   - Manejo de errores: respuesta 502 cuando la API externa falla

3. **Rutas** (`src/routes/weather.js`):
   - `GET /api/weather` conectado al controlador

4. **Servidor** (`src/index.js`):
   - Aplicacion Express con el router de weather montado
   - Escucha en el puerto configurado

---

### Fase 4: Verificacion

**Prompt:**
> Ejecutar todos los tests, verificar que pasan, y probar el endpoint manualmente con curl.

**Resultados:**
- **24 tests ejecutados, 24 pasados** (0 fallos)
  - 14 tests de conversiones
  - 4 tests del servicio
  - 4 tests del controlador (+ 2 adicionales de verificacion de unidades)
- **Verificacion con curl:**
  ```bash
  curl http://localhost:3000/api/weather
  ```
  Respuesta JSON correctamente formateada con todos los campos esperados
- **Linter:** Sin errores criticos

---

### Fase 5: Frontend

**Prompt:**
> Crear la interfaz web SPA (Single Page Application) con HTML + CSS + JavaScript vanilla, servida como contenido estatico desde Express. Card central con datos meteorologicos, paleta de colores dinamica segun temperatura, boton de actualizar, estados de loading/error/datos, responsive.

**Acciones realizadas:**

1. **Infraestructura actualizada:**
   - Nuevo agente: `.claude/agents/frontend.md`
   - Nuevo skill: `.claude/skills/frontend-ui.md`
   - CLAUDE.md actualizado con seccion de frontend
   - `src/index.js` actualizado con `express.static('public')`

2. **Frontend** (`public/`):
   - `index.html`: Estructura semantica HTML5 con header, main, footer. Tres estados: loading, error, data.
   - `style.css`: Diseño responsive con CSS custom properties, paleta dinamica por temperatura (frio=azul, templado=verde, calido=naranja, calor=rojo), spinner CSS puro, media queries para movil.
   - `app.js`: Fetch a `/api/weather`, render de datos en el DOM, manejo de estados (loading/error/data), boton de actualizar sin recargar pagina, carga automatica al abrir.

3. **Temas de temperatura:**
   - `< 5°C` → azul (theme-cold)
   - `5-15°C` → cian (theme-cool)
   - `15-25°C` → verde (theme-mild)
   - `25-35°C` → ambar (theme-warm)
   - `> 35°C` → rojo (theme-hot)

---

## Herramientas utilizadas

| Herramienta          | Uso                                                    |
|----------------------|--------------------------------------------------------|
| **Claude Opus 4.6**  | Modelo de IA utilizado para la generacion del codigo   |
| **Claude Code CLI**  | Interfaz de linea de comandos para interactuar con Claude |
| **Node.js**          | Runtime de ejecucion                                   |
| **Express 5**        | Framework HTTP para el servidor REST                   |
| **Jest 30**          | Framework de testing con soporte ES Modules            |
| **ESLint 9**         | Linter con flat config                                 |
| **node-fetch 3**     | Cliente HTTP compatible con ES Modules                 |

## Flujo TDD

El desarrollo siguio un flujo de **Test-Driven Development**:

1. **Escribir los tests primero:** Se definieron las expectativas de comportamiento para las funciones de conversion, el servicio y el controlador antes de implementar el codigo de produccion.

2. **Ejecutar los tests (rojo):** Los tests fallaron inicialmente al no existir las implementaciones.

3. **Implementar el codigo minimo:** Se escribio el codigo necesario para que todos los tests pasaran.

4. **Ejecutar los tests (verde):** Los 24 tests pasaron correctamente.

5. **Refactorizar:** Se reviso el codigo para asegurar claridad, consistencia y adherencia a las convenciones del proyecto (funciones puras, inyeccion de dependencias, manejo de errores en los limites).

Este enfoque garantizo que cada funcion tuviera cobertura de tests desde el inicio y que el comportamiento estuviera verificado antes de integrar los componentes.

---

## Actividad 2: Evolucion a Portal Meteorologico Completo

### Requisitos nuevos

> Realizar un portal meteorologico full stack que se conecte a una API tipo Open Meteo. El portal debe contener: tiempo actual, prevision proximas 24 horas y alertas meteorologicas. Se deben ejecutar 3 tipos de tests: unitarios, de integracion y con mocks.

### Fase 5: Infraestructura y reorganizacion de tests

**Prompt:**
> Refactorizar la infraestructura del proyecto para soportar 3 tipos de tests (unit, mocks, integration). Reorganizar tests existentes, instalar supertest, agregar scripts npm por tipo de test y exportar app de Express para tests de integracion.

**Acciones realizadas:**
1. `src/index.js` refactorizado para exportar `app` sin iniciar servidor
2. `supertest` instalado como devDependency
3. Scripts `test:unit`, `test:mocks`, `test:integration` agregados
4. Tests con mocks movidos de `tests/unit/` a `tests/mocks/`
5. Config actualizado con `alertThresholds` y `forecastDays`

### Fase 6: Alertas meteorologicas (TDD)

**Prompt:**
> Implementar logica de alertas meteorologicas con funciones puras. Umbrales: EXTREME_HEAT >40C, HIGH_HEAT >35C, FREEZING <0C, EXTREME_COLD <-10C, HIGH_WIND >60km/h, STORM_WIND >90km/h. Deduplicar alertas por tipo, mantener valor mas extremo.

**Acciones realizadas:**
1. Test first: `tests/unit/alerts.test.js` con 12 tests
2. Implementacion: `src/utils/alerts.js` con `evaluateAlerts()` y `checkThreshold()`

### Fase 7: Servicio de prevision (TDD)

**Prompt:**
> Crear servicio de prevision que consulte datos horarios de Open-Meteo (hourly=temperature_2m,wind_speed_10m,wind_direction_10m,weather_code) y los normalice en un array de 24 objetos.

**Acciones realizadas:**
1. Test first: `tests/mocks/forecastService.mock.test.js`
2. Implementacion: `src/services/forecastService.js` (mismo patron que weatherService)

### Fase 8: Controladores y endpoints (TDD)

**Prompt:**
> Crear controladores para GET /api/forecast y GET /api/alerts. Forecast aplica conversiones de unidades a cada hora. Alerts evalua umbrales sobre datos de prevision.

**Acciones realizadas:**
1. Tests first: `tests/mocks/forecastController.mock.test.js` y `tests/mocks/alertsController.mock.test.js`
2. Implementacion: `src/controllers/forecastController.js` y `src/controllers/alertsController.js`
3. Rutas actualizadas en `src/routes/weather.js`

### Fase 9: Tests de integracion

**Prompt:**
> Escribir tests de integracion HTTP con supertest para los 3 endpoints (/api/weather, /api/forecast, /api/alerts). Tests contra la app real con llamadas reales a Open-Meteo.

**Acciones realizadas:**
1. `tests/integration/weather.integration.test.js`
2. `tests/integration/forecast.integration.test.js`
3. `tests/integration/alerts.integration.test.js`

### Fase 10: Frontend ampliado

**Prompt:**
> Actualizar el frontend SPA para mostrar alertas meteorologicas (banners coloreados por severidad) y timeline de prevision 24 horas (scroll horizontal con datos por hora).

**Acciones realizadas:**
1. HTML: secciones de alertas y prevision en `index.html`
2. JS: funciones `fetchForecastData()`, `fetchAlertsData()`, `renderForecast()`, `renderAlerts()` con `Promise.all`
3. CSS: estilos para `.alert-banner`, `.forecast-timeline`, responsive movil

### Fase 11: Documentacion

**Prompt:**
> Actualizar todos los agentes, skills, CLAUDE.md y prompts para reflejar el nuevo alcance del proyecto.

**Acciones realizadas:**
1. 6 agentes actualizados con nuevos modulos y tipos de tests
2. 4 skills actualizados + 2 nuevos (weather-alerts.md, forecast-api.md)
3. CLAUDE.md actualizado con arquitectura, endpoints y scripts
4. docs/prompt.md actualizado con fases de Actividad 2
