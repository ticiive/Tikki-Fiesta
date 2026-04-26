import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import type { Player } from "@/types/game";
import { CHARACTER_MAP } from "@/data/characters";
import { TropicalBackground } from "@/components/layout/TropicalBackground";
import { WoodenCard } from "@/components/ui/WoodenCard";
import { COLORS } from "@/lib/tokens";


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
      style={{ background: '#AAF0D1', border: '2px solid #5D3A1A', color: '#2D1B0D', fontFamily: 'Fredoka, sans-serif' }}
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

  const endTurn = () => {
    setPlayerOrder((prev) => {
      const rotated = [...prev.slice(1), prev[0]];
      // Every time the starting player comes back, a full cycle is complete
      if (rotated[0].id === startingPlayerId.current) {
        const nextRound = currentRound + 1;
        const isGameOver = nextRound > totalRounds;
        // CRITICAL FIX: Update currentRound BEFORE navigate to prevent infinite loop
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
      style={{
        height: '100vh',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        padding: '12px',
        gap: '6px',
        fontFamily: 'Fredoka, sans-serif',
        boxSizing: 'border-box',
      }}
    >
      <TropicalBackground />

      {/* ── Decorativos tropicais nos cantos da tela ────────────────────────── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
        {/* TL — folha de palmeira */}
        <div className="absolute select-none" style={{ top: 10, left: 10, opacity: 0.85, transform: 'rotate(-10deg)' }}>
          <svg width="80" height="95" viewBox="0 0 80 95" fill="none">
            <path d="M12,85 Q-8,45 38,5 Q55,32 50,62 Q36,78 12,85 Z" fill="#2D6B31" />
            <path d="M12,85 Q28,44 38,5" stroke="#1B4D1E" strokeWidth="2" strokeLinecap="round" />
            <path d="M22,65 Q35,50 42,30" stroke="#1B4D1E" strokeWidth="1" opacity="0.6" />
            <path d="M18,72 Q30,55 37,38" stroke="#1B4D1E" strokeWidth="1" opacity="0.5" />
          </svg>
        </div>
        {/* TR — flor hibisco */}
        <div className="absolute select-none" style={{ top: 12, right: 10, opacity: 0.85, transform: 'rotate(15deg)' }}>
          <svg width="70" height="70" viewBox="0 0 68 68" fill="none">
            {([0, 72, 144, 216, 288] as number[]).map((deg, i) => (
              <ellipse key={i} cx="34" cy="16" rx="8" ry="16" fill="#E8476A" opacity="0.92"
                transform={`rotate(${deg} 34 34)`} />
            ))}
            <circle cx="34" cy="34" r="7" fill="#FFD700" />
            <circle cx="34" cy="34" r="4" fill="#FFA500" />
            <circle cx="34" cy="34" r="2" fill="#FF6B00" />
          </svg>
        </div>
        {/* BL — concha */}
        <div className="absolute select-none" style={{ bottom: 8, left: 8, opacity: 0.85, transform: 'rotate(-5deg)' }}>
          <svg width="60" height="64" viewBox="0 0 52 56" fill="none">
            <path d="M26,52 Q6,46 3,30 Q0,14 15,6 Q30,0 42,12 Q52,24 47,38 Q42,50 30,52 Q22,53 17,46 Q12,39 16,30 Q20,22 27,23 Q34,24 35,32 Q36,39 29,41 Z"
              fill="#D4A373" stroke="#A07850" strokeWidth="1.5" />
            <path d="M26,48 Q10,42 8,28 Q6,16 18,10" stroke="#A07850" strokeWidth="1" fill="none" opacity="0.5" />
            <path d="M26,44 Q14,39 13,28 Q12,19 22,15" stroke="#A07850" strokeWidth="0.8" fill="none" opacity="0.4" />
          </svg>
        </div>
        {/* BR — folhinhas */}
        <div className="absolute select-none" style={{ bottom: 10, right: 8, opacity: 0.85, transform: 'rotate(8deg)' }}>
          <svg width="70" height="62" viewBox="0 0 58 52" fill="none">
            <path d="M5,42 Q8,10 32,4 Q26,26 5,42 Z" fill="#5CB85C" />
            <path d="M5,42 Q18,18 32,4" stroke="#3A8A3A" strokeWidth="1.2" fill="none" />
            <path d="M18,48 Q28,18 52,12 Q44,34 18,48 Z" fill="#4CAE4C" />
            <path d="M18,48 Q36,26 52,12" stroke="#3A8A3A" strokeWidth="1.2" fill="none" />
          </svg>
        </div>
      </div>

      {/* ── Seção 1: Header ─────────────────────────────────────────────────── */}
      <div
        className="shrink-0 flex items-center justify-between px-4 py-2 rounded-xl shadow-sm"
        style={{ background: 'rgba(244,228,193,0.85)', backdropFilter: 'blur(4px)', border: '1.5px solid #5D3A1A' }}
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
        <span className="text-xl select-none">⚙️</span>
      </div>

      {/* ── Seção 2: Card do jogador ativo ──────────────────────────────────── */}
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
            <button
              onClick={endTurn}
              className="self-end px-5 rounded-full font-bold text-sm text-white shadow-md transition-all hover:scale-105 active:scale-95"
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
      </WoodenCard>

      {/* ── Seção 3: Fileira de inativos ────────────────────────────────────── */}
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
                      🥥{p.coins} · 🗿{p.stars} · 🏆{p.trophies}
                    </span>
                  </div>
                </div>
              </WoodenCard>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Game;
