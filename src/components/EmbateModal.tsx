import { useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogClose } from "@/components/ui/dialog";
import type { Player } from "@/types/game";
import { COLORS, WOOD_BG, WOOD_INSET_MAIN } from "@/lib/tokens";
import { CharacterAvatar } from "@/components/CharacterAvatar";

interface EmbateModalProps {
  isOpen: boolean;
  onClose: () => void;
  challenger: Player;
  targets: Player[];
  onConfirm: (opponentId: string, betAmount: number) => void;
}

const closeButtonStyle: React.CSSProperties = {
  position: 'absolute', top: 12, right: 12,
  width: 34, height: 34, borderRadius: '50%',
  background: COLORS.areia, border: `2px solid ${COLORS.madeiraEscura}`,
  color: COLORS.marromProfundo, display: 'flex', alignItems: 'center',
  justifyContent: 'center', fontSize: '14px', fontWeight: 700,
  cursor: 'pointer', transition: 'transform 150ms ease, background 150ms ease', zIndex: 10,
};

export const EmbateModal = ({ isOpen, onClose, challenger, targets, onConfirm }: EmbateModalProps) => {
  const [phase, setPhase] = useState<'select' | 'bet'>('select');
  const [selectedTarget, setSelectedTarget] = useState<Player | null>(null);
  const [betAmount, setBetAmount] = useState(1);

  const maxBet = selectedTarget ? Math.min(challenger.coins, selectedTarget.coins) : 0;

  const handleSelectTarget = (target: Player) => {
    const max = Math.min(challenger.coins, target.coins);
    setSelectedTarget(target);
    setBetAmount(Math.max(1, Math.min(1, max)));
    setPhase('bet');
  };

  const handleConfirm = () => {
    if (!selectedTarget || maxBet < 1) return;
    onConfirm(selectedTarget.id, betAmount);
    handleClose();
  };

  const handleClose = () => {
    setPhase('select');
    setSelectedTarget(null);
    setBetAmount(1);
    onClose();
  };

  const titleStyle: React.CSSProperties = {
    fontFamily: 'Fredoka, sans-serif', fontWeight: 700,
    fontSize: 'clamp(1.1rem, 4vw, 1.5rem)', color: COLORS.marromProfundo,
  };

  const cancelBtnStyle: React.CSSProperties = {
    fontFamily: 'Quicksand, sans-serif', fontWeight: 600,
    background: 'rgba(244,228,193,0.3)', border: `1.5px solid ${COLORS.madeiraEscura}`,
    color: COLORS.marromProfundo, cursor: 'pointer',
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
          <DialogClose asChild>
            <button
              aria-label="Fechar"
              onClick={handleClose}
              style={closeButtonStyle}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.1)'; e.currentTarget.style.background = COLORS.areiaEscura; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.background = COLORS.areia; }}
              onMouseDown={(e) => { e.currentTarget.style.transform = 'scale(0.93)'; }}
              onMouseUp={(e) => { e.currentTarget.style.transform = 'scale(1.1)'; }}
            >✕</button>
          </DialogClose>

          {phase === 'select' && (
            <>
              <DialogTitle className="text-center mb-5" style={titleStyle}>
                ⚔️ Quem você vai chamar?
              </DialogTitle>
              <div className="flex flex-col gap-3">
                {targets.map((target) => (
                  <button
                    key={target.id}
                    onClick={() => handleSelectTarget(target)}
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
                      <span style={{ fontFamily: 'Quicksand, sans-serif', fontSize: '0.75rem', color: COLORS.marromProfundo, opacity: 0.65 }}>
                        <img src={`${import.meta.env.BASE_URL}img/coco.png`} alt="" className="inline-block" style={{ height: '1rem', width: 'auto', verticalAlign: 'middle' }} /> {target.coins} · Aposta máx: {Math.min(challenger.coins, target.coins)}
                      </span>
                    </div>
                    <span style={{ fontSize: '1.2rem', color: COLORS.marromProfundo, opacity: 0.4 }}>›</span>
                  </button>
                ))}
                <button
                  onClick={handleClose}
                  className="rounded-xl px-4 py-2 text-sm w-full transition-all hover:scale-[1.02] active:scale-[0.98]"
                  style={cancelBtnStyle}
                >Cancelar</button>
              </div>
            </>
          )}

          {phase === 'bet' && selectedTarget && (
            <>
              <DialogTitle className="text-center mb-4" style={titleStyle}>
                ⚔️ Quantos cocos apostar?
              </DialogTitle>
              <div className="flex flex-col gap-3">
                {/* Selected target info */}
                <div
                  className="rounded-xl px-4 py-2 flex items-center gap-3"
                  style={{ background: 'rgba(244,228,193,0.55)', border: `2px solid ${selectedTarget.color}` }}
                >
                  <CharacterAvatar player={selectedTarget} size={36} className="shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div style={{ fontFamily: 'Fredoka, sans-serif', fontWeight: 700, color: COLORS.marromProfundo, fontSize: '1rem' }}>
                      vs {selectedTarget.label}
                    </div>
                    <div style={{ fontFamily: 'Quicksand, sans-serif', fontSize: '0.72rem', color: COLORS.marromProfundo, opacity: 0.7 }}>
                      Você: {challenger.coins} · Adversário: {selectedTarget.coins} · Máx: {maxBet}
                    </div>
                  </div>
                </div>

                {maxBet < 1 ? (
                  <p style={{ fontFamily: 'Quicksand, sans-serif', fontSize: '0.88rem', color: COLORS.marromProfundo, textAlign: 'center', opacity: 0.8 }}>
                    ⚠️ Um dos jogadores tem 0 cocos. Embate impossível.
                  </p>
                ) : (
                  <div className="flex items-center justify-center gap-4 py-1">
                    <button
                      onClick={() => setBetAmount(b => Math.max(1, b - 1))}
                      disabled={betAmount <= 1}
                      className="w-11 h-11 rounded-full flex items-center justify-center font-black text-xl text-white transition-all active:scale-90"
                      style={{ background: betAmount <= 1 ? '#aaa' : COLORS.turquoise, border: `2px solid ${COLORS.madeiraEscura}`, cursor: betAmount <= 1 ? 'not-allowed' : 'pointer' }}
                    >−</button>
                    <div className="flex items-center gap-1">
                      <span style={{ fontFamily: 'Fredoka, sans-serif', fontWeight: 700, fontSize: '2.2rem', color: COLORS.marromProfundo, minWidth: '2rem', textAlign: 'center' }}>
                        {betAmount}
                      </span>
                      <img src={`${import.meta.env.BASE_URL}img/coco.png`} alt="" style={{ height: '2rem', width: 'auto' }} />
                    </div>
                    <button
                      onClick={() => setBetAmount(b => Math.min(maxBet, b + 1))}
                      disabled={betAmount >= maxBet}
                      className="w-11 h-11 rounded-full flex items-center justify-center font-black text-xl text-white transition-all active:scale-90"
                      style={{ background: betAmount >= maxBet ? '#aaa' : COLORS.coral, border: `2px solid ${COLORS.madeiraEscura}`, cursor: betAmount >= maxBet ? 'not-allowed' : 'pointer' }}
                    >+</button>
                  </div>
                )}

                <button
                  onClick={handleConfirm}
                  disabled={maxBet < 1}
                  className="rounded-xl px-4 py-3 font-bold text-white w-full transition-all hover:scale-[1.02] active:scale-[0.98]"
                  style={{
                    fontFamily: 'Fredoka, sans-serif', fontSize: '1.05rem',
                    background: maxBet < 1 ? '#999' : COLORS.coral,
                    border: `2px solid ${COLORS.madeiraEscura}`,
                    boxShadow: maxBet < 1 ? 'none' : '0 3px 0 #3D2010',
                    cursor: maxBet < 1 ? 'not-allowed' : 'pointer',
                    opacity: maxBet < 1 ? 0.5 : 1,
                  }}
                >
                  ⚔️ Confirmar Embate!
                </button>
                <button
                  onClick={() => setPhase('select')}
                  className="rounded-xl px-4 py-2 text-sm w-full transition-all hover:scale-[1.02] active:scale-[0.98]"
                  style={{ fontFamily: 'Quicksand, sans-serif', fontWeight: 600, background: 'rgba(244,228,193,0.55)', border: `1.5px solid ${COLORS.madeiraEscura}`, color: COLORS.marromProfundo, cursor: 'pointer' }}
                >← Voltar</button>
                <button
                  onClick={handleClose}
                  className="rounded-xl px-4 py-2 text-sm w-full transition-all hover:scale-[1.02] active:scale-[0.98]"
                  style={cancelBtnStyle}
                >Cancelar</button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EmbateModal;
