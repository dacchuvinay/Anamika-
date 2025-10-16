import React from 'react';

const MaleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <circle cx="12" cy="12" r="5" />
    <line x1="12" y1="17" x2="12" y2="22" />
    <line x1="10" y1="20" x2="14" y2="20" />
    <line x1="12" y1="7" x2="12" y2="2" />
    <line x1="10" y1="4" x2="14" y2="4" />
  </svg>
);

export default MaleIcon;