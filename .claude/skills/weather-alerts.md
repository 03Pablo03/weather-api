# Skill: Alertas Meteorologicas

## Umbrales configurados

| Tipo | Parametro | Condicion | Severidad |
|------|-----------|-----------|-----------|
| EXTREME_HEAT | temperature | > 40°C | danger |
| HIGH_HEAT | temperature | > 35°C | warning |
| FREEZING | temperature | < 0°C | warning |
| EXTREME_COLD | temperature | < -10°C | danger |
| HIGH_WIND | windspeed | > 60 km/h | warning |
| STORM_WIND | windspeed | > 90 km/h | danger |

Los umbrales se definen en `src/config/index.js` como array de objetos con: `type`, `parameter`, `operator`, `value`, `unit`, `severity`, `message`.

## Funcion principal

```js
evaluateAlerts(hourlyData, thresholds) → Alert[]
```

- Recibe array de datos horarios y array de umbrales
- Itera cada hora, verifica cada umbral con `checkThreshold(value, operator, thresholdValue)`
- **Deduplicacion:** si multiples horas disparan el mismo tipo de alerta, mantiene solo el valor mas extremo (max para `>`, min para `<`)
- Retorna array de alertas con: `type`, `severity`, `message`, `threshold`, `triggered_at`, `actual_value`

## Reglas

- Las funciones de alertas son **puras** — sin dependencias externas ni efectos secundarios
- El operador `>` y `<` son **estrictos** (el valor exacto del umbral NO dispara la alerta)
- Los umbrales son configurables desde config, no hardcodeados en la logica
