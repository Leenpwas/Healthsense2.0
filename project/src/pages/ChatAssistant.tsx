import React from 'react';
import { Bot } from 'lucide-react';
import { supabase } from '../lib/supabase';

const ChatAssistant = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-xl p-8 text-center border border-gray-700">
        <Bot className="h-12 w-12 text-indigo-400 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-white">AI Health Assistant</h2>
        <p className="mt-4 text-gray-400">
          Our AI assistant helps analyze your symptoms and provides health insights.
        </p>
      </div>
    </div>
  );
};

export default ChatAssistant;