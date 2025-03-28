/*
  # Add device connections and health data

  1. New Tables
    - `devices`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `device_type` (text) - Type of device (e.g., 'smartwatch', 'fitness_tracker')
      - `device_name` (text) - Name of the device
      - `device_id` (text) - Unique identifier from the device
      - `last_sync` (timestamptz) - Last synchronization time
      - `is_connected` (boolean) - Current connection status
      - `metadata` (jsonb) - Additional device information
      
    - `health_metrics`
      - `id` (uuid, primary key)
      - `device_id` (uuid, references devices)
      - `user_id` (uuid, references auth.users)
      - `metric_type` (text) - Type of health metric
      - `value` (numeric) - Measured value
      - `unit` (text) - Unit of measurement
      - `timestamp` (timestamptz) - When the measurement was taken
      - `metadata` (jsonb) - Additional measurement data

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to manage their devices and data
*/

-- Create devices table
CREATE TABLE IF NOT EXISTS devices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  device_type text NOT NULL,
  device_name text NOT NULL,
  device_id text NOT NULL,
  last_sync timestamptz DEFAULT now(),
  is_connected boolean DEFAULT false,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, device_id)
);

-- Create health metrics table
CREATE TABLE IF NOT EXISTS health_metrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id uuid REFERENCES devices NOT NULL,
  user_id uuid REFERENCES auth.users NOT NULL,
  metric_type text NOT NULL,
  value numeric NOT NULL,
  unit text NOT NULL,
  timestamp timestamptz DEFAULT now(),
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_metrics ENABLE ROW LEVEL SECURITY;

-- Devices policies
CREATE POLICY "Users can read own devices"
  ON devices
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create devices"
  ON devices
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own devices"
  ON devices
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Health metrics policies
CREATE POLICY "Users can read own health metrics"
  ON health_metrics
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create health metrics"
  ON health_metrics
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);