# Skill: Conversion de Unidades

## Formulas de temperatura

### Celsius a Fahrenheit
```
F = (C * 9/5) + 32
```
- 0°C = 32°F
- 100°C = 212°F
- -40°C = -40°F (punto de cruce)

### Celsius a Kelvin
```
K = C + 273.15
```
- 0°C = 273.15K
- -273.15°C = 0K (cero absoluto)
- 100°C = 373.15K

## Formulas de velocidad del viento

### km/h a mph
```
mph = kmh / 1.60934
```
- Factor: 1 km/h = 0.621371 mph

### km/h a m/s
```
ms = kmh / 3.6
```
- Factor: 1 km/h = 0.277778 m/s

### km/h a nudos (knots)
```
knots = kmh / 1.852
```
- Factor: 1 km/h = 0.539957 nudos

## Reglas de implementacion

- Cada funcion es PURA: recibe un numero, devuelve un numero
- Sin efectos secundarios
- Resultado redondeado a 2 decimales: `parseFloat(result.toFixed(2))`
- Exportadas individualmente como named exports
- Tests con casos edge: 0, negativos, decimales
