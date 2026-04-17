# Weather API

Servicio REST API desarrollado con Node.js y Express que consulta datos meteorologicos en tiempo real de la API de Open-Meteo y los devuelve formateados con temperatura y velocidad del viento en multiples unidades de medida. Incluye interfaz web responsive que muestra los datos de forma visual con paleta de colores dinamica segun la temperatura.

## Requisitos previos

- **Node.js** v18 o superior
- **npm** (incluido con Node.js)

## Instalacion

```bash
npm install
```

## Ejecucion

```bash
npm start
```

El servidor se iniciara por defecto en `http://localhost:3000`. Abre esa URL en el navegador para ver la interfaz web.

## Ejecucion de tests

```bash
npm test
```

## Tests con cobertura

```bash
npm run test:coverage
```

## Linter

```bash
npm run lint
```

## Variables de entorno

| Variable        | Descripcion                          | Valor por defecto                                    |
|-----------------|--------------------------------------|------------------------------------------------------|
| `PORT`          | Puerto en el que escucha el servidor | `3000`                                               |
| `API_BASE_URL`  | URL base de la API de Open-Meteo     | `https://api.open-meteo.com/v1/forecast`             |
| `LATITUDE`      | Latitud de la ubicacion a consultar  | `39.47` (Valencia)                                   |
| `LONGITUDE`     | Longitud de la ubicacion a consultar | `-0.38` (Valencia)                                   |

## Endpoint

### `GET /api/weather`

Devuelve los datos meteorologicos actuales de la ubicacion configurada con las conversiones de unidades aplicadas.

#### Respuesta exitosa (200)

```json
{
  "location": {
    "latitude": 39.47,
    "longitude": -0.38,
    "city": "Valencia"
  },
  "timestamp": "2026-04-07T12:00",
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

#### Respuestas de error

**502 Bad Gateway** - Cuando la API externa de Open-Meteo no esta disponible o devuelve un error:

```json
{
  "error": "Failed to fetch weather data from external API",
  "status": 502
}
```

**500 Internal Server Error** - Cuando ocurre un error inesperado en el servidor.

## Estructura del proyecto

```
/
├── CLAUDE.md                          # Instrucciones del proyecto para IA
├── README.md                          # Documentacion del proyecto
├── package.json                       # Dependencias y scripts
├── eslint.config.js                   # Configuracion del linter
├── src/
│   ├── index.js                       # Punto de entrada, servidor Express
│   ├── config/
│   │   └── index.js                   # Configuracion (puerto, URL, coordenadas)
│   ├── controllers/
│   │   └── weatherController.js       # Controlador del endpoint weather
│   ├── routes/
│   │   └── weather.js                 # Definicion de rutas
│   ├── services/
│   │   └── weatherService.js          # Servicio de consulta a Open-Meteo
│   └── utils/
│       └── conversions.js             # Funciones de conversion de unidades
├── public/
│   ├── index.html                     # Pagina principal del frontend (SPA)
│   ├── style.css                      # Estilos responsive con paleta dinamica
│   └── app.js                         # Logica del frontend (fetch, render, estados)
├── tests/
│   └── unit/
│       ├── conversions.test.js        # Tests de funciones de conversion
│       ├── weatherService.test.js     # Tests del servicio de consulta
│       └── weatherController.test.js  # Tests del controlador
└── docs/
    └── prompt.md                      # Documento con los prompts utilizados
```

## Funciones de conversion

El modulo `src/utils/conversions.js` contiene las siguientes funciones puras de conversion de unidades:

### Temperatura

| Funcion                         | Formula                         | Ejemplo                    |
|---------------------------------|---------------------------------|----------------------------|
| `celsiusToFahrenheit(celsius)`  | `(celsius * 9 / 5) + 32`       | `25°C` -> `77°F`          |
| `celsiusToKelvin(celsius)`      | `celsius + 273.15`              | `0°C` -> `273.15 K`       |

### Velocidad del viento

| Funcion              | Formula            | Ejemplo                       |
|----------------------|--------------------|-------------------------------|
| `kmhToMph(kmh)`     | `kmh / 1.60934`    | `100 km/h` -> `62.14 mph`    |
| `kmhToMs(kmh)`      | `kmh / 3.6`        | `36 km/h` -> `10 m/s`        |
| `kmhToKnots(kmh)`   | `kmh / 1.852`      | `100 km/h` -> `53.996 knots` |

Todas las funciones devuelven el resultado redondeado a 2 decimales mediante `parseFloat(value.toFixed(2))`.

## Interfaz web

Al acceder a `http://localhost:3000` se muestra una interfaz web con:

- **Card central** con datos meteorologicos de Valencia
- **Temperatura** en Celsius, Fahrenheit y Kelvin con icono
- **Viento** en km/h, mph y m/s con icono
- **Paleta de colores dinamica** segun temperatura (frio=azul, templado=verde, calido=naranja, calor=rojo)
- **Boton "Actualizar datos"** que refresca sin recargar la pagina
- **Estados visuales:** loading (spinner), error (mensaje + boton reintentar), datos cargados
- **Responsive:** se adapta a movil y desktop

## Tecnologias

- **Runtime:** Node.js
- **Framework:** Express 5
- **Testing:** Jest 30
- **Linting:** ESLint 9
- **HTTP Client:** node-fetch 3
- **Modulos:** ES Modules (`import`/`export`)
