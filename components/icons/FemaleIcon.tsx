import React from 'react';

const FemaleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <circle cx="12" cy="7" r="4" />
    <path d="M12 11v10" />
    <path d="M9 18h6" />
  </svg>
);

export default FemaleIcon;