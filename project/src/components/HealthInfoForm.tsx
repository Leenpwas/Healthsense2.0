import React, { useState } from 'react';
import { Activity, Heart, Scale, Ruler, FileText, Users } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface HealthInfoFormProps {
  onComplete: () => void;
}

interface HealthInfo {
  age: number;
  weight: number;
  height: number;
  diagnoses: string[];
  family_history: {
    condition: string;
    relation: string;
  }[];
}

const commonDiagnoses = [
  'Hypertension',
  'Diabetes',
  'Asthma',
  'Arthritis',
  'Depression',
  'Anxiety',
  'Heart Disease',
  'Cancer',
];

const HealthInfoForm: React.FC<HealthInfoFormProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [healthInfo, setHealthInfo] = useState<HealthInfo>({
    age: 0,
    weight: 0,
    height: 0,
    diagnoses: [],
    family_history: [],
  });
  const [error, setError] = useState('');

  const handleBasicInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (healthInfo.age < 1 || healthInfo.weight < 1 || healthInfo.height < 1) {
      setError('Please enter valid values');
      return;
    }
    setStep(2);
  };

  const toggleDiagnosis = (diagnosis: string) => {
    setHealthInfo(prev => ({
      ...prev,
      diagnoses: prev.diagnoses.includes(diagnosis)
        ? prev.diagnoses.filter(d => d !== diagnosis)
        : [...prev.diagnoses, diagnosis]
    }));
  };

  const addFamilyHistory = (condition: string) => {
    const relation = prompt('What is your relation to the family member with this condition?');
    if (relation) {
      setHealthInfo(prev => ({
        ...prev,
        family_history: [...prev.family_history, { condition, relation }]
      }));
    }
  };

  const handleSubmit = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const { error } = await supabase
        .from('health_profiles')
        .insert([
          {
            user_id: user.id,
            age: healthInfo.age,
            weight: healthInfo.weight,
            height: healthInfo.height,
            diagnoses: healthInfo.diagnoses,
            family_history: healthInfo.family_history
          }
        ]);

      if (error) throw error;
      onComplete();
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-2xl p-8 max-w-2xl w-full mx-4 border border-gray-700">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent mb-2">
          Health Profile Setup
        </h2>
        <p className="text-gray-400 mb-6">Help us personalize your health monitoring experience</p>

        {step === 1 ? (
          <form onSubmit={handleBasicInfoSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Age
                </label>
                <div className="relative">
                  <Activity className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
                  <input
                    type="number"
                    required
                    value={healthInfo.age || ''}
                    onChange={(e) => setHealthInfo(prev => ({ ...prev, age: parseInt(e.target.value) }))}
                    className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white placeholder-gray-500"
                    placeholder="Years"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Weight
                </label>
                <div className="relative">
                  <Scale className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
                  <input
                    type="number"
                    required
                    value={healthInfo.weight || ''}
                    onChange={(e) => setHealthInfo(prev => ({ ...prev, weight: parseInt(e.target.value) }))}
                    className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white placeholder-gray-500"
                    placeholder="kg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Height
                </label>
                <div className="relative">
                  <Ruler className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
                  <input
                    type="number"
                    required
                    value={healthInfo.height || ''}
                    onChange={(e) => setHealthInfo(prev => ({ ...prev, height: parseInt(e.target.value) }))}
                    className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white placeholder-gray-500"
                    placeholder="cm"
                  />
                </div>
              </div>
            </div>

            {error && (
              <div className="text-rose-500 text-sm bg-rose-500/10 p-3 rounded-lg border border-rose-500/20">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg hover:from-indigo-600 hover:to-purple-600 transition-all duration-300 shadow-lg hover:shadow-indigo-500/25"
            >
              Next
            </button>
          </form>
        ) : (
          <div className="space-y-6">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <FileText className="h-5 w-5 text-indigo-400" />
                <h3 className="text-lg font-medium text-white">Previous Diagnoses</h3>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {commonDiagnoses.map(diagnosis => (
                  <button
                    key={diagnosis}
                    onClick={() => toggleDiagnosis(diagnosis)}
                    className={`p-3 rounded-lg text-left transition-all duration-200 ${
                      healthInfo.diagnoses.includes(diagnosis)
                        ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700'
                    }`}
                  >
                    {diagnosis}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Users className="h-5 w-5 text-indigo-400" />
                <h3 className="text-lg font-medium text-white">Family History</h3>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {commonDiagnoses.map(condition => (
                  <button
                    key={condition}
                    onClick={() => addFamilyHistory(condition)}
                    className="p-3 rounded-lg text-left bg-gray-800 text-gray-300 hover:bg-gray-700 transition-all duration-200 border border-gray-700"
                  >
                    {condition}
                  </button>
                ))}
              </div>
              {healthInfo.family_history.length > 0 && (
                <div className="mt-4 space-y-2">
                  {healthInfo.family_history.map((history, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg border border-gray-700">
                      <span className="text-gray-300">{history.condition}</span>
                      <span className="text-gray-500">{history.relation}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {error && (
              <div className="text-rose-500 text-sm bg-rose-500/10 p-3 rounded-lg border border-rose-500/20">
                {error}
              </div>
            )}

            <div className="flex space-x-3">
              <button
                onClick={() => setStep(1)}
                className="flex-1 px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-all duration-200 border border-gray-700"
              >
                Back
              </button>
              <button
                onClick={handleSubmit}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg hover:from-indigo-600 hover:to-purple-600 transition-all duration-300 shadow-lg hover:shadow-indigo-500/25"
              >
                Complete
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HealthInfoForm;