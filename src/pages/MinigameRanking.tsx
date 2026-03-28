import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Crown, Shell, Trophy, Waves } from "lucide-react";
import type { Player } from "@/types/game";
import CharacterAvatar from "@/components/game/CharacterAvatar";

interface RankingPosition {
  position: number;
  player: Player | null;
}

const POSITION_LABELS = ["1º", "2º", "3º", "4º"];
const COIN_REWARDS = [3, 2, 1];

const MinigameRanking = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { players, currentRound, totalRounds, isGameOver } =
    (location.state as {
      players: Player[];
      currentRound: number;
      totalRounds: number;
      isGameOver: boolean;
    }) || {};

  const [positions, setPositions] = useState<RankingPosition[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [coinAnimations, setCoinAnimations] = useState<string[]>([]);

  useEffect(() => {
    if (!location.state) {
      navigate("/setup");
      return;
    }

    setPositions(players.map((_, index) => ({ position: index + 1, player: null })));
  }, [location.state, navigate, players]);

  if (!location.state || !players) return null;

  const allFilled = positions.length > 0 && positions.every((position) => position.player !== null);

  const handleSelectPlayer = (player: Player) => {
    if (selectedIds.has(player.id)) {
      setPositions((prev) =>
        prev.map((position) =>
          position.player?.id === player.id ? { ...position, player: null } : position,
        ),
      );
      setSelectedIds((prev) => {
        const next = new Set(prev);
        next.delete(player.id);
        return next;
      });
      return;
    }

    const firstEmpty = positions.findIndex((position) => position.player === null);
    if (firstEmpty === -1) return;

    if (firstEmpty < COIN_REWARDS.length) {
      setCoinAnimations((prev) => [...prev, player.id]);
      setTimeout(
        () => setCoinAnimations((prev) => prev.filter((id) => id !== player.id)),
        700,
      );
    }

    setPositions((prev) => {
      const updated = [...prev];
      updated[firstEmpty] = { ...updated[firstEmpty], player };
      return updated;
    });
    setSelectedIds((prev) => new Set(prev).add(player.id));
  };

  const handleContinue = () => {
    const updatedPlayers = players.map((player) => {
      const positionIndex = positions.findIndex(
        (position) => position.player?.id === player.id,
      );
      const reward =
        positionIndex >= 0 && positionIndex < COIN_REWARDS.length
          ? COIN_REWARDS[positionIndex]
          : 0;

      return { ...player, coins: player.coins + reward };
    });

    if (isGameOver) {
      navigate("/ranking", { state: { players: updatedPlayers } });
      return;
    }

    navigate("/game", {
      state: { players: updatedPlayers, totalRounds, currentRound: currentRound + 1 },
    });
  };

  return (
    <div className="world-shell">
      <div className="gameplay-stage">
        <div className="landscape-board">
          <aside className="landscape-side">
            <section className="leafy-card p-5">
              <div className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-white" />
                <p className="text-xs font-black uppercase tracking-[0.22em] text-white/82">
                  Pódio tropical
                </p>
              </div>
              <h2 className="font-display mt-3 text-5xl leading-none text-white">
                Rodada {currentRound}
              </h2>
            </section>

            <section className="surf-card p-5 text-[#12707a]">
              <p className="text-xs font-black uppercase tracking-[0.22em]">
                Bônus
              </p>
              <ul className="mt-4 grid gap-2 text-sm font-black">
                <li>1º lugar: +3 🥥</li>
                <li>2º lugar: +2 🥥</li>
                <li>3º lugar: +1 🥥</li>
              </ul>
            </section>
          </aside>

          <main className="landscape-main">
            <section className="parchment-panel p-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.22em] text-[#4a8085]">
                    Defina o pódio
                  </p>
                  <h1 className="font-display mt-2 text-5xl leading-none text-[#14828d]">
                    Quem brilhou?
                  </h1>
                </div>
                <div className="island-badge flex items-center gap-2 px-4 py-2 text-xs font-black uppercase tracking-[0.18em]">
                  <Waves className="h-4 w-4" />
                  Selecione a ordem
                </div>
              </div>

              <div className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,1fr)_18rem]">
                <div className="grid gap-3">
                  {positions.map((position, index) => {
                    const reward = index < COIN_REWARDS.length ? `+${COIN_REWARDS[index]} 🥥` : "";

                    return (
                      <motion.div
                        key={position.position}
                        layout
                        className={`${index === 0 ? "leafy-card" : "driftwood-card"} flex items-center gap-4 p-4`}
                      >
                        <span className={`flex h-12 w-12 items-center justify-center rounded-full text-lg font-black ${index === 0 ? "bg-white/18 text-white" : "bg-white/65 text-[#19707a]"}`}>
                          {POSITION_LABELS[index]}
                        </span>

                        <AnimatePresence mode="wait">
                          {position.player ? (
                            <motion.div
                              key={position.player.id}
                              className="relative flex items-center gap-3"
                              initial={{ opacity: 0, y: 20, scale: 0.6 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.8 }}
                              transition={{ type: "spring", stiffness: 400, damping: 20 }}
                            >
                              <CharacterAvatar playerId={position.player.id} size="sm" bounce />
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className={`text-lg font-black ${index === 0 ? "text-white" : "text-[#19707a]"}`}>
                                    {position.player.label}
                                  </span>
                                  {index === 0 && <Crown className="h-4 w-4 text-[#fff0a8]" />}
                                </div>
                                {reward && (
                                  <span className={`text-xs font-black uppercase tracking-[0.16em] ${index === 0 ? "text-white/82" : "text-[#5a7974]"}`}>
                                    {reward}
                                  </span>
                                )}
                              </div>

                              {coinAnimations.includes(position.player.id) && (
                                <motion.span
                                  className="absolute -top-2 left-12 text-lg"
                                  initial={{ y: 0, opacity: 1, scale: 1 }}
                                  animate={{ y: -30, opacity: 0, scale: 1.3 }}
                                  transition={{ duration: 0.6 }}
                                >
                                  🥥
                                </motion.span>
                              )}
                            </motion.div>
                          ) : (
                            <motion.span
                              key="empty"
                              className="text-sm font-black uppercase tracking-[0.18em] text-[#5b7d80]"
                            >
                              Aguardando jogador
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    );
                  })}
                </div>

                <div className="surf-card p-5 text-center text-[#116f78]">
                  <div className="island-badge mx-auto inline-flex items-center gap-2 px-4 py-2 text-xs font-black uppercase tracking-[0.18em]">
                    <Shell className="h-4 w-4" />
                    Jogadores
                  </div>
                  <div className="mt-5 grid gap-3">
                    {players.map((player) => {
                      const isSelected = selectedIds.has(player.id);

                      return (
                        <button
                          key={player.id}
                          onClick={() => handleSelectPlayer(player)}
                          className={`splash-hit flex items-center gap-3 rounded-full px-4 py-3 text-left transition-all ${
                            isSelected ? "leafy-card scale-[0.98]" : "pebble-button"
                          }`}
                          type="button"
                        >
                          <CharacterAvatar playerId={player.id} size="sm" />
                          <span className={`font-black ${isSelected ? "text-white" : "text-[#116f78]"}`}>
                            {player.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </section>
          </main>

          <aside className="landscape-side">
            {allFilled && (
              <motion.button
                onClick={handleContinue}
                className="splash-hit gem-button gem-magenta px-8 py-5 text-sm uppercase tracking-[0.22em]"
                initial={{ opacity: 0, y: 30, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 30 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                whileTap={{ scale: 0.97 }}
                type="button"
              >
                {isGameOver ? "Ver ranking final" : "Próxima onda"}
              </motion.button>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
};

export default MinigameRanking;
