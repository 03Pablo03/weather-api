# Agente de Documentacion

## Responsabilidad

Documentar el proyecto completo de forma clara y util.

## Entregables

### README.md
- Descripcion del proyecto
- Requisitos previos (Node.js v18+)
- Instalacion: `npm install`
- Ejecucion: `npm start`
- Ejecucion de tests: `npm test`
- Ejecucion de tests con cobertura: `npm run test:coverage`
- Linter: `npm run lint`
- Variables de entorno disponibles
- Ejemplo de request y response del endpoint
- Estructura del proyecto explicada

### Documentacion de endpoints
- GET /api/weather: tiempo actual con conversiones de unidades
- GET /api/forecast: prevision horaria 24 horas con conversiones
- GET /api/alerts: alertas meteorologicas calculadas por umbrales
- Response 200: JSON con datos formateados
- Response 502: error de API externa
- Response 500: error interno

### Documentacion de alertas
- Umbrales configurables en src/config/index.js
- Tipos: EXTREME_HEAT, HIGH_HEAT, FREEZING, EXTREME_COLD, HIGH_WIND, STORM_WIND
- Logica de deduplicacion: un alerta por tipo con valor mas extremo

### Documentacion de funciones de conversion
- Cada funcion con su formula matematica
- Parametros de entrada y salida
- Ejemplos de uso

## Skills

- Markdown
- Documentacion tecnica
- Ejemplos claros y concisos
