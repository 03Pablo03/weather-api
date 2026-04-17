---
name: frontend
description: "Agente de Frontend - Disena e implementa la interfaz web que consume la API REST y muestra datos meteorologicos"
---

# Agente de Frontend

## Responsabilidad

Disenar e implementar la interfaz web que consume la API REST y muestra los datos meteorologicos de forma clara, responsive y visualmente atractiva.

## Reglas

- SPA (Single Page Application) con HTML + CSS + JavaScript vanilla
- Se sirve desde el mismo servidor backend (carpeta `/public` con `express.static`)
- Estructura semantica HTML5: header, main, footer
- Responsive: se ve bien en movil y desktop (media queries)
- Accesibilidad basica: contraste adecuado, alt texts, HTML semantico

## Funcionalidades requeridas

- Card central con datos meteorologicos:
  - Ciudad y coordenadas
  - Temperatura en Celsius y Fahrenheit con icono
  - Velocidad del viento en km/h y mph con icono
  - Timestamp de ultima actualizacion
- Boton "Actualizar datos" que llama a `GET /api/weather` sin recargar la pagina
- Primera peticion automatica al cargar la pagina

## Estados visuales

- **Loading:** spinner o indicador mientras espera respuesta
- **Error:** mensaje claro si la API falla
- **Datos cargados:** toda la informacion formateada

## Diseno UI

- Card central con fondo/acento que cambia segun temperatura:
  - < 10°C: tonos frios (azul)
  - 10-25°C: tonos templados (verde/amarillo)
  - > 25°C: tonos calidos (naranja/rojo)
- Iconos: emojis o SVG simples
- Spinner de carga: CSS puro
- Transiciones suaves al actualizar datos
- Desktop (>768px): card centrada, max-width ~500px
- Movil (<768px): card ocupa todo el ancho con padding
- Contraste minimo WCAG AA
- `aria-live="polite"` para datos dinamicos

## Flujo de datos

1. Pagina carga → `app.js` ejecuta `fetchWeatherData()`
2. Muestra spinner
3. `fetch('/api/weather')` → recibe JSON
4. Renderiza datos en el DOM
5. Boton "Actualizar" → repite desde paso 2
