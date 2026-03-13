import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Crown } from "lucide-react";
import type { Player } from "@/types/game";
import SkyBackground from "@/components/SkyBackground";
import CharacterAvatar from "@/components/game/CharacterAvatar";

interface RankingPosition {
  position: number;
  player: Player | null;
}

const POSITION_LABELS = ["1º", "2º", "3º", "4º"];
const MEDAL_COLORS = [
  "border-sunflower",
  "border-sky",
  "border-mint",
  "border-muted",
];
const COIN_REWARDS = [3, 2, 1];

const MinigameRanking = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { players, currentRound, totalRounds, isGameOver } =
    (location.state as { players: Player[]; currentRound: number; totalRounds: number; isGameOver: boolean }) || {};

  const [positions, setPositions] = useState<RankingPosition[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [coinAnimations, setCoinAnimations] = useState<string[]>([]);

  useEffect(() => {
    if (!location.state) { navigate("/"); return; }
    setPositions(players.map((_, i) => ({ position: i + 1, player: null })));
  }, [location.state, navigate, players]);

  if (!location.state || !players) return null;

  const allFilled = positions.length > 0 && positions.every((p) => p.player !== null);

  const handleSelectPlayer = (player: Player) => {
    if (selectedIds.has(player.id)) {
      setPositions((prev) => prev.map((pos) => pos.player?.id === player.id ? { ...pos, player: null } : pos));
      setSelectedIds((prev) => { const next = new Set(prev); next.delete(player.id); return next; });
      return;
    }
    const firstEmpty = positions.findIndex((p) => p.player === null);
    if (firstEmpty === -1) return;

    // Coin animation for top 3
    if (firstEmpty < COIN_REWARDS.length) {
      setCoinAnimations((prev) => [...prev, player.id]);
      setTimeout(() => setCoinAnimations((prev) => prev.filter((id) => id !== player.id)), 700);
    }

    setPositions((prev) => {
      const updated = [...prev];
      updated[firstEmpty] = { ...updated[firstEmpty], player };
      return updated;
    });
    setSelectedIds((prev) => new Set(prev).add(player.id));
  };

  const handleContinue = () => {
    const updatedPlayers = players.map((p) => {
      const posIdx = positions.findIndex((pos) => pos.player?.id === p.id);
      const reward = posIdx >= 0 && posIdx < COIN_REWARDS.length ? COIN_REWARDS[posIdx] : 0;
      return { ...p, coins: p.coins + reward };
    });

    if (isGameOver) {
      navigate("/ranking", { state: { players: updatedPlayers } });
    } else {
      navigate("/game", { state: { players: updatedPlayers, totalRounds, currentRound: currentRound + 1 } });
    }
  };

  return (
    <SkyBackground>
      <div className="h-screen w-screen flex flex-col items-center justify-center overflow-hidden px-4 gap-4">
        <div className="flex items-center gap-2">
          <Trophy className="w-7 h-7 text-sunflower" />
          <h1 className="text-2xl font-bold text-foreground tracking-tight font-display">
            Pódio da Rodada 🏅
          </h1>
        </div>

        <div className="flex flex-row items-start gap-8 w-full max-w-3xl">
          {/* Ranking positions */}
          <div className="flex-1 flex flex-col gap-2">
            {positions.map((pos, i) => {
              const borderClass = i < MEDAL_COLORS.length ? MEDAL_COLORS[i] : "border-muted";
              const reward = i < COIN_REWARDS.length ? `+${COIN_REWARDS[i]} 🪙` : "";
              return (
                <motion.div
                  key={pos.position}
                  layout
                  className={`flex items-center gap-3 px-4 py-3 rounded-3xl border-[3px] ${borderClass} glass transition-all`}
                  style={{ boxShadow: i === 0 ? "var(--pop-shadow-sunflower)" : "var(--pop-shadow-white)" }}
                >
                  <span className="text-xl font-black min-w-[2.5ch] text-foreground">{POSITION_LABELS[i]}</span>
                  <AnimatePresence mode="wait">
                    {pos.player ? (
                      <motion.div
                        key={pos.player.id}
                        className="flex items-center gap-2 relative"
                        initial={{ opacity: 0, y: 20, scale: 0.6 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ type: "spring", stiffness: 400, damping: 20 }}
                      >
                        <CharacterAvatar playerId={pos.player.id} size="sm" bounce />
                        {i === 0 && <Crown className="w-5 h-5 text-sunflower" />}
                        <span className="text-lg font-bold text-foreground">{pos.player.label}</span>
                        {reward && <span className="text-xs font-bold text-foreground/50">{reward}</span>}

                        {/* Coin pop animation */}
                        {coinAnimations.includes(pos.player.id) && (
                          <motion.span
                            className="absolute -top-2 left-1/2 text-lg"
                            initial={{ y: 0, opacity: 1, scale: 1 }}
                            animate={{ y: -30, opacity: 0, scale: 1.3 }}
                            transition={{ duration: 0.6 }}
                          >
                            🪙
                          </motion.span>
                        )}
                      </motion.div>
                    ) : (
                      <motion.span key="empty" className="text-sm font-semibold text-foreground/30">
                        Esperando...
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>

          {/* Player selection */}
          <div className="flex flex-col items-center gap-4">
            <span className="text-xs font-bold text-foreground/40 uppercase tracking-widest">
              Selecione a ordem
            </span>
            <div className="relative w-48 h-48">
              {players.map((player, i) => {
                const angle = (2 * Math.PI * i) / players.length - Math.PI / 2;
                const radius = 70;
                const x = Math.cos(angle) * radius;
                const y = Math.sin(angle) * radius;
                const isSelected = selectedIds.has(player.id);

                return (
                  <motion.button
                    key={player.id}
                    onClick={() => handleSelectPlayer(player)}
                    className={`absolute w-16 h-16 rounded-full border-[3px] flex items-center justify-center font-bold text-sm transition-all ${
                      isSelected
                        ? "border-mint bg-mint/20 opacity-60"
                        : "border-border glass hover:scale-110 active:scale-95"
                    }`}
                    style={{
                      left: `calc(50% + ${x}px - 2rem)`,
                      top: `calc(50% + ${y}px - 2rem)`,
                      boxShadow: isSelected ? "none" : "var(--pop-shadow-white)",
                    }}
                    whileHover={{ scale: isSelected ? 0.95 : 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {isSelected ? "✓" : <CharacterAvatar playerId={player.id} size="sm" />}
                  </motion.button>
                );
              })}
            </div>
          </div>
        </div>

        <AnimatePresence>
          {allFilled && (
            <motion.button
              onClick={handleContinue}
              className="px-10 py-4 rounded-3xl border-[3px] border-border bg-mint text-accent-foreground font-bold text-lg tracking-wide"
              style={{ boxShadow: "var(--pop-shadow-mint)" }}
              initial={{ opacity: 0, y: 30, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.95 }}
            >
              {isGameOver ? "🏆 Ver Ranking Final" : "Vamos para a próxima etapa? ▶"}
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </SkyBackground>
  );
};

export default MinigameRanking;
