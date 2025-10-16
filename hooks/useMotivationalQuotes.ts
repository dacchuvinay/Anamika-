
import { useState, useEffect } from 'react';
import { Quote } from '../types';
import { MOTIVATIONAL_QUOTES } from '../constants';

export const useMotivationalQuotes = (intervalMs: number = 15000): Quote => {
  const [quoteIndex, setQuoteIndex] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setQuoteIndex((prevIndex) => (prevIndex + 1) % MOTIVATIONAL_QUOTES.length);
    }, intervalMs);

    return () => clearInterval(intervalId);
  }, [intervalMs]);

  return MOTIVATIONAL_QUOTES[quoteIndex];
};
