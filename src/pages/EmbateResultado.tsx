import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { TropicalBackground } from "@/components/layout/TropicalBackground";
import { WoodenPanel } from "@/components/layout/WoodenPanel";
import { COLORS } from "@/lib/tokens";
import type { Player } from "@/types/game";
import { CharacterAvatar } from "@/components/CharacterAvatar";

const EmbateResultado = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { players, currentRound, totalRounds, playedMinigames = [], embateContext } =
    (location.state as {
      players: Player[];
      currentRound: number;
      totalRounds: number;
      playedMinigames?: string[];
      embateContext: { challengerId: string; opponentId: string; betAmount: number };
    }) || {};

  useEffect(() => {
    if (!location.state) navigate("/game");
  }, [location.state, navigate]);

  if (!location.state) return null;

  const challenger = players.find(p => p.id === embateContext.challengerId)!;
  const opponent = players.find(p => p.id === embateContext.opponentId)!;
  const { betAmount } = embateContext;

  const handleWinner = (winnerId: string) => {
    const loserId = winnerId === challenger.id ? opponent.id : challenger.id;
    const updatedPlayers = players.map(p => {
      if (p.id === winnerId) return { ...p, coins: p.coins + betAmount };
      if (p.id === loserId) return { ...p, coins: Math.max(0, p.coins - betAmount) };
      return p;
    });
    navigate("/game", {
      state: {
        players: updatedPlayers,
        totalRounds,
        currentRound,
        playedMinigames,
      },
    });
  };

  return (
    <div className="min-h-screen w-full overflow-x-hidden flex items-center justify-center px-4 py-3" style={{ minHeight: '100dvh' }}>
      <TropicalBackground />

      <WoodenPanel compact className="max-w-sm w-full mx-auto">
        <h1
          className="text-center mb-2"
          style={{
            fontFamily: 'Fredoka, sans-serif',
            fontWeight: 700,
            fontSize: 'clamp(1.2rem, 4vw, 1.6rem)',
            color: COLORS.marromProfundo,
          }}
        >
          ⚔️ Quem saiu vitorioso?
        </h1>

        <p
          className="text-center mb-5"
          style={{
            fontFamily: 'Quicksand, sans-serif',
            fontSize: '0.88rem',
            color: COLORS.marromProfundo,
            opacity: 0.7,
          }}
        >
          Aposta: <strong>{betAmount}</strong>
          <img
            src={`${import.meta.env.BASE_URL}img/coco.png`}
            alt=""
            className="inline-block mx-1"
            style={{ height: '1rem', width: 'auto', verticalAlign: 'middle' }}
          />
          em jogo
        </p>

        <div className="flex gap-3 justify-center">
          {[challenger, opponent].map(player => (
            <button
              key={player.id}
              onClick={() => handleWinner(player.id)}
              className="flex-1 flex flex-col items-center gap-2 rounded-2xl p-4 transition-all hover:scale-[1.04] active:scale-95"
              style={{
                background: `${player.color}22`,
                border: `3px solid ${player.color}`,
                boxShadow: `0 4px 0 rgba(45,27,13,0.4)`,
                cursor: 'pointer',
              }}
            >
              <CharacterAvatar player={player} size={64} />
              <span style={{
                fontFamily: 'Fredoka, sans-serif',
                fontWeight: 700,
                fontSize: '1rem',
                color: COLORS.marromProfundo,
                textAlign: 'center',
              }}>
                {player.label}
              </span>
              <span style={{
                fontFamily: 'Quicksand, sans-serif',
                fontSize: '0.78rem',
                color: COLORS.marromProfundo,
                opacity: 0.7,
              }}>
                {player.coins}
                <img
                  src={`${import.meta.env.BASE_URL}img/coco.png`}
                  alt=""
                  className="inline-block mx-0.5"
                  style={{ height: '0.9rem', width: 'auto', verticalAlign: 'middle' }}
                />
                <span style={{ color: COLORS.verde, fontWeight: 700 }}>+{betAmount}</span>
              </span>
            </button>
          ))}
        </div>
      </WoodenPanel>
    </div>
  );
};

export default EmbateResultado;
