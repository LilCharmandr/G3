import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGlucose } from '../context/GlucoseContext';
import { toast } from 'react-hot-toast';
import { Save, X } from 'lucide-react';

const AddEntry: React.FC = () => {
  const navigate = useNavigate();
  const { addEntry } = useGlucose();
  
  const [formData, setFormData] = useState({
    value: '',
    timestamp: new Date().toISOString().slice(0, 16),
    mealType: '' as 'before_breakfast' | 'after_breakfast' | 'before_lunch' | 'after_lunch' | 'before_dinner' | 'after_dinner' | 'bedtime' | 'other' | '',
    notes: '',
    medication: '',
    exercise: false,
    stress: '' as 'low' | 'medium' | 'high' | ''
  });

  const mealTypes = [
    { value: 'before_breakfast', label: 'Before Breakfast' },
    { value: 'after_breakfast', label: 'After Breakfast' },
    { value: 'before_lunch', label: 'Before Lunch' },
    { value: 'after_lunch', label: 'After Lunch' },
    { value: 'before_dinner', label: 'Before Dinner' },
    { value: 'after_dinner', label: 'After Dinner' },
    { value: 'bedtime', label: 'Bedtime' },
    { value: 'other', label: 'Other' }
  ];

  const stressLevels = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const glucoseValue = parseFloat(formData.value);
    if (isNaN(glucoseValue) || glucoseValue <= 0 || glucoseValue > 1000) {
      toast.error('Please enter a valid glucose value (1-1000 mg/dL)');
      return;
    }

    const entry = {
      value: glucoseValue,
      timestamp: new Date(formData.timestamp),
      mealType: formData.mealType as 'before_breakfast' | 'after_breakfast' | 'before_lunch' | 'after_lunch' | 'before_dinner' | 'after_dinner' | 'bedtime' | 'other' | undefined,
      notes: formData.notes || undefined,
      medication: formData.medication || undefined,
      exercise: formData.exercise,
      stress: formData.stress as 'low' | 'medium' | 'high' | undefined
    };

    addEntry(entry);
    toast.success('Glucose reading added successfully!');
    navigate('/');
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ 
      ...prev, 
      [field]: field === 'mealType' || field === 'stress' ? value as string : value 
    }));
  };

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Add Reading</h1>
        <button
          onClick={() => navigate('/')}
          className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={24} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Glucose Value */}
        <div className="card">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Glucose Level (mg/dL) *
          </label>
          <input
            type="number"
            value={formData.value}
            onChange={(e) => handleInputChange('value', e.target.value)}
            className="input-field text-2xl font-bold text-center"
            placeholder="120"
            min="1"
            max="1000"
            step="1"
            required
          />
        </div>

        {/* Date & Time */}
        <div className="card">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Date & Time *
          </label>
          <input
            type="datetime-local"
            value={formData.timestamp}
            onChange={(e) => handleInputChange('timestamp', e.target.value)}
            className="input-field"
            required
          />
        </div>

        {/* Meal Type */}
        <div className="card">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Meal Type
          </label>
          <select
            value={formData.mealType}
            onChange={(e) => handleInputChange('mealType', e.target.value)}
            className="input-field"
          >
            <option value="">Select meal type</option>
            {mealTypes.map(type => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        {/* Notes */}
        <div className="card">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Notes
          </label>
          <textarea
            value={formData.notes}
            onChange={(e) => handleInputChange('notes', e.target.value)}
            className="input-field resize-none"
            rows={3}
            placeholder="Any additional notes..."
          />
        </div>

        {/* Medication */}
        <div className="card">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Medication
          </label>
          <input
            type="text"
            value={formData.medication}
            onChange={(e) => handleInputChange('medication', e.target.value)}
            className="input-field"
            placeholder="e.g., Insulin, Metformin"
          />
        </div>

        {/* Exercise */}
        <div className="card">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.exercise}
              onChange={(e) => handleInputChange('exercise', e.target.checked)}
              className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
            />
            <span className="ml-2 text-sm font-medium text-gray-700">
              Exercise before reading
            </span>
          </label>
        </div>

        {/* Stress Level */}
        <div className="card">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Stress Level
          </label>
          <select
            value={formData.stress}
            onChange={(e) => handleInputChange('stress', e.target.value)}
            className="input-field"
          >
            <option value="">Select stress level</option>
            {stressLevels.map(level => (
              <option key={level.value} value={level.value}>
                {level.label}
              </option>
            ))}
          </select>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="btn-primary w-full flex items-center justify-center gap-2"
        >
          <Save size={20} />
          Save Reading
        </button>
      </form>
    </div>
  );
};

export default AddEntry; 