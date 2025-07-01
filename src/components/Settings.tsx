import React, { useState } from 'react';
import { useGlucose } from '../context/GlucoseContext';
import { toast } from 'react-hot-toast';
import { Settings as SettingsIcon, Trash2, Download, Upload } from 'lucide-react';

const Settings: React.FC = () => {
  const { state, updateSettings, deleteEntry } = useGlucose();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleTargetRangeChange = (field: 'min' | 'max', value: string) => {
    const numValue = parseInt(value);
    if (isNaN(numValue) || numValue < 0 || numValue > 1000) {
      toast.error('Please enter a valid glucose value (0-1000 mg/dL)');
      return;
    }

    const newTargetRange = {
      ...state.settings.targetRange,
      [field]: numValue
    };

    if (newTargetRange.min >= newTargetRange.max) {
      toast.error('Minimum value must be less than maximum value');
      return;
    }

    updateSettings({ targetRange: newTargetRange });
    toast.success('Target range updated');
  };

  const handleUnitsChange = (units: 'mg/dL' | 'mmol/L') => {
    updateSettings({ units });
    toast.success('Units updated');
  };

  const handleReminderToggle = (enabled: boolean) => {
    updateSettings({
      reminders: {
        ...state.settings.reminders,
        enabled
      }
    });
    toast.success(`Reminders ${enabled ? 'enabled' : 'disabled'}`);
  };

  const handleReminderFrequencyChange = (frequency: 'daily' | 'weekly') => {
    updateSettings({
      reminders: {
        ...state.settings.reminders,
        frequency
      }
    });
    toast.success('Reminder frequency updated');
  };

  const handleExportData = () => {
    const data = {
      entries: state.entries,
      settings: state.settings,
      exportDate: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `glucose-tracker-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success('Data exported successfully');
  };

  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        if (data.entries && data.settings) {
          // In a real app, you'd want to validate the data structure
          localStorage.setItem('glucoseEntries', JSON.stringify(data.entries));
          localStorage.setItem('glucoseSettings', JSON.stringify(data.settings));
          window.location.reload(); // Reload to apply changes
          toast.success('Data imported successfully');
        } else {
          toast.error('Invalid backup file format');
        }
      } catch (error) {
        toast.error('Failed to import data');
      }
    };
    reader.readAsText(file);
  };

  const handleDeleteAllData = () => {
    if (showDeleteConfirm) {
      localStorage.removeItem('glucoseEntries');
      localStorage.removeItem('glucoseSettings');
      window.location.reload();
      toast.success('All data deleted');
    } else {
      setShowDeleteConfirm(true);
      setTimeout(() => setShowDeleteConfirm(false), 5000);
    }
  };

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <SettingsIcon size={24} className="text-primary-600" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600">Manage your preferences</p>
        </div>
      </div>

      {/* Target Range */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Target Glucose Range</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Minimum (mg/dL)
            </label>
            <input
              type="number"
              value={state.settings.targetRange.min}
              onChange={(e) => handleTargetRangeChange('min', e.target.value)}
              className="input-field"
              min="0"
              max="1000"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Maximum (mg/dL)
            </label>
            <input
              type="number"
              value={state.settings.targetRange.max}
              onChange={(e) => handleTargetRangeChange('max', e.target.value)}
              className="input-field"
              min="0"
              max="1000"
            />
          </div>
        </div>
        <p className="text-sm text-gray-600 mt-2">
          Readings within this range will be considered "in target"
        </p>
      </div>

      {/* Units */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Units</h3>
        <div className="grid grid-cols-2 gap-2">
          {(['mg/dL', 'mmol/L'] as const).map(unit => (
            <button
              key={unit}
              onClick={() => handleUnitsChange(unit)}
              className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                state.settings.units === unit
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {unit}
            </button>
          ))}
        </div>
      </div>

      {/* Reminders */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Reminders</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Enable reminders</span>
            <button
              onClick={() => handleReminderToggle(!state.settings.reminders.enabled)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                state.settings.reminders.enabled ? 'bg-primary-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  state.settings.reminders.enabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
          
          {state.settings.reminders.enabled && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Frequency
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(['daily', 'weekly'] as const).map(frequency => (
                  <button
                    key={frequency}
                    onClick={() => handleReminderFrequencyChange(frequency)}
                    className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                      state.settings.reminders.frequency === frequency
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {frequency.charAt(0).toUpperCase() + frequency.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Data Management */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Data Management</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-gray-900">Total Entries</div>
              <div className="text-sm text-gray-600">{state.entries.length} readings</div>
            </div>
            <button
              onClick={handleExportData}
              className="btn-secondary flex items-center gap-2"
            >
              <Download size={16} />
              Export
            </button>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Import Backup
            </label>
            <input
              type="file"
              accept=".json"
              onChange={handleImportData}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
            />
          </div>
          
          <div className="pt-4 border-t border-gray-200">
            <button
              onClick={handleDeleteAllData}
              className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-colors ${
                showDeleteConfirm
                  ? 'bg-red-600 text-white hover:bg-red-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Trash2 size={16} />
              {showDeleteConfirm ? 'Click again to confirm' : 'Delete All Data'}
            </button>
            {showDeleteConfirm && (
              <p className="text-sm text-red-600 mt-2 text-center">
                This action cannot be undone
              </p>
            )}
          </div>
        </div>
      </div>

      {/* App Info */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">About</h3>
        <div className="space-y-2 text-sm text-gray-600">
          <p>Glucose Tracker v1.0.0</p>
          <p>A comprehensive glucose monitoring application</p>
          <p>Data is stored locally on your device</p>
        </div>
      </div>
    </div>
  );
};

export default Settings; 