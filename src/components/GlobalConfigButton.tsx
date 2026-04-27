import { useState } from "react";
import { ConfiguracoesModal } from "@/components/ConfiguracoesModal";
import { COLORS } from "@/lib/tokens";

export const GlobalConfigButton = () => {
  const [showConfig, setShowConfig] = useState(false);

  return (
    <>
      <button
        aria-label="Configurações"
        onClick={() => setShowConfig(true)}
        style={{
          position: 'fixed',
          top: '12px',
          right: '12px',
          zIndex: 40,
          width: 50,
          height: 50,
          borderRadius: '50%',
          border: `2px solid ${COLORS.madeiraMedia}`,
          background: `linear-gradient(145deg, ${COLORS.madeiraClara} 0%, ${COLORS.madeiraEscura} 100%)`,
          boxShadow: '0 4px 12px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.2)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '22px',
          transition: 'transform 150ms ease, box-shadow 150ms ease',
          padding: 0,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.08)';
          e.currentTarget.style.boxShadow = '0 6px 18px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.2)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.2)';
        }}
        onMouseDown={(e) => { e.currentTarget.style.transform = 'scale(0.95)'; }}
        onMouseUp={(e)   => { e.currentTarget.style.transform = 'scale(1.08)'; }}
      >
        ⚙️
      </button>
      <ConfiguracoesModal isOpen={showConfig} onClose={() => setShowConfig(false)} />
    </>
  );
};

export default GlobalConfigButton;
