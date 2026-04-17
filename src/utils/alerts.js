export function checkThreshold(value, operator, thresholdValue) {
  if (operator === '>') return value > thresholdValue;
  if (operator === '<') return value < thresholdValue;
  return false;
}

export function evaluateAlerts(hourlyData, thresholds) {
  const alertMap = new Map();

  for (const hour of hourlyData) {
    for (const threshold of thresholds) {
      const value = hour[threshold.parameter];
      if (value === undefined) continue;

      if (checkThreshold(value, threshold.operator, threshold.value)) {
        const existing = alertMap.get(threshold.type);
        const isMoreExtreme = !existing ||
          (threshold.operator === '>' && value > existing.actual_value) ||
          (threshold.operator === '<' && value < existing.actual_value);

        if (isMoreExtreme) {
          alertMap.set(threshold.type, {
            type: threshold.type,
            severity: threshold.severity,
            message: `${threshold.message}: ${value} ${threshold.unit}`,
            threshold: {
              parameter: threshold.parameter,
              operator: threshold.operator,
              value: threshold.value,
              unit: threshold.unit
            },
            triggered_at: hour.time,
            actual_value: value
          });
        }
      }
    }
  }

  return Array.from(alertMap.values());
}
