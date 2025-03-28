/*
  # Create health profiles table

  1. New Tables
    - `health_profiles`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `age` (integer)
      - `weight` (numeric)
      - `height` (numeric)
      - `diagnoses` (text array)
      - `family_history` (jsonb)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `health_profiles` table
    - Add policies for authenticated users to:
      - Read their own health profile
      - Create their health profile
      - Update their health profile
*/

CREATE TABLE IF NOT EXISTS health_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  age integer NOT NULL,
  weight numeric NOT NULL,
  height numeric NOT NULL,
  diagnoses text[] DEFAULT '{}',
  family_history jsonb DEFAULT '[]',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

ALTER TABLE health_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own health profile"
  ON health_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own health profile"
  ON health_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own health profile"
  ON health_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);