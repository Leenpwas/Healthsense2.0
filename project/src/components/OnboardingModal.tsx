import React, { useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface OnboardingModalProps {
  onComplete: (data: {
    name: string;
    age: string;
    gender: string;
    preferences: {
      darkMode: boolean;
      notifications: boolean;
    };
  }) => void;
}

const OnboardingModal: React.FC<OnboardingModalProps> = ({ onComplete }) => {
  const { isDarkMode, toggleDarkMode } = useTheme();
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: '',
    preferences: {
      darkMode: isDarkMode,
      notifications: true,
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-8 max-w-md w-full mx-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Welcome to HealthSense</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              Name
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              Age
            </label>
            <input
              type="number"
              required
              value={formData.age}
              onChange={(e) => setFormData({ ...formData, age: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              Gender
            </label>
            <select
              required
              value={formData.gender}
              onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
              <option value="prefer-not-to-say">Prefer not to say</option>
            </select>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Preferences</h3>
            
            <div className="flex items-center justify-between">
              <span className="text-gray-700 dark:text-gray-200">Dark Mode</span>
              <button
                type="button"
                onClick={() => {
                  toggleDarkMode();
                  setFormData({
                    ...formData,
                    preferences: {
                      ...formData.preferences,
                      darkMode: !formData.preferences.darkMode,
                    },
                  });
                }}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700"
              >
                {isDarkMode ? (
                  <Moon className="h-5 w-5 text-blue-500" />
                ) : (
                  <Sun className="h-5 w-5 text-blue-500" />
                )}
              </button>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-700 dark:text-gray-200">Enable Notifications</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.preferences.notifications}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      preferences: {
                        ...formData.preferences,
                        notifications: e.target.checked,
                      },
                    })
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>

          <button
            type="submit"
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Get Started
          </button>
        </form>
      </div>
    </div>
  );
};

export default OnboardingModal