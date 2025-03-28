import React, { useState } from 'react';
import { Stethoscope, AlertCircle, FileText, Activity, Plus } from 'lucide-react';
import SymptomChat from '../components/SymptomChat';

const SymptomChecker = () => {
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [familyHistory, setFamilyHistory] = useState<Record<string, boolean>>({});

  const commonSymptoms = [
    'Headache',
    'Fever',
    'Cough',
    'Fatigue',
    'Nausea',
    'Dizziness',
    'Shortness of breath',
    'Body aches',
  ];

  const commonConditions = [
    'Diabetes',
    'Heart Disease',
    'Cancer',
    'Hypertension',
    'Asthma',
    'Mental Health Conditions',
  ];

  const toggleSymptom = (symptom: string) => {
    setSymptoms(prev => 
      prev.includes(symptom)
        ? prev.filter(s => s !== symptom)
        : [...prev, symptom]
    );
  };

  const toggleFamilyHistory = (condition: string) => {
    setFamilyHistory(prev => ({
      ...prev,
      [condition]: !prev[condition]
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            AI Symptom Checker
          </h1>
          <p className="mt-2 text-gray-400">Get instant insights about your symptoms</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-2xl shadow-xl border border-gray-700">
            <div className="flex items-center space-x-2 mb-6">
              <Stethoscope className="h-6 w-6 text-indigo-400" />
              <h2 className="text-lg font-semibold text-white">Common Symptoms</h2>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {commonSymptoms.map(symptom => (
                <button
                  key={symptom}
                  onClick={() => toggleSymptom(symptom)}
                  className={`p-4 rounded-xl text-left transition-all duration-200 ${
                    symptoms.includes(symptom)
                      ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700'
                  }`}
                >
                  {symptom}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-2xl shadow-xl border border-gray-700">
            <div className="flex items-center space-x-2 mb-6">
              <FileText className="h-6 w-6 text-indigo-400" />
              <h2 className="text-lg font-semibold text-white">Family Medical History</h2>
            </div>
            <div className="space-y-3">
              {commonConditions.map(condition => (
                <button
                  key={condition}
                  onClick={() => toggleFamilyHistory(condition)}
                  className={`w-full p-4 rounded-xl text-left transition-all duration-200 ${
                    familyHistory[condition]
                      ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700'
                  }`}
                >
                  {condition}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-2xl shadow-xl border border-gray-700">
            <div className="flex items-center space-x-2 mb-6">
              <Activity className="h-6 w-6 text-indigo-400" />
              <h2 className="text-lg font-semibold text-white">Additional Information</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Duration of Symptoms
                </label>
                <input
                  type="text"
                  className="w-full p-4 bg-gray-800 border border-gray-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white placeholder-gray-500"
                  placeholder="How long have you been experiencing these symptoms?"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Additional Notes
                </label>
                <textarea
                  className="w-full h-32 p-4 bg-gray-800 border border-gray-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white placeholder-gray-500 resize-none"
                  placeholder="Any other details you'd like to share..."
                />
              </div>
            </div>
          </div>
        </div>

        <SymptomChat />
      </div>
    </div>
  );
};

export default SymptomChecker;