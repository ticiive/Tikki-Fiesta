import React from 'react';

/*
 * Fundo fixo reutilizável em todas as telas.
 * Gradiente radial: centro areia (#F4E4C1) → azul claro → turquoise nas bordas.
 * SVG overlay com 4 círculos concêntricos brancos translúcidos (espessuras variadas)
 * para criar profundidade visual sem animação.
 */
export const TropicalBackground: React.FC = () => {
  return (
    <div
      className="fixed inset-0 z-[-10]"
      style={{
        background: 'radial-gradient(ellipse at center, #F4E4C1 0%, #B8E8F0 50%, #1FBFCF 100%)',
      }}
    >
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid slice"
      >
        {/* Espessuras propositalmente diferentes: 0.25 / 0.35 / 0.35 / 0.5 */}
        <circle cx="50" cy="50" r="15" fill="none" stroke="white" strokeWidth="0.25" opacity="0.15" />
        <circle cx="50" cy="50" r="28" fill="none" stroke="white" strokeWidth="0.35" opacity="0.20" />
        <circle cx="50" cy="50" r="42" fill="none" stroke="white" strokeWidth="0.35" opacity="0.25" />
        <circle cx="50" cy="50" r="56" fill="none" stroke="white" strokeWidth="0.5"  opacity="0.30" />
      </svg>
    </div>
  );
};

export default TropicalBackground;
