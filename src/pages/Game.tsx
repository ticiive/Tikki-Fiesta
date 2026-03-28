import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { Shell, Sun, Waves } from "lucide-react";
import type { Player } from "@/types/game";
import ActivePlayerCard from "@/components/game/ActivePlayerCard";
import InactivePlayerRow from "@/components/game/InactivePlayerRow";
import GameTransition from "@/components/GameTransition";
import { getCharacter } from "@/components/game/CharacterAvatar";

enum GameState {
  START = "START",
  PLAYING = "PLAYING",
  ROUND_END = "ROUND_END",
  RANKING = "RANKING",
}

interface GameLocationState {
  players?: Array<Player | string>;
  totalRounds?: number;
  currentRound?: number;
}

const normalizePlayers = (rawPlayers: Array<Player | string> = []): Player[] =>
  rawPlayers.map((player) => {
    if (typeof player === "string") {
      const character = getCharacter(player);
      return { id: player, label: character.name, coins: 0, stars: 0 };
    }

    return {
      id: player.id,
      label: player.label,
      coins: player.coins ?? 0,
      stars: player.stars ?? 0,
    };
  });

const GameBoard = ({
  currentRound,
  totalRounds,
  currentTurn,
  totalPlayers,
  activePlayer,
  inactivePlayers,
  onUpdateCoins,
  onUpdateStars,
  onEndTurn,
}: {
  currentRound: number;
  totalRounds: number;
  currentTurn: number;
  totalPlayers: number;
  activePlayer: Player;
  inactivePlayers: Player[];
  onUpdateCoins: (delta: number) => void;
  onUpdateStars: (delta: number) => void;
  onEndTurn: () => void;
}) => (
  <div className="world-shell">
    <div className="gameplay-stage">
      <div className="landscape-board">
        <aside className="landscape-side">
          <section className="leafy-card p-5">
            <div className="flex items-center gap-3">
              <div className="island-badge flex h-11 w-11 items-center justify-center">
                <Sun className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-[0.22em] text-white/82">
                  Rodada
                </p>
                <h2 className="font-display mt-1 text-5xl leading-none text-white">
                  {currentRound}
                </h2>
              </div>
            </div>
            <p className="mt-4 text-sm font-bold text-white/82">
              de {totalRounds} ondas totais
            </p>
          </section>

          <section className="surf-card p-5 text-[#14727b]">
            <div className="flex items-center gap-2">
              <Shell className="h-4 w-4" />
              <p className="text-xs font-black uppercase tracking-[0.22em]">
                Turno atual
              </p>
            </div>
            <h3 className="font-display mt-3 text-4xl leading-none">
              {Math.min(currentTurn + 1, totalPlayers)}/{totalPlayers}
            </h3>
            <p className="mt-3 text-sm font-bold">
              Os status principais ficam nas margens para manter a arena central
              limpa e horizontal.
            </p>
          </section>
        </aside>

        <main className="landscape-main">
          <header className="parchment-panel flex items-center justify-between gap-4 px-6 py-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-[#498086]">
                Praia principal
              </p>
              <h1 className="font-display mt-1 text-5xl leading-none text-[#14828d]">
                {activePlayer.label}
              </h1>
            </div>
            <div className="island-badge flex items-center gap-2 px-4 py-2 text-xs font-black uppercase tracking-[0.18em]">
              <Waves className="h-4 w-4" />
              Jogando agora
            </div>
          </header>

          <div className="min-h-0 flex-1">
            <ActivePlayerCard
              player={activePlayer}
              onUpdateCoins={onUpdateCoins}
              onUpdateStars={onUpdateStars}
              onEndTurn={onEndTurn}
            />
          </div>
        </main>

        <aside className="landscape-side">
          <section className="parchment-panel p-5">
            <div className="flex items-center gap-3">
              <div className="island-badge flex h-11 w-11 items-center justify-center">
                <Waves className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-[0.22em] text-[#498086]">
                  Laterais
                </p>
                <h2 className="font-display mt-1 text-4xl leading-none text-[#14828d]">
                  Próximos
                </h2>
              </div>
            </div>
          </section>

          <section className="flex-1">
            <InactivePlayerRow players={inactivePlayers} />
          </section>
        </aside>
      </div>
    </div>
  </div>
);

const Game = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const state = (location.state as GameLocationState) || {};
  const incomingRound = state.currentRound ?? 1;
  const totalRounds = state.totalRounds ?? 10;
  const incomingPlayers = useMemo(() => normalizePlayers(state.players), [state.players]);

  const [playerOrder, setPlayerOrder] = useState<Player[]>(incomingPlayers);
  const [currentRound, setCurrentRound] = useState(Math.max(0, incomingRound - 1));
  const [currentTurn, setCurrentTurn] = useState(0);
  const [turnsCounter, setTurnsCounter] = useState(0);
  const [playersWhoPlayed, setPlayersWhoPlayed] = useState<string[]>([]);
  const [gameState, setGameState] = useState<GameState>(GameState.START);
  const [hasNavigatedRound, setHasNavigatedRound] = useState(false);
  const [hasCompletedFirstTransition, setHasCompletedFirstTransition] = useState(false);

  const totalPlayers = playerOrder.length;
  const activePlayer = playerOrder[0];
  const inactivePlayers = playerOrder.slice(1);

  const prepareNextRound = () => {
    setCurrentTurn(0);
    setPlayersWhoPlayed([]);
    setTurnsCounter(0);
    setCurrentRound((previous) => previous + 1);
    setGameState(GameState.PLAYING);
    setHasNavigatedRound(false);
  };

  useEffect(() => {
    if (!location.state || incomingPlayers.length === 0) {
      navigate("/setup");
      return;
    }

    setPlayerOrder(incomingPlayers);

    if (incomingRound > currentRound) {
      prepareNextRound();
    }
  }, [location.state, incomingPlayers, incomingRound, currentRound, navigate]);

  useEffect(() => {
    if (currentRound <= 0) return;

    setCurrentTurn(0);
    setTurnsCounter(0);
    setPlayersWhoPlayed([]);
    setGameState(GameState.PLAYING);
    setHasNavigatedRound(false);
  }, [currentRound]);

  const handleShowRanking = (playersAfterRound: Player[]) => {
    if (hasNavigatedRound) return;

    setHasNavigatedRound(true);
    setGameState(GameState.RANKING);
    const isGameOver = currentRound >= totalRounds;

    navigate("/sorteio", {
      state: { players: playersAfterRound, currentRound, totalRounds, isGameOver },
    });
  };

  const updateActivePlayer = (field: "coins" | "stars", delta: number) => {
    setPlayerOrder((previous) => {
      if (previous.length === 0) return previous;
      const updated = [...previous];
      updated[0] = {
        ...updated[0],
        [field]: Math.max(0, updated[0][field] + delta),
      };
      return updated;
    });
  };

  const handleEndTurn = () => {
    if (!activePlayer || gameState !== GameState.PLAYING || totalPlayers === 0) return;

    const rotated = [...playerOrder.slice(1), playerOrder[0]];
    const nextCurrentTurn = currentTurn + 1;
    const nextPlayersWhoPlayed = playersWhoPlayed.includes(activePlayer.id)
      ? playersWhoPlayed
      : [...playersWhoPlayed, activePlayer.id];
    const nextTurnsCounter = nextPlayersWhoPlayed.length;

    setPlayerOrder(rotated);
    setCurrentTurn(nextCurrentTurn);
    setPlayersWhoPlayed(nextPlayersWhoPlayed);
    setTurnsCounter(nextTurnsCounter);

    if (nextTurnsCounter >= totalPlayers) {
      setGameState(GameState.ROUND_END);
      handleShowRanking(rotated);
    }
  };

  const handleTransitionComplete = useCallback(() => {
    setHasCompletedFirstTransition(true);
    setGameState(GameState.PLAYING);
  }, []);

  if (!location.state || playerOrder.length === 0 || !activePlayer || currentRound <= 0) {
    return null;
  }

  return (
    <>
      <AnimatePresence>
        {!hasCompletedFirstTransition && (
          <GameTransition onComplete={handleTransitionComplete} />
        )}
      </AnimatePresence>
      <GameBoard
        key={currentRound}
        currentRound={currentRound}
        totalRounds={totalRounds}
        currentTurn={turnsCounter}
        totalPlayers={totalPlayers}
        activePlayer={activePlayer}
        inactivePlayers={inactivePlayers}
        onUpdateCoins={(delta) => updateActivePlayer("coins", delta)}
        onUpdateStars={(delta) => updateActivePlayer("stars", delta)}
        onEndTurn={handleEndTurn}
      />
    </>
  );
};

export default Game;
