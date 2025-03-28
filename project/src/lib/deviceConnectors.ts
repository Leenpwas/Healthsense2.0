import type { Device, DeviceConnection, HealthMetricData, SupportedDevice } from './types';
import { supabase } from './supabase';

// Mock device data generation
function generateMockHealthData(): HealthMetricData[] {
  const now = Date.now();
  return [
    {
      type: 'heart_rate',
      value: 65 + Math.random() * 20,
      unit: 'bpm',
      timestamp: new Date(now),
      metadata: { confidence: 0.95 }
    },
    {
      type: 'blood_oxygen',
      value: 95 + Math.random() * 5,
      unit: '%',
      timestamp: new Date(now),
      metadata: { confidence: 0.92 }
    },
    {
      type: 'temperature',
      value: 97 + Math.random() * 2,
      unit: '°F',
      timestamp: new Date(now),
      metadata: { confidence: 0.98 }
    }
  ];
}

// Device-specific connection handlers
const deviceHandlers: Record<SupportedDevice, () => Promise<DeviceConnection>> = {
  fitbit: async () => {
    let monitoringInterval: number;

    return {
      connect: async () => {
        // Simulate Fitbit OAuth flow
        await new Promise(resolve => setTimeout(resolve, 1500));
        console.log('Fitbit connected successfully');
      },
      disconnect: async () => {
        if (monitoringInterval) {
          clearInterval(monitoringInterval);
        }
      },
      startMonitoring: async () => {
        monitoringInterval = setInterval(async () => {
          const metrics = generateMockHealthData();
          
          // Store metrics in database
          for (const metric of metrics) {
            try {
              await supabase.from('health_metrics').insert([{
                ...metric,
                device_id: 'fitbit_device',
                timestamp: new Date().toISOString()
              }]);
            } catch (err) {
              console.error('Error storing metric:', err);
            }
          }
        }, 5000) as unknown as number;
      },
      stopMonitoring: async () => {
        if (monitoringInterval) {
          clearInterval(monitoringInterval);
        }
      }
    };
  },
  
  apple_watch: async () => {
    let monitoringInterval: number;

    return {
      connect: async () => {
        await new Promise(resolve => setTimeout(resolve, 1500));
        console.log('Apple Watch connected successfully');
      },
      disconnect: async () => {
        if (monitoringInterval) {
          clearInterval(monitoringInterval);
        }
      },
      startMonitoring: async () => {
        monitoringInterval = setInterval(async () => {
          const metrics = generateMockHealthData();
          
          for (const metric of metrics) {
            try {
              await supabase.from('health_metrics').insert([{
                ...metric,
                device_id: 'apple_watch_device',
                timestamp: new Date().toISOString()
              }]);
            } catch (err) {
              console.error('Error storing metric:', err);
            }
          }
        }, 5000) as unknown as number;
      },
      stopMonitoring: async () => {
        if (monitoringInterval) {
          clearInterval(monitoringInterval);
        }
      }
    };
  },

  google_fit: async () => {
    let monitoringInterval: number;

    return {
      connect: async () => {
        await new Promise(resolve => setTimeout(resolve, 1500));
        console.log('Google Fit connected successfully');
      },
      disconnect: async () => {
        if (monitoringInterval) {
          clearInterval(monitoringInterval);
        }
      },
      startMonitoring: async () => {
        monitoringInterval = setInterval(async () => {
          const metrics = generateMockHealthData();
          
          for (const metric of metrics) {
            try {
              await supabase.from('health_metrics').insert([{
                ...metric,
                device_id: 'google_fit_device',
                timestamp: new Date().toISOString()
              }]);
            } catch (err) {
              console.error('Error storing metric:', err);
            }
          }
        }, 5000) as unknown as number;
      },
      stopMonitoring: async () => {
        if (monitoringInterval) {
          clearInterval(monitoringInterval);
        }
      }
    };
  },

  samsung_health: async () => {
    let monitoringInterval: number;

    return {
      connect: async () => {
        await new Promise(resolve => setTimeout(resolve, 1500));
        console.log('Samsung Health connected successfully');
      },
      disconnect: async () => {
        if (monitoringInterval) {
          clearInterval(monitoringInterval);
        }
      },
      startMonitoring: async () => {
        monitoringInterval = setInterval(async () => {
          const metrics = generateMockHealthData();
          
          for (const metric of metrics) {
            try {
              await supabase.from('health_metrics').insert([{
                ...metric,
                device_id: 'samsung_health_device',
                timestamp: new Date().toISOString()
              }]);
            } catch (err) {
              console.error('Error storing metric:', err);
            }
          }
        }, 5000) as unknown as number;
      },
      stopMonitoring: async () => {
        if (monitoringInterval) {
          clearInterval(monitoringInterval);
        }
      }
    };
  },

  garmin: async () => {
    let monitoringInterval: number;

    return {
      connect: async () => {
        await new Promise(resolve => setTimeout(resolve, 1500));
        console.log('Garmin connected successfully');
      },
      disconnect: async () => {
        if (monitoringInterval) {
          clearInterval(monitoringInterval);
        }
      },
      startMonitoring: async () => {
        monitoringInterval = setInterval(async () => {
          const metrics = generateMockHealthData();
          
          for (const metric of metrics) {
            try {
              await supabase.from('health_metrics').insert([{
                ...metric,
                device_id: 'garmin_device',
                timestamp: new Date().toISOString()
              }]);
            } catch (err) {
              console.error('Error storing metric:', err);
            }
          }
        }, 5000) as unknown as number;
      },
      stopMonitoring: async () => {
        if (monitoringInterval) {
          clearInterval(monitoringInterval);
        }
      }
    };
  }
};

export async function connectDevice(deviceType: SupportedDevice): Promise<Device> {
  try {
    const handler = await deviceHandlers[deviceType]();
    await handler.connect();
    
    // Get the current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('No authenticated user');

    // Create device record in database
    const deviceInfo = {
      user_id: user.id,
      device_type: deviceType,
      device_name: `${deviceType.replace('_', ' ').toUpperCase()}`,
      device_id: `${deviceType}_${Date.now()}`,
      is_connected: true,
      metadata: {
        initialized_at: new Date().toISOString(),
        platform: navigator.platform,
      }
    };

    const { data, error } = await supabase
      .from('devices')
      .insert([deviceInfo])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error(`Error connecting ${deviceType}:`, error);
    throw error;
  }
}

export async function disconnectDevice(deviceId: string): Promise<void> {
  try {
    const { data: device, error: fetchError } = await supabase
      .from('devices')
      .select('device_type')
      .eq('id', deviceId)
      .single();

    if (fetchError) throw fetchError;

    const handler = await deviceHandlers[device.device_type as SupportedDevice]();
    await handler.disconnect();

    const { error: updateError } = await supabase
      .from('devices')
      .update({ is_connected: false })
      .eq('id', deviceId);

    if (updateError) throw updateError;
  } catch (error) {
    console.error('Error disconnecting device:', error);
    throw error;
  }
}

export async function startMonitoring(deviceId: string): Promise<void> {
  try {
    const { data: device, error: fetchError } = await supabase
      .from('devices')
      .select('device_type')
      .eq('id', deviceId)
      .single();

    if (fetchError) throw fetchError;

    const handler = await deviceHandlers[device.device_type as SupportedDevice]();
    await handler.startMonitoring();
  } catch (error) {
    console.error('Error starting device monitoring:', error);
    throw error;
  }
}

export async function stopMonitoring(deviceId: string): Promise<void> {
  try {
    const { data: device, error: fetchError } = await supabase
      .from('devices')
      .select('device_type')
      .eq('id', deviceId)
      .single();

    if (fetchError) throw fetchError;

    const handler = await deviceHandlers[device.device_type as SupportedDevice]();
    await handler.stopMonitoring();
  } catch (error) {
    console.error('Error stopping device monitoring:', error);
    throw error;
  }
}