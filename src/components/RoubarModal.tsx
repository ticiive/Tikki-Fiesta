import { useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogClose } from "@/components/ui/dialog";
import type { Player } from "@/types/game";
import { COLORS, WOOD_BG, WOOD_INSET_MAIN } from "@/lib/tokens";
import { CharacterAvatar } from "@/components/CharacterAvatar";

interface RoubarModalProps {
  isOpen: boolean;
  onClose: () => void;
  attacker: Player;
  targets: Player[];
  onSteal: (targetId: string, action: 'cocos' | 'tikki') => void;
}

export const RoubarModal = ({ isOpen, onClose, attacker, targets, onSteal }: RoubarModalProps) => {
  const [selectedTarget, setSelectedTarget] = useState<Player | null>(null);

  const handleAction = (action: 'cocos' | 'tikki') => {
    if (!selectedTarget) return;
    onSteal(selectedTarget.id, action);
    setSelectedTarget(null);
    onClose();
  };

  const handleClose = () => {
    setSelectedTarget(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) handleClose(); }}>
      <DialogContent
        className="max-w-sm w-[92vw] p-0 border-0 bg-transparent shadow-none overflow-visible [&>button]:hidden"
        style={{ borderRadius: '28px 36px 24px 40px' }}
      >
        <div
          style={{
            borderRadius: '28px 36px 24px 40px',
            border: `10px solid ${COLORS.madeiraEscura}`,
            background: WOOD_BG,
            boxShadow: `${WOOD_INSET_MAIN}, 0 12px 0 rgba(45,27,13,0.8), 0 16px 30px rgba(45,27,13,0.4)`,
            padding: '1.5rem 1.25rem 1.25rem',
            position: 'relative',
          }}
        >
          {/* Botão X customizado — idêntico ao ConfiguracoesModal */}
          <DialogClose asChild>
            <button
              aria-label="Fechar"
              onClick={handleClose}
              style={{
                position: 'absolute',
                top: 12,
                right: 12,
                width: 34,
                height: 34,
                borderRadius: '50%',
                background: COLORS.areia,
                border: `2px solid ${COLORS.madeiraEscura}`,
                color: COLORS.marromProfundo,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '14px',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'transform 150ms ease, background 150ms ease',
                zIndex: 10,
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.1)'; e.currentTarget.style.background = COLORS.areiaEscura; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.background = COLORS.areia; }}
              onMouseDown={(e) => { e.currentTarget.style.transform = 'scale(0.93)'; }}
              onMouseUp={(e) => { e.currentTarget.style.transform = 'scale(1.1)'; }}
            >
              ✕
            </button>
          </DialogClose>

          <DialogTitle
            className="text-center mb-5"
            style={{
              fontFamily: 'Fredoka, sans-serif',
              fontWeight: 700,
              fontSize: 'clamp(1.3rem, 4vw, 1.75rem)',
              color: COLORS.marromProfundo,
            }}
          >
            🏴 Roubar de quem?
          </DialogTitle>

          <div className="flex flex-col gap-3">
            {!selectedTarget ? (
              <>
                {targets.map((target) => (
                  <button
                    key={target.id}
                    onClick={() => setSelectedTarget(target)}
                    className="rounded-xl px-4 py-3 flex items-center gap-3 text-left w-full transition-all hover:scale-[1.02] active:scale-[0.98]"
                    style={{
                      background: 'rgba(244,228,193,0.55)',
                      border: `2px solid ${target.color}`,
                      boxShadow: `0 0 8px ${target.color}44`,
                      cursor: 'pointer',
                    }}
                  >
                    <CharacterAvatar player={target} size={48} className="shrink-0" />
                    <div className="flex flex-col items-start min-w-0 flex-1">
                      <span style={{ fontFamily: 'Fredoka, sans-serif', fontWeight: 700, color: COLORS.marromProfundo, fontSize: '1.05rem' }}>
                        {target.label}
                      </span>
                      <span style={{ fontFamily: 'Quicksand, sans-serif', fontSize: '0.78rem', color: COLORS.marromProfundo, opacity: 0.65 }}>
                        🥥 {target.coins} · <img src={`${import.meta.env.BASE_URL}img/tikkimask.png`} alt="" className="inline-block w-3.5 h-3.5 object-contain" style={{ verticalAlign: 'middle' }} /> {target.stars}
                      </span>
                    </div>
                    <span style={{ fontSize: '1.2rem', color: COLORS.marromProfundo, opacity: 0.4 }}>›</span>
                  </button>
                ))}
              </>
            ) : (
              <>
                {/* Header do alvo selecionado */}
                <div
                  className="rounded-xl px-4 py-2 flex items-center gap-3"
                  style={{
                    background: 'rgba(244,228,193,0.55)',
                    border: `2px solid ${selectedTarget.color}`,
                  }}
                >
                  <CharacterAvatar player={selectedTarget} size={36} className="shrink-0" />
                  <span style={{ fontFamily: 'Fredoka, sans-serif', fontWeight: 700, color: COLORS.marromProfundo, flex: 1 }}>
                    {selectedTarget.label}
                  </span>
                  <span style={{ fontFamily: 'Quicksand, sans-serif', fontSize: '0.78rem', color: COLORS.marromProfundo, opacity: 0.65 }}>
                    🥥 {selectedTarget.coins} · <img src={`${import.meta.env.BASE_URL}img/tikkimask.png`} alt="" className="inline-block w-3.5 h-3.5 object-contain" style={{ verticalAlign: 'middle' }} /> {selectedTarget.stars}
                  </span>
                </div>

                {/* Roubar Cocos — sempre habilitado */}
                <button
                  onClick={() => handleAction('cocos')}
                  className="rounded-xl px-4 py-3 font-bold text-white w-full transition-all hover:scale-[1.02] active:scale-[0.98]"
                  style={{
                    fontFamily: 'Fredoka, sans-serif',
                    fontSize: '1rem',
                    background: COLORS.coral,
                    border: `2px solid ${COLORS.madeiraEscura}`,
                    boxShadow: '0 3px 0 #3D2010',
                    cursor: 'pointer',
                  }}
                >
                  🥥 Roubar Cocos
                </button>

                {/* Roubar Tikki — disabled se atacante < 35 cocos OU vítima sem tikkis */}
                <button
                  onClick={() => handleAction('tikki')}
                  disabled={attacker.coins < 35 || selectedTarget.stars === 0}
                  className="rounded-xl px-4 py-3 font-bold text-white w-full transition-all"
                  style={{
                    fontFamily: 'Fredoka, sans-serif',
                    fontSize: '1rem',
                    background: COLORS.turquoise,
                    border: `2px solid ${COLORS.madeiraEscura}`,
                    boxShadow: (attacker.coins < 35 || selectedTarget.stars === 0) ? 'none' : '0 3px 0 #3D2010',
                    opacity: (attacker.coins < 35 || selectedTarget.stars === 0) ? 0.4 : 1,
                    cursor: (attacker.coins < 35 || selectedTarget.stars === 0) ? 'not-allowed' : 'pointer',
                  }}
                >
                  <img src={`${import.meta.env.BASE_URL}img/tikkimask.png`} alt="" className="inline-block w-5 h-5 object-contain" style={{ verticalAlign: 'middle' }} /> Roubar Tikki (-35 🥥)
                  {attacker.coins < 35 && (
                    <span style={{ fontSize: '0.72rem', display: 'block', fontWeight: 500, opacity: 0.9 }}>
                      Cocos insuficientes
                    </span>
                  )}
                  {attacker.coins >= 35 && selectedTarget.stars === 0 && (
                    <span style={{ fontSize: '0.72rem', display: 'block', fontWeight: 500, opacity: 0.9 }}>
                      Vítima sem tikkis
                    </span>
                  )}
                </button>

                <button
                  onClick={() => setSelectedTarget(null)}
                  className="rounded-xl px-4 py-2 text-sm w-full transition-all hover:scale-[1.02] active:scale-[0.98]"
                  style={{
                    fontFamily: 'Quicksand, sans-serif',
                    fontWeight: 600,
                    background: 'rgba(244,228,193,0.55)',
                    border: `1.5px solid ${COLORS.madeiraEscura}`,
                    color: COLORS.marromProfundo,
                    cursor: 'pointer',
                  }}
                >
                  ← Voltar
                </button>
              </>
            )}

            <button
              onClick={handleClose}
              className="rounded-xl px-4 py-2 text-sm w-full transition-all hover:scale-[1.02] active:scale-[0.98]"
              style={{
                fontFamily: 'Quicksand, sans-serif',
                fontWeight: 600,
                background: 'rgba(244,228,193,0.3)',
                border: `1.5px solid ${COLORS.madeiraEscura}`,
                color: COLORS.marromProfundo,
                cursor: 'pointer',
              }}
            >
              Cancelar
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RoubarModal;
