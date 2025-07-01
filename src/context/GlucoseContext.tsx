import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { GlucoseEntry, AppSettings } from '../types';
import { generateId, DEFAULT_GLUCOSE_RANGES, DEFAULT_TARGET_RANGE } from '../utils/glucoseUtils';

interface GlucoseState {
  entries: GlucoseEntry[];
  settings: AppSettings;
}

type GlucoseAction =
  | { type: 'ADD_ENTRY'; payload: Omit<GlucoseEntry, 'id'> }
  | { type: 'UPDATE_ENTRY'; payload: GlucoseEntry }
  | { type: 'DELETE_ENTRY'; payload: string }
  | { type: 'LOAD_ENTRIES'; payload: GlucoseEntry[] }
  | { type: 'UPDATE_SETTINGS'; payload: Partial<AppSettings> }
  | { type: 'LOAD_SETTINGS'; payload: AppSettings };

const initialState: GlucoseState = {
  entries: [],
  settings: {
    glucoseRanges: DEFAULT_GLUCOSE_RANGES,
    targetRange: DEFAULT_TARGET_RANGE,
    units: 'mg/dL',
    reminders: {
      enabled: false,
      frequency: 'daily',
      times: ['08:00', '12:00', '18:00']
    }
  }
};

function glucoseReducer(state: GlucoseState, action: GlucoseAction): GlucoseState {
  switch (action.type) {
    case 'ADD_ENTRY':
      const newEntry: GlucoseEntry = {
        ...action.payload,
        id: generateId()
      };
      return {
        ...state,
        entries: [...state.entries, newEntry].sort((a, b) => 
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        )
      };
    
    case 'UPDATE_ENTRY':
      return {
        ...state,
        entries: state.entries.map(entry => 
          entry.id === action.payload.id ? action.payload : entry
        )
      };
    
    case 'DELETE_ENTRY':
      return {
        ...state,
        entries: state.entries.filter(entry => entry.id !== action.payload)
      };
    
    case 'LOAD_ENTRIES':
      return {
        ...state,
        entries: action.payload
      };
    
    case 'UPDATE_SETTINGS':
      return {
        ...state,
        settings: { ...state.settings, ...action.payload }
      };
    
    case 'LOAD_SETTINGS':
      return {
        ...state,
        settings: action.payload
      };
    
    default:
      return state;
  }
}

interface GlucoseContextType {
  state: GlucoseState;
  addEntry: (entry: Omit<GlucoseEntry, 'id'>) => void;
  updateEntry: (entry: GlucoseEntry) => void;
  deleteEntry: (id: string) => void;
  updateSettings: (settings: Partial<AppSettings>) => void;
}

const GlucoseContext = createContext<GlucoseContextType | undefined>(undefined);

export function GlucoseProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(glucoseReducer, initialState);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedEntries = localStorage.getItem('glucoseEntries');
    const savedSettings = localStorage.getItem('glucoseSettings');
    
    if (savedEntries) {
      try {
        const entries = JSON.parse(savedEntries).map((entry: any) => ({
          ...entry,
          timestamp: new Date(entry.timestamp)
        }));
        dispatch({ type: 'LOAD_ENTRIES', payload: entries });
      } catch (error) {
        console.error('Error loading entries:', error);
      }
    }
    
    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings);
        dispatch({ type: 'LOAD_SETTINGS', payload: settings });
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    }
  }, []);

  // Save data to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('glucoseEntries', JSON.stringify(state.entries));
  }, [state.entries]);

  useEffect(() => {
    localStorage.setItem('glucoseSettings', JSON.stringify(state.settings));
  }, [state.settings]);

  const addEntry = (entry: Omit<GlucoseEntry, 'id'>) => {
    dispatch({ type: 'ADD_ENTRY', payload: entry });
  };

  const updateEntry = (entry: GlucoseEntry) => {
    dispatch({ type: 'UPDATE_ENTRY', payload: entry });
  };

  const deleteEntry = (id: string) => {
    dispatch({ type: 'DELETE_ENTRY', payload: id });
  };

  const updateSettings = (settings: Partial<AppSettings>) => {
    dispatch({ type: 'UPDATE_SETTINGS', payload: settings });
  };

  return (
    <GlucoseContext.Provider value={{
      state,
      addEntry,
      updateEntry,
      deleteEntry,
      updateSettings
    }}>
      {children}
    </GlucoseContext.Provider>
  );
}

export function useGlucose() {
  const context = useContext(GlucoseContext);
  if (context === undefined) {
    throw new Error('useGlucose must be used within a GlucoseProvider');
  }
  return context;
} 