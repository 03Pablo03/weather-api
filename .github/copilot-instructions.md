# Weather API Project

## Descripcion del proyecto

Servicio REST API que consulta datos meteorologicos en tiempo real de Open-Meteo y los devuelve formateados con temperatura y velocidad del viento en multiples unidades. Proyecto desarrollado con asistencia de IA siguiendo metodologia TDD y arquitectura limpia.

## Stack tecnologico

- **Runtime:** Node.js (v18+)
- **Framework:** Express.js — ligero, ampliamente adoptado, ideal para APIs REST simples
- **Testing:** Jest — framework completo con mocking integrado, cobertura y soporte ESM
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
  /config         → configuracion centralizada (URL, coordenadas, puerto)
  /controllers    → logica del endpoint (recibe request, orquesta, responde)
  /services       → llamada a API externa (fetch + manejo de errores)
  /utils          → funciones puras de conversion de unidades
/public
  index.html      → pagina principal del frontend (SPA)
  style.css       → estilos responsive con paleta dinamica
  app.js          → logica del frontend (fetch API, render, estados)
/tests
  /unit           → tests unitarios (conversiones, servicio, endpoint)
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

| Agente | Invocacion | Responsabilidad |
|--------|------------|-----------------|
| Arquitecto | `@architect` | Disena estructura, define interfaces y contratos |
| Developer | `@developer` | Implementa codigo siguiendo decisiones del arquitecto |
| Tester | `@tester` | Escribe y mantiene tests unitarios (TDD) |
| Reviewer | `@reviewer` | Revisa todo el codigo antes de darlo por terminado |
| Frontend | `@frontend` | Disena e implementa la interfaz web |
| Docs | `@docs` | Documenta el proyecto completo |

## Conocimiento de dominio (Skills)

### Conversion de unidades
- Celsius a Fahrenheit: `F = (C * 9/5) + 32`
- Celsius a Kelvin: `K = C + 273.15`
- km/h a mph: `mph = kmh / 1.60934`
- km/h a m/s: `ms = kmh / 3.6`
- km/h a nudos: `knots = kmh / 1.852`
- Funciones puras, resultado redondeado a 2 decimales con `parseFloat(result.toFixed(2))`

### API externa (Open-Meteo)
- URL: `https://api.open-meteo.com/v1/forecast?latitude=39.47&longitude=-0.38&current=temperature_2m,wind_speed_10m,wind_direction_10m,weather_code`
- Manejo de errores: API falla → 502, timeout → 502, datos faltantes → 500

### Diseno REST
- Endpoint: `GET /api/weather` → JSON con temperatura y viento en multiples unidades
- Siempre devolver JSON, incluso en errores
- No exponer stack traces ni detalles internos

## Ejecucion

```bash
npm install          # Instalar dependencias
npm start            # Arrancar servidor
npm test             # Ejecutar tests
npm run test:coverage # Tests con cobertura
npm run lint         # Ejecutar linter
```

## Variables de entorno

| Variable | Default | Descripcion |
|----------|---------|-------------|
| `PORT` | `3000` | Puerto del servidor |
| `API_BASE_URL` | `https://api.open-meteo.com/v1/forecast` | URL base de Open-Meteo |
| `LATITUDE` | `39.47` | Latitud (Valencia) |
| `LONGITUDE` | `-0.38` | Longitud (Valencia) |
