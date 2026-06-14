import { useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogClose } from "@/components/ui/dialog";
import type { Player } from "@/types/game";
import { COLORS, WOOD_BG, WOOD_INSET_MAIN } from "@/lib/tokens";
import { CharacterAvatar } from "@/components/CharacterAvatar";

export type SurpresaEffect =
  | { type: 'gain_coins'; amount: number }
  | { type: 'gain_item'; item: string }
  | { type: 'steal'; targetId: string; amount: number }
  | { type: 'lose_coins'; amount: number }
  | { type: 'lucky' };

interface SurpresaModalProps {
  isOpen: boolean;
  onClose: () => void;
  activePlayer: Player;
  otherPlayers: Player[];
  onEffect: (effect: SurpresaEffect) => void;
}

const ITEMS = [
  'Banana 🍌',
  'Vitamina de Banana 🥤',
  'Corneta do Mercador 📯',
  'Bola de Cristal 🔮',
  'Casca de Banana 🍌',
  'Tubarão no Balde 🦈',
  'Sereia na Garrafa 🧜‍♀️',
  'Concha do Tridente 🐚',
];

type Phase = 'choice' | 'mystery_reveal' | 'steal_target';

type MysteryResult =
  | { kind: 'gain_coins'; amount: number }
  | { kind: 'gain_item'; item: string }
  | { kind: 'steal' }
  | { kind: 'lucky' }
  | { kind: 'azar' };

function rollMystery(): MysteryResult {
  const roll = Math.floor(Math.random() * 6);
  switch (roll) {
    case 0: return { kind: 'gain_coins', amount: 5 };
    case 1: return { kind: 'gain_coins', amount: 7 };
    case 2: return { kind: 'gain_coins', amount: 2 };
    case 3: return { kind: 'gain_item', item: ITEMS[Math.floor(Math.random() * ITEMS.length)] };
    case 4: return { kind: 'steal' };
    default: return Math.random() < 0.5 ? { kind: 'lucky' } : { kind: 'azar' };
  }
}

const closeButtonStyle = {
  position: 'absolute' as const, top: 12, right: 12,
  width: 34, height: 34, borderRadius: '50%',
  background: COLORS.areia, border: `2px solid ${COLORS.madeiraEscura}`,
  color: COLORS.marromProfundo, display: 'flex', alignItems: 'center',
  justifyContent: 'center', fontSize: '14px', fontWeight: 700,
  cursor: 'pointer', transition: 'transform 150ms ease, background 150ms ease', zIndex: 10,
};

function getMysteryDisplay(result: MysteryResult) {
  switch (result.kind) {
    case 'gain_coins':
      return {
        emoji: '🥥',
        title: `+${result.amount} Cocos!`,
        desc: `Você ganhou ${result.amount} cocos!`,
        color: COLORS.turquoise,
      };
    case 'gain_item':
      return {
        emoji: '📦',
        title: 'Item Especial!',
        desc: `Você ganhou: ${result.item}`,
        color: COLORS.ouro,
      };
    case 'steal':
      return {
        emoji: '🏴‍☠️',
        title: 'Roubar 4 Cocos!',
        desc: 'Escolha quem você vai roubar!',
        color: COLORS.coral,
      };
    case 'lucky':
      return {
        emoji: '🍀',
        title: 'SORTE!',
        desc: 'Role os dados novamente!',
        color: '#2D7A4B',
      };
    case 'azar':
      return {
        emoji: '💀',
        title: 'AZAR!',
        desc: 'Perdeu 5 cocos!',
        color: COLORS.alerta,
      };
  }
}

export const SurpresaModal = ({ isOpen, onClose, activePlayer, otherPlayers, onEffect }: SurpresaModalProps) => {
  const [phase, setPhase] = useState<Phase>('choice');
  const [mysteryResult, setMysteryResult] = useState<MysteryResult | null>(null);

  const handleClose = () => {
    setPhase('choice');
    setMysteryResult(null);
    onClose();
  };

  const handleThreeCocos = () => {
    onEffect({ type: 'gain_coins', amount: 3 });
    handleClose();
  };

  const handleMystery = () => {
    const result = rollMystery();
    // If steal but no targets, reroll as +3 coins
    if (result.kind === 'steal' && otherPlayers.length === 0) {
      setMysteryResult({ kind: 'gain_coins', amount: 3 });
    } else {
      setMysteryResult(result);
    }
    setPhase('mystery_reveal');
  };

  const handleConfirmResult = () => {
    if (!mysteryResult) return;
    switch (mysteryResult.kind) {
      case 'gain_coins':
        onEffect({ type: 'gain_coins', amount: mysteryResult.amount });
        break;
      case 'gain_item':
        onEffect({ type: 'gain_item', item: mysteryResult.item });
        break;
      case 'steal':
        setPhase('steal_target');
        return;
      case 'lucky':
        onEffect({ type: 'lucky' });
        break;
      case 'azar':
        onEffect({ type: 'lose_coins', amount: 5 });
        break;
    }
    handleClose();
  };

  const handleStealTarget = (targetId: string) => {
    onEffect({ type: 'steal', targetId, amount: 4 });
    handleClose();
  };

  const titleStyle = {
    fontFamily: 'Fredoka, sans-serif', fontWeight: 700,
    fontSize: 'clamp(1.1rem, 4vw, 1.5rem)', color: COLORS.marromProfundo,
  };

  const cancelBtnStyle = {
    fontFamily: 'Quicksand, sans-serif', fontWeight: 600,
    background: 'rgba(244,228,193,0.3)', border: `1.5px solid ${COLORS.madeiraEscura}`,
    color: COLORS.marromProfundo, cursor: 'pointer',
  };

  const display = mysteryResult ? getMysteryDisplay(mysteryResult) : null;

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

          {/* Phase: choice */}
          {phase === 'choice' && (
            <>
              <DialogTitle className="text-center mb-5" style={titleStyle}>
                🎁 Casa Surpresa!
              </DialogTitle>
              <div
                className="flex items-center justify-center gap-3 rounded-xl px-3 py-2 mb-4"
                style={{ background: 'rgba(244,228,193,0.55)', border: `2px solid ${activePlayer.color}` }}
              >
                <CharacterAvatar player={activePlayer} size={36} className="shrink-0" />
                <span style={{ fontFamily: 'Fredoka, sans-serif', fontWeight: 700, color: COLORS.marromProfundo }}>
                  {activePlayer.label}
                </span>
              </div>
              <div className="flex flex-col gap-2">
                {/* Botão menor: 3 Cocos */}
                <button
                  onClick={handleThreeCocos}
                  className="rounded-xl px-4 py-2.5 font-bold text-white w-full transition-all hover:scale-[1.02] active:scale-[0.98]"
                  style={{
                    fontFamily: 'Fredoka, sans-serif', fontSize: '1rem',
                    background: COLORS.turquoise,
                    border: `2px solid ${COLORS.madeiraEscura}`,
                    boxShadow: '0 3px 0 #3D2010', cursor: 'pointer',
                  }}
                >
                  🥥 3 Cocos
                </button>

                {/* Separador */}
                <div className="flex items-center gap-2 my-0.5">
                  <div className="flex-1 h-px" style={{ background: `${COLORS.madeiraMedia}55` }} />
                  <span style={{ fontFamily: 'Fredoka, sans-serif', fontSize: '0.85rem', color: COLORS.madeiraMedia, opacity: 0.8 }}>
                    — ou —
                  </span>
                  <div className="flex-1 h-px" style={{ background: `${COLORS.madeiraMedia}55` }} />
                </div>

                {/* Botão maior: Surpresa Misteriosa */}
                <button
                  onClick={handleMystery}
                  className="rounded-xl px-4 py-5 font-bold text-white w-full transition-all hover:scale-[1.02] active:scale-[0.98]"
                  style={{
                    fontFamily: 'Fredoka, sans-serif', fontSize: '1.25rem',
                    background: COLORS.coral,
                    border: `2px solid ${COLORS.madeiraEscura}`,
                    boxShadow: '0 4px 0 #3D2010', cursor: 'pointer',
                    letterSpacing: '0.02em',
                  }}
                >
                  🎲 Surpresa Misteriosa
                </button>

                <button
                  onClick={handleClose}
                  className="rounded-xl px-4 py-2 text-sm w-full transition-all hover:scale-[1.02] active:scale-[0.98] mt-1"
                  style={cancelBtnStyle}
                >Cancelar</button>
              </div>
            </>
          )}

          {/* Phase: mystery_reveal */}
          {phase === 'mystery_reveal' && display && (
            <>
              <DialogTitle className="text-center mb-4" style={titleStyle}>
                🎲 Surpresa Misteriosa!
              </DialogTitle>
              <div className="flex flex-col items-center gap-3 mb-4">
                <div
                  className="rounded-2xl px-6 py-5 flex flex-col items-center gap-2 w-full"
                  style={{ background: `${display.color}22`, border: `3px solid ${display.color}` }}
                >
                  <span style={{ fontSize: '3rem', lineHeight: 1 }}>{display.emoji}</span>
                  <span style={{
                    fontFamily: 'Fredoka, sans-serif', fontWeight: 700,
                    fontSize: '1.4rem', color: display.color,
                    textShadow: '0 1px 2px rgba(0,0,0,0.2)',
                  }}>
                    {display.title}
                  </span>
                  <span style={{
                    fontFamily: 'Quicksand, sans-serif', fontSize: '0.9rem',
                    color: COLORS.marromProfundo, textAlign: 'center', opacity: 0.85,
                  }}>
                    {display.desc}
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <button
                  onClick={handleConfirmResult}
                  className="rounded-xl px-4 py-3 font-bold text-white w-full transition-all hover:scale-[1.02] active:scale-[0.98]"
                  style={{
                    fontFamily: 'Fredoka, sans-serif', fontSize: '1.05rem',
                    background: display.color,
                    border: `2px solid ${COLORS.madeiraEscura}`,
                    boxShadow: '0 3px 0 #3D2010', cursor: 'pointer',
                  }}
                >
                  {mysteryResult?.kind === 'steal' ? '🏴‍☠️ Escolher Alvo' : '✅ Entendido!'}
                </button>
              </div>
            </>
          )}

          {/* Phase: steal_target */}
          {phase === 'steal_target' && (
            <>
              <DialogTitle className="text-center mb-5" style={titleStyle}>
                🏴‍☠️ Quem roubar?
              </DialogTitle>
              <div className="flex flex-col gap-3">
                {otherPlayers.map((target) => (
                  <button
                    key={target.id}
                    onClick={() => handleStealTarget(target.id)}
                    className="rounded-xl px-4 py-3 flex items-center gap-3 text-left w-full transition-all hover:scale-[1.02] active:scale-[0.98]"
                    style={{
                      background: 'rgba(244,228,193,0.55)',
                      border: `2px solid ${target.color}`,
                      boxShadow: `0 0 8px ${target.color}44`,
                      cursor: 'pointer',
                    }}
                  >
                    <CharacterAvatar player={target} size={40} className="shrink-0" />
                    <div className="flex flex-col items-start min-w-0 flex-1">
                      <span style={{ fontFamily: 'Fredoka, sans-serif', fontWeight: 700, color: COLORS.marromProfundo, fontSize: '1.05rem' }}>
                        {target.label}
                      </span>
                      <span style={{ fontFamily: 'Quicksand, sans-serif', fontSize: '0.75rem', color: COLORS.marromProfundo, opacity: 0.65 }}>
                        Rouba {Math.min(4, target.coins)} de {target.coins} 🥥
                      </span>
                    </div>
                    <span style={{ fontSize: '1.2rem', color: COLORS.marromProfundo, opacity: 0.4 }}>›</span>
                  </button>
                ))}
                <button
                  onClick={() => setPhase('mystery_reveal')}
                  className="rounded-xl px-4 py-2 text-sm w-full transition-all hover:scale-[1.02] active:scale-[0.98]"
                  style={{ fontFamily: 'Quicksand, sans-serif', fontWeight: 600, background: 'rgba(244,228,193,0.55)', border: `1.5px solid ${COLORS.madeiraEscura}`, color: COLORS.marromProfundo, cursor: 'pointer' }}
                >← Voltar</button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SurpresaModal;
