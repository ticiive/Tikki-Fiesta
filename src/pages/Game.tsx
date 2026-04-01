import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import type { Player } from "@/types/game";
import ActivePlayerCard from "@/components/game/ActivePlayerCard";
import InactivePlayerRow from "@/components/game/InactivePlayerRow";

const Game = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { players: playerLabels = ["P1", "P2", "P3"], totalRounds = 3 } =
    (location.state as { players: string[]; totalRounds: number }) || {};

  const [playerOrder, setPlayerOrder] = useState<Player[]>(() =>
    playerLabels.map((label: string) => ({
      id: label,
      label,
      coins: 0,
      stars: 0,
    }))
  );

  const [currentRound, setCurrentRound] = useState(1);
  const startingPlayerId = useRef(playerLabels[0]);

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
      // Every time the starting player comes back, a full cycle is complete novo comit
      if (rotated[0].id === startingPlayerId.current) {
        const nextRound = currentRound + 1;
        const isGameOver = nextRound > totalRounds;
        // Navigate to /sorteio after every cycle
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
        if (!isGameOver) setCurrentRound(nextRound);
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
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-background">
      {/* Top Section - 75% - Active Player */}
      <div className="h-[75%] flex flex-col p-3 pb-2">
        {/* Round indicator */}
        <div className="flex items-center justify-between px-2 mb-2">
          <span className="text-sm font-bold text-cobalt tracking-wide">
            🎲 Rodada {currentRound}/{totalRounds}
          </span>
        </div>

        {/* Active Player Card */}
        <div className="flex-1 min-h-0">
          <ActivePlayerCard
            player={activePlayer}
            onUpdateCoins={(d) => updateActivePlayer("coins", d)}
            onUpdateStars={(d) => updateActivePlayer("stars", d)}
            onEndTurn={endTurn}
          />
        </div>
      </div>

      {/* Bottom Section - 25% - Inactive Players */}
      <div className="h-[25%] border-t-4 border-cobalt-light/30 bg-muted/50">
        <InactivePlayerRow players={inactivePlayers} />
      </div>
    </div>
  );
};

export default Game;
