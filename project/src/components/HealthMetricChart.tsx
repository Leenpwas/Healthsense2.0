import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
  ChartOptions,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import 'chartjs-adapter-date-fns';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
);

interface DataPoint {
  timestamp: string;
  value: number;
}

interface HealthMetricChartProps {
  data: DataPoint[];
  metricType: string;
  unit: string;
  thresholds: {
    low: number;
    high: number;
  };
  timeRange: {
    start: Date;
    end: Date;
  };
  onTimeRangeChange: (range: { start: Date; end: Date }) => void;
}

const HealthMetricChart: React.FC<HealthMetricChartProps> = ({
  data,
  metricType,
  unit,
  thresholds,
  timeRange,
  onTimeRangeChange,
}) => {
  const chartData = {
    datasets: [
      {
        label: metricType,
        data: data.map(point => ({
          x: new Date(point.timestamp),
          y: point.value,
        })),
        borderColor: 'rgb(99, 102, 241)',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        segment: {
          borderColor: (ctx: any) => {
            if (!ctx?.p1?.parsed) return 'rgb(99, 102, 241)';
            const value = ctx.p1.parsed.y;
            if (value > thresholds.high) return 'rgb(239, 68, 68)';
            if (value < thresholds.low) return 'rgb(59, 130, 246)';
            return 'rgb(99, 102, 241)';
          },
        },
        pointBackgroundColor: (ctx: any) => {
          if (!ctx?.raw) return 'rgb(99, 102, 241)';
          const value = ctx.raw.y;
          if (value > thresholds.high) return 'rgb(239, 68, 68)';
          if (value < thresholds.low) return 'rgb(59, 130, 246)';
          return 'rgb(99, 102, 241)';
        },
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      intersect: false,
      mode: 'index',
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(17, 24, 39, 0.9)',
        titleColor: 'rgb(243, 244, 246)',
        bodyColor: 'rgb(243, 244, 246)',
        borderColor: 'rgb(75, 85, 99)',
        borderWidth: 1,
        padding: 12,
        boxPadding: 6,
        usePointStyle: true,
        callbacks: {
          label: (context) => `${context.dataset.label}: ${context.parsed.y} ${unit}`,
        },
      },
    },
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'hour',
          displayFormats: {
            hour: 'MMM d, HH:mm',
          },
        },
        grid: {
          color: 'rgba(75, 85, 99, 0.2)',
        },
        ticks: {
          color: 'rgb(156, 163, 175)',
        },
        title: {
          display: true,
          text: 'Time',
          color: 'rgb(156, 163, 175)',
        },
        min: timeRange.start.getTime(),
        max: timeRange.end.getTime(),
      },
      y: {
        grid: {
          color: 'rgba(75, 85, 99, 0.2)',
        },
        ticks: {
          color: 'rgb(156, 163, 175)',
        },
        title: {
          display: true,
          text: unit,
          color: 'rgb(156, 163, 175)',
        },
      },
    },
  };

  return (
    <div className="w-full h-[400px]">
      <div className="mb-6 flex items-center justify-between">
        <div className="space-x-3">
          <span className="inline-flex items-center px-3 py-1.5 rounded-lg bg-indigo-500/20 text-indigo-400">
            <span className="w-2 h-2 rounded-full bg-indigo-500 mr-2"></span>
            Normal
          </span>
          <span className="inline-flex items-center px-3 py-1.5 rounded-lg bg-red-500/20 text-red-400">
            <span className="w-2 h-2 rounded-full bg-red-500 mr-2"></span>
            High
          </span>
          <span className="inline-flex items-center px-3 py-1.5 rounded-lg bg-blue-500/20 text-blue-400">
            <span className="w-2 h-2 rounded-full bg-blue-500 mr-2"></span>
            Low
          </span>
        </div>
        <select
          className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          onChange={(e) => {
            const now = new Date();
            const start = new Date();
            start.setHours(now.getHours() - parseInt(e.target.value));
            onTimeRangeChange({ start, end: now });
          }}
        >
          <option value="24">Last 24 hours</option>
          <option value="48">Last 48 hours</option>
          <option value="72">Last 72 hours</option>
          <option value="168">Last week</option>
        </select>
      </div>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default HealthMetricChart;