import { useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Reorder } from "framer-motion";
import { TropicalBackground } from "@/components/layout/TropicalBackground";
import { WoodenPanel } from "@/components/layout/WoodenPanel";
import { WoodenCard } from "@/components/ui/WoodenCard";
import { TropicalButton } from "@/components/ui/TropicalButton";
import { COLORS } from "@/lib/tokens";
import type { Player } from "@/types/game";
import { CharacterAvatar } from "@/components/CharacterAvatar";

const REWARDS = [5, 3, 1, 0];

const BADGE_STYLES = [
  { bg: COLORS.ouro,        text: COLORS.marromProfundo },
  { bg: COLORS.prata,       text: COLORS.marromProfundo },
  { bg: COLORS.bronze,      text: '#FDF5E6' },
  { bg: COLORS.areiaEscura, text: COLORS.marromProfundo },
];

const RankingMinigame = () => {
  const location       = useLocation();
  const navigate       = useNavigate();
  const constraintsRef = useRef<HTMLDivElement>(null);

  const { players, currentRound, totalRounds, isGameOver, playedMinigames = [] } =
    (location.state as {
      players: Player[];
      currentRound: number;
      totalRounds: number;
      isGameOver: boolean;
      playedMinigames?: string[];
    }) || {};

  const [order, setOrder] = useState<Player[]>(players ?? []);

  if (!location.state) {
    navigate("/");
    return null;
  }

  const handleConfirm = () => {
    const updated = order.map((p, idx) => ({
      ...p,
      coins: p.coins + (REWARDS[idx] ?? 0),
    }));

    if (isGameOver) {
      navigate("/ranking", { state: { players: updated } });
    } else {
      navigate("/game", { state: { players: updated, totalRounds, currentRound, playedMinigames } });
    }
  };

  return (
    <div className="h-screen w-screen overflow-y-auto flex items-center justify-center px-3 py-2">
      <TropicalBackground />

      <WoodenPanel compact className="max-w-xl w-full mx-auto">
        <h1
          className="text-center"
          style={{
            fontFamily: 'Fredoka, sans-serif',
            fontWeight: 700,
            fontSize: 'clamp(1.2rem, 3vh, 1.8rem)',
            color: COLORS.marromProfundo,
            marginBottom: '0.15rem',
          }}
        >
          🏆 Resultado do Minigame
        </h1>
        <p
          className="text-center"
          style={{
            fontFamily: 'Fredoka, sans-serif',
            fontSize: 'clamp(0.75rem, 2vh, 0.95rem)',
            color: COLORS.marromProfundo,
            opacity: 0.65,
            marginBottom: '0.6rem',
          }}
        >
          Arraste para ordenar do 1º ao último
        </p>

        {/* ref de constraint — o drag fica restrito a este container */}
        <div ref={constraintsRef} style={{ overflow: 'hidden', borderRadius: '0.5rem' }}>
          <Reorder.Group
            axis="y"
            values={order}
            onReorder={setOrder}
            style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.4rem' }}
          >
            {order.map((player, idx) => {
              const badge  = BADGE_STYLES[idx] ?? BADGE_STYLES[3];
              const reward = REWARDS[idx] ?? 0;

              return (
                <Reorder.Item
                  key={player.id}
                  value={player}
                  dragConstraints={constraintsRef}
                  style={{ listStyle: 'none' }}
                  whileDrag={{ scale: 1.04, boxShadow: '0 8px 24px rgba(0,0,0,0.3)', zIndex: 10 }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>

                    {/* Badge externo — posição e recompensa */}
                    <div style={{
                      width: 54,
                      flexShrink: 0,
                      background: badge.bg,
                      borderRadius: '0.5rem',
                      padding: '0.25rem 0.2rem',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      border: `2px solid ${COLORS.madeiraEscura}`,
                      boxShadow: '2px 3px 0 rgba(45,27,13,0.4)',
                    }}>
                      <span style={{ fontFamily: 'Fredoka, sans-serif', fontWeight: 700, fontSize: 'clamp(0.9rem, 2.5vh, 1.1rem)', color: badge.text, lineHeight: 1 }}>
                        {idx + 1}º
                      </span>
                      <span style={{ fontFamily: 'Fredoka, sans-serif', fontSize: '0.65rem', color: badge.text, opacity: 0.9, marginTop: 1 }}>
                        +{reward}🥥
                      </span>
                    </div>

                    {/* Card arrastável */}
                    <div style={{ flex: 1 }}>
                      <WoodenCard variant="card" ringColor={player.color}>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          padding: 'clamp(0.3rem, 1vh, 0.6rem) 0.75rem',
                          gap: '0.5rem',
                        }}>
                          <CharacterAvatar player={player} size={40} className="shrink-0" />
                          <span style={{ flex: 1, fontFamily: 'Fredoka, sans-serif', fontWeight: 700, fontSize: 'clamp(0.9rem, 2.5vh, 1.2rem)', color: '#FDF5E6', textShadow: '0 1px 3px rgba(0,0,0,0.5)' }}>
                            {player.label}
                          </span>
                          <span style={{ fontSize: '1.1rem', opacity: 0.45, cursor: 'grab', userSelect: 'none' }}>⠿</span>
                        </div>
                      </WoodenCard>
                    </div>

                  </div>
                </Reorder.Item>
              );
            })}
          </Reorder.Group>
        </div>

        <div className="flex justify-center mt-3">
          <TropicalButton variant="primary" size="md" onClick={handleConfirm}>
            ✅ Confirmar Ranking
          </TropicalButton>
        </div>
      </WoodenPanel>
    </div>
  );
};

export default RankingMinigame;
