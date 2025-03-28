import React from 'react';
import { Moon, Sun, Clock, Battery, Activity, Zap, Plus } from 'lucide-react';

const SleepManagement = () => {
  const sleepMetrics = [
    {
      icon: Moon,
      label: 'Sleep Duration',
      value: '7h 30m',
      status: 'Good',
      color: 'text-indigo-400',
    },
    {
      icon: Activity,
      label: 'Sleep Quality',
      value: '85%',
      status: 'Excellent',
      color: 'text-emerald-400',
    },
    {
      icon: Clock,
      label: 'Bedtime',
      value: '10:30 PM',
      status: 'Consistent',
      color: 'text-blue-400',
    },
    {
      icon: Sun,
      label: 'Wake Time',
      value: '6:00 AM',
      status: 'On Schedule',
      color: 'text-amber-400',
    },
  ];

  const sleepStages = [
    { stage: 'Deep Sleep', duration: '2h 15m', percentage: 30 },
    { stage: 'Light Sleep', duration: '4h', percentage: 53 },
    { stage: 'REM', duration: '1h 15m', percentage: 17 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            Sleep Management
          </h1>
          <p className="mt-2 text-gray-400">Monitor and improve your sleep quality</p>
        </div>
        <button className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl hover:from-indigo-600 hover:to-purple-600 transition-all duration-300 shadow-lg hover:shadow-indigo-500/25 flex items-center space-x-2">
          <Plus className="h-5 w-5" />
          <span>Start Sleep Tracking</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {sleepMetrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <div key={metric.label} className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-2xl shadow-xl border border-gray-700">
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${
                  metric.color === 'text-indigo-400' ? 'from-indigo-500/20 to-indigo-600/20' :
                  metric.color === 'text-emerald-400' ? 'from-emerald-500/20 to-emerald-600/20' :
                  metric.color === 'text-blue-400' ? 'from-blue-500/20 to-blue-600/20' :
                  'from-amber-500/20 to-amber-600/20'
                }`}>
                  <Icon className={`h-8 w-8 ${metric.color}`} />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-400">{metric.label}</h3>
                  <p className="text-2xl font-bold text-white">{metric.value}</p>
                  <p className="text-sm text-indigo-400 font-medium">{metric.status}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-2xl shadow-xl border border-gray-700">
          <h2 className="text-lg font-semibold text-white mb-6">Sleep Stages</h2>
          <div className="space-y-6">
            {sleepStages.map((stage) => (
              <div key={stage.stage}>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-gray-300">{stage.stage}</span>
                  <span className="text-sm text-gray-400">{stage.duration}</span>
                </div>
                <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className="h-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
                    style={{ width: `${stage.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-2xl shadow-xl border border-gray-700">
          <h2 className="text-lg font-semibold text-white mb-6">Sleep Environment</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-800 rounded-xl border border-gray-700">
              <div className="flex items-center space-x-3">
                <Battery className="h-5 w-5 text-emerald-400" />
                <span className="text-gray-300">Room Temperature</span>
              </div>
              <span className="text-emerald-400">68°F (Optimal)</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-800 rounded-xl border border-gray-700">
              <div className="flex items-center space-x-3">
                <Zap className="h-5 w-5 text-amber-400" />
                <span className="text-gray-300">Noise Level</span>
              </div>
              <span className="text-amber-400">35dB (Quiet)</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-800 rounded-xl border border-gray-700">
              <div className="flex items-center space-x-3">
                <Sun className="h-5 w-5 text-blue-400" />
                <span className="text-gray-300">Light Level</span>
              </div>
              <span className="text-blue-400">5% (Dark)</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-2xl shadow-xl border border-gray-700">
        <h2 className="text-lg font-semibold text-white mb-6">Sleep Schedule</h2>
        <div className="relative">
          <div className="h-16 bg-gray-800 rounded-xl border border-gray-700 flex items-center">
            <div className="absolute left-6 flex items-center space-x-2">
              <Moon className="h-5 w-5 text-indigo-400" />
              <span className="text-sm font-medium text-gray-300">10:30 PM</span>
            </div>
            <div className="flex-1 mx-24">
              <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                <div className="h-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full" style={{ width: '60%' }}></div>
              </div>
            </div>
            <div className="absolute right-6 flex items-center space-x-2">
              <Sun className="h-5 w-5 text-amber-400" />
              <span className="text-sm font-medium text-gray-300">6:00 AM</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SleepManagement;