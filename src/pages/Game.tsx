import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Flame, Map, Waves } from "lucide-react";
import type { Player } from "@/types/game";
import ActivePlayerCard from "@/components/game/ActivePlayerCard";
import InactivePlayerRow from "@/components/game/InactivePlayerRow";

const Game = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { players: playerLabels = [], totalRounds = 10 } =
    (location.state as { players: string[]; totalRounds: number }) || {};

  const [playerOrder, setPlayerOrder] = useState<Player[]>(() => {
    const existingPlayers = (location.state as { players?: Player[] | string[] })?.players;

    if (existingPlayers && typeof existingPlayers[0] === "object") {
      return existingPlayers as Player[];
    }

    return playerLabels.map((label: string) => ({
      id: label,
      label,
      coins: 0,
      stars: 0,
    }));
  });

  const [currentRound, setCurrentRound] = useState(() => {
    return (location.state as { currentRound?: number })?.currentRound || 1;
  });

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

      if (rotated[0].id === startingPlayerId.current) {
        const nextRound = currentRound + 1;
        const isGameOver = currentRound >= totalRounds;

        setTimeout(
          () =>
            navigate("/sorteio", {
              state: {
                players: rotated,
                currentRound,
                totalRounds,
                isGameOver,
              },
            }),
          0,
        );

        if (!isGameOver) {
          setCurrentRound(nextRound);
        }
      }

      return rotated;
    });
  };

  useEffect(() => {
    if (!location.state || playerLabels.length === 0) {
      navigate("/");
    }
  }, [location.state, navigate, playerLabels.length]);

  if (!location.state || playerOrder.length === 0) return null;

  return (
    <div className="world-shell">
      <div className="mobile-island">
        <div className="island-screen">
          <header className="parchment-panel px-4 py-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="subtle-copy text-xs uppercase tracking-[0.3em]">
                  Status da partida
                </span>
                <h1 className="font-display mt-2 text-4xl leading-none text-[#7a4b1d]">
                  Rodada {currentRound}
                  <span className="ml-2 text-3xl text-[#af7b38]">/ {totalRounds}</span>
                </h1>
              </div>

              <div className="flex flex-col items-end gap-2">
                <div className="stake-tab is-selected px-4 py-3 text-center">
                  <span className="block text-xs uppercase tracking-[0.22em]">
                    Turno
                  </span>
                  <strong className="text-lg">
                    {playerLabels.indexOf(activePlayer.id) + 1}/{playerLabels.length}
                  </strong>
                </div>
                <div className="island-badge flex items-center gap-2 px-3 py-2 text-xs font-black uppercase tracking-[0.18em]">
                  <Map className="h-4 w-4" />
                  Mesa em curso
                </div>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="wood-panel px-4 py-3 text-[#fff4df]">
                <span className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.24em] text-[#fde8ca]/85">
                  <Flame className="h-4 w-4 text-[#ffd46d]" />
                  Jogador ativo
                </span>
                <strong className="font-display mt-2 block text-3xl leading-none">
                  {activePlayer.label}
                </strong>
              </div>
              <div className="wood-panel px-4 py-3 text-[#fff4df]">
                <span className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.24em] text-[#fde8ca]/85">
                  <Waves className="h-4 w-4 text-[#84f1e4]" />
                  Próximo sorteio
                </span>
                <strong className="font-display mt-2 block text-3xl leading-none">
                  Ao fim do ciclo
                </strong>
              </div>
            </div>
          </header>

          <div className="min-h-0 flex-1">
            <ActivePlayerCard
              player={activePlayer}
              onUpdateCoins={(delta) => updateActivePlayer("coins", delta)}
              onUpdateStars={(delta) => updateActivePlayer("stars", delta)}
              onEndTurn={endTurn}
            />
          </div>

          <section className="parchment-panel px-4 py-4">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div>
                <h2 className="section-title">
                  <Flame className="h-5 w-5 text-tangerine" />
                  Estacas de navegação
                </h2>
                <p className="subtle-copy mt-1 text-sm">
                  A chama marca quem está mais perto de assumir a vez.
                </p>
              </div>
            </div>
            <InactivePlayerRow players={inactivePlayers} />
          </section>
        </div>
      </div>
    </div>
  );
};

export default Game;
