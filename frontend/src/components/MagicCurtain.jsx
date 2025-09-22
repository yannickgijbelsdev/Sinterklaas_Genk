import React, { useState, useEffect } from 'react';

export const MagicCurtain = ({ isLoading, onAnimationComplete }) => {
  const [curtainState, setCurtainState] = useState('closed'); // closed, opening, opened

  useEffect(() => {
    if (!isLoading && curtainState === 'closed') {
      // Start opening animation after component mounts
      const timer = setTimeout(() => {
        setCurtainState('opening');
        
        // Complete animation after curtains open
        const completeTimer = setTimeout(() => {
          setCurtainState('opened');
          onAnimationComplete();
        }, 1500); // Time for curtain opening animation

        return () => clearTimeout(completeTimer);
      }, 2500); // Wait 2.5 seconds before starting to open

      return () => clearTimeout(timer);
    }
  }, [isLoading, curtainState, onAnimationComplete]);

  if (curtainState === 'opened') {
    return null; // Remove curtain completely
  }

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Background with Sinterklaas colors */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-900 via-red-800 to-red-900"></div>
      
      {/* Sparkling stars background */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute text-yellow-300 opacity-70"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              fontSize: `${Math.random() * 20 + 10}px`,
              animationDelay: `${Math.random() * 3}s`
            }}
          >
            ✨
          </div>
        ))}
      </div>

      {/* Left curtain */}
      <div 
        className={`absolute inset-y-0 left-0 bg-gradient-to-r from-red-800 via-red-700 to-red-600 transition-transform duration-1500 ease-in-out ${
          curtainState === 'opening' ? '-translate-x-full' : 'translate-x-0'
        }`}
        style={{ 
          width: '50%',
          boxShadow: 'inset -20px 0 40px -20px rgba(0,0,0,0.3)',
          background: `
            repeating-linear-gradient(
              90deg,
              #dc2626 0px,
              #b91c1c 20px,
              #991b1b 40px,
              #dc2626 60px
            )
          `
        }}
      >
        {/* Curtain texture */}
        <div className="absolute inset-0 opacity-30">
          <div className="h-full w-full bg-gradient-to-b from-transparent via-black/10 to-black/20"></div>
        </div>
        
        {/* Curtain rope/tassels */}
        <div className="absolute top-0 right-0 h-full w-4 bg-yellow-600 shadow-lg">
          <div className="absolute top-4 right-1 w-2 h-8 bg-yellow-500 rounded-full"></div>
          <div className="absolute top-16 right-1 w-2 h-8 bg-yellow-500 rounded-full"></div>
          <div className="absolute top-28 right-1 w-2 h-8 bg-yellow-500 rounded-full"></div>
        </div>
      </div>

      {/* Right curtain */}
      <div 
        className={`absolute inset-y-0 right-0 bg-gradient-to-l from-red-800 via-red-700 to-red-600 transition-transform duration-1500 ease-in-out ${
          curtainState === 'opening' ? 'translate-x-full' : 'translate-x-0'
        }`}
        style={{ 
          width: '50%',
          boxShadow: 'inset 20px 0 40px -20px rgba(0,0,0,0.3)',
          background: `
            repeating-linear-gradient(
              90deg,
              #dc2626 0px,
              #b91c1c 20px,
              #991b1b 40px,
              #dc2626 60px
            )
          `
        }}
      >
        {/* Curtain texture */}
        <div className="absolute inset-0 opacity-30">
          <div className="h-full w-full bg-gradient-to-b from-transparent via-black/10 to-black/20"></div>
        </div>
        
        {/* Curtain rope/tassels */}
        <div className="absolute top-0 left-0 h-full w-4 bg-yellow-600 shadow-lg">
          <div className="absolute top-4 left-1 w-2 h-8 bg-yellow-500 rounded-full"></div>
          <div className="absolute top-16 left-1 w-2 h-8 bg-yellow-500 rounded-full"></div>
          <div className="absolute top-28 left-1 w-2 h-8 bg-yellow-500 rounded-full"></div>
        </div>
      </div>

      {/* Center loading content */}
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <div className="text-center text-white">
          {/* Main logo/title */}
          <div className="mb-8">
            <div className="text-8xl mb-4 animate-bounce">🎭</div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4 text-yellow-200">
              De Magische
            </h1>
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-yellow-100">
              Sinterklaas Show
            </h2>
          </div>
          
          {curtainState === 'closed' && (
            <div className="space-y-4">
              <div className="text-xl text-yellow-200 mb-4">
                Het doek gaat zo open... ✨
              </div>
              
              {/* Loading animation */}
              <div className="flex justify-center space-x-2">
                <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          )}
          
          {curtainState === 'opening' && (
            <div className="text-2xl text-yellow-200 animate-pulse">
              🌟 Welkom bij de show! 🌟
            </div>
          )}
        </div>
      </div>

      {/* Sparkle effects when opening */}
      {curtainState === 'opening' && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute text-yellow-300 animate-ping"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                fontSize: `${Math.random() * 30 + 15}px`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: '1s'
              }}
            >
              ✨
            </div>
          ))}
        </div>
      )}
    </div>
  );
};