import React, { useState, useEffect } from 'react';
import { Activity, Heart, Thermometer, Wind, Smartphone, Plus } from 'lucide-react';
import { supabase } from '../lib/supabase';
import DeviceManager from '../components/DeviceManager';
import type { Device, HealthMetric } from '../lib/types';

const HomeMonitoring = () => {
  const [showDeviceManager, setShowDeviceManager] = useState(false);
  const [connectedDevices, setConnectedDevices] = useState<Device[]>([]);
  const [latestMetrics, setLatestMetrics] = useState<Record<string, HealthMetric>>({});

  useEffect(() => {
    loadConnectedDevices();
    loadLatestMetrics();
  }, []);

  const loadConnectedDevices = async () => {
    try {
      const { data, error } = await supabase
        .from('devices')
        .select('*')
        .eq('is_connected', true);

      if (error) throw error;
      setConnectedDevices(data || []);
    } catch (err) {
      console.error('Error loading devices:', err);
    }
  };

  const loadLatestMetrics = async () => {
    try {
      const { data, error } = await supabase
        .from('health_metrics')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(1);

      if (error) throw error;

      const metrics: Record<string, HealthMetric> = {};
      data?.forEach(metric => {
        metrics[metric.metric_type] = metric;
      });

      setLatestMetrics(metrics);
    } catch (err) {
      console.error('Error loading metrics:', err);
    }
  };

  const handleDeviceConnected = (device: Device) => {
    setConnectedDevices(prev => [...prev, device]);
    setShowDeviceManager(false);
  };

  const metrics = [
    {
      icon: Heart,
      label: 'Heart Rate',
      value: latestMetrics.heart_rate?.value || '72',
      unit: 'BPM',
      status: 'Normal',
      color: 'text-rose-400',
    },
    {
      icon: Thermometer,
      label: 'Room Temperature',
      value: latestMetrics.temperature?.value || '72',
      unit: '°F',
      status: 'Optimal',
      color: 'text-blue-400',
    },
    {
      icon: Wind,
      label: 'Air Quality',
      value: latestMetrics.air_quality?.value || 'Good',
      unit: '',
      status: 'AQI: 42',
      color: 'text-emerald-400',
    },
    {
      icon: Activity,
      label: 'Activity Level',
      value: latestMetrics.steps?.value || '6,500',
      unit: 'steps',
      status: 'Moderate',
      color: 'text-purple-400',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            Home Health Monitoring
          </h1>
          <p className="mt-2 text-gray-400">Monitor your health metrics in real-time</p>
        </div>
        <button
          onClick={() => setShowDeviceManager(true)}
          className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl hover:from-indigo-600 hover:to-purple-600 transition-all duration-300 shadow-lg hover:shadow-indigo-500/25 flex items-center space-x-2"
        >
          <Plus className="h-5 w-5" />
          <span>Connect Device</span>
        </button>
      </div>

      {showDeviceManager && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-2xl p-8 max-w-4xl w-full mx-4 border border-gray-700 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">Connect a Device</h2>
              <button
                onClick={() => setShowDeviceManager(false)}
                className="text-gray-400 hover:text-gray-300 transition-colors"
              >
                ✕
              </button>
            </div>
            <DeviceManager onDeviceConnected={handleDeviceConnected} />
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <div key={metric.label} className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-2xl shadow-xl border border-gray-700">
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${
                  metric.color === 'text-rose-400' ? 'from-rose-500/20 to-rose-600/20' :
                  metric.color === 'text-blue-400' ? 'from-blue-500/20 to-blue-600/20' :
                  metric.color === 'text-emerald-400' ? 'from-emerald-500/20 to-emerald-600/20' :
                  'from-purple-500/20 to-purple-600/20'
                }`}>
                  <Icon className={`h-8 w-8 ${metric.color}`} />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-400">{metric.label}</h3>
                  <p className="text-2xl font-bold text-white">
                    {metric.value}
                    {metric.unit && <span className="text-base ml-1 text-gray-400">{metric.unit}</span>}
                  </p>
                  <p className="text-sm text-indigo-400 font-medium">{metric.status}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-2xl shadow-xl border border-gray-700">
          <h2 className="text-lg font-semibold text-white mb-6">Connected Devices</h2>
          <div className="space-y-3">
            {connectedDevices.map(device => (
              <div key={device.id} className="flex items-center justify-between p-4 bg-gray-800 rounded-xl border border-gray-700">
                <div className="flex items-center space-x-3">
                  <Smartphone className="h-5 w-5 text-indigo-400" />
                  <span className="text-gray-300">{device.device_name}</span>
                </div>
                <span className="text-emerald-400">Connected</span>
              </div>
            ))}
            {connectedDevices.length === 0 && (
              <p className="text-gray-400 text-center py-8">
                No devices connected. Click "Connect Device" to add a device.
              </p>
            )}
          </div>
        </div>

        <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-2xl shadow-xl border border-gray-700">
          <h2 className="text-lg font-semibold text-white mb-6">Environment Status</h2>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-gray-300">Temperature</span>
                <span className="text-sm text-gray-400">72°F</span>
              </div>
              <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                <div className="h-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full" style={{ width: '60%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-gray-300">Humidity</span>
                <span className="text-sm text-gray-400">45%</span>
              </div>
              <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                <div className="h-2 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full" style={{ width: '45%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-gray-300">Air Quality</span>
                <span className="text-sm text-gray-400">Good</span>
              </div>
              <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                <div className="h-2 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full" style={{ width: '80%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeMonitoring;