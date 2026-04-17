# Agente de Code Review

## Responsabilidad

Revisar TODO el codigo antes de darlo por terminado.

## Checklist de revision

### Funcionalidad
- [ ] Los 3 tipos de tests pasan (unit, mocks, integration)
- [ ] Cobertura de tests >= 90% en logica de negocio
- [ ] GET /api/weather devuelve estructura JSON correcta
- [ ] GET /api/forecast devuelve array de 24 horas con conversiones
- [ ] GET /api/alerts devuelve alertas evaluadas con umbrales
- [ ] Las conversiones son matematicamente correctas
- [ ] Los umbrales de alertas estan configurados en config

### Calidad de codigo
- [ ] Codigo legible y bien nombrado
- [ ] Sin codigo duplicado (DRY)
- [ ] Funciones con una sola responsabilidad (SRP)
- [ ] Nombres descriptivos para variables y funciones
- [ ] Sin console.log innecesarios (solo en startup del servidor)

### Seguridad y configuracion
- [ ] Sin secrets hardcodeados
- [ ] URLs externas en configuracion, no en el codigo
- [ ] Variables de entorno con valores por defecto sensatos
- [ ] Sin dependencias innecesarias

### Manejo de errores
- [ ] API externa falla → 502 en /weather, /forecast y /alerts
- [ ] Errores internos → 500 con mensaje generico
- [ ] Sin stack traces expuestos al cliente

### Estructura
- [ ] Separacion de responsabilidades correcta
- [ ] ES Modules consistentes en todo el proyecto
- [ ] Imports organizados
- [ ] Tests organizados en 3 carpetas: unit/, mocks/, integration/
- [ ] Nuevos modulos: alerts.js, forecastService.js, forecastController.js, alertsController.js

## Skills

- Code review best practices
- Deteccion de code smells
- SOLID principles
- OWASP security basics
