import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Activity, Brain, Home, Moon, MessageSquareText, Thermometer } from 'lucide-react';
import { ThemeProvider } from './context/ThemeContext';
import { supabase } from './lib/supabase';
import Navbar from './components/Navbar';
import LoginModal from './components/LoginModal';
import HealthInfoForm from './components/HealthInfoForm';
import Dashboard from './pages/Dashboard';
import MentalHealth from './pages/MentalHealth';
import SymptomChecker from './pages/SymptomChecker';
import HomeMonitoring from './pages/HomeMonitoring';
import ChatAssistant from './pages/ChatAssistant';
import SleepManagement from './pages/SleepManagement';

function App() {
  const [showLogin, setShowLogin] = useState(true);
  const [showHealthForm, setShowHealthForm] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const navItems = [
    { icon: Home, label: 'Dashboard', path: '/' },
    { icon: Brain, label: 'Mental Health', path: '/mental-health' },
    { icon: Thermometer, label: 'Symptom Checker', path: '/symptoms' },
    { icon: Activity, label: 'Home Monitoring', path: '/monitoring' },
    { icon: MessageSquareText, label: 'AI Assistant', path: '/chat' },
    { icon: Moon, label: 'Sleep', path: '/sleep' },
  ];

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
      setShowLogin(!session);
      
      if (session) {
        try {
          const { data, error } = await supabase
            .from('health_profiles')
            .select('*')
            .eq('user_id', session.user.id)
            .maybeSingle();

          if (error && error.code !== 'PGRST116') {
            console.error('Error fetching health profile:', error);
            return;
          }

          setShowHealthForm(!data);
        } catch (err) {
          console.error('Error checking health profile:', err);
        }
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setIsAuthenticated(!!session);
      setShowLogin(!session);
      
      if (session) {
        try {
          const { data, error } = await supabase
            .from('health_profiles')
            .select('*')
            .eq('user_id', session.user.id)
            .maybeSingle();

          if (error && error.code !== 'PGRST116') {
            console.error('Error fetching health profile:', error);
            return;
          }

          setShowHealthForm(!data);
        } catch (err) {
          console.error('Error checking health profile:', err);
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleLoginSuccess = () => {
    setShowLogin(false);
    setShowHealthForm(true);
  };

  const handleHealthFormComplete = () => {
    setShowHealthForm(false);
  };

  return (
    <ThemeProvider>
      <Router>
        <div className="min-h-screen bg-gray-900 text-white">
          {isAuthenticated && <Navbar items={navItems} />}
          <main className="container mx-auto px-4 py-8 pt-20">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/mental-health" element={<MentalHealth />} />
              <Route path="/symptoms" element={<SymptomChecker />} />
              <Route path="/monitoring" element={<HomeMonitoring />} />
              <Route path="/chat" element={<ChatAssistant />} />
              <Route path="/sleep" element={<SleepManagement />} />
            </Routes>
          </main>
          {showLogin && <LoginModal onSuccess={handleLoginSuccess} />}
          {showHealthForm && !showLogin && <HealthInfoForm onComplete={handleHealthFormComplete} />}
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;