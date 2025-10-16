import React from 'react';
import { ActiveTab } from '../types';
import DumbbellIcon from './icons/DumbbellIcon';
import FlameIcon from './icons/FlameIcon';
import ChatIcon from './icons/ChatIcon';
import LogoIcon from './icons/LogoIcon';
import SunIcon from './icons/SunIcon';
import MoonIcon from './icons/MoonIcon';
import CalendarIcon from './icons/CalendarIcon';
import MaleIcon from './icons/MaleIcon';
import FemaleIcon from './icons/FemaleIcon';

type GenderMode = 'boys' | 'girls';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  genderMode: GenderMode;
  setGenderMode: (mode: GenderMode) => void;
}

const NavButton: React.FC<{
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
}> = ({ label, icon, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors duration-300 text-sm md:text-base ${
      isActive
        ? 'bg-emerald-500 text-white shadow-md'
        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
    }`}
  >
    {icon}
    {label}
  </button>
);

const GenderToggle: React.FC<{
  genderMode: GenderMode;
  setGenderMode: (mode: GenderMode) => void;
}> = ({ genderMode, setGenderMode }) => (
  <div className="flex items-center gap-1 bg-slate-200/50 dark:bg-slate-900/50 p-1 rounded-full">
    <button
      onClick={() => setGenderMode('boys')}
      className={`p-1.5 rounded-full transition-colors duration-300 ${genderMode === 'boys' ? 'bg-emerald-500 text-white' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
      aria-label="Switch to boys mode"
    >
      <MaleIcon className="h-5 w-5" />
    </button>
    <button
      onClick={() => setGenderMode('girls')}
      className={`p-1.5 rounded-full transition-colors duration-300 ${genderMode === 'girls' ? 'bg-emerald-500 text-white' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
      aria-label="Switch to girls mode"
    >
      <FemaleIcon className="h-5 w-5" />
    </button>
  </div>
);

const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab, theme, toggleTheme, genderMode, setGenderMode }) => {
  return (
    <header className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm sticky top-0 z-50 shadow-lg">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-3">
            <LogoIcon className="h-8 w-8 text-emerald-500 dark:text-emerald-400" />
            <h1 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">FitBot AI</h1>
        </div>
        <div className="flex items-center gap-4">
            <nav className="flex items-center gap-2 bg-slate-200/50 dark:bg-slate-900/50 p-1 rounded-xl">
                <NavButton 
                    label="Daily" 
                    icon={<CalendarIcon className="h-5 w-5" />} 
                    isActive={activeTab === 'daily'} 
                    onClick={() => setActiveTab('daily')} 
                />
                <NavButton 
                    label="Workouts" 
                    icon={<DumbbellIcon className="h-5 w-5" />} 
                    isActive={activeTab === 'workouts'} 
                    onClick={() => setActiveTab('workouts')} 
                />
                <NavButton 
                    label="Calories" 
                    icon={<FlameIcon className="h-5 w-5" />}
                    isActive={activeTab === 'calories'} 
                    onClick={() => setActiveTab('calories')} 
                />
                <NavButton 
                    label="Assistant" 
                    icon={<ChatIcon className="h-5 w-5" />}
                    isActive={activeTab === 'assistant'} 
                    onClick={() => setActiveTab('assistant')} 
                />
            </nav>
             <GenderToggle genderMode={genderMode} setGenderMode={setGenderMode} />
            <button
                onClick={toggleTheme}
                className="p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors duration-300"
                aria-label="Toggle theme"
            >
                {theme === 'light' ? <MoonIcon className="h-5 w-5" /> : <SunIcon className="h-5 w-5" />}
            </button>
        </div>
      </div>
    </header>
  );
};

export default Header;