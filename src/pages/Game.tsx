import { useState, useEffect, useRef } from "react";
import type { ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "sonner";
import type { Player } from "@/types/game";
import { CHARACTER_MAP } from "@/data/characters";
import { TropicalBackground } from "@/components/layout/TropicalBackground";
import { WoodenPanel } from "@/components/layout/WoodenPanel";
import { WoodenCard } from "@/components/ui/WoodenCard";
import { COLORS } from "@/lib/tokens";
import { RoubarModal } from "@/components/RoubarModal";
import { EmbateModal } from "@/components/EmbateModal";
import { SurpresaModal } from "@/components/SurpresaModal";
import type { SurpresaEffect } from "@/components/SurpresaModal";
import { CharacterAvatar } from "@/components/CharacterAvatar";


// ── Contador em grid de 6 colunas fixas ─────────────────────────────────────
// col1=-3  col2=icon  col3=-  col4=número(1fr)  col5=+  col6=+3
// Células vazias preservam o alinhamento entre linha do coco e linha do tikki.
const Counter = ({
  icon,
  value,
  onAdd,
  onRemove,
  onRemoveBig,
  onAddBig,
  hideRemove,
  disabledAdd,
}: {
  icon: ReactNode;
  value: number;
  onAdd: () => void;
  onRemove: () => void;
  onRemoveBig?: () => void;
  onAddBig?: () => void;
  hideRemove?: boolean;
  disabledAdd?: boolean;
}) => (
  <div
    className="grid grid-cols-[40px_auto_40px_1fr_40px_40px] items-center gap-1.5 rounded-xl px-2 py-2 short:py-0.5 w-full"
    style={{
      border: '1.5px solid #5D3A1A',
      background: `
        linear-gradient(90deg, transparent 0%, rgba(212,168,106,0.08) 50%, transparent 100%),
        repeating-linear-gradient(
          90deg,
          transparent 0px,
          transparent 8px,
          rgba(180,130,70,0.06) 8px,
          rgba(180,130,70,0.06) 9px
        ),
        linear-gradient(180deg, #F8E9C9 0%, #F0DAB5 50%, #F4E4C1 100%)
      `,
      boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.6), inset 0 -1px 2px rgba(120,80,40,0.1)',
    }}
  >
    {/* col1: -3 */}
    {onRemoveBig
      ? <button onClick={onRemoveBig} className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm text-white transition-transform active:scale-90" style={{ background: COLORS.alerta, border: '2px solid #5D3A1A', fontFamily: 'Fredoka, sans-serif' }}>−3</button>
      : <div />
    }
    {/* col2: ícone */}
    <span className="leading-none justify-self-center">{icon}</span>
    {/* col3: − */}
    {!hideRemove
      ? <button onClick={onRemove} className="w-10 h-10 rounded-full flex items-center justify-center font-black text-lg text-white transition-transform active:scale-90" style={{ background: COLORS.turquoise, border: '2px solid #5D3A1A', fontFamily: 'Fredoka, sans-serif' }}>−</button>
      : <div />
    }
    {/* col4: número */}
    <span
      className="text-center text-2xl short:text-xl font-bold"
      style={{ fontFamily: 'Fredoka, sans-serif', color: COLORS.madeiraEscura, textShadow: '0 1px 0 rgba(255,255,255,0.5)' }}
    >
      {value}
    </span>
    {/* col5: + */}
    <button
      onClick={onAdd}
      disabled={disabledAdd}
      className="w-10 h-10 rounded-full flex items-center justify-center font-black text-lg transition-transform active:scale-90"
      style={{
        background: disabledAdd ? '#999' : COLORS.coral,
        border: '2px solid #5D3A1A',
        color: '#ffffff',
        fontFamily: 'Fredoka, sans-serif',
        cursor: disabledAdd ? 'not-allowed' : 'pointer',
        opacity: disabledAdd ? 0.5 : 1,
      }}
    >+</button>
    {/* col6: +3 */}
    {onAddBig
      ? <button onClick={onAddBig} className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm text-white transition-transform active:scale-90" style={{ background: COLORS.verde, border: '2px solid #5D3A1A', fontFamily: 'Fredoka, sans-serif' }}>+3</button>
      : <div />
    }
  </div>
);

const STORAGE_KEY = 'tikki-fiesta-game-state';

const loadSavedState = () => {
  try {
    const s = localStorage.getItem(STORAGE_KEY);
    const parsed = s ? JSON.parse(s) : null;
    console.log('[GAME] loadSavedState:', parsed ? `encontrou estado (${(parsed.players || []).length} jogadores, round ${parsed.currentRound})` : 'nada no localStorage');
    return parsed;
  } catch { return null; }
};

const clearSavedState = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem('tikki-fiesta-route');
  } catch {}
};

const Game = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // location.state (navegação normal) tem prioridade; fallback para localStorage ao recarregar
  const effectiveState = (location.state ?? loadSavedState()) as {
    players: (string | Player)[];
    totalRounds: number;
    currentRound?: number;
    playedMinigames?: string[];
    startingPlayerId?: string;
  } | null;

  const {
    players: incoming = [],
    totalRounds = 3,
    currentRound: initialRound = 1,
    playedMinigames: incomingPlayed = [],
    startingPlayerId: savedStartingPlayerId,
  } = effectiveState ?? {};

  const [playerOrder, setPlayerOrder] = useState<Player[]>(() =>
    (incoming as any[]).map((p) =>
      typeof p === 'string'
        ? { id: p, label: CHARACTER_MAP[p]?.label ?? p, avatar: CHARACTER_MAP[p]?.avatar ?? '🎮', image: CHARACTER_MAP[p]?.image, color: CHARACTER_MAP[p]?.color ?? COLORS.coral, coins: 10, stars: 0, trophies: 0 }
        : p as Player
    )
  );

  const [currentRound, setCurrentRound] = useState(initialRound ?? 1);
  const startingPlayerId = useRef(
    savedStartingPlayerId ??
    (incoming.length > 0
      ? (typeof incoming[0] === 'string' ? incoming[0] : (incoming[0] as Player).id)
      : '')
  );
  const [hasStolenThisTurn, setHasStolenThisTurn] = useState(false);
  const [isRoubarOpen, setIsRoubarOpen] = useState(false);
  const [isEmbateOpen, setIsEmbateOpen] = useState(false);
  const [isSurpresaOpen, setIsSurpresaOpen] = useState(false);
  const [isBuyTikkiOpen, setIsBuyTikkiOpen] = useState(false);
  const playedMinigames = useRef<string[]>(incomingPlayed);

  const activePlayer = playerOrder[0];
  const inactivePlayers = playerOrder.slice(1);

  const updateActivePlayer = (field: "coins" | "stars", delta: number) => {
    setPlayerOrder((prev) => {
      const updated = [...prev];
      updated[0] = {
        ...updated[0],
        [field]: Math.max(0, updated[0][field] + delta),
      };
      return updated;
    });
  };

  const handleSteal = (targetId: string, action: 'cocos' | 'tikki') => {
    const target = playerOrder.find(p => p.id === targetId);
    if (!target) return;

    if (action === 'cocos') {
      const roll = Math.floor(Math.random() * 19) + 12;
      const stolen = Math.min(roll, target.coins);
      setPlayerOrder(prev => prev.map((p, i) => {
        if (i === 0) return { ...p, coins: p.coins + stolen };
        if (p.id === targetId) return { ...p, coins: Math.max(0, p.coins - stolen) };
        return p;
      }));
      toast.success(`🥥 Roubou ${stolen} cocos de ${target.label}!`);
    } else {
      if (playerOrder[0].coins < 35 || target.stars <= 0) return;
      setPlayerOrder(prev => prev.map((p, i) => {
        if (i === 0) return { ...p, stars: p.stars + 1, coins: Math.max(0, p.coins - 35) };
        if (p.id === targetId) return { ...p, stars: Math.max(0, p.stars - 1) };
        return p;
      }));
      toast.success(`🗿 Roubou 1 tikki de ${target.label}!`);
    }

    setHasStolenThisTurn(true);
  };

  const startEmbate = (opponentId: string, betAmount: number) => {
    navigate("/sorteio", {
      state: {
        players: playerOrder,
        currentRound,
        totalRounds,
        isGameOver: false,
        playedMinigames: playedMinigames.current,
        embateContext: { challengerId: activePlayer.id, opponentId, betAmount },
      },
    });
  };

  const handleSurpresaEffect = (effect: SurpresaEffect) => {
    switch (effect.type) {
      case 'gain_coins':
        updateActivePlayer('coins', effect.amount);
        toast.success(`🎁 +${effect.amount} cocos!`);
        break;
      case 'gain_item':
        toast.success(`🎁 Você ganhou: ${effect.item}!`, { duration: 4000 });
        break;
      case 'steal': {
        const target = playerOrder.find(p => p.id === effect.targetId);
        if (!target) break;
        const stolen = Math.min(effect.amount, target.coins);
        setPlayerOrder(prev => prev.map((p, i) => {
          if (i === 0) return { ...p, coins: p.coins + stolen };
          if (p.id === effect.targetId) return { ...p, coins: Math.max(0, p.coins - stolen) };
          return p;
        }));
        toast.success(`🎁 Surpresa: roubou ${stolen} cocos de ${target.label}!`);
        break;
      }
      case 'lose_coins':
        updateActivePlayer('coins', -effect.amount);
        toast.error(`💀 AZAR! Perdeu ${effect.amount} cocos!`);
        break;
      case 'lucky':
        toast.success(`🍀 SORTE! Role os dados novamente!`, { duration: 4000 });
        break;
    }
  };

  const endTurn = () => {
    setHasStolenThisTurn(false);
    setPlayerOrder((prev) => {
      const rotated = [...prev.slice(1), prev[0]];
      if (rotated[0].id === startingPlayerId.current) {
        const nextRound = currentRound + 1;
        const isGameOver = nextRound > totalRounds;
        if (!isGameOver) {
          setCurrentRound(nextRound);
        }
        setTimeout(() => {
          if (isGameOver) clearSavedState();
          navigate("/sorteio", {
            state: {
              players: rotated,
              currentRound: isGameOver ? currentRound : nextRound,
              totalRounds,
              isGameOver,
              playedMinigames: playedMinigames.current,
            },
          });
        }, 0);
        return rotated;
      }
      return rotated;
    });
  };

  const handleBuyTikki = () => {
    if (activePlayer.coins >= 20) setIsBuyTikkiOpen(true);
  };

  const handleConfirmBuyTikki = () => {
    setPlayerOrder((prev) => {
      const updated = [...prev];
      updated[0] = { ...updated[0], stars: updated[0].stars + 1, coins: Math.max(0, updated[0].coins - 20) };
      return updated;
    });
    setIsBuyTikkiOpen(false);
  };

  // Salva estado a cada mudança de playerOrder ou round
  useEffect(() => {
    if (!effectiveState) return;
    console.log('[GAME] Salvando estado no localStorage — round:', currentRound, '| jogadores:', playerOrder.length);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        players: playerOrder,
        totalRounds,
        currentRound,
        playedMinigames: playedMinigames.current,
        startingPlayerId: startingPlayerId.current,
      }));
    } catch {}
  }, [playerOrder, currentRound]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    console.log('[GAME] Guard: effectiveState =', !!effectiveState, '| location.state =', !!location.state);
    if (!effectiveState) {
      console.log('[GAME] Sem estado — redirecionando para /');
      navigate("/");
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!effectiveState) return null;

  return (
    <div
      key={currentRound}
      className="h-screen p-3 md:p-4 overflow-x-hidden"
      style={{ fontFamily: 'Fredoka, sans-serif', boxSizing: 'border-box', height: '100dvh' }}
    >
      <TropicalBackground />

      <WoodenPanel
        compact
        fillHeight
        className="w-full max-w-7xl mx-auto h-full"
        style={{ maxHeight: '95vh' }}
      >
        <div className="flex flex-col gap-2 short:gap-1 h-full overflow-hidden">

          {/* ── Seção 1: Header ───────────────────────────────────────────── */}
          <div
            className="shrink-0 flex items-center justify-between px-4 py-2 rounded-xl shadow-sm"
            style={{ background: 'rgba(244,228,193,0.85)', backdropFilter: 'blur(4px)', border: '1.5px solid #5D3A1A', paddingRight: '68px' }}
          >
            <span className="font-bold text-base" style={{ color: '#2D1B0D' }}>
              🎲 Rodada {currentRound}/{totalRounds}
            </span>
            <span
              className="font-bold text-sm px-3 py-0.5 rounded-lg"
              style={{ background: 'rgba(45,27,13,0.1)', color: '#2D1B0D' }}
            >
              Vez de: {activePlayer.label}
            </span>
          </div>

          {/* ── Seção 2: Card do jogador ativo ────────────────────────────── */}
          <WoodenCard
            variant="card"
            irregularCorners
            ringColor={activePlayer.color}
            className="min-h-0"
            style={{ flex: '55 1 0px' }}
            stretch
          >
            <div className="flex flex-col sm:flex-row gap-3 p-3 short:p-1.5 h-full">
              {/* Esquerda: avatar + nome */}
              <div className="flex sm:flex-col items-center justify-center gap-2 shrink-0 sm:min-w-[80px]">
                <div
                  className="rounded-full overflow-hidden shrink-0"
                  style={{
                    width: 'clamp(48px, 12.5vh, 88px)',
                    height: 'clamp(48px, 12.5vh, 88px)',
                    border: `4px solid ${activePlayer.color}`,
                    background: `${activePlayer.color}22`,
                    boxShadow: `0 0 12px ${activePlayer.color}66`,
                  }}
                >
                  <CharacterAvatar player={activePlayer} fill />
                </div>
                <span
                  className="font-bold text-base text-center short:hidden"
                  style={{ color: COLORS.areia, textShadow: '0 1px 3px rgba(0,0,0,0.6)' }}
                >
                  {activePlayer.label}
                </span>
              </div>

              {/* Direita: contadores + botão */}
              <div className="flex-1 flex flex-col justify-center gap-2 short:gap-0.5 min-w-0">
                <Counter
                  icon={<img src={`${import.meta.env.BASE_URL}img/coco.png`} alt="Coco" style={{ height: 'clamp(1.5rem, 5vh, 2.2rem)', width: 'auto' }} />}
                  value={activePlayer.coins}
                  onRemoveBig={() => updateActivePlayer("coins", -3)}
                  onRemove={() => updateActivePlayer("coins", -1)}
                  onAdd={() => updateActivePlayer("coins", 1)}
                  onAddBig={() => updateActivePlayer("coins", 3)}
                />
                <Counter
                  icon={<img src={`${import.meta.env.BASE_URL}img/tikkimask.png`} alt="Tikki" style={{ height: 'clamp(1.5rem, 5vh, 2.2rem)', width: 'auto' }} />}
                  value={activePlayer.stars}
                  onAdd={handleBuyTikki}
                  onRemove={() => {}}
                  hideRemove
                  disabledAdd={activePlayer.coins < 20}
                />
                <div className="self-end flex flex-row flex-wrap gap-2 items-center justify-end">
                  {/* Botão Roubar */}
                  <button
                    onClick={() => setIsRoubarOpen(true)}
                    disabled={hasStolenThisTurn}
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all active:scale-95${!hasStolenThisTurn ? ' hover:scale-105' : ''}`}
                    style={{
                      background: `linear-gradient(145deg, ${COLORS.madeiraClara}, ${COLORS.madeiraMedia})`,
                      border: `3px solid ${COLORS.madeiraEscura}`,
                      boxShadow: hasStolenThisTurn ? 'none' : '3px 3px 0 #3D2010',
                      opacity: hasStolenThisTurn ? 0.5 : 1,
                      cursor: hasStolenThisTurn ? 'not-allowed' : 'pointer',
                    }}
                  >
                    <img src={`${import.meta.env.BASE_URL}img/bandeira.png`} alt="" style={{ height: '1.5rem', width: 'auto' }} />
                  </button>
                  {/* Botão Embate */}
                  <button
                    onClick={() => setIsEmbateOpen(true)}
                    disabled={inactivePlayers.length === 0}
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all active:scale-95${inactivePlayers.length > 0 ? ' hover:scale-105' : ''}`}
                    title="Embate"
                    style={{
                      background: `linear-gradient(145deg, ${COLORS.madeiraClara}, ${COLORS.madeiraMedia})`,
                      border: `3px solid ${COLORS.madeiraEscura}`,
                      boxShadow: inactivePlayers.length === 0 ? 'none' : '3px 3px 0 #3D2010',
                      opacity: inactivePlayers.length === 0 ? 0.5 : 1,
                      cursor: inactivePlayers.length === 0 ? 'not-allowed' : 'pointer',
                    }}
                  >
                    <img src={`${import.meta.env.BASE_URL}img/embate.png`} alt="Embate" style={{ height: '1.5rem', width: 'auto' }} />
                  </button>
                  {/* Botão Surpresa */}
                  <button
                    onClick={() => setIsSurpresaOpen(true)}
                    className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-105 active:scale-95"
                    title="Surpresa"
                    style={{
                      background: `linear-gradient(145deg, ${COLORS.madeiraClara}, ${COLORS.madeiraMedia})`,
                      border: `3px solid ${COLORS.madeiraEscura}`,
                      boxShadow: '3px 3px 0 #3D2010',
                      cursor: 'pointer',
                    }}
                  >
                    <img src={`${import.meta.env.BASE_URL}img/surpresa.png`} alt="Surpresa" style={{ height: '1.5rem', width: 'auto' }} />
                  </button>
                  {/* Encerrar turno */}
                  <button
                    onClick={endTurn}
                    className="h-10 px-4 short:px-3 rounded-full font-bold text-sm short:text-xs text-white transition-all hover:scale-105 active:scale-95"
                    style={{
                      background: COLORS.coral,
                      border: `3px solid ${COLORS.madeiraEscura}`,
                      boxShadow: '3px 3px 0 #3D2010',
                      fontFamily: 'Fredoka, sans-serif',
                    }}
                  >
                    Encerrar turno 🔄
                  </button>
                </div>
              </div>
            </div>
          </WoodenCard>

          {/* ── Seção 3: Fileira de inativos ──────────────────────────────── */}
          {inactivePlayers.length > 0 && (
            <div
              className="flex gap-2 w-full min-h-0"
              style={{ flex: '28 1 0px', maxHeight: 'clamp(60px, 15vh, 100px)' }}
            >
              {inactivePlayers.map((p) => (
                <motion.div
                  key={p.id}
                  className="flex-1 min-w-0 flex flex-col"
                  style={{ willChange: 'transform' }}
                >
                  <WoodenCard variant="card" stretch className="flex-1 min-h-0">
                    <div className="flex items-center gap-2 px-2 h-full">
                      <div className="shrink-0 rounded-full overflow-hidden w-8 h-8">
                        <CharacterAvatar player={p} fill />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span
                          className="font-bold text-sm truncate"
                          style={{ fontFamily: 'Fredoka, sans-serif', color: COLORS.areia, textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
                        >
                          {p.label}
                        </span>
                        <span className="text-xs" style={{ color: `${COLORS.areia}CC`, fontFamily: 'Quicksand, sans-serif' }}>
                          <img src={`${import.meta.env.BASE_URL}img/coco.png`} alt="" className="inline-block" style={{ height: '1.1rem', width: 'auto', verticalAlign: 'middle' }} />{p.coins} · <img src={`${import.meta.env.BASE_URL}img/tikkimask.png`} alt="" className="inline-block" style={{ height: '1.1rem', width: 'auto', verticalAlign: 'middle' }} />{p.stars}
                        </span>
                      </div>
                    </div>
                  </WoodenCard>
                </motion.div>
              ))}
            </div>
          )}

        </div>
      </WoodenPanel>
      <RoubarModal
        isOpen={isRoubarOpen}
        onClose={() => setIsRoubarOpen(false)}
        attacker={activePlayer}
        targets={inactivePlayers}
        onSteal={handleSteal}
      />
      <EmbateModal
        isOpen={isEmbateOpen}
        onClose={() => setIsEmbateOpen(false)}
        challenger={activePlayer}
        targets={inactivePlayers}
        onConfirm={startEmbate}
      />
      <SurpresaModal
        isOpen={isSurpresaOpen}
        onClose={() => setIsSurpresaOpen(false)}
        activePlayer={activePlayer}
        otherPlayers={inactivePlayers}
        onEffect={handleSurpresaEffect}
      />

      {/* ── Modal: comprar Tikki (Máscara Tikki) ─────────────────────── */}
      {isBuyTikkiOpen && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 50,
            background: 'rgba(0,0,0,0.65)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '1rem',
          }}
          onClick={() => setIsBuyTikkiOpen(false)}
        >
          <div
            style={{
              background: 'linear-gradient(180deg, #F8E9C9 0%, #F0DAB5 100%)',
              border: '3px solid #5D3A1A',
              borderRadius: '20px',
              padding: '1.5rem',
              maxWidth: '360px',
              width: '100%',
              boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
              textAlign: 'center',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ marginBottom: '0.5rem' }}>
              <img src={`${import.meta.env.BASE_URL}img/tikkimask.png`} alt="Tikki" className="mx-auto" style={{ height: '5rem', width: 'auto' }} />
            </div>
            <h2 style={{ fontFamily: 'Fredoka, sans-serif', fontWeight: 700, fontSize: '1.4rem', color: '#2D1B0D', marginBottom: '0.5rem' }}>
              Comprar Máscara Tikki?
            </h2>
            <p style={{ fontFamily: 'Quicksand, sans-serif', fontSize: '1rem', color: '#5D3A1A', marginBottom: '1.25rem' }}>
              Custa <strong>20 <img src={`${import.meta.env.BASE_URL}img/coco.png`} alt="" className="inline-block" style={{ height: '1rem', width: 'auto', verticalAlign: 'middle' }} /> cocos</strong>.<br />
              Você tem <strong>{activePlayer.coins} <img src={`${import.meta.env.BASE_URL}img/coco.png`} alt="" className="inline-block" style={{ height: '1rem', width: 'auto', verticalAlign: 'middle' }} /></strong>.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
              <button
                onClick={() => setIsBuyTikkiOpen(false)}
                style={{
                  fontFamily: 'Fredoka, sans-serif', fontWeight: 700, fontSize: '1rem',
                  padding: '0.5rem 1.25rem', borderRadius: '999px',
                  background: '#ccc', border: '2px solid #5D3A1A', cursor: 'pointer', color: '#2D1B0D',
                }}
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmBuyTikki}
                style={{
                  fontFamily: 'Fredoka, sans-serif', fontWeight: 700, fontSize: '1rem',
                  padding: '0.5rem 1.25rem', borderRadius: '999px',
                  background: COLORS.coral, border: '2px solid #5D3A1A', cursor: 'pointer', color: '#fff',
                  boxShadow: '3px 3px 0 #3D2010',
                }}
              >
                ✅ Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Game;
