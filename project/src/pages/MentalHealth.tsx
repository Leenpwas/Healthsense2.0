import React, { useState } from 'react';
import { Brain, TrendingUp, AlertCircle, CheckCircle, Plus } from 'lucide-react';
import MentalHealthAssessment from '../components/MentalHealthAssessment';

const MentalHealth = () => {
  const [showAssessment, setShowAssessment] = useState(false);
  
  const moodMetrics = [
    {
      icon: Brain,
      label: 'Stress Level',
      value: 'Moderate',
      trend: '-5% from last week',
      color: 'text-yellow-400',
    },
    {
      icon: TrendingUp,
      label: 'Mood Trend',
      value: 'Improving',
      trend: '+10% this month',
      color: 'text-emerald-400',
    },
    {
      icon: AlertCircle,
      label: 'Anxiety Level',
      value: 'Low',
      trend: 'Stable',
      color: 'text-blue-400',
    },
    {
      icon: CheckCircle,
      label: 'Well-being Score',
      value: '85/100',
      trend: 'Good',
      color: 'text-purple-400',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            Mental Health Analysis
          </h1>
          <p className="mt-2 text-gray-400">Track and improve your mental well-being</p>
        </div>
        <button 
          onClick={() => setShowAssessment(true)}
          className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl hover:from-indigo-600 hover:to-purple-600 transition-all duration-300 shadow-lg hover:shadow-indigo-500/25 flex items-center space-x-2"
        >
          <Plus className="h-5 w-5" />
          <span>Start Assessment</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {moodMetrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <div key={metric.label} className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-2xl shadow-xl border border-gray-700">
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${
                  metric.color === 'text-yellow-400' ? 'from-yellow-500/20 to-yellow-600/20' :
                  metric.color === 'text-emerald-400' ? 'from-emerald-500/20 to-emerald-600/20' :
                  metric.color === 'text-blue-400' ? 'from-blue-500/20 to-blue-600/20' :
                  'from-purple-500/20 to-purple-600/20'
                }`}>
                  <Icon className={`h-8 w-8 ${metric.color}`} />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-400">{metric.label}</h3>
                  <p className="text-2xl font-bold text-white">{metric.value}</p>
                  <p className="text-sm text-indigo-400 font-medium">{metric.trend}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {showAssessment ? (
        <MentalHealthAssessment />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-2xl shadow-xl border border-gray-700">
            <h2 className="text-lg font-semibold text-white mb-4">Daily Mood Journal</h2>
            <textarea
              className="w-full h-32 p-4 bg-gray-800 border border-gray-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white placeholder-gray-500 resize-none"
              placeholder="How are you feeling today? Write your thoughts here..."
            />
            <button className="mt-4 px-6 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg hover:from-indigo-600 hover:to-purple-600 transition-all duration-300 shadow-lg hover:shadow-indigo-500/25">
              Save Entry
            </button>
          </div>

          <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-2xl shadow-xl border border-gray-700">
            <h2 className="text-lg font-semibold text-white mb-4">Recommended Activities</h2>
            <ul className="space-y-3">
              <li className="flex items-center space-x-3 p-4 bg-indigo-500/10 rounded-xl border border-indigo-500/20">
                <CheckCircle className="h-5 w-5 text-indigo-400" />
                <span className="text-gray-300">5-minute mindfulness meditation</span>
              </li>
              <li className="flex items-center space-x-3 p-4 bg-blue-500/10 rounded-xl border border-blue-500/20">
                <CheckCircle className="h-5 w-5 text-blue-400" />
                <span className="text-gray-300">Deep breathing exercises</span>
              </li>
              <li className="flex items-center space-x-3 p-4 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                <CheckCircle className="h-5 w-5 text-emerald-400" />
                <span className="text-gray-300">Evening relaxation routine</span>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default MentalHealth;