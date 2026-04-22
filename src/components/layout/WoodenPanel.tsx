import React, { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { WOOD_BG, WOOD_INSET_MAIN } from '@/lib/tokens';

interface WoodenPanelProps {
  children: ReactNode;
  className?: string; // posicionamento externo: max-w, mx-auto, margens, etc.
  compact?: boolean;  // padding interno reduzido — para HUDs e headers de jogo
}


/*
 * Painel de madeira com personalidade visual — seis técnicas simultâneas:
 *   a) border-radius com 4 valores distintos → cantos "entalhados à mão"
 *   b) border sólida 10px + 3 insets em camadas → relevo/espessura física
 *   c) 2 gradientes sobrepostos → textura de veios de madeira
 *   d) box-shadow externo assimétrico (y > x) → peso e materialidade
 *   e) Decorativos SVG com offsets negativos → quebram borda propositalmente
 *   f) Elipses SVG (nós de madeira) z-0 atrás do conteúdo → imperfeição natural
 */
export const WoodenPanel: React.FC<WoodenPanelProps> = ({ children, className, compact }) => {
  return (
    <div
      className={cn('relative', className)}
      style={{
        borderRadius: '28px 36px 24px 40px',   // a) Cantos irregulares
        border: '10px solid #5D3A1A',           // b) Borda espessa
        background: WOOD_BG,                   // c) Textura de madeira
        boxShadow: [
          WOOD_INSET_MAIN,                     // b) Relevo interno
          '0 12px 0 0 rgba(45,27,13,0.8)',     // d) Sombra "chão" espessa
          '0 16px 30px rgba(45,27,13,0.4)',    // d) Blur de profundidade
        ].join(', '),
        overflow: 'visible',                   // e) Decorativos extravasam
      }}
    >
      {/* f) Nós de madeira — elipses em posições/rotações irregulares ────── */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ zIndex: 0, borderRadius: 'inherit' }}
        viewBox="0 0 1000 600"
        preserveAspectRatio="none"
      >
        <ellipse cx="140" cy="110" rx="72" ry="38" fill="rgba(45,27,13,0.28)" transform="rotate(-22 140 110)" />
        <ellipse cx="820" cy="390" rx="55" ry="28" fill="rgba(45,27,13,0.22)" transform="rotate(16 820 390)"  />
        <ellipse cx="440" cy="530" rx="64" ry="32" fill="rgba(45,27,13,0.20)" transform="rotate(-7 440 530)"  />
      </svg>

      {/* e) Canto TL — folha de palmeira saindo para fora da moldura ──────── */}
      <div
        className="absolute pointer-events-none select-none"
        style={{ top: -24, left: -32, zIndex: 10, transform: 'rotate(-15deg)' }}
      >
        <svg width="80" height="95" viewBox="0 0 80 95" fill="none">
          <path d="M12,85 Q-8,45 38,5 Q55,32 50,62 Q36,78 12,85 Z" fill="#2D6B31" />
          <path d="M12,85 Q28,44 38,5" stroke="#1B4D1E" strokeWidth="2" strokeLinecap="round" />
          <path d="M22,65 Q35,50 42,30" stroke="#1B4D1E" strokeWidth="1" opacity="0.6" />
          <path d="M18,72 Q30,55 37,38" stroke="#1B4D1E" strokeWidth="1" opacity="0.5" />
        </svg>
      </div>

      {/* e) Canto TR — flor hibisco saindo para fora da moldura ─────────────── */}
      <div
        className="absolute pointer-events-none select-none"
        style={{ top: -18, right: -28, zIndex: 10, transform: 'rotate(20deg)' }}
      >
        <svg width="68" height="68" viewBox="0 0 68 68" fill="none">
          {([0, 72, 144, 216, 288] as number[]).map((deg, i) => (
            <ellipse
              key={i}
              cx="34" cy="16" rx="8" ry="16"
              fill="#E8476A" opacity="0.92"
              transform={`rotate(${deg} 34 34)`}
            />
          ))}
          <circle cx="34" cy="34" r="7" fill="#FFD700" />
          <circle cx="34" cy="34" r="4" fill="#FFA500" />
          <circle cx="34" cy="34" r="2" fill="#FF6B00" />
        </svg>
      </div>

      {/* e) Canto BL — concha do mar saindo para fora da moldura ─────────────── */}
      <div
        className="absolute pointer-events-none select-none"
        style={{ bottom: -20, left: -24, zIndex: 10, transform: 'rotate(-10deg)' }}
      >
        <svg width="52" height="56" viewBox="0 0 52 56" fill="none">
          <path
            d="M26,52 Q6,46 3,30 Q0,14 15,6 Q30,0 42,12 Q52,24 47,38 Q42,50 30,52 Q22,53 17,46 Q12,39 16,30 Q20,22 27,23 Q34,24 35,32 Q36,39 29,41 Z"
            fill="#D4A373" stroke="#A07850" strokeWidth="1.5"
          />
          <path d="M26,48 Q10,42 8,28 Q6,16 18,10"  stroke="#A07850" strokeWidth="1"   fill="none" opacity="0.5" />
          <path d="M26,44 Q14,39 13,28 Q12,19 22,15" stroke="#A07850" strokeWidth="0.8" fill="none" opacity="0.4" />
        </svg>
      </div>

      {/* e) Canto BR — duas folhinhas saindo para fora da moldura ─────────────── */}
      <div
        className="absolute pointer-events-none select-none"
        style={{ bottom: -16, right: -20, zIndex: 10, transform: 'rotate(15deg)' }}
      >
        <svg width="58" height="52" viewBox="0 0 58 52" fill="none">
          <path d="M5,42 Q8,10 32,4 Q26,26 5,42 Z"         fill="#5CB85C" />
          <path d="M5,42 Q18,18 32,4"                       stroke="#3A8A3A" strokeWidth="1.2" fill="none" />
          <path d="M18,48 Q28,18 52,12 Q44,34 18,48 Z"      fill="#4CAE4C" />
          <path d="M18,48 Q36,26 52,12"                     stroke="#3A8A3A" strokeWidth="1.2" fill="none" />
        </svg>
      </div>

      {/* Área de conteúdo — padding generoso, acima dos nós de madeira */}
      <div className={compact ? 'relative p-3 md:p-4' : 'relative p-8 md:p-10'} style={{ zIndex: 1 }}>
        {children}
      </div>
    </div>
  );
};

export default WoodenPanel;
