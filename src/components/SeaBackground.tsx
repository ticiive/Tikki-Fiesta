import React from 'react';

/**
 * SeaBackground - Animated tropical sea background
 * Features: Turquoise gradient water + wave animation + bubbles
 */
export const SeaBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 overflow-hidden z-0">
      {/* Sky gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-200 via-blue-300 to-turquoise h-1/3" />
      
      {/* Main ocean gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-turquoise via-blue-400 to-blue-600 h-full" />
      
      {/* Animated waves - primary */}
      <svg
        className="absolute bottom-0 w-full h-48 opacity-70"
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
        style={{
          animation: 'wave 15s linear infinite',
        }}
      >
        <path
          d="M0,40 Q300,0 600,40 T1200,40 L1200,120 L0,120 Z"
          className="fill-wave"
        />
      </svg>

      {/* Animated waves - secondary (offset for depth) */}
      <svg
        className="absolute bottom-10 w-full h-32 opacity-50"
        viewBox="0 0 1200 80"
        preserveAspectRatio="none"
        style={{
          animation: 'wave 20s linear infinite reverse',
        }}
      >
        <path
          d="M0,20 Q300,0 600,20 T1200,20 L1200,80 L0,80 Z"
          fill="#1FBFCF"
        />
      </svg>

      {/* Animated wave - tertiary (gentle ripples) */}
      <svg
        className="absolute bottom-5 w-full h-24 opacity-40"
        viewBox="0 0 1200 60"
        preserveAspectRatio="none"
        style={{
          animation: 'wave 25s linear infinite',
        }}
      >
        <path
          d="M0,15 Q300,5 600,15 T1200,15 L1200,60 L0,60 Z"
          fill="#40B0D0"
        />
      </svg>

      {/* Floating bubbles */}
      <div className="absolute inset-0">
        <div
          className="absolute w-8 h-8 rounded-full bg-white opacity-20"
          style={{
            bottom: '20%',
            left: '10%',
            animation: 'float 6s ease-in-out infinite',
          }}
        />
        <div
          className="absolute w-6 h-6 rounded-full bg-white opacity-15"
          style={{
            bottom: '30%',
            left: '25%',
            animation: 'float 8s ease-in-out infinite 2s',
          }}
        />
        <div
          className="absolute w-5 h-5 rounded-full bg-white opacity-25"
          style={{
            bottom: '25%',
            left: '70%',
            animation: 'float 7s ease-in-out infinite 1s',
          }}
        />
        <div
          className="absolute w-7 h-7 rounded-full bg-white opacity-10"
          style={{
            bottom: '35%',
            left: '85%',
            animation: 'float 9s ease-in-out infinite 3s',
          }}
        />
      </div>

      {/* CSS animations for bubbles */}
      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-30px);
          }
        }
      `}</style>
    </div>
  );
};
