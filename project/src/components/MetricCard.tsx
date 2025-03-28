import React, { useState } from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';
import HealthMetricChart from './HealthMetricChart';

interface MetricCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  unit: string;
  status: string;
  color: string;
  data: Array<{ timestamp: string; value: number }>;
  thresholds: {
    low: number;
    high: number;
  };
}

const MetricCard: React.FC<MetricCardProps> = ({
  icon: Icon,
  label,
  value,
  unit,
  status,
  color,
  data,
  thresholds,
}) => {
  const [showChart, setShowChart] = useState(false);
  const [timeRange, setTimeRange] = useState({
    start: new Date(Date.now() - 24 * 60 * 60 * 1000),
    end: new Date(),
  });

  return (
    <div className="col-span-1">
      <div
        className={`relative bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-2xl shadow-xl cursor-pointer 
          transition-all duration-500 transform hover:scale-[1.02] hover:shadow-2xl
          ${showChart ? 'ring-2 ring-indigo-500' : ''}
          before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-r before:from-indigo-500/20 before:to-purple-500/20 before:opacity-0 before:transition-opacity hover:before:opacity-100`}
        onClick={() => setShowChart(!showChart)}
      >
        <div className="relative flex items-center space-x-4">
          <div className={`p-3 rounded-xl bg-gradient-to-br from-${color.split('-')[1]}-500/20 to-${color.split('-')[1]}-600/20`}>
            <Icon className={`h-8 w-8 ${color}`} />
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-400">{label}</h3>
            <p className="text-2xl font-bold text-white">
              {value}
              {unit && <span className="text-base ml-1 text-gray-400">{unit}</span>}
            </p>
            <p className="text-sm text-indigo-400 font-medium">{status}</p>
          </div>
        </div>
      </div>

      {showChart && (
        <div className="mt-4 bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-2xl p-6 transition-all duration-500 animate-fadeIn">
          <HealthMetricChart
            data={data}
            metricType={label}
            unit={unit}
            thresholds={thresholds}
            timeRange={timeRange}
            onTimeRangeChange={setTimeRange}
          />
        </div>
      )}
    </div>
  );
};

export default MetricCard;