/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import Layout from "./components/Layout";
import OnboardingForm from "./components/Form";
import Dashboard from "./components/Dashboard";
import Splash from "./components/Splash";
import AuthScreen from "./components/Auth";
import { HealthPlan, UserData } from "./types";
import { generateHealthPlan } from "./services/geminiService";
import { motion, AnimatePresence } from "motion/react";

export default function App() {
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<HealthPlan | null>(null);
  const [history, setHistory] = useState<HealthPlan[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLightMode, setIsLightMode] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    const savedMode = localStorage.getItem('vita_mode');
    const savedAuth = localStorage.getItem('vita_auth');
    const savedName = localStorage.getItem('vita_user_name');
    const savedEmail = localStorage.getItem('vita_user_email');
    
    if (savedMode === 'light') setIsLightMode(true);
    if (savedAuth === 'true' && savedEmail) {
      setIsAuthenticated(true);
      setUserName(savedName || "");
      setUserEmail(savedEmail);
      
      const savedHistory = localStorage.getItem(`vita_history_${savedEmail}`);
      const savedCurrentPlan = localStorage.getItem(`vita_current_plan_${savedEmail}`);
      if (savedHistory) setHistory(JSON.parse(savedHistory));
      if (savedCurrentPlan) setPlan(JSON.parse(savedCurrentPlan));
    }
  }, []);

  useEffect(() => {
    const root = document.querySelector('body');
    if (isLightMode) {
      root?.classList.add('light-mode');
      localStorage.setItem('vita_mode', 'light');
    } else {
      root?.classList.remove('light-mode');
      localStorage.setItem('vita_mode', 'dark');
    }
  }, [isLightMode]);

  const handleAuth = (name: string, email: string) => {
    setIsAuthenticated(true);
    setUserName(name);
    setUserEmail(email);
    localStorage.setItem('vita_auth', 'true');
    localStorage.setItem('vita_user_name', name);
    localStorage.setItem('vita_user_email', email);

    // Load specific user data
    const savedHistory = localStorage.getItem(`vita_history_${email}`);
    const savedCurrentPlan = localStorage.getItem(`vita_current_plan_${email}`);
    if (savedHistory) setHistory(JSON.parse(savedHistory));
    else setHistory([]);
    if (savedCurrentPlan) setPlan(JSON.parse(savedCurrentPlan));
    else setPlan(null);
  };

  const handleSubmit = async (data: UserData) => {
    setLoading(true);
    setError(null);
    try {
      const result = await generateHealthPlan(data);
      // Add current metadata if needed (not strictly required by type yet but good for history)
      const planWithDate = { ...result, timestamp: new Date().toISOString() };
      
      setPlan(planWithDate);
      localStorage.setItem(`vita_current_plan_${userEmail}`, JSON.stringify(planWithDate));
      
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ocorreu um erro inesperado.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    if (plan) {
      const newHistory = [plan, ...history];
      setHistory(newHistory);
      localStorage.setItem(`vita_history_${userEmail}`, JSON.stringify(newHistory));
    }
    setPlan(null);
    localStorage.removeItem(`vita_current_plan_${userEmail}`);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserEmail("");
    setUserName("");
    setPlan(null);
    setHistory([]);
    localStorage.removeItem('vita_auth');
    localStorage.removeItem('vita_user_name');
    localStorage.removeItem('vita_user_email');
  };

  return (
    <>
      <AnimatePresence>
        {showSplash && <Splash onComplete={() => setShowSplash(false)} />}
      </AnimatePresence>

      <Layout isLightMode={isLightMode}>
        <AnimatePresence mode="wait">
          {!isAuthenticated ? (
            <motion.div
              key="auth"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <AuthScreen onAuth={handleAuth} isLightMode={isLightMode} />
            </motion.div>
          ) : !plan ? (
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -20 }}
              className="py-10"
            >
              <div className="mb-16 text-center max-w-2xl mx-auto">
                <span className="inline-block px-3 py-1 rounded-full bg-wellness-green/10 text-wellness-green text-[10px] font-bold tracking-[0.2em] mb-4 uppercase">
                  SISTEMA RECONHECIDO: {userName}
                </span>
                <h1 className={`text-5xl md:text-7xl font-bold tracking-tighter mb-6 ${isLightMode ? 'text-black' : 'text-white'}`}>
                  UPGRADE <span className="text-wellness-green">HUMANO</span>
                </h1>
                <p className={`${isLightMode ? 'text-black/60' : 'text-white/40'} text-lg leading-relaxed`}>
                  Transforme seus dados biológicos em um protocolo de alta performance. 
                  Nutrição de precisão e biomecânica avançada em um só lugar.
                </p>
              </div>
              
              {error && (
                <div className="max-w-2xl mx-auto mb-8 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm text-center">
                  {error}
                </div>
              )}
              
              <OnboardingForm onSubmit={handleSubmit} loading={loading} isLightMode={isLightMode} />
            </motion.div>
          ) : (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <Dashboard 
                plan={plan} 
                userName={userName}
                isLightMode={isLightMode} 
                setIsLightMode={setIsLightMode} 
                onReset={handleReset}
                onLogout={handleLogout}
                history={history}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </Layout>
    </>
  );
}

