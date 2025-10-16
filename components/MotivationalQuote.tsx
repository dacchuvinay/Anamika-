import React from 'react';
import { useMotivationalQuotes } from '../hooks/useMotivationalQuotes';

const MotivationalQuote: React.FC = () => {
  const quote = useMotivationalQuotes();

  return (
    <div className="fixed bottom-4 right-4 max-w-sm bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border border-emerald-500/50 dark:border-emerald-500/30 p-4 rounded-xl shadow-lg animate-fade-in-up">
      <p className="text-sm italic text-slate-700 dark:text-slate-200">"{quote.text}"</p>
      <p className="text-xs text-emerald-600 dark:text-emerald-400 text-right mt-2">- {quote.author}</p>
    </div>
  );
};

export default MotivationalQuote;