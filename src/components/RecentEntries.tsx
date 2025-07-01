import React from 'react';
import { GlucoseEntry } from '../types';
import { format } from 'date-fns';
import { getGlucoseLevel } from '../utils/glucoseUtils';
import { Trash2, Edit } from 'lucide-react';

interface RecentEntriesProps {
  entries: GlucoseEntry[];
  onEdit?: (entry: GlucoseEntry) => void;
  onDelete?: (id: string) => void;
  showActions?: boolean;
}

const RecentEntries: React.FC<RecentEntriesProps> = ({ 
  entries, 
  onEdit, 
  onDelete, 
  showActions = false 
}) => {
  if (entries.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        <p>No entries yet</p>
        <p className="text-sm">Add your first glucose reading to get started</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {entries.map((entry) => {
        const glucoseLevel = getGlucoseLevel(entry.value);
        
        return (
          <div key={entry.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg transition-colors duration-200">
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${glucoseLevel.color.replace('text-', 'bg-').replace('border-', 'bg-')}`} />
                <div>
                  <div className="font-semibold text-gray-900 dark:text-gray-100">
                    {entry.value} mg/dL
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {format(new Date(entry.timestamp), 'MMM dd, HH:mm')}
                  </div>
                </div>
              </div>
              
              {entry.mealType && (
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {entry.mealType.split('_').map(word => 
                    word.charAt(0).toUpperCase() + word.slice(1)
                  ).join(' ')}
                </div>
              )}
              
              {entry.notes && (
                <div className="text-xs text-gray-600 dark:text-gray-400 mt-1 truncate">
                  {entry.notes}
                </div>
              )}
            </div>
            
            {showActions && onEdit && onDelete && (
              <div className="flex gap-2 ml-4">
                <button
                  onClick={() => onEdit(entry)}
                  className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <Edit size={16} />
                </button>
                <button
                  onClick={() => onDelete(entry.id)}
                  className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default RecentEntries; 