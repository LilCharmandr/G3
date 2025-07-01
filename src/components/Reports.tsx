import React, { useState } from 'react';
import { useGlucose } from '../context/GlucoseContext';
import { calculateStats, filterEntriesByDateRange, getDateRangePresets, calculateMealTypeStats } from '../utils/glucoseUtils';
import { exportToCSV, exportToExcel, exportToPDF, downloadFile } from '../utils/exportUtils';
import { format } from 'date-fns';
import { Download, Calendar, BarChart3, PieChart } from 'lucide-react';
import GlucoseChart from './GlucoseChart';
import { ExportOptions } from '../types';
import toast from 'react-hot-toast';

const Reports: React.FC = () => {
  const { state } = useGlucose();
  const [selectedRange, setSelectedRange] = useState('last30Days');
  const [exportFormat, setExportFormat] = useState<'csv' | 'excel' | 'pdf'>('excel');
  const [showExportOptions, setShowExportOptions] = useState(false);

  const dateRanges = getDateRangePresets();
  const currentRange = dateRanges[selectedRange as keyof typeof dateRanges];
  const filteredEntries = filterEntriesByDateRange(state.entries, currentRange.startDate, currentRange.endDate);
  const stats = calculateStats(filteredEntries, state.settings.targetRange);
  const mealStats = calculateMealTypeStats(filteredEntries, state.settings.targetRange);

  const handleExport = async () => {
    if (filteredEntries.length === 0) {
      toast.error('No data to export for the selected date range');
      return;
    }

    const options: ExportOptions = {
      format: exportFormat,
      dateRange: currentRange,
      includeNotes: true,
      includeStats: true
    };

    try {
      let content: string | Blob;
      let filename: string;
      let mimeType: string;

      switch (exportFormat) {
        case 'csv':
          content = await exportToCSV(filteredEntries, options);
          filename = `glucose-report-${format(currentRange.startDate, 'yyyy-MM-dd')}-${format(currentRange.endDate, 'yyyy-MM-dd')}.csv`;
          mimeType = 'text/csv';
          break;
        case 'excel':
          content = await exportToExcel(filteredEntries, options);
          filename = `glucose-report-${format(currentRange.startDate, 'yyyy-MM-dd')}-${format(currentRange.endDate, 'yyyy-MM-dd')}.xlsx`;
          mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
          break;
        case 'pdf':
          content = await exportToPDF(filteredEntries, options);
          filename = `glucose-report-${format(currentRange.startDate, 'yyyy-MM-dd')}-${format(currentRange.endDate, 'yyyy-MM-dd')}.pdf`;
          mimeType = 'application/pdf';
          break;
      }

      downloadFile(content, filename, mimeType);
      toast.success('Report exported successfully!');
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export report');
    }
  };

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Reports</h1>
          <p className="text-gray-600 dark:text-gray-400">Analyze your glucose data</p>
        </div>
        <button
          onClick={() => setShowExportOptions(!showExportOptions)}
          className="btn-primary flex items-center gap-2"
        >
          <Download size={20} />
          Export
        </button>
      </div>

      {/* Export Options */}
      {showExportOptions && (
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Export Options</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Export Format
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['csv', 'excel', 'pdf'] as const).map(format => (
                  <button
                    key={format}
                    onClick={() => setExportFormat(format)}
                    className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                      exportFormat === format
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {format.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
            <button
              onClick={handleExport}
              className="btn-primary w-full"
            >
              Export Report
            </button>
          </div>
        </div>
      )}

      {/* Date Range Selector */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Time Period</h3>
        <div className="grid grid-cols-2 gap-2">
          {Object.entries({
            last7Days: 'Last 7 Days',
            last30Days: 'Last 30 Days',
            thisWeek: 'This Week',
            thisMonth: 'This Month'
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
        <div className="mt-3 text-sm text-gray-600">
          {format(currentRange.startDate, 'MMM dd, yyyy')} - {format(currentRange.endDate, 'MMM dd, yyyy')}
        </div>
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-2 gap-4">
        <div className="card text-center">
          <div className="text-3xl font-bold text-gray-900 mb-1">{stats.average}</div>
          <div className="text-sm text-gray-600">Average Glucose</div>
        </div>
        <div className="card text-center">
          <div className="text-3xl font-bold text-gray-900 mb-1">{stats.rangePercentage}%</div>
          <div className="text-sm text-gray-600">In Target Range</div>
        </div>
        <div className="card text-center">
          <div className="text-3xl font-bold text-gray-900 mb-1">{stats.totalReadings}</div>
          <div className="text-sm text-gray-600">Total Readings</div>
        </div>
        <div className="card text-center">
          <div className="text-3xl font-bold text-gray-900 mb-1">{stats.max}</div>
          <div className="text-sm text-gray-600">Highest Reading</div>
        </div>
      </div>

      {/* Chart */}
      {filteredEntries.length > 0 && (
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Glucose Trend</h3>
          <GlucoseChart entries={filteredEntries} targetRange={state.settings.targetRange} />
        </div>
      )}

      {/* Meal Type Analysis */}
      {mealStats.length > 0 && (
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Meal Type Analysis</h3>
          <div className="space-y-3">
            {mealStats.map((meal) => (
              <div key={meal.mealType} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium text-gray-900">{meal.mealType}</div>
                  <div className="text-sm text-gray-600">{meal.count} readings</div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-gray-900">{meal.average} mg/dL</div>
                  <div className="text-sm text-gray-600">
                    {Math.round((meal.inRange / meal.count) * 100)}% in range
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Data Table */}
      {filteredEntries.length > 0 && (
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Recent Readings</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2">Date</th>
                  <th className="text-left py-2">Time</th>
                  <th className="text-left py-2">Glucose</th>
                  <th className="text-left py-2">Meal</th>
                  <th className="text-left py-2">Notes</th>
                </tr>
              </thead>
              <tbody>
                {filteredEntries.slice(0, 10).map((entry) => (
                  <tr key={entry.id} className="border-b border-gray-100">
                    <td className="py-2">{format(new Date(entry.timestamp), 'MMM dd')}</td>
                    <td className="py-2">{format(new Date(entry.timestamp), 'HH:mm')}</td>
                    <td className="py-2 font-medium">{entry.value} mg/dL</td>
                    <td className="py-2">
                      {entry.mealType ? entry.mealType.split('_').map(word => 
                        word.charAt(0).toUpperCase() + word.slice(1)
                      ).join(' ') : '-'}
                    </td>
                    <td className="py-2 text-gray-600 truncate max-w-32">
                      {entry.notes || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {filteredEntries.length === 0 && (
        <div className="card text-center py-12">
          <BarChart3 size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500">No data available for the selected time period</p>
        </div>
      )}
    </div>
  );
};

export default Reports; 