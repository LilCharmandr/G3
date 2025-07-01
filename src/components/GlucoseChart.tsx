import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { GlucoseEntry } from '../types';
import { prepareChartData, getGlucoseLevel } from '../utils/glucoseUtils';
import { format } from 'date-fns';

interface GlucoseChartProps {
  entries: GlucoseEntry[];
  targetRange?: { min: number; max: number };
}

const GlucoseChart: React.FC<GlucoseChartProps> = ({ entries, targetRange = { min: 80, max: 130 } }) => {
  const chartData = prepareChartData(entries);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const glucoseLevel = getGlucoseLevel(data.value);
      
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900">{label}</p>
          <p className={`text-sm font-medium ${glucoseLevel.color}`}>
            {data.value} mg/dL
          </p>
          {data.mealType && (
            <p className="text-sm text-gray-600">
              {data.mealType.split('_').map((word: string) => 
                word.charAt(0).toUpperCase() + word.slice(1)
              ).join(' ')}
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  const formatXAxis = (tickItem: string) => {
    if (chartData.length > 7) {
      // Show only date for longer periods
      return format(new Date(tickItem), 'MM/dd');
    }
    return tickItem;
  };

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="date" 
            tickFormatter={formatXAxis}
            tick={{ fontSize: 12 }}
            interval="preserveStartEnd"
          />
          <YAxis 
            domain={['dataMin - 20', 'dataMax + 20']}
            tick={{ fontSize: 12 }}
            label={{ value: 'mg/dL', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip content={<CustomTooltip />} />
          
          {/* Target range reference lines */}
          <ReferenceLine 
            y={targetRange.max} 
            stroke="#f59e0b" 
            strokeDasharray="3 3" 
            label="Target Max"
          />
          <ReferenceLine 
            y={targetRange.min} 
            stroke="#f59e0b" 
            strokeDasharray="3 3" 
            label="Target Min"
          />
          
          <Line
            type="monotone"
            dataKey="value"
            stroke="#0ea5e9"
            strokeWidth={3}
            dot={{ fill: '#0ea5e9', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: '#0ea5e9', strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default GlucoseChart; 