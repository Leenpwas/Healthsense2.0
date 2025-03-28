/*
  # Create mental health assessments table

  1. New Tables
    - `mental_health_assessments`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references users.id)
      - `scores` (jsonb, stores assessment scores)
      - `timestamp` (timestamptz, when the assessment was taken)
      - `created_at` (timestamptz, when the record was created)

  2. Security
    - Enable RLS on `mental_health_assessments` table
    - Add policies for authenticated users to:
      - Create their own assessments
      - Read their own assessments
*/

CREATE TABLE IF NOT EXISTS mental_health_assessments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  scores jsonb NOT NULL DEFAULT '{}'::jsonb,
  timestamp timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE mental_health_assessments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can create their own assessments"
  ON mental_health_assessments
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read their own assessments"
  ON mental_health_assessments
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS mental_health_assessments_user_id_idx ON mental_health_assessments(user_id);
CREATE INDEX IF NOT EXISTS mental_health_assessments_timestamp_idx ON mental_health_assessments(timestamp);