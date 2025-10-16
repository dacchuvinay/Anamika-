import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { getAIAssistantResponse } from '../services/geminiService';
import LogoIcon from './icons/LogoIcon';

const AiAssistant: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: "Hello! I'm FitBot AI. How can I help you with your fitness and nutrition goals today?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async () => {
    if (input.trim() && !isLoading) {
      const userMessage: ChatMessage = { role: 'user', text: input };
      setMessages(prev => [...prev, userMessage]);
      setInput('');
      setIsLoading(true);

      const responseText = await getAIAssistantResponse(input);
      const modelMessage: ChatMessage = { role: 'model', text: responseText };
      
      setMessages(prev => [...prev, modelMessage]);
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };
  
  return (
    <section className="max-w-3xl mx-auto flex flex-col h-[75vh]">
      <h2 className="text-3xl font-bold text-emerald-500 dark:text-emerald-400 mb-6 text-center">AI Fitness Assistant</h2>
      <div className="flex-grow bg-white dark:bg-slate-800 rounded-t-xl p-4 overflow-y-auto space-y-4">
        {messages.map((msg, index) => (
          <div key={index} className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
            {msg.role === 'model' && <div className="flex-shrink-0 h-8 w-8 rounded-full bg-emerald-500 flex items-center justify-center"><LogoIcon className="h-5 w-5 text-white"/></div>}
            <div className={`max-w-md p-3 rounded-xl ${msg.role === 'user' ? 'bg-emerald-500 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200'}`}>
              <p className="text-sm">{msg.text}</p>
            </div>
          </div>
        ))}
         {isLoading && (
            <div className="flex items-start gap-3">
                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-emerald-500 flex items-center justify-center"><LogoIcon className="h-5 w-5 text-white"/></div>
                <div className="max-w-md p-3 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200">
                    <div className="flex items-center space-x-1">
                        <span className="h-2 w-2 bg-emerald-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                        <span className="h-2 w-2 bg-emerald-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                        <span className="h-2 w-2 bg-emerald-400 rounded-full animate-bounce"></span>
                    </div>
                </div>
            </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 rounded-b-xl p-4 flex items-center gap-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask about exercises, nutrition..."
          className="flex-grow bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50"
          disabled={isLoading}
        />
        <button 
          onClick={handleSend}
          disabled={isLoading}
          className="bg-emerald-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-emerald-600 transition-colors duration-300 disabled:bg-emerald-700 disabled:cursor-not-allowed">
          Send
        </button>
      </div>
    </section>
  );
};

export default AiAssistant;