import { useState, useEffect, useRef } from "react";
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


// ── Contador compacto [ícone] [−] [número] [+] ──────────────────────────────
const Counter = ({
  icon,
  value,
  onAdd,
  onRemove,
}: {
  icon: string;
  value: number;
  onAdd: () => void;
  onRemove: () => void;
}) => (
  <div
    className="flex items-center gap-2 rounded-xl px-3 py-2"
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
    <span className="text-2xl shrink-0 leading-none">{icon}</span>
    <button
      onClick={onRemove}
      className="w-9 h-9 rounded-full flex items-center justify-center font-black text-lg text-white shrink-0 transition-transform active:scale-90"
      style={{ background: COLORS.turquoise, border: '2px solid #5D3A1A', fontFamily: 'Fredoka, sans-serif' }}
    >−</button>
    <span
      className="min-w-[2rem] text-center text-2xl font-bold"
      style={{ fontFamily: 'Fredoka, sans-serif', color: '#F4E4C1', textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
    >
      {value}
    </span>
    <button
      onClick={onAdd}
      className="w-9 h-9 rounded-full flex items-center justify-center font-black text-lg shrink-0 transition-transform active:scale-90"
      style={{ background: COLORS.coral, border: '2px solid #5D3A1A', color: '#ffffff', fontFamily: 'Fredoka, sans-serif' }}
    >+</button>
  </div>
);

const Game = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { players: incoming = ["P1", "P2", "P3"], totalRounds = 3, currentRound: initialRound = 1 } =
    (location.state as { players: (string | Player)[]; totalRounds: number; currentRound?: number }) || {};

  const [playerOrder, setPlayerOrder] = useState<Player[]>(() =>
    (incoming as any[]).map((p) =>
      typeof p === 'string'
        ? { id: p, label: CHARACTER_MAP[p]?.label ?? p, avatar: CHARACTER_MAP[p]?.avatar ?? '🎮', color: CHARACTER_MAP[p]?.color ?? COLORS.coral, coins: 0, stars: 0, trophies: 0 }
        : p as Player
    )
  );

  const [currentRound, setCurrentRound] = useState(initialRound);
  const startingPlayerId = useRef(
    typeof incoming[0] === 'string' ? incoming[0] : (incoming[0] as Player).id
  );
  const [hasStolenThisTurn, setHasStolenThisTurn] = useState(false);
  const [isRoubarOpen, setIsRoubarOpen] = useState(false);

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
        setTimeout(
          () =>
            navigate("/sorteio", {
              state: {
                players: rotated,
                currentRound: isGameOver ? currentRound : nextRound,
                totalRounds,
                isGameOver,
              },
            }),
          0
        );
        return rotated;
      }
      return rotated;
    });
  };

  useEffect(() => {
    if (!location.state) navigate("/");
  }, [location.state, navigate]);

  if (!location.state) return null;

  return (
    <div
      key={currentRound}
      className="h-screen p-3 md:p-4"
      style={{ fontFamily: 'Fredoka, sans-serif', boxSizing: 'border-box' }}
    >
      <TropicalBackground />

      <WoodenPanel
        compact
        fillHeight
        className="w-full max-w-7xl mx-auto h-full"
        style={{ maxHeight: '95vh' }}
      >
        <div className="flex flex-col gap-2 h-full overflow-hidden">

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
            <div className="flex flex-col md:flex-row gap-4 p-3 h-full">
              {/* Esquerda: avatar + nome */}
              <div className="flex md:flex-col items-center justify-center gap-3 shrink-0 md:min-w-[120px]">
                <div
                  className="rounded-full flex items-center justify-center text-5xl md:text-6xl p-2 shrink-0"
                  style={{
                    border: `4px solid ${activePlayer.color}`,
                    background: `${activePlayer.color}22`,
                    boxShadow: `0 0 12px ${activePlayer.color}66`,
                  }}
                >
                  {activePlayer.avatar}
                </div>
                <span
                  className="font-bold text-lg text-center"
                  style={{ color: COLORS.areia, textShadow: '0 1px 3px rgba(0,0,0,0.6)' }}
                >
                  {activePlayer.label}
                </span>
              </div>

              {/* Direita: contadores + botão */}
              <div className="flex-1 flex flex-col justify-center gap-3 min-w-0">
                <Counter
                  icon="🥥"
                  value={activePlayer.coins}
                  onAdd={() => updateActivePlayer("coins", 1)}
                  onRemove={() => updateActivePlayer("coins", -1)}
                />
                <Counter
                  icon="🗿"
                  value={activePlayer.stars}
                  onAdd={() => updateActivePlayer("stars", 1)}
                  onRemove={() => updateActivePlayer("stars", -1)}
                />
                <div className="self-end flex items-center gap-2">
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
                    <img
                      src={`${import.meta.env.BASE_URL}icone-roubar.png`}
                      alt=""
                      width={24}
                      height={24}
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).style.display = 'none';
                        const fallback = e.currentTarget.parentElement?.querySelector<HTMLElement>('.steal-fallback');
                        if (fallback) fallback.style.display = 'inline';
                      }}
                    />
                    <span className="steal-fallback" style={{ display: 'none', fontSize: '1.25rem', lineHeight: 1 }}>🏴</span>
                  </button>
                  {/* Botão Encerrar turno */}
                  <button
                    onClick={endTurn}
                    className="px-5 rounded-full font-bold text-sm text-white shadow-md transition-all hover:scale-105 active:scale-95"
                    style={{
                      background: COLORS.coral,
                      border: `3px solid ${COLORS.madeiraEscura}`,
                      boxShadow: '3px 3px 0 #3D2010',
                      fontFamily: 'Fredoka, sans-serif',
                      maxWidth: 200,
                      paddingTop: '6px',
                      paddingBottom: '6px',
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
              style={{ flex: '28 1 0px', maxHeight: 'clamp(80px, 22vh, 140px)' }}
            >
              {inactivePlayers.map((p) => (
                <motion.div
                  key={p.id}
                  className="flex-1 min-w-0 flex flex-col"
                  style={{ willChange: 'transform' }}
                >
                  <WoodenCard variant="card" stretch className="flex-1 min-h-0">
                    <div className="flex items-center gap-3 px-3 h-full">
                      <span className="text-2xl shrink-0">{p.avatar}</span>
                      <div className="flex flex-col min-w-0">
                        <span
                          className="font-bold text-xs truncate"
                          style={{ fontFamily: 'Fredoka, sans-serif', color: COLORS.areia, textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
                        >
                          {p.label}
                        </span>
                        <span className="text-xs" style={{ color: `${COLORS.areia}CC`, fontFamily: 'Quicksand, sans-serif' }}>
                          🥥{p.coins} · 🗿{p.stars}
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
    </div>
  );
};

export default Game;
