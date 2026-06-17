import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { TropicalBackground } from "@/components/layout/TropicalBackground";
import { WoodenCard } from "@/components/ui/WoodenCard";
import { TropicalButton } from "@/components/ui/TropicalButton";
import { COLORS } from "@/lib/tokens";
import type { Player } from "@/types/game";

type Choice = 'palma' | 'gancho';
type Phase = 'escondedor-choose' | 'pass-phone' | 'adivinhador-choose' | 'reveal' | 'game-over';

const PALMA_KEY = 'tikki-fiesta-palma-state';
const POINTS_TO_WIN = 3;

const PalmaOuGancho = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const effectiveState = (location.state as any) ?? (() => {
    try { const s = localStorage.getItem(PALMA_KEY); return s ? JSON.parse(s) : null; } catch { return null; }
  })();

  const {
    players = [],
    currentRound,
    totalRounds,
    isGameOver,
    playedMinigames = [],
    embateContext,
  } = (effectiveState as any) || {};

  useEffect(() => {
    if (location.state) {
      try { localStorage.setItem(PALMA_KEY, JSON.stringify(location.state)); } catch {}
    }
  }, []); // eslint-disable-line

  useEffect(() => {
    if (!effectiveState) navigate("/game");
  }, []); // eslint-disable-line

  const activePlayers: Player[] = embateContext
    ? (players as Player[]).filter((p: Player) => p.id === embateContext.challengerId || p.id === embateContext.opponentId)
    : players;

  const is1v1 = activePlayers.length <= 2;

  const [phase, setPhase] = useState<Phase>('escondedor-choose');
  const [escondedorIdx, setEscondedorIdx] = useState(0);
  const [escondedorChoice, setEscondedorChoice] = useState<Choice | null>(null);
  const [adivinhadorChoice, setAdivinhadorChoice] = useState<Choice | null>(null);
  const [scores, setScores] = useState<Record<string, number>>(() =>
    Object.fromEntries(activePlayers.map((p: Player) => [p.id, 0]))
  );
  const [winner, setWinner] = useState<Player | null>(null);

  if (!effectiveState) return null;

  const handleEncerrar = () => {
    navigate('/ranking-minigame', {
      state: { players, currentRound, totalRounds, isGameOver, playedMinigames },
    });
  };

  if (!is1v1) {
    return (
      <div className="min-h-screen w-full overflow-x-hidden flex items-center justify-center px-4 py-3" style={{ minHeight: '100dvh' }}>
        <TropicalBackground />
        <div className="relative max-w-md w-full" style={{ overflow: 'visible' }}>
          <WoodenCard variant="main" irregularCorners>
            <div className="flex flex-col items-center gap-4 px-4 py-6">
              <div className="flex items-center gap-2">
                <span style={{ fontSize: 'clamp(1.4rem, 4vw, 2rem)', lineHeight: 1 }}>✋</span>
                <h1 style={{
                  fontFamily: 'Fredoka, sans-serif',
                  fontWeight: 700,
                  fontSize: 'clamp(1rem, 3vw, 1.5rem)',
                  color: COLORS.marromProfundo,
                  textShadow: '1px 1px 0 rgba(255,255,255,0.4)',
                }}>
                  Palma ou Gancho?
                </h1>
              </div>
              <div style={{
                background: COLORS.madeiraMedia,
                borderRadius: '1rem',
                padding: '1rem 1.25rem',
                width: '100%',
              }}>
                <p style={{
                  fontFamily: 'Fredoka, sans-serif',
                  fontWeight: 700,
                  fontSize: '1rem',
                  color: COLORS.areia,
                  textAlign: 'center',
                  marginBottom: '0.5rem',
                }}>
                  Jogo presencial
                </p>
                <div style={{ fontFamily: 'Quicksand, sans-serif', fontSize: '0.9rem', color: COLORS.areia, opacity: 0.9, display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <p>1. Todos escondem a mão atrás das costas</p>
                  <p>2. Juntos: "Um… Dois… Três…"</p>
                  <p>3. Todos revelam: ✋ Palma ou 🪝 Gancho</p>
                  <p>4. Quem ficar na <strong>minoria</strong> é eliminado</p>
                  <p>5. Empate → ninguém sai, repete a rodada</p>
                  <p>6. Último de pé vence!</p>
                </div>
              </div>
              <TropicalButton variant="primary" size="lg" onClick={handleEncerrar}>
                🏁 Ir para Ranking
              </TropicalButton>
            </div>
          </WoodenCard>
        </div>
      </div>
    );
  }

  // 1v1 mode
  const escondedor = activePlayers[escondedorIdx];
  const adivinhador = activePlayers[1 - escondedorIdx];

  const handleEscondedorChoose = (choice: Choice) => {
    setEscondedorChoice(choice);
    setPhase('pass-phone');
  };

  const handlePassConfirm = () => {
    setPhase('adivinhador-choose');
  };

  const handleAdivinhadorChoose = (choice: Choice) => {
    setAdivinhadorChoice(choice);
    setPhase('reveal');
  };

  const handleNextRound = () => {
    const acertou = adivinhadorChoice === escondedorChoice;
    const winnerId = acertou ? adivinhador.id : escondedor.id;
    const newScores = { ...scores, [winnerId]: scores[winnerId] + 1 };
    setScores(newScores);

    if (newScores[winnerId] >= POINTS_TO_WIN) {
      const w = activePlayers.find((p: Player) => p.id === winnerId) ?? null;
      setWinner(w);
      setPhase('game-over');
    } else {
      setEscondedorChoice(null);
      setAdivinhadorChoice(null);
      setEscondedorIdx(i => 1 - i);
      setPhase('escondedor-choose');
    }
  };

  const scoreP0 = scores[activePlayers[0]?.id] ?? 0;
  const scoreP1 = scores[activePlayers[1]?.id] ?? 0;

  return (
    <div className="min-h-screen w-full overflow-x-hidden flex items-center justify-center px-4 py-3" style={{ minHeight: '100dvh' }}>
      <TropicalBackground />
      <div className="relative max-w-md w-full" style={{ overflow: 'visible' }}>
        <WoodenCard variant="main" irregularCorners>
          <div className="flex flex-col items-center gap-4 px-4 py-5">

            {/* Header */}
            <div className="flex items-center gap-2">
              <span style={{ fontSize: 'clamp(1.4rem, 4vw, 2rem)', lineHeight: 1 }}>✋</span>
              <h1 style={{
                fontFamily: 'Fredoka, sans-serif',
                fontWeight: 700,
                fontSize: 'clamp(1rem, 3vw, 1.5rem)',
                color: COLORS.marromProfundo,
                textShadow: '1px 1px 0 rgba(255,255,255,0.4)',
              }}>
                Palma ou Gancho?
              </h1>
            </div>

            {/* Scoreboard */}
            <div style={{
              display: 'flex',
              gap: '1rem',
              width: '100%',
              justifyContent: 'center',
            }}>
              {activePlayers.map((p: Player, i: number) => (
                <div key={p.id} style={{
                  flex: 1,
                  background: COLORS.madeiraMedia,
                  borderRadius: '0.75rem',
                  padding: '0.5rem 0.75rem',
                  textAlign: 'center',
                  border: escondedorIdx === i ? `2px solid ${COLORS.ouro}` : '2px solid transparent',
                }}>
                  <p style={{ fontFamily: 'Fredoka, sans-serif', fontWeight: 700, fontSize: '0.9rem', color: (p as any).color ?? COLORS.ouro }}>{p.label}</p>
                  <p style={{ fontFamily: 'Fredoka, sans-serif', fontWeight: 700, fontSize: '1.4rem', color: COLORS.areia }}>{i === 0 ? scoreP0 : scoreP1}</p>
                  <p style={{ fontFamily: 'Quicksand, sans-serif', fontSize: '0.65rem', color: COLORS.areia, opacity: 0.7 }}>de {POINTS_TO_WIN}</p>
                </div>
              ))}
            </div>

            {/* Phase content */}
            {phase === 'escondedor-choose' && (
              <div className="flex flex-col items-center gap-3 w-full">
                <div style={{
                  background: COLORS.madeiraMedia,
                  borderRadius: '1rem',
                  padding: '0.75rem 1rem',
                  textAlign: 'center',
                  width: '100%',
                }}>
                  <p style={{ fontFamily: 'Quicksand, sans-serif', fontSize: '0.8rem', color: COLORS.areia, opacity: 0.8, marginBottom: '0.2rem' }}>Escondedor</p>
                  <p style={{ fontFamily: 'Fredoka, sans-serif', fontWeight: 700, fontSize: '1.2rem', color: (escondedor as any).color ?? COLORS.ouro }}>
                    {escondedor.label}
                  </p>
                  <p style={{ fontFamily: 'Quicksand, sans-serif', fontSize: '0.75rem', color: COLORS.areia, opacity: 0.7, marginTop: '0.25rem' }}>
                    Escolha sem mostrar para {adivinhador.label}
                  </p>
                </div>
                <div className="flex gap-3 w-full">
                  <button
                    onClick={() => handleEscondedorChoose('palma')}
                    style={{
                      flex: 1,
                      background: COLORS.coral,
                      border: `3px solid ${COLORS.madeiraEscura}`,
                      borderRadius: '1rem',
                      padding: '1rem',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '0.25rem',
                      boxShadow: '0 3px 0 rgba(45,27,13,0.4)',
                    }}
                  >
                    <span style={{ fontSize: '2.5rem' }}>✋</span>
                    <span style={{ fontFamily: 'Fredoka, sans-serif', fontWeight: 700, fontSize: '1rem', color: '#fff' }}>Palma</span>
                  </button>
                  <button
                    onClick={() => handleEscondedorChoose('gancho')}
                    style={{
                      flex: 1,
                      background: COLORS.turquoise,
                      border: `3px solid ${COLORS.madeiraEscura}`,
                      borderRadius: '1rem',
                      padding: '1rem',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '0.25rem',
                      boxShadow: '0 3px 0 rgba(45,27,13,0.4)',
                    }}
                  >
                    <span style={{ fontSize: '2.5rem' }}>🪝</span>
                    <span style={{ fontFamily: 'Fredoka, sans-serif', fontWeight: 700, fontSize: '1rem', color: '#fff' }}>Gancho</span>
                  </button>
                </div>
              </div>
            )}

            {phase === 'pass-phone' && (
              <div className="flex flex-col items-center gap-3 w-full">
                <div style={{
                  background: COLORS.madeiraMedia,
                  borderRadius: '1rem',
                  padding: '1.25rem 1rem',
                  textAlign: 'center',
                  width: '100%',
                }}>
                  <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '0.5rem' }}>📱</span>
                  <p style={{ fontFamily: 'Fredoka, sans-serif', fontWeight: 700, fontSize: '1.1rem', color: COLORS.areia, marginBottom: '0.25rem' }}>
                    Passe o celular para
                  </p>
                  <p style={{ fontFamily: 'Fredoka, sans-serif', fontWeight: 700, fontSize: '1.4rem', color: (adivinhador as any).color ?? COLORS.ouro }}>
                    {adivinhador.label}
                  </p>
                  <p style={{ fontFamily: 'Quicksand, sans-serif', fontSize: '0.75rem', color: COLORS.areia, opacity: 0.7, marginTop: '0.25rem' }}>
                    Não mostre a tela para {escondedor.label}!
                  </p>
                </div>
                <TropicalButton variant="primary" size="lg" onClick={handlePassConfirm}>
                  ✅ Já passei
                </TropicalButton>
              </div>
            )}

            {phase === 'adivinhador-choose' && (
              <div className="flex flex-col items-center gap-3 w-full">
                <div style={{
                  background: COLORS.madeiraMedia,
                  borderRadius: '1rem',
                  padding: '0.75rem 1rem',
                  textAlign: 'center',
                  width: '100%',
                }}>
                  <p style={{ fontFamily: 'Quicksand, sans-serif', fontSize: '0.8rem', color: COLORS.areia, opacity: 0.8, marginBottom: '0.2rem' }}>Adivinhador</p>
                  <p style={{ fontFamily: 'Fredoka, sans-serif', fontWeight: 700, fontSize: '1.2rem', color: (adivinhador as any).color ?? COLORS.ouro }}>
                    {adivinhador.label}
                  </p>
                  <p style={{ fontFamily: 'Quicksand, sans-serif', fontSize: '0.75rem', color: COLORS.areia, opacity: 0.7, marginTop: '0.25rem' }}>
                    O que {escondedor.label} escolheu?
                  </p>
                </div>
                <div className="flex gap-3 w-full">
                  <button
                    onClick={() => handleAdivinhadorChoose('palma')}
                    style={{
                      flex: 1,
                      background: COLORS.coral,
                      border: `3px solid ${COLORS.madeiraEscura}`,
                      borderRadius: '1rem',
                      padding: '1rem',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '0.25rem',
                      boxShadow: '0 3px 0 rgba(45,27,13,0.4)',
                    }}
                  >
                    <span style={{ fontSize: '2.5rem' }}>✋</span>
                    <span style={{ fontFamily: 'Fredoka, sans-serif', fontWeight: 700, fontSize: '1rem', color: '#fff' }}>Palma</span>
                  </button>
                  <button
                    onClick={() => handleAdivinhadorChoose('gancho')}
                    style={{
                      flex: 1,
                      background: COLORS.turquoise,
                      border: `3px solid ${COLORS.madeiraEscura}`,
                      borderRadius: '1rem',
                      padding: '1rem',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '0.25rem',
                      boxShadow: '0 3px 0 rgba(45,27,13,0.4)',
                    }}
                  >
                    <span style={{ fontSize: '2.5rem' }}>🪝</span>
                    <span style={{ fontFamily: 'Fredoka, sans-serif', fontWeight: 700, fontSize: '1rem', color: '#fff' }}>Gancho</span>
                  </button>
                </div>
              </div>
            )}

            {phase === 'reveal' && escondedorChoice && adivinhadorChoice && (
              <div className="flex flex-col items-center gap-3 w-full">
                <div style={{ display: 'flex', gap: '1rem', width: '100%' }}>
                  <div style={{
                    flex: 1,
                    background: COLORS.madeiraMedia,
                    borderRadius: '1rem',
                    padding: '0.75rem',
                    textAlign: 'center',
                  }}>
                    <p style={{ fontFamily: 'Quicksand, sans-serif', fontSize: '0.7rem', color: COLORS.areia, opacity: 0.7, marginBottom: '0.25rem' }}>{escondedor.label} escondeu</p>
                    <span style={{ fontSize: '2.5rem' }}>{escondedorChoice === 'palma' ? '✋' : '🪝'}</span>
                    <p style={{ fontFamily: 'Fredoka, sans-serif', fontWeight: 700, fontSize: '0.9rem', color: COLORS.areia, marginTop: '0.25rem' }}>
                      {escondedorChoice === 'palma' ? 'Palma' : 'Gancho'}
                    </p>
                  </div>
                  <div style={{
                    flex: 1,
                    background: COLORS.madeiraMedia,
                    borderRadius: '1rem',
                    padding: '0.75rem',
                    textAlign: 'center',
                  }}>
                    <p style={{ fontFamily: 'Quicksand, sans-serif', fontSize: '0.7rem', color: COLORS.areia, opacity: 0.7, marginBottom: '0.25rem' }}>{adivinhador.label} chutou</p>
                    <span style={{ fontSize: '2.5rem' }}>{adivinhadorChoice === 'palma' ? '✋' : '🪝'}</span>
                    <p style={{ fontFamily: 'Fredoka, sans-serif', fontWeight: 700, fontSize: '0.9rem', color: COLORS.areia, marginTop: '0.25rem' }}>
                      {adivinhadorChoice === 'palma' ? 'Palma' : 'Gancho'}
                    </p>
                  </div>
                </div>

                {(() => {
                  const acertou = adivinhadorChoice === escondedorChoice;
                  const pointWinner = acertou ? adivinhador : escondedor;
                  return (
                    <div style={{
                      background: acertou ? COLORS.verde : COLORS.alerta,
                      borderRadius: '1rem',
                      padding: '0.75rem 1rem',
                      textAlign: 'center',
                      width: '100%',
                    }}>
                      <p style={{ fontFamily: 'Fredoka, sans-serif', fontWeight: 700, fontSize: '1rem', color: '#fff' }}>
                        {acertou ? '✅ Acertou!' : '❌ Errou!'}
                      </p>
                      <p style={{ fontFamily: 'Quicksand, sans-serif', fontSize: '0.85rem', color: '#fff', opacity: 0.9 }}>
                        +1 ponto para <strong>{pointWinner.label}</strong>
                      </p>
                    </div>
                  );
                })()}

                <TropicalButton variant="primary" size="lg" onClick={handleNextRound}>
                  ▶️ Próxima Rodada
                </TropicalButton>
              </div>
            )}

            {phase === 'game-over' && winner && (
              <div className="flex flex-col items-center gap-3 w-full">
                <div style={{
                  background: COLORS.madeiraMedia,
                  borderRadius: '1rem',
                  padding: '1.25rem 1rem',
                  textAlign: 'center',
                  width: '100%',
                }}>
                  <span style={{ fontSize: '3rem', display: 'block', marginBottom: '0.5rem' }}>🏆</span>
                  <p style={{ fontFamily: 'Quicksand, sans-serif', fontSize: '0.8rem', color: COLORS.areia, opacity: 0.8, marginBottom: '0.25rem' }}>Vencedor</p>
                  <p style={{ fontFamily: 'Fredoka, sans-serif', fontWeight: 700, fontSize: '1.5rem', color: (winner as any).color ?? COLORS.ouro }}>
                    {winner.label}
                  </p>
                  <p style={{ fontFamily: 'Quicksand, sans-serif', fontSize: '0.75rem', color: COLORS.areia, opacity: 0.7, marginTop: '0.25rem' }}>
                    Primeiro a {POINTS_TO_WIN} pontos!
                  </p>
                </div>
                <TropicalButton variant="primary" size="lg" onClick={handleEncerrar}>
                  🏁 Ir para Ranking
                </TropicalButton>
              </div>
            )}

          </div>
        </WoodenCard>
      </div>
    </div>
  );
};

export default PalmaOuGancho;
