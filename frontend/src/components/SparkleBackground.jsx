import React from 'react';

export const SparkleBackground = ({ density = 'light', animation = 'slow' }) => {
  // Density settings
  const sparkleCount = {
    light: 8,
    medium: 15,
    heavy: 25
  }[density] || 8;

  // Animation speed settings
  const animationDuration = {
    slow: '4s',
    medium: '3s',
    fast: '2s'
  }[animation] || '4s';

  const sparkles = [...Array(sparkleCount)].map((_, i) => ({
    id: i,
    left: Math.random() * 100,
    top: Math.random() * 100,
    size: Math.random() * 0.8 + 0.4, // Between 0.4 and 1.2
    delay: Math.random() * 4, // Random delay up to 4s
    emoji: ['✨', '⭐', '🌟'][Math.floor(Math.random() * 3)]
  }));

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {sparkles.map((sparkle) => (
        <div
          key={sparkle.id}
          className="absolute opacity-30 select-none"
          style={{
            left: `${sparkle.left}%`,
            top: `${sparkle.top}%`,
            fontSize: `${sparkle.size}rem`,
            animationDelay: `${sparkle.delay}s`,
            animationDuration: animationDuration,
            animation: `twinkle ${animationDuration} ease-in-out infinite`
          }}
        >
          {sparkle.emoji}
        </div>
      ))}
    </div>
  );
};