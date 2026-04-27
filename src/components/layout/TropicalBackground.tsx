import React from 'react';

export const TropicalBackground: React.FC = () => {
  return (
    <>
      {/* Camada 1 — fallback: gradiente + círculos SVG */}
      <div
        className="fixed inset-0"
        style={{
          zIndex: -10,
          background: 'radial-gradient(ellipse at center, #F4E4C1 0%, #B8E8F0 50%, #1FBFCF 100%)',
        }}
      >
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="xMidYMid slice"
        >
          <circle cx="50" cy="50" r="15" fill="none" stroke="white" strokeWidth="0.25" opacity="0.15" />
          <circle cx="50" cy="50" r="28" fill="none" stroke="white" strokeWidth="0.35" opacity="0.20" />
          <circle cx="50" cy="50" r="42" fill="none" stroke="white" strokeWidth="0.35" opacity="0.25" />
          <circle cx="50" cy="50" r="56" fill="none" stroke="white" strokeWidth="0.5"  opacity="0.30" />
        </svg>
      </div>

      {/* Camada 2 — vídeo (sobre fallback; fallback visível se vídeo falhar) */}
      <video
        autoPlay
        muted
        loop
        playsInline
        disablePictureInPicture
        preload="auto"
        src={`${import.meta.env.BASE_URL}videos/background-waves.mp4`}
        onError={(e) => { e.currentTarget.style.display = 'none'; }}
        style={{
          position: 'fixed',
          inset: 0,
          width: '100vw',
          height: '100vh',
          objectFit: 'cover',
          zIndex: -5,
          pointerEvents: 'none',
        }}
      />

      {/* Camada 3 — overlay semi-transparente pra legibilidade */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(255, 240, 220, 0.15)',
          zIndex: -3,
          pointerEvents: 'none',
        }}
      />
    </>
  );
};

export default TropicalBackground;
