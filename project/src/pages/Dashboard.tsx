import React, { useState, useEffect } from 'react';
import { Activity, Brain, Heart, Thermometer, Plus } from 'lucide-react';
import { supabase } from '../lib/supabase';
import MetricCard from '../components/MetricCard';
import type { HealthMetric } from '../lib/types';

const Dashboard = () => {
  const [healthData, setHealthData] = useState<Record<string, HealthMetric[]>>({});

  useEffect(() => {
    loadHealthData();
  }, []);

  const loadHealthData = async () => {
    try {
      const { data, error } = await supabase
        .from('health_metrics')
        .select('*')
        .order('timestamp', { ascending: true });

      if (error) throw error;

      const groupedData: Record<string, HealthMetric[]> = {};
      data?.forEach(metric => {
        if (!groupedData[metric.metric_type]) {
          groupedData[metric.metric_type] = [];
        }
        groupedData[metric.metric_type].push(metric);
      });

      setHealthData(groupedData);
    } catch (err) {
      console.error('Error loading health data:', err);
    }
  };

  const getLatestValue = (metricType: string) => {
    const metrics = healthData[metricType] || [];
    return metrics.length > 0 ? metrics[metrics.length - 1].value : null;
  };

  const healthMetrics = [
    {
      icon: Heart,
      label: 'Heart Rate',
      value: getLatestValue('heart_rate') || '72',
      unit: 'BPM',
      status: 'Normal',
      color: 'text-rose-500',
      thresholds: { low: 60, high: 100 },
      data: (healthData['heart_rate'] || []).map(m => ({
        timestamp: m.timestamp,
        value: Number(m.value),
      })),
    },
    {
      icon: Thermometer,
      label: 'Body Temperature',
      value: getLatestValue('temperature') || '98.6',
      unit: '°F',
      status: 'Normal',
      color: 'text-blue-500',
      thresholds: { low: 97, high: 99.5 },
      data: (healthData['temperature'] || []).map(m => ({
        timestamp: m.timestamp,
        value: Number(m.value),
      })),
    },
    {
      icon: Activity,
      label: 'Blood Oxygen',
      value: getLatestValue('blood_oxygen') || '98',
      unit: '%',
      status: 'Good',
      color: 'text-emerald-500',
      thresholds: { low: 95, high: 100 },
      data: (healthData['blood_oxygen'] || []).map(m => ({
        timestamp: m.timestamp,
        value: Number(m.value),
      })),
    },
    {
      icon: Brain,
      label: 'Stress Level',
      value: getLatestValue('stress') || 'Low',
      unit: '',
      status: 'Good',
      color: 'text-purple-500',
      thresholds: { low: 0, high: 7 },
      data: (healthData['stress'] || []).map(m => ({
        timestamp: m.timestamp,
        value: Number(m.value),
      })),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Health Dashboard
            </h1>
            <p className="mt-2 text-gray-400">Monitor your vital signs in real-time</p>
          </div>
          <button className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl hover:from-indigo-600 hover:to-purple-600 transition-all duration-300 shadow-lg hover:shadow-indigo-500/25 flex items-center space-x-2">
            <Plus className="h-5 w-5" />
            <span>Connect Device</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {healthMetrics.map((metric) => (
            <MetricCard
              key={metric.label}
              icon={metric.icon}
              label={metric.label}
              value={metric.value}
              unit={metric.unit}
              status={metric.status}
              color={metric.color}
              data={metric.data}
              thresholds={metric.thresholds}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;