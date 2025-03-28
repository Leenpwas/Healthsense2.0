import React, { useState, useEffect } from 'react';
import { Loader2, Smartphone, Check, X, Play, Square } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { connectDevice, disconnectDevice, startMonitoring, stopMonitoring } from '../lib/deviceConnectors';
import type { Device, SupportedDevice, SUPPORTED_DEVICES } from '../lib/types';

interface DeviceManagerProps {
  onDeviceConnected?: (device: Device) => void;
}

const DeviceManager: React.FC<DeviceManagerProps> = ({ onDeviceConnected }) => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isMonitoring, setIsMonitoring] = useState<Record<string, boolean>>({});

  useEffect(() => {
    loadDevices();
  }, []);

  const loadDevices = async () => {
    try {
      const { data, error } = await supabase
        .from('devices')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDevices(data || []);

      // Initialize monitoring status
      const monitoringStatus: Record<string, boolean> = {};
      data?.forEach(device => {
        monitoringStatus[device.id] = false;
      });
      setIsMonitoring(monitoringStatus);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConnect = async (deviceType: SupportedDevice) => {
    setIsConnecting(true);
    setError(null);

    try {
      const device = await connectDevice(deviceType);
      setDevices(prev => [device, ...prev]);
      onDeviceConnected?.(device);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = async (deviceId: string) => {
    try {
      await disconnectDevice(deviceId);
      setDevices(prev =>
        prev.map(device =>
          device.id === deviceId
            ? { ...device, is_connected: false }
            : device
        )
      );
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleStartMonitoring = async (deviceId: string) => {
    try {
      await startMonitoring(deviceId);
      setIsMonitoring(prev => ({ ...prev, [deviceId]: true }));
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleStopMonitoring = async (deviceId: string) => {
    try {
      await stopMonitoring(deviceId);
      setIsMonitoring(prev => ({ ...prev, [deviceId]: false }));
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.values(SUPPORTED_DEVICES).map((deviceType) => (
          <button
            key={deviceType}
            onClick={() => handleConnect(deviceType)}
            disabled={isConnecting}
            className="p-4 border rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-between"
          >
            <div className="flex items-center space-x-3">
              <Smartphone className="h-6 w-6 text-blue-600" />
              <span className="font-medium">
                {deviceType.split('_').map(word => 
                  word.charAt(0).toUpperCase() + word.slice(1)
                ).join(' ')}
              </span>
            </div>
            {isConnecting ? (
              <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
            ) : (
              <span className="text-sm text-blue-600">Connect</span>
            )}
          </button>
        ))}
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg">
          {error}
        </div>
      )}

      {devices.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-medium mb-4">Connected Devices</h3>
          <div className="space-y-3">
            {devices.map(device => (
              <div
                key={device.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <Smartphone className="h-5 w-5 text-gray-600" />
                  <div>
                    <p className="font-medium">{device.device_name}</p>
                    <p className="text-sm text-gray-500">
                      Last synced: {new Date(device.last_sync).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  {device.is_connected && (
                    <>
                      {isMonitoring[device.id] ? (
                        <button
                          onClick={() => handleStopMonitoring(device.id)}
                          className="text-red-600 hover:text-red-700 flex items-center space-x-1"
                        >
                          <Square className="h-4 w-4" />
                          <span>Stop</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => handleStartMonitoring(device.id)}
                          className="text-green-600 hover:text-green-700 flex items-center space-x-1"
                        >
                          <Play className="h-4 w-4" />
                          <span>Start</span>
                        </button>
                      )}
                      <button
                        onClick={() => handleDisconnect(device.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        Disconnect
                      </button>
                    </>
                  )}
                  {device.is_connected ? (
                    <Check className="h-5 w-5 text-green-600" />
                  ) : (
                    <X className="h-5 w-5 text-red-600" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DeviceManager;