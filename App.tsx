import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Workouts from './components/Workouts';
import CalorieTracker from './components/CalorieTracker';
import AiAssistant from './components/AiAssistant';
import DailyWorkouts from './components/DailyWorkouts';
import MotivationalQuote from './components/MotivationalQuote';
import { ActiveTab } from './types';

type Theme = 'light' | 'dark';
type GenderMode = 'boys' | 'girls';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('daily');
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem('theme');
    return (savedTheme === 'light' || savedTheme === 'dark') ? savedTheme : 'dark';
  });
  const [genderMode, setGenderMode] = useState<GenderMode>(() => {
    const savedMode = localStorage.getItem('genderMode');
    return (savedMode === 'boys' || savedMode === 'girls') ? savedMode : 'boys';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);
  
  useEffect(() => {
    const root = window.document.documentElement;
    if (genderMode === 'girls') {
      root.classList.add('theme-girls');
    } else {
      root.classList.remove('theme-girls');
    }
    localStorage.setItem('genderMode', genderMode);
  }, [genderMode]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'daily':
        return <DailyWorkouts genderMode={genderMode} />;
      case 'workouts':
        return <Workouts genderMode={genderMode} />;
      case 'calories':
        return <CalorieTracker />;
      case 'assistant':
        return <AiAssistant />;
      default:
        return <DailyWorkouts genderMode={genderMode} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-100 font-sans transition-colors duration-300">
      <Header 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        theme={theme}
        toggleTheme={toggleTheme}
        genderMode={genderMode}
        setGenderMode={setGenderMode}
      />
      <main className="container mx-auto px-4 py-8">
        {renderContent()}
      </main>
      <MotivationalQuote />
    </div>
  );
};

export default App;