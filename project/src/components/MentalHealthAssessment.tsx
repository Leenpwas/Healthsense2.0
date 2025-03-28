import React, { useState, useEffect } from 'react';
import { Brain, AlertCircle, CheckCircle, ArrowRight, Loader2, Heart, Moon, Sun } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { AssessmentScore, AssessmentRecommendation } from '../lib/types';

interface Question {
  id: number;
  text: string;
  category: keyof AssessmentScore;
  options: {
    text: string;
    score: number;
    icon?: React.ElementType;
  }[];
}

const assessmentQuestions: Question[] = [
  {
    id: 1,
    text: "Over the past 2 weeks, how often have you felt little interest or pleasure in doing things?",
    category: "depression",
    options: [
      { text: "Not at all", score: 0, icon: Sun },
      { text: "Several days", score: 1 },
      { text: "More than half the days", score: 2 },
      { text: "Nearly every day", score: 3, icon: Moon }
    ]
  },
  {
    id: 2,
    text: "Over the past 2 weeks, how often have you felt down, depressed, or hopeless?",
    category: "depression",
    options: [
      { text: "Not at all", score: 0, icon: Heart },
      { text: "Several days", score: 1 },
      { text: "More than half the days", score: 2 },
      { text: "Nearly every day", score: 3, icon: AlertCircle }
    ]
  },
  {
    id: 3,
    text: "Over the past 2 weeks, how often have you felt nervous, anxious, or on edge?",
    category: "anxiety",
    options: [
      { text: "Not at all", score: 0 },
      { text: "Several days", score: 1 },
      { text: "More than half the days", score: 2 },
      { text: "Nearly every day", score: 3 }
    ]
  },
  {
    id: 4,
    text: "Over the past 2 weeks, how often have you not been able to stop or control worrying?",
    category: "anxiety",
    options: [
      { text: "Not at all", score: 0 },
      { text: "Several days", score: 1 },
      { text: "More than half the days", score: 2 },
      { text: "Nearly every day", score: 3 }
    ]
  },
  {
    id: 5,
    text: "In the past month, how often have you felt that you were unable to control the important things in your life?",
    category: "stress",
    options: [
      { text: "Never", score: 0 },
      { text: "Almost never", score: 1 },
      { text: "Sometimes", score: 2 },
      { text: "Fairly often", score: 3 },
      { text: "Very often", score: 4 }
    ]
  },
  {
    id: 6,
    text: "Over the past 2 weeks, how would you rate your sleep quality overall?",
    category: "sleep",
    options: [
      { text: "Very good", score: 0, icon: Moon },
      { text: "Fairly good", score: 1 },
      { text: "Fairly bad", score: 2 },
      { text: "Very bad", score: 3, icon: AlertCircle }
    ]
  },
  {
    id: 7,
    text: "How satisfied are you with your social connections and support system?",
    category: "social",
    options: [
      { text: "Very satisfied", score: 0, icon: Heart },
      { text: "Somewhat satisfied", score: 1 },
      { text: "Somewhat dissatisfied", score: 2 },
      { text: "Very dissatisfied", score: 3 }
    ]
  },
  {
    id: 8,
    text: "How would you rate your physical activity level in the past 2 weeks?",
    category: "physical",
    options: [
      { text: "Very active", score: 0 },
      { text: "Moderately active", score: 1 },
      { text: "Somewhat active", score: 2 },
      { text: "Not active at all", score: 3 }
    ]
  }
];

const MentalHealthAssessment: React.FC = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Smooth scroll to top when question changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentQuestion]);

  const handleAnswer = (questionId: number, score: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: score }));
    
    if (currentQuestion < assessmentQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      setShowResults(true);
    }
  };

  const calculateScores = (): AssessmentScore => {
    const scores: AssessmentScore = {
      depression: 0,
      anxiety: 0,
      stress: 0,
      wellbeing: 0,
      sleep: 0,
      social: 0,
      physical: 0
    };

    Object.entries(answers).forEach(([questionId, score]) => {
      const question = assessmentQuestions.find(q => q.id === parseInt(questionId));
      if (question) {
        scores[question.category] += score;
      }
    });

    // Calculate overall wellbeing score (inverse of average of other scores)
    const totalScore = Object.values(scores).reduce((acc, curr) => acc + curr, 0);
    const maxPossibleScore = assessmentQuestions.length * 3; // Assuming max score of 3 per question
    scores.wellbeing = 100 - ((totalScore / maxPossibleScore) * 100);

    return scores;
  };

  const getRecommendations = (scores: AssessmentScore): AssessmentRecommendation[] => {
    const recommendations: AssessmentRecommendation[] = [];

    if (scores.depression > 4) {
      recommendations.push({
        title: "Depression Screening",
        text: "Your responses suggest you may be experiencing symptoms of depression. Consider speaking with a mental health professional for proper evaluation and support.",
        urgent: scores.depression > 8,
        category: "depression",
        severity: scores.depression > 8 ? "high" : "moderate"
      });
    }

    if (scores.anxiety > 4) {
      recommendations.push({
        title: "Anxiety Management",
        text: "Your responses indicate you may be experiencing anxiety symptoms. A mental health professional can provide strategies and support to help manage anxiety.",
        urgent: scores.anxiety > 8,
        category: "anxiety",
        severity: scores.anxiety > 8 ? "high" : "moderate"
      });
    }

    if (scores.stress > 6) {
      recommendations.push({
        title: "Stress Management",
        text: "Your stress levels appear elevated. Consider incorporating stress management techniques like meditation, deep breathing, or professional support.",
        urgent: scores.stress > 10,
        category: "stress",
        severity: scores.stress > 10 ? "high" : "moderate"
      });
    }

    if (scores.sleep > 2) {
      recommendations.push({
        title: "Sleep Health",
        text: "Your sleep quality might be affecting your mental health. Consider establishing a regular sleep schedule and consulting a healthcare provider about sleep improvement strategies.",
        urgent: false,
        category: "sleep",
        severity: "moderate"
      });
    }

    if (scores.social > 2) {
      recommendations.push({
        title: "Social Connection",
        text: "Consider ways to strengthen your social support network. This might include reaching out to friends, joining community groups, or speaking with a counselor.",
        urgent: false,
        category: "social",
        severity: "low"
      });
    }

    if (scores.physical > 2) {
      recommendations.push({
        title: "Physical Activity",
        text: "Regular physical activity can improve mental well-being. Consider incorporating more movement into your daily routine.",
        urgent: false,
        category: "physical",
        severity: "low"
      });
    }

    return recommendations;
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No authenticated user');

      const scores = calculateScores();
      
      const { error: submitError } = await supabase
        .from('mental_health_assessments')
        .insert([{
          user_id: user.id,
          scores,
          timestamp: new Date().toISOString()
        }]);

      if (submitError) throw submitError;
      setSubmitted(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showResults) {
    const scores = calculateScores();
    const recommendations = getRecommendations(scores);
    
    return (
      <div className="space-y-6 animate-fadeIn">
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-2xl shadow-xl border border-gray-700">
          <div className="flex items-center space-x-2 mb-6">
            <Brain className="h-6 w-6 text-indigo-400" />
            <h2 className="text-xl font-semibold text-white">Your Mental Health Profile</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {Object.entries(scores).map(([category, score]) => (
              <div key={category} className="bg-gray-800/50 p-4 rounded-xl border border-gray-700">
                <h3 className="text-lg font-medium text-gray-300 capitalize mb-2">
                  {category === 'wellbeing' ? 'Overall Well-being' : category}
                </h3>
                <div className="flex items-center space-x-2">
                  <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${
                        category === 'wellbeing'
                          ? 'bg-gradient-to-r from-emerald-500 to-teal-500'
                          : 'bg-gradient-to-r from-indigo-500 to-purple-500'
                      }`}
                      style={{ 
                        width: category === 'wellbeing' 
                          ? `${score}%` 
                          : `${(score / 12) * 100}%` 
                      }}
                    />
                  </div>
                  <span className="text-gray-400 font-medium">
                    {category === 'wellbeing' ? `${Math.round(score)}%` : score}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium text-white mb-4">Recommendations</h3>
            {recommendations.map((rec, index) => (
              <div 
                key={index}
                className={`p-4 rounded-xl border ${
                  rec.urgent
                    ? 'bg-rose-500/10 border-rose-500/30'
                    : rec.severity === 'moderate'
                    ? 'bg-amber-500/10 border-amber-500/30'
                    : 'bg-emerald-500/10 border-emerald-500/30'
                }`}
              >
                <div className="flex items-start space-x-3">
                  {rec.urgent ? (
                    <AlertCircle className="h-5 w-5 text-rose-400 mt-1 flex-shrink-0" />
                  ) : rec.severity === 'moderate' ? (
                    <AlertCircle className="h-5 w-5 text-amber-400 mt-1 flex-shrink-0" />
                  ) : (
                    <CheckCircle className="h-5 w-5 text-emerald-400 mt-1 flex-shrink-0" />
                  )}
                  <div>
                    <h4 className={`font-medium ${
                      rec.urgent 
                        ? 'text-rose-400' 
                        : rec.severity === 'moderate'
                        ? 'text-amber-400'
                        : 'text-emerald-400'
                    }`}>
                      {rec.title}
                    </h4>
                    <p className="text-gray-300 mt-1">{rec.text}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {!submitted && (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="mt-6 w-full px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg hover:from-indigo-600 hover:to-purple-600 transition-all duration-300 shadow-lg hover:shadow-indigo-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Saving Results...</span>
                </>
              ) : (
                <span>Save Results</span>
              )}
            </button>
          )}

          {error && (
            <div className="mt-4 p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400">
              {error}
            </div>
          )}
        </div>

        <div className="bg-indigo-500/10 border border-indigo-500/30 p-4 rounded-xl">
          <p className="text-indigo-400 text-sm">
            This assessment is for screening purposes only and does not constitute a diagnosis. 
            Please consult with a qualified mental health professional for proper evaluation and treatment.
          </p>
        </div>
      </div>
    );
  }

  const question = assessmentQuestions[currentQuestion];
  const progress = ((currentQuestion + 1) / assessmentQuestions.length) * 100;

  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-2xl shadow-xl border border-gray-700">
      <div className="flex items-center space-x-2 mb-8">
        <Brain className="h-6 w-6 text-indigo-400" />
        <h2 className="text-xl font-semibold text-white">Mental Health Assessment</h2>
      </div>

      <div className="mb-8">
        <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex items-center justify-between mt-2">
          <p className="text-gray-400 text-sm">
            Question {currentQuestion + 1} of {assessmentQuestions.length}
          </p>
          <p className="text-gray-400 text-sm">
            {Math.round(progress)}% Complete
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <p className="text-lg text-white font-medium">{question.text}</p>

        <div className="grid grid-cols-1 gap-3">
          {question.options.map((option, index) => {
            const Icon = option.icon;
            return (
              <button
                key={index}
                onClick={() => handleAnswer(question.id, option.score)}
                className="group p-4 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-xl text-left transition-all duration-200 flex items-center justify-between hover:border-indigo-500/50 hover:shadow-lg hover:shadow-indigo-500/10"
              >
                <div className="flex items-center space-x-3">
                  {Icon && (
                    <div className="p-2 rounded-lg bg-gray-700 group-hover:bg-gray-600 transition-colors">
                      <Icon className="h-5 w-5 text-indigo-400" />
                    </div>
                  )}
                  <span className="text-gray-300 group-hover:text-white">
                    {option.text}
                  </span>
                </div>
                <ArrowRight className="h-5 w-5 text-gray-600 group-hover:text-indigo-400 transition-colors" />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MentalHealthAssessment;