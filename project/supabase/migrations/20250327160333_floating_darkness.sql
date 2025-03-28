/*
  # Add notification settings and phone number

  1. Changes
    - Add phone_number column to auth.users
    - Create notifications_settings table for user preferences
    - Add RLS policies for secure access

  2. Security
    - Enable RLS on notifications_settings
    - Add policies for authenticated users
*/

-- Add phone number to existing profiles
ALTER TABLE auth.users ADD COLUMN IF NOT EXISTS phone_number TEXT;

-- Create notifications settings table
CREATE TABLE IF NOT EXISTS notification_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  assessment_reminders boolean DEFAULT true,
  reminder_day text DEFAULT 'MONDAY',
  reminder_time time DEFAULT '10:00',
  last_notification timestamptz,
  next_notification timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE notification_settings ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can manage their notification settings"
  ON notification_settings
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS notification_settings_user_id_idx ON notification_settings(user_id);
CREATE INDEX IF NOT EXISTS notification_settings_next_notification_idx ON notification_settings(next_notification);