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

const RANKING_KEY = 'tikki-fiesta-ranking-state';

const RankingMinigame = () => {
  const location       = useLocation();
  const navigate       = useNavigate();
  const constraintsRef = useRef<HTMLDivElement>(null);

  const effectiveState = (location.state as any) ?? (() => {
    try { const s = localStorage.getItem(RANKING_KEY); return s ? JSON.parse(s) : null; } catch { return null; }
  })();

  const { players, currentRound, totalRounds, isGameOver, playedMinigames = [] } =
    (effectiveState as {
      players: Player[];
      currentRound: number;
      totalRounds: number;
      isGameOver: boolean;
      playedMinigames?: string[];
    }) || {};

  const [order, setOrder] = useState<Player[]>(players ?? []);
  const [tiedPositions, setTiedPositions] = useState<Set<number>>(new Set());

  const toggleTieAt = (idx: number) => {
    setTiedPositions(prev => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx); else next.add(idx);
      return next;
    });
  };

  // Dense ranking: tied position shares rank with the one above it
  const computedRanks = (() => {
    let rank = 1;
    return order.map((_, idx) => {
      if (idx > 0 && !tiedPositions.has(idx)) rank += 1;
      return { rank, reward: REWARDS[rank - 1] ?? 0 };
    });
  })();

  useEffect(() => {
    if (location.state) {
      try { localStorage.setItem(RANKING_KEY, JSON.stringify(location.state)); } catch {}
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!effectiveState) {
    navigate("/game");
    return null;
  }

  const handleConfirm = () => {
    const updated = order.map((p, idx) => ({
      ...p,
      coins: p.coins + computedRanks[idx].reward,
    }));

    if (isGameOver) {
      navigate("/ranking", { state: { players: updated } });
    } else {
      navigate("/game", { state: { players: updated, totalRounds, currentRound, playedMinigames } });
    }
  };

  return (
    <div className="min-h-screen w-full overflow-y-auto overflow-x-hidden flex items-center justify-center px-3 py-2" style={{ minHeight: '100dvh' }}>
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
          className="text-center mb-2 short:mb-1"
          style={{
            fontFamily: 'Fredoka, sans-serif',
            fontSize: 'clamp(0.75rem, 2vh, 0.95rem)',
            color: COLORS.marromProfundo,
            opacity: 0.65,
          }}
        >
          Arraste para ordenar do 1º ao último
        </p>

        {/* em short: mode, lista com scroll interno para o botão ficar sempre visível */}
        <div
          ref={constraintsRef}
          className="overflow-hidden short:overflow-y-auto rounded-lg short:max-h-[calc(100dvh_-_185px)]"
        >
          <Reorder.Group
            axis="y"
            values={order}
            onReorder={(newOrder) => { setOrder(newOrder); setTiedPositions(new Set()); }}
            className="flex flex-col gap-1.5 short:gap-1"
            style={{ listStyle: 'none', padding: 0, margin: 0 }}
          >
            {order.map((player, idx) => {
              const { rank, reward } = computedRanks[idx];
              const badge = BADGE_STYLES[rank - 1] ?? BADGE_STYLES[3];
              const isTied = idx > 0 && tiedPositions.has(idx);

              return (
                <Reorder.Item
                  key={player.id}
                  value={player}
                  dragConstraints={constraintsRef}
                  style={{ listStyle: 'none' }}
                  whileDrag={{ scale: 1.04, boxShadow: '0 8px 24px rgba(0,0,0,0.3)', zIndex: 10 }}
                >
                  {/* ── Empate toggle — entre este item e o anterior ── */}
                  {idx > 0 && (
                    <div
                      onPointerDown={(e) => e.stopPropagation()}
                      onClick={(e) => { e.stopPropagation(); toggleTieAt(idx); }}
                      className="flex justify-center cursor-pointer mb-1.5 short:mb-1"
                    >
                      {isTied ? (
                        <span style={{
                          background: COLORS.verde,
                          color: '#fff',
                          fontFamily: 'Fredoka, sans-serif',
                          fontWeight: 700,
                          fontSize: 'clamp(0.85rem, 2.5vh, 1rem)',
                          padding: '0.15rem 1rem',
                          borderRadius: '1rem',
                          letterSpacing: '0.06em',
                          boxShadow: '0 2px 6px rgba(0,0,0,0.35)',
                          userSelect: 'none',
                        }}>
                          = EMPATE
                        </span>
                      ) : (
                        <span style={{
                          background: 'rgba(0,0,0,0.22)',
                          color: 'rgba(255,255,255,0.65)',
                          fontFamily: 'Fredoka, sans-serif',
                          fontWeight: 600,
                          fontSize: 'clamp(0.7rem, 2vh, 0.82rem)',
                          padding: '0.1rem 0.65rem',
                          borderRadius: '1rem',
                          userSelect: 'none',
                        }}>
                          ⊕ empatar com ↑
                        </span>
                      )}
                    </div>
                  )}

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>

                    {/* Badge externo — posição e recompensa */}
                    <div style={{
                      width: 54,
                      flexShrink: 0,
                      background: badge.bg,
                      borderRadius: '0.5rem',
                      padding: '0.3rem 0.2rem',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      border: `2px solid ${COLORS.madeiraEscura}`,
                      boxShadow: '2px 3px 0 rgba(45,27,13,0.4)',
                    }}>
                      <span style={{ fontFamily: 'Fredoka, sans-serif', fontWeight: 700, fontSize: 'clamp(0.9rem, 2.5vh, 1.1rem)', color: badge.text, lineHeight: 1 }}>
                        {rank}º
                      </span>
                      <span style={{ fontFamily: 'Fredoka, sans-serif', fontSize: '0.65rem', color: badge.text, opacity: 0.9, marginTop: 2 }}>
                        +{reward}<img src={`${import.meta.env.BASE_URL}img/coco.png`} alt="" className="inline-block" style={{ height: '0.65rem', width: 'auto', verticalAlign: 'middle' }} />
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
                          <div className="w-10 h-10 short:w-8 short:h-8 rounded-full overflow-hidden shrink-0">
                            <CharacterAvatar player={player} fill />
                          </div>
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

        <div className="flex justify-center mt-2 short:mt-1">
          <TropicalButton variant="primary" size="md" onClick={handleConfirm}>
            ✅ Confirmar Ranking
          </TropicalButton>
        </div>
      </WoodenPanel>
    </div>
  );
};

export default RankingMinigame;
