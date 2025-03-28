import { Database } from './database.types';

export type Device = Database['public']['Tables']['devices']['Row'];
export type HealthMetric = Database['public']['Tables']['health_metrics']['Row'];
export type MentalHealthAssessment = Database['public']['Tables']['mental_health_assessments']['Row'];

export interface AssessmentScore {
  depression: number;
  anxiety: number;
  stress: number;
  wellbeing: number;
  sleep: number;
  social: number;
  physical: number;
}

export interface AssessmentRecommendation {
  title: string;
  text: string;
  urgent: boolean;
  category: keyof AssessmentScore;
  severity: 'low' | 'moderate' | 'high';
}

export interface DeviceConnection {
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  startMonitoring: () => Promise<void>;
  stopMonitoring: () => Promise<void>;
}

export interface HealthMetricData {
  type: string;
  value: number;
  unit: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

export const SUPPORTED_DEVICES = {
  FITBIT: 'fitbit',
  APPLE_WATCH: 'apple_watch',
  GOOGLE_FIT: 'google_fit',
  SAMSUNG_HEALTH: 'samsung_health',
  GARMIN: 'garmin'
} as const;

export type SupportedDevice = typeof SUPPORTED_DEVICES[keyof typeof SUPPORTED_DEVICES];

export const METRIC_TYPES = {
  HEART_RATE: 'heart_rate',
  STEPS: 'steps',
  BLOOD_OXYGEN: 'blood_oxygen',
  TEMPERATURE: 'temperature',
  SLEEP: 'sleep',
  STRESS: 'stress'
} as const;

export type MetricType = typeof METRIC_TYPES[keyof typeof METRIC_TYPES];