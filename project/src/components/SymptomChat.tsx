import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2, AlertCircle, Heart } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { supabase } from '../lib/supabase';

interface Message {
  type: 'user' | 'bot';
  content: string;
  analysis?: {
    possibleConditions: string[];
    recommendations: string[];
    urgencyLevel: string;
    shouldSeeDoctor: boolean;
    insights: string[];
  };
  results?: string[];
}

const INITIAL_MESSAGE: Message = {
  type: 'bot',
  content: `👋 Hello! I'm your friendly health assistant. I'm here to help answer your health-related questions and provide general guidance.

I can help you with:
- Understanding common medical terms
- Learning about general health topics
- Getting evidence-based health information
- Receiving lifestyle and preventive health tips

Please note that I'm not a substitute for professional medical advice. If you're experiencing severe symptoms or have an emergency, please seek immediate medical attention.

How can I assist you with your health questions today?`
};

const SymptomChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const analyzeSymptoms = async (symptoms: string[]) => {
    try {
      const { data, error } = await supabase.functions.invoke('symptom-analysis', {
        body: { symptoms }
      });

      if (error) throw error;
      return data;
    } catch (err) {
      console.error('Error analyzing symptoms:', err);
      throw err;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setIsLoading(true);

    setMessages(prev => [...prev, { type: 'user', content: userMessage }]);

    try {
      const symptoms = userMessage.split(',').map(s => s.trim());
      const result = await analyzeSymptoms(symptoms);

      // Check for emergency keywords
      const emergencyKeywords = ['heart attack', 'stroke', 'unconscious', 'severe bleeding', 'difficulty breathing'];
      const isEmergency = emergencyKeywords.some(keyword => 
        userMessage.toLowerCase().includes(keyword.toLowerCase())
      );

      let response = '';

      if (isEmergency) {
        response = `🚨 **EMERGENCY MEDICAL ATTENTION REQUIRED**

Based on what you've described, you should seek immediate emergency medical care. Please:

1. Call emergency services (911 in the US) immediately
2. Do not wait or delay seeking help
3. If possible, have someone stay with you

This is not a situation for online consultation. Your safety is the top priority.`;
      } else {
        response = `Thank you for sharing your symptoms. Here's what I can tell you:

${result.analysis.urgencyLevel === 'high' ? '⚠️ These symptoms suggest you should seek prompt medical attention.\n' : ''}

**Based on the information provided:**
${result.analysis.insights.map(insight => `- ${insight}`).join('\n')}

**General Recommendations:**
${result.analysis.recommendations.map(r => `- ${r}`).join('\n')}

${result.analysis.shouldSeeDoctor ? '👨‍⚕️ It would be advisable to consult with a healthcare professional for proper evaluation.' : ''}

**Important Disclaimer:**
This information is for general guidance only and should not replace professional medical advice. If your symptoms worsen or persist, please consult with a qualified healthcare provider.

Is there anything specific about these recommendations you'd like me to clarify?`;
      }

      setMessages(prev => [...prev, {
        type: 'bot',
        content: response,
        analysis: result.analysis,
        results: result.results
      }]);
    } catch (error) {
      setMessages(prev => [...prev, {
        type: 'bot',
        content: `I apologize, but I'm having trouble analyzing your symptoms right now. For your safety and well-being, I recommend:

1. Consulting with a healthcare professional directly
2. Visiting an urgent care center if you're concerned
3. Calling emergency services if you feel your situation is serious

Is there something else I can help you with?`
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-xl border border-gray-700 overflow-hidden">
      <div className="p-4 bg-indigo-500/10 border-b border-gray-700">
        <div className="flex items-center space-x-2">
          <Heart className="h-6 w-6 text-rose-400" />
          <h2 className="text-lg font-semibold text-white">Health Assistant</h2>
        </div>
      </div>

      <div className="h-[calc(100vh-300px)] min-h-[500px] flex flex-col">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-xl p-4 ${
                  message.type === 'user'
                    ? 'bg-indigo-500/20 text-indigo-100'
                    : 'bg-gray-800 text-gray-100'
                }`}
              >
                <ReactMarkdown className="prose prose-invert prose-sm max-w-none">
                  {message.content}
                </ReactMarkdown>
                {message.results && (
                  <div className="mt-2 pt-2 border-t border-gray-700 text-xs text-gray-400">
                    Information based on medical knowledge database
                  </div>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSubmit} className="p-4 border-t border-gray-700">
          <div className="flex space-x-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Describe your health concerns or ask a question..."
              className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg hover:from-indigo-600 hover:to-purple-600 transition-all duration-300 shadow-lg hover:shadow-indigo-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Send className="h-5 w-5" />
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SymptomChat;