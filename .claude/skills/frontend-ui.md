# Skill: Interfaz Web Meteorologica

## Layout

- Card central con los datos del tiempo
- Fondo o acento de color que cambie segun temperatura:
  - < 10°C: tonos frios (azul)
  - 10-25°C: tonos templados (verde/amarillo)
  - > 25°C: tonos calidos (naranja/rojo)

## Secciones de la card

1. **Header:** nombre de la ciudad, coordenadas, fuente de datos
2. **Temperatura:** valor en Celsius y Fahrenheit, icono de termometro
3. **Viento:** valor en km/h y mph, icono de viento
4. **Footer:** timestamp de ultima actualizacion, boton de refresh

## Elementos visuales

- Iconos: emojis o SVG simples (termometro, viento, ubicacion)
- Spinner de carga: CSS puro (animacion rotate)
- Transiciones suaves al actualizar datos

## Responsive

- **Desktop (>768px):** card centrada, max-width ~500px
- **Movil (<768px):** card ocupa todo el ancho con padding

## Accesibilidad

- Contraste minimo WCAG AA
- `alt` texts en elementos visuales
- HTML semantico: `<main>`, `<header>`, `<section>`, `<footer>`
- `aria-live="polite"` para datos que se actualizan dinamicamente

## Seccion de alertas meteorologicas

- Ubicada entre la card principal y la prevision
- Banners coloreados por severidad:
  - `warning` → fondo amarillo (#fef3c7), borde izquierdo ambar
  - `danger` → fondo rojo claro (#fee2e2), borde izquierdo rojo
- Cada banner muestra: icono + mensaje + hora prevista
- Se oculta completamente si no hay alertas (`hidden`)

## Timeline de prevision 24 horas

- Scroll horizontal con items por hora
- Cada item muestra: hora (HH:mm), icono del tiempo, temperatura (°C), viento (km/h)
- Responsive: layout vertical en movil (cada hora ocupa fila completa)
- Estilos: cards pequenas con sombra sutil, scroll-snap

## Flujo de datos

1. Pagina carga → `app.js` ejecuta `fetchAllData()` con `Promise.all`
2. Lanza en paralelo: `fetchWeatherData()`, `fetchForecastData()`, `fetchAlertsData()`
3. Cada fetch renderiza su seccion independientemente
4. Boton "Actualizar" → repite `fetchAllData()`

## Manejo de errores en UI

- Respuesta no OK → mostrar mensaje "No se pudieron obtener los datos"
- Error de red → mostrar mensaje "Error de conexion"
- Error en forecast → mostrar "Error al cargar la prevision"
- Error en alertas → ocultar seccion de alertas silenciosamente
- Sin recargar la pagina, el usuario puede reintentar con el boton
