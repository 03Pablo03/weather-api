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

- Card central con datos meteorologicos actuales:
  - Ciudad y coordenadas
  - Temperatura en Celsius y Fahrenheit con icono
  - Velocidad del viento en km/h y mph con icono
  - Timestamp de ultima actualizacion
- Seccion de alertas meteorologicas:
  - Banners coloreados por severidad (amarillo=warning, rojo=danger)
  - Icono + mensaje + hora prevista de la alerta
  - Se oculta si no hay alertas activas
- Timeline de prevision 24 horas:
  - Scroll horizontal con items por hora
  - Cada item muestra: hora, icono del tiempo, temperatura, viento
  - Responsive: layout vertical en movil
- Boton "Actualizar datos" lanza los 3 fetches en paralelo (`Promise.all`)
- Primera peticion automatica al cargar la pagina (los 3 endpoints)

## Estados visuales

- **Loading:** spinner o indicador mientras espera respuesta
- **Error:** mensaje claro si la API falla
- **Datos cargados:** toda la informacion formateada

## Skills

- Fetch API del navegador
- Manipulacion del DOM
- CSS responsive (media queries, flexbox/grid)
- Manejo de estados UI (loading, error, success)
- Paleta de colores dinamica segun temperatura
