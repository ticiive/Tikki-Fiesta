import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import type { Player } from "@/types/game";
import { CHARACTER_MAP } from "@/data/characters";
import { TropicalBackground } from "@/components/layout/TropicalBackground";
import { COLORS } from "@/lib/tokens";

const WOOD_BG = [
  'linear-gradient(135deg, rgba(93,58,26,0.4) 0%, transparent 40%)',
  'linear-gradient(90deg, #8B5E34 0%, #A0693E 50%, #8B5E34 100%)',
].join(', ');

const WOOD_INSET = 'inset 0 0 0 2px #6D4A22, inset 0 0 20px rgba(45,27,13,0.2)';

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
    className="flex items-center gap-2 bg-white/40 rounded-xl px-3 py-2"
    style={{ border: '1.5px solid #5D3A1A' }}
  >
    <span className="text-2xl shrink-0 leading-none">{icon}</span>
    <button
      onClick={onRemove}
      className="w-9 h-9 rounded-full flex items-center justify-center font-black text-lg text-white shrink-0 transition-transform active:scale-90"
      style={{ background: COLORS.coral, border: '2px solid #5D3A1A', fontFamily: 'Fredoka, sans-serif' }}
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
      <div
        className="flex-1 min-h-0 flex flex-col md:flex-row gap-4 p-2 rounded-2xl shadow-lg"
        style={{
          background: WOOD_BG,
          border: '4px solid #5D3A1A',
          boxShadow: WOOD_INSET,
        }}
      >
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
            style={{ color: '#F4E4C1', textShadow: '0 1px 3px rgba(0,0,0,0.6)' }}
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
              border: '3px solid #5D3A1A',
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

      {/* ── Seção 3: Fileira de inativos ────────────────────────────────────── */}
      {inactivePlayers.length > 0 && (
        <div className="shrink-0 flex gap-2 w-full">
          {inactivePlayers.map((p) => (
            <div
              key={p.id}
              className="flex-1 min-w-0 flex items-center gap-3 px-3 rounded-xl shadow-sm"
              style={{
                background: WOOD_BG,
                border: '2px solid #5D3A1A',
                boxShadow: WOOD_INSET,
                paddingTop: '6px',
                paddingBottom: '6px',
              }}
            >
              <span className="text-2xl shrink-0">{p.avatar}</span>
              <div className="flex flex-col min-w-0">
                <span
                  className="font-bold text-xs truncate"
                  style={{ fontFamily: 'Fredoka, sans-serif', color: '#F4E4C1', textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
                >
                  {p.label}
                </span>
                <span className="text-xs" style={{ color: 'rgba(244,228,193,0.8)', fontFamily: 'Quicksand, sans-serif' }}>
                  🥥{p.coins} · 🗿{p.stars} · 🏆{p.trophies}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Game;
