# Weather API Project

## Descripcion del proyecto

Portal meteorologico full stack que consulta datos en tiempo real de Open-Meteo: tiempo actual, prevision 24 horas y alertas meteorologicas calculadas. Devuelve temperatura y velocidad del viento en multiples unidades. Proyecto desarrollado con asistencia de IA siguiendo metodologia TDD y arquitectura limpia.

## Stack tecnologico

- **Runtime:** Node.js (v18+)
- **Framework:** Express.js — ligero, ampliamente adoptado, ideal para APIs REST simples
- **Testing:** Jest + Supertest — framework completo con mocking integrado, cobertura, soporte ESM y tests de integracion HTTP
- **Linter:** ESLint — configuracion estandar para mantener calidad de codigo
- **HTTP Client:** node-fetch — cliente HTTP ligero para llamadas a API externa
- **Language:** JavaScript (ES Modules)

## Convenciones de codigo

- **Modulos:** ES Modules (`import`/`export`) en todo el proyecto
- **Naming:** camelCase para variables y funciones, PascalCase para clases
- **Estructura:** cada modulo con una unica responsabilidad (SRP)
- **Funciones puras:** las funciones de conversion no tienen efectos secundarios
- **Async:** usar `async`/`await` para operaciones asincronas
- **Configuracion:** valores por defecto en config, sobreescribibles con variables de entorno
- **Sin secrets hardcodeados:** URLs y parametros en modulo de configuracion

## Arquitectura

```
/src
  /config         → configuracion centralizada (URL, coordenadas, puerto, umbrales de alertas)
  /controllers    → logica de endpoints (weather, forecast, alerts)
  /services       → llamadas a API externa (current weather + hourly forecast)
  /utils          → funciones puras de conversion de unidades y evaluacion de alertas
  /routes         → definicion de rutas REST
/public
  index.html      → pagina principal del frontend (SPA)
  style.css       → estilos responsive con paleta dinamica
  app.js          → logica del frontend (fetch API, render, estados)
/tests
  /unit           → tests unitarios de logica pura (conversiones, alertas)
  /mocks          → tests con mocks inyectados (servicios, controladores)
  /integration    → tests de integracion HTTP con supertest
```

Separacion de responsabilidades:
- **Config** → centraliza toda la configuracion
- **Utils** → funciones puras de conversion, sin dependencias externas
- **Services** → comunicacion con API externa, manejo de errores de red
- **Controllers** → orquestacion: llama al servicio, aplica conversiones, formatea respuesta
- **Public** → frontend SPA servido como contenido estatico por Express

## Regla TDD obligatoria

NO se escribe codigo de produccion sin su test unitario correspondiente. Flujo:
1. El agente **tester** escribe los tests primero
2. El agente **developer** implementa hasta que pasen
3. El agente **reviewer** verifica calidad y cobertura

## Agentes disponibles

| Agente | Archivo | Responsabilidad |
|--------|---------|-----------------|
| Arquitecto | `.claude/agents/architect.md` | Disena estructura, define interfaces y contratos |
| Developer | `.claude/agents/developer.md` | Implementa codigo siguiendo decisiones del arquitecto |
| Tester | `.claude/agents/tester.md` | Escribe y mantiene tests unitarios (TDD) |
| Reviewer | `.claude/agents/reviewer.md` | Revisa todo el codigo antes de darlo por terminado |
| Frontend | `.claude/agents/frontend.md` | Disena e implementa la interfaz web |
| Docs | `.claude/agents/docs.md` | Documenta el proyecto completo |

## Skills disponibles

| Skill | Archivo | Dominio |
|-------|---------|---------|
| Conversion de unidades | `.claude/skills/unit-conversion.md` | Formulas y reglas de conversion |
| API externa | `.claude/skills/external-api.md` | Consumo de Open-Meteo (current + hourly) |
| Diseno REST | `.claude/skills/rest-api-design.md` | Estructura de endpoints y respuestas |
| Frontend UI | `.claude/skills/frontend-ui.md` | Interfaz web meteorologica |
| Alertas meteorologicas | `.claude/skills/weather-alerts.md` | Umbrales, evaluacion y deduplicacion |
| API de prevision | `.claude/skills/forecast-api.md` | Consumo de datos horarios Open-Meteo |

## Ejecucion

```bash
# Instalar dependencias
npm install

# Arrancar servidor
npm start

# Ejecutar todos los tests
npm test

# Ejecutar solo tests unitarios
npm run test:unit

# Ejecutar solo tests con mocks
npm run test:mocks

# Ejecutar solo tests de integracion
npm run test:integration

# Ejecutar tests con cobertura
npm run test:coverage

# Ejecutar linter
npm run lint
```

## Endpoints REST

| Endpoint | Metodo | Descripcion |
|----------|--------|-------------|
| `/api/weather` | GET | Tiempo actual con conversiones de unidades |
| `/api/forecast` | GET | Prevision horaria de las proximas 24 horas |
| `/api/alerts` | GET | Alertas meteorologicas calculadas por umbrales |

## Variables de entorno

| Variable | Default | Descripcion |
|----------|---------|-------------|
| `PORT` | `3000` | Puerto del servidor |
| `API_BASE_URL` | `https://api.open-meteo.com/v1/forecast` | URL base de Open-Meteo |
| `LATITUDE` | `39.47` | Latitud (Valencia) |
| `LONGITUDE` | `-0.38` | Longitud (Valencia) |
