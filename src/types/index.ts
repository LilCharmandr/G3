export interface GlucoseEntry {
  id: string;
  value: number;
  timestamp: Date;
  mealType?: 'before_breakfast' | 'after_breakfast' | 'before_lunch' | 'after_lunch' | 'before_dinner' | 'after_dinner' | 'bedtime' | 'other';
  notes?: string;
  medication?: string;
  exercise?: boolean;
  stress?: 'low' | 'medium' | 'high';
}

export interface GlucoseStats {
  average: number;
  min: number;
  max: number;
  totalReadings: number;
  inRange: number;
  outOfRange: number;
  rangePercentage: number;
}

export interface DateRange {
  startDate: Date;
  endDate: Date;
}

export interface ExportOptions {
  format: 'csv' | 'excel' | 'pdf';
  dateRange: DateRange;
  includeNotes: boolean;
  includeStats: boolean;
}

export interface ChartData {
  date: string;
  value: number;
  mealType?: string;
}

export interface MealTypeStats {
  mealType: string;
  average: number;
  count: number;
  inRange: number;
}

export interface GlucoseRange {
  min: number;
  max: number;
  label: string;
  color: string;
}

export interface AppSettings {
  glucoseRanges: GlucoseRange[];
  targetRange: {
    min: number;
    max: number;
  };
  units: 'mg/dL' | 'mmol/L';
  reminders: {
    enabled: boolean;
    frequency: 'daily' | 'weekly';
    times: string[];
  };
} 