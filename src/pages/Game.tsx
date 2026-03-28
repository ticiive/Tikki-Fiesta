import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { Flame, Map, Waves } from "lucide-react";
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
      const char = getCharacter(player);
      return { id: player, label: char.name, coins: 0, stars: 0 };
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
                  {Math.min(currentTurn + 1, totalPlayers)}/{totalPlayers}
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
            onUpdateCoins={onUpdateCoins}
            onUpdateStars={onUpdateStars}
            onEndTurn={onEndTurn}
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
    setCurrentRound((prev) => prev + 1);
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
    setPlayerOrder((prev) => {
      if (prev.length === 0) return prev;
      const updated = [...prev];
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
