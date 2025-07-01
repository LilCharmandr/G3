import React, { useState } from 'react';
import { useGlucose } from '../context/GlucoseContext';
import { calculateStats, filterEntriesByDateRange, getDateRangePresets, getGlucoseLevel } from '../utils/glucoseUtils';
import { format } from 'date-fns';
import { TrendingUp, TrendingDown, Activity, Target } from 'lucide-react';
import GlucoseChart from './GlucoseChart';
import RecentEntries from './RecentEntries';

const Dashboard: React.FC = () => {
  const { state } = useGlucose();
  const [selectedRange, setSelectedRange] = useState('last7Days');
  
  const dateRanges = getDateRangePresets();
  const currentRange = dateRanges[selectedRange as keyof typeof dateRanges];
  const filteredEntries = filterEntriesByDateRange(state.entries, currentRange.startDate, currentRange.endDate);
  const stats = calculateStats(filteredEntries, state.settings.targetRange);
  
  const todayEntries = filterEntriesByDateRange(
    state.entries,
    dateRanges.today.startDate,
    dateRanges.today.endDate
  );
  
  const latestEntry = state.entries[0];
  const latestGlucoseLevel = latestEntry ? getGlucoseLevel(latestEntry.value, state.settings.glucoseRanges) : null;

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Glucose Tracker</h1>
        <p className="text-gray-600">Monitor your glucose levels daily</p>
      </div>

      {/* Latest Reading */}
      {latestEntry && (
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Latest Reading</h2>
            <span className={`px-3 py-1 rounded-full text-sm font-medium border ${latestGlucoseLevel?.color}`}>
              {latestGlucoseLevel?.label}
            </span>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-gray-900 mb-2">
              {latestEntry.value} mg/dL
            </div>
            <div className="text-sm text-gray-600">
              {format(new Date(latestEntry.timestamp), 'MMM dd, yyyy HH:mm')}
            </div>
            {latestEntry.mealType && (
              <div className="text-sm text-gray-500 mt-1">
                {latestEntry.mealType.split('_').map(word => 
                  word.charAt(0).toUpperCase() + word.slice(1)
                ).join(' ')}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="card text-center">
          <div className="flex items-center justify-center mb-2">
            <Activity className="w-5 h-5 text-primary-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{stats.totalReadings}</div>
          <div className="text-sm text-gray-600">Total Readings</div>
        </div>
        
        <div className="card text-center">
          <div className="flex items-center justify-center mb-2">
            <Target className="w-5 h-5 text-green-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{stats.rangePercentage}%</div>
          <div className="text-sm text-gray-600">In Range</div>
        </div>
        
        <div className="card text-center">
          <div className="flex items-center justify-center mb-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{stats.average}</div>
          <div className="text-sm text-gray-600">Average</div>
        </div>
        
        <div className="card text-center">
          <div className="flex items-center justify-center mb-2">
            <TrendingDown className="w-5 h-5 text-orange-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{stats.min}</div>
          <div className="text-sm text-gray-600">Lowest</div>
        </div>
      </div>

      {/* Date Range Selector */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Time Period</h3>
        <div className="grid grid-cols-3 gap-2">
          {Object.entries({
            today: 'Today',
            last7Days: '7 Days',
            last30Days: '30 Days'
          }).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setSelectedRange(key)}
              className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                selectedRange === key
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      {filteredEntries.length > 0 && (
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Glucose Trend</h3>
          <GlucoseChart entries={filteredEntries} />
        </div>
      )}

      {/* Recent Entries */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Recent Entries</h3>
        <RecentEntries entries={state.entries.slice(0, 5)} />
      </div>
    </div>
  );
};

export default Dashboard; 