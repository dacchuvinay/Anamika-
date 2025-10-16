import React from 'react';

const CONFETTI_COUNT = 100;
const COLORS = ['#2dd4bf', '#34d399', '#6ee7b7', '#a7f3d0'];

const Confetti: React.FC = () => {
  const confetti = Array.from({ length: CONFETTI_COUNT }).map((_, i) => {
    const style: React.CSSProperties = {
      left: `${Math.random() * 100}%`,
      backgroundColor: COLORS[Math.floor(Math.random() * COLORS.length)],
      animationName: `fall, spin-${i % 2}`,
      animationDuration: `${Math.random() * 2 + 3}s, ${Math.random() * 2 + 2}s`,
      animationDelay: `${Math.random() * 2}s`,
      animationTimingFunction: 'linear, ease-in-out',
      animationIterationCount: 'infinite, infinite',
      animationFillMode: 'forwards',
      position: 'absolute',
      width: `${Math.floor(Math.random() * 8) + 8}px`,
      height: `${Math.floor(Math.random() * 5) + 5}px`,
      opacity: Math.random(),
      top: '-20px',
    };
    return <div key={i} style={style} className="confetti-piece" />;
  });

  return (
    <>
      <style>{`
        @keyframes fall {
          to {
            transform: translateY(100vh);
          }
        }
        @keyframes spin-0 {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes spin-1 {
            from { transform: rotate(360deg); }
            to { transform: rotate(0deg); }
        }
      `}</style>
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 overflow-hidden z-50"
      >
        {confetti}
      </div>
    </>
  );
};

export default Confetti;