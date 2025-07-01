import { GlucoseEntry, GlucoseStats, ChartData, MealTypeStats, GlucoseRange } from '../types';
import { format, startOfDay, endOfDay, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';

export const DEFAULT_GLUCOSE_RANGES: GlucoseRange[] = [
  { min: 0, max: 70, label: 'Low', color: 'glucose-low' },
  { min: 70, max: 140, label: 'Normal', color: 'glucose-normal' },
  { min: 140, max: 200, label: 'High', color: 'glucose-high' },
  { min: 200, max: 999, label: 'Very High', color: 'glucose-very-high' }
];

export const DEFAULT_TARGET_RANGE = { min: 80, max: 130 };

export function getGlucoseLevel(value: number, ranges: GlucoseRange[] = DEFAULT_GLUCOSE_RANGES): GlucoseRange {
  return ranges.find(range => value >= range.min && value <= range.max) || ranges[ranges.length - 1];
}

export function calculateStats(entries: GlucoseEntry[], targetRange = DEFAULT_TARGET_RANGE): GlucoseStats {
  if (entries.length === 0) {
    return {
      average: 0,
      min: 0,
      max: 0,
      totalReadings: 0,
      inRange: 0,
      outOfRange: 0,
      rangePercentage: 0
    };
  }

  const values = entries.map(entry => entry.value);
  const average = values.reduce((sum, value) => sum + value, 0) / values.length;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const inRange = entries.filter(entry => 
    entry.value >= targetRange.min && entry.value <= targetRange.max
  ).length;
  const outOfRange = entries.length - inRange;
  const rangePercentage = (inRange / entries.length) * 100;

  return {
    average: Math.round(average * 10) / 10,
    min,
    max,
    totalReadings: entries.length,
    inRange,
    outOfRange,
    rangePercentage: Math.round(rangePercentage * 10) / 10
  };
}

export function filterEntriesByDateRange(entries: GlucoseEntry[], startDate: Date, endDate: Date): GlucoseEntry[] {
  return entries.filter(entry => {
    const entryDate = new Date(entry.timestamp);
    return entryDate >= startDate && entryDate <= endDate;
  });
}

export function groupEntriesByDate(entries: GlucoseEntry[]): Map<string, GlucoseEntry[]> {
  const grouped = new Map<string, GlucoseEntry[]>();
  
  entries.forEach(entry => {
    const dateKey = format(new Date(entry.timestamp), 'yyyy-MM-dd');
    if (!grouped.has(dateKey)) {
      grouped.set(dateKey, []);
    }
    grouped.get(dateKey)!.push(entry);
  });
  
  return grouped;
}

export function prepareChartData(entries: GlucoseEntry[]): ChartData[] {
  return entries
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
    .map(entry => ({
      date: format(new Date(entry.timestamp), 'MMM dd, HH:mm'),
      value: entry.value,
      mealType: entry.mealType
    }));
}

export function calculateMealTypeStats(entries: GlucoseEntry[], targetRange = DEFAULT_TARGET_RANGE): MealTypeStats[] {
  const mealGroups = new Map<string, GlucoseEntry[]>();
  
  entries.forEach(entry => {
    if (entry.mealType) {
      if (!mealGroups.has(entry.mealType)) {
        mealGroups.set(entry.mealType, []);
      }
      mealGroups.get(entry.mealType)!.push(entry);
    }
  });
  
  return Array.from(mealGroups.entries()).map(([mealType, mealEntries]) => {
    const values = mealEntries.map(entry => entry.value);
    const average = values.reduce((sum, value) => sum + value, 0) / values.length;
    const inRange = mealEntries.filter(entry => 
      entry.value >= targetRange.min && entry.value <= targetRange.max
    ).length;
    
    return {
      mealType: formatMealType(mealType),
      average: Math.round(average * 10) / 10,
      count: mealEntries.length,
      inRange
    };
  }).sort((a, b) => b.count - a.count);
}

export function formatMealType(mealType: string): string {
  return mealType
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function formatGlucoseValue(value: number, units: 'mg/dL' | 'mmol/L' = 'mg/dL'): string {
  if (units === 'mmol/L') {
    return `${(value / 18).toFixed(1)} mmol/L`;
  }
  return `${value} mg/dL`;
}

export function convertGlucoseValue(value: number, fromUnit: 'mg/dL' | 'mmol/L', toUnit: 'mg/dL' | 'mmol/L'): number {
  if (fromUnit === toUnit) return value;
  
  if (fromUnit === 'mg/dL' && toUnit === 'mmol/L') {
    return value / 18;
  } else if (fromUnit === 'mmol/L' && toUnit === 'mg/dL') {
    return value * 18;
  }
  
  return value;
}

export function getDateRangePresets() {
  const now = new Date();
  
  return {
    today: {
      startDate: startOfDay(now),
      endDate: endOfDay(now)
    },
    yesterday: {
      startDate: startOfDay(subDays(now, 1)),
      endDate: endOfDay(subDays(now, 1))
    },
    last7Days: {
      startDate: startOfDay(subDays(now, 6)),
      endDate: endOfDay(now)
    },
    last30Days: {
      startDate: startOfDay(subDays(now, 29)),
      endDate: endOfDay(now)
    },
    thisWeek: {
      startDate: startOfWeek(now, { weekStartsOn: 1 }),
      endDate: endOfWeek(now, { weekStartsOn: 1 })
    },
    thisMonth: {
      startDate: startOfMonth(now),
      endDate: endOfMonth(now)
    }
  };
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
} 