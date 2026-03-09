import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import type { Player } from "@/types/game";
import ActivePlayerCard from "@/components/game/ActivePlayerCard";
import InactivePlayerRow from "@/components/game/InactivePlayerRow";
import GameTransition from "@/components/GameTransition";

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

interface GameBoardProps {
  currentRound: number;
  totalRounds: number;
  currentTurn: number;
  totalPlayers: number;
  activePlayer: Player;
  inactivePlayers: Player[];
  onUpdateCoins: (delta: number) => void;
  onUpdateStars: (delta: number) => void;
  onEndTurn: () => void;
}

const normalizePlayers = (rawPlayers: Array<Player | string> = []): Player[] =>
  rawPlayers.map((player) => {
    if (typeof player === "string") {
      return {
        id: player,
        label: player,
        coins: 0,
        stars: 0,
      };
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
}: GameBoardProps) => {
  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-background">
      <div className="h-[75%] flex flex-col p-4 pb-2">
        <div className="flex items-center justify-between px-2 mb-2">
          <div className="flex flex-col">
            <span className="text-xs font-black text-cobalt/40 uppercase tracking-widest">
              Status da Partida
            </span>
            <span className="text-lg font-bold text-cobalt">
              Rodada {currentRound} <span className="text-cobalt/30">/ {totalRounds}</span>
            </span>
          </div>

          <div className="bg-tangerine/10 px-3 py-1 rounded-full border border-tangerine/20">
            <span className="text-xs font-bold text-tangerine">
              Turno {Math.min(currentTurn + 1, totalPlayers)} de {totalPlayers}
            </span>
          </div>
        </div>

        <div className="flex-1 min-h-0">
          <ActivePlayerCard
            player={activePlayer}
            onUpdateCoins={onUpdateCoins}
            onUpdateStars={onUpdateStars}
            onEndTurn={onEndTurn}
          />
        </div>
      </div>

      <div className="h-[25%] border-t-4 border-cobalt-light/20 bg-muted/30">
        <InactivePlayerRow players={inactivePlayers} />
      </div>
    </div>
  );
};

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

  // Reset de ouro obrigatório ao detectar mudança de rodada
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
      state: {
        players: playersAfterRound,
        currentRound,
        totalRounds,
        isGameOver,
      },
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

    // Guard clause universal de fim de rodada
    if (nextTurnsCounter >= totalPlayers) {
      setGameState(GameState.ROUND_END);
      console.log(
        `SISTEMA: Turno ${nextCurrentTurn} de ${totalPlayers} finalizado. Próximo passo: ROUND_END -> RANKING`
      );
      handleShowRanking(rotated);
      return;
    }

    console.log(
      `SISTEMA: Turno ${nextCurrentTurn} de ${totalPlayers} finalizado. Próximo passo: PLAYING`
    );
  };

  if (!location.state || playerOrder.length === 0 || !activePlayer || currentRound <= 0) {
    return null;
  }

  return (
    <GameBoard
      key={currentRound}
      currentRound={currentRound}
      totalRounds={totalRounds}
      currentTurn={turnsCounter}
      totalPlayers={totalPlayers}
      activePlayer={activePlayer}
      inactivePlayers={inactivePlayers}
      onUpdateCoins={(d) => updateActivePlayer("coins", d)}
      onUpdateStars={(d) => updateActivePlayer("stars", d)}
      onEndTurn={handleEndTurn}
    />
  );
};

export default Game;

