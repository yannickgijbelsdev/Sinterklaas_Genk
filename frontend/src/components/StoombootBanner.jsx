import React from 'react';
import '../styles/sinterklaas-theme.css';

export const StoombootBanner = ({ className = "" }) => {
  return (
    <div className={`stoomboot-container ${className}`}>
      <div className="stoomboot">
        {/* Stoomboot body */}
        <div className="stoomboot-body">
          <div className="stoomboot-cabin"></div>
          <div className="stoomboot-chimney"></div>
          
          {/* Rook particles */}
          <div className="smoke"></div>
          <div className="smoke"></div>
          <div className="smoke"></div>
          <div className="smoke"></div>
        </div>
        
        {/* Golven onder de boot */}
        <div className="absolute -bottom-2 left-0 w-full">
          <svg width="100%" height="20" viewBox="0 0 300 20" className="text-blue-300 opacity-30">
            <path
              d="M0,10 Q75,0 150,10 T300,10 V20 H0 Z"
              fill="currentColor"
            />
          </svg>
        </div>
      </div>
      
      {/* Decoratieve elementen rondom de boot */}
      <div className="absolute top-4 left-4 text-2xl opacity-20 animate-pulse">⭐</div>
      <div className="absolute top-8 right-8 text-xl opacity-15 animate-pulse" style={{animationDelay: '1s'}}>🎁</div>
      <div className="absolute bottom-4 left-12 text-lg opacity-10 animate-pulse" style={{animationDelay: '2s'}}>✨</div>
    </div>
  );
};