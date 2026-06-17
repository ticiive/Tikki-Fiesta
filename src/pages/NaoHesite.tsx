import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { TropicalBackground } from "@/components/layout/TropicalBackground";
import { WoodenCard } from "@/components/ui/WoodenCard";
import { TropicalButton } from "@/components/ui/TropicalButton";
import { COLORS } from "@/lib/tokens";
import type { Player } from "@/types/game";

const RADIUS = 100;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const DURATION = 90;

const beep = () => {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    osc.frequency.value = 800;
    osc.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.12);
  } catch (_) {}
};

const NAO_HESITE_KEY = 'tikki-fiesta-nao-hesite-state';

const NaoHesite = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const effectiveState = (location.state as any) ?? (() => {
    try { const s = localStorage.getItem(NAO_HESITE_KEY); return s ? JSON.parse(s) : null; } catch { return null; }
  })();

  const {
    players = [],
    currentRound,
    totalRounds,
    isGameOver,
    playedMinigames = [],
    embateContext,
  } = (effectiveState as any) || {};

  const activePlayers: Player[] = embateContext
    ? (players as Player[]).filter(p => p.id === embateContext.challengerId || p.id === embateContext.opponentId)
    : players;

  const [playerIdx, setPlayerIdx] = useState(0);
  const [phase, setPhase] = useState<'waiting' | 'running' | 'done'>('waiting');
  const [timeLeft, setTimeLeft] = useState(DURATION);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (location.state) {
      try { localStorage.setItem(NAO_HESITE_KEY, JSON.stringify(location.state)); } catch {}
    }
  }, []); // eslint-disable-line

  useEffect(() => {
    if (!effectiveState) navigate("/game");
  }, []); // eslint-disable-line

  useEffect(() => {
    if (phase !== 'running') return;
    intervalRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!);
          setPhase('done');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current!);
  }, [phase]);

  useEffect(() => {
    if (phase === 'running' && timeLeft <= 10 && timeLeft > 0) beep();
  }, [timeLeft, phase]);

  useEffect(() => {
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, []);

  if (!effectiveState) return null;

  const currentPlayer = activePlayers[playerIdx];
  const isLastPlayer = playerIdx === activePlayers.length - 1;
  const isUrgent = timeLeft <= 10 && phase === 'running';
  const dashOffset = phase === 'waiting' ? CIRCUMFERENCE : CIRCUMFERENCE * (1 - timeLeft / DURATION);
  const arcColor = isUrgent ? COLORS.alerta : COLORS.coral;
  const numberColor = isUrgent ? COLORS.alerta : COLORS.marromProfundo;
  const label = String(timeLeft).padStart(2, '0');
  const circleSize = 'clamp(140px, 30vh, 200px)';

  const handleStart = () => {
    setTimeLeft(DURATION);
    setPhase('running');
  };

  const handleFailed = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setPhase('done');
    setTimeLeft(0);
  };

  const handleNext = () => {
    if (isLastPlayer) {
      navigate('/ranking-minigame', {
        state: { players, currentRound, totalRounds, isGameOver, playedMinigames },
      });
    } else {
      setPlayerIdx(i => i + 1);
      setPhase('waiting');
      setTimeLeft(DURATION);
    }
  };

  return (
    <div className="min-h-screen w-full overflow-x-hidden flex items-center justify-center px-4 py-3" style={{ minHeight: '100dvh' }}>
      <TropicalBackground />

      <div className="relative max-w-md w-full" style={{ overflow: 'visible' }}>
        <WoodenCard variant="main" irregularCorners>
          <div className="flex flex-col items-center gap-4 px-4 py-5">

            {/* Header */}
            <div className="flex items-center gap-2">
              <span style={{ fontSize: 'clamp(1.4rem, 4vw, 2rem)', lineHeight: 1 }}>🤐</span>
              <h1 style={{
                fontFamily: 'Fredoka, sans-serif',
                fontWeight: 700,
                fontSize: 'clamp(1rem, 3vw, 1.5rem)',
                color: COLORS.marromProfundo,
                textShadow: '1px 1px 0 rgba(255,255,255,0.4)',
              }}>
                Não Hesite
              </h1>
            </div>

            {/* Player indicator */}
            <div style={{
              background: COLORS.madeiraMedia,
              borderRadius: '1rem',
              padding: '0.5rem 1.25rem',
              textAlign: 'center',
              width: '100%',
            }}>
              <p style={{
                fontFamily: 'Quicksand, sans-serif',
                fontSize: 'clamp(0.75rem, 1.8vw, 0.85rem)',
                color: COLORS.areia,
                opacity: 0.85,
                marginBottom: '0.15rem',
              }}>
                {phase === 'waiting' ? 'Vez de contar a história:' : phase === 'running' ? 'Contando...' : 'Fim da vez!'}
              </p>
              <p style={{
                fontFamily: 'Fredoka, sans-serif',
                fontWeight: 700,
                fontSize: 'clamp(1.1rem, 3vw, 1.5rem)',
                color: (currentPlayer as any)?.color ?? COLORS.ouro,
                textShadow: '0 1px 3px rgba(0,0,0,0.4)',
              }}>
                {currentPlayer?.label ?? ''}
              </p>
              <p style={{
                fontFamily: 'Quicksand, sans-serif',
                fontSize: 'clamp(0.7rem, 1.6vw, 0.8rem)',
                color: COLORS.areia,
                opacity: 0.7,
                marginTop: '0.1rem',
              }}>
                Jogador {playerIdx + 1} de {activePlayers.length}
              </p>
            </div>

            {/* Timer circle */}
            <div className="relative flex items-center justify-center"
              style={{ width: circleSize, height: circleSize }}>
              <svg viewBox="0 0 220 220" style={{ width: '100%', height: '100%', filter: 'drop-shadow(3px 5px 0 rgba(45,27,13,0.45))' }}>
                <circle cx="110" cy="110" r={RADIUS} fill={COLORS.areia} />
                <circle cx="110" cy="110" r={RADIUS} fill="none" stroke={COLORS.madeiraEscura} strokeWidth={12} />
                <circle
                  cx="110" cy="110" r={RADIUS}
                  fill="none"
                  stroke={arcColor}
                  strokeWidth={8}
                  strokeLinecap="round"
                  strokeDasharray={CIRCUMFERENCE}
                  strokeDashoffset={dashOffset}
                  style={{
                    transform: 'rotate(-90deg)',
                    transformOrigin: '110px 110px',
                    transition: phase === 'running' ? 'stroke-dashoffset 0.8s linear, stroke 0.3s ease' : 'none',
                  }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center"
                style={{ animation: isUrgent ? 'pulse-scale 1s ease-in-out infinite' : 'none' }}>
                <span style={{
                  fontFamily: 'Fredoka, sans-serif',
                  fontWeight: 700,
                  fontSize: 'clamp(42px, 9vh, 72px)',
                  lineHeight: 1,
                  color: phase === 'waiting' ? COLORS.madeiraMedia : numberColor,
                  transition: 'color 0.3s ease',
                }}>
                  {phase === 'waiting' ? '90' : label}
                </span>
                {phase === 'done' && (
                  <span style={{
                    fontFamily: 'Fredoka, sans-serif',
                    fontSize: 'clamp(0.7rem, 2vw, 0.85rem)',
                    color: COLORS.madeiraMedia,
                    fontWeight: 700,
                    letterSpacing: '0.05em',
                  }}>
                    FIM
                  </span>
                )}
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col items-center gap-2 w-full">
              {phase === 'waiting' && (
                <TropicalButton variant="primary" size="lg" onClick={handleStart}>
                  ▶️ Iniciar Timer
                </TropicalButton>
              )}

              {phase === 'running' && (
                <TropicalButton variant="secondary" size="sm" onClick={handleFailed}>
                  ❌ Contador Falhou
                </TropicalButton>
              )}

              {phase === 'done' && (
                <TropicalButton variant="primary" size="lg" onClick={handleNext}>
                  {isLastPlayer ? '🏁 Ir para Ranking' : '▶️ Próximo Jogador'}
                </TropicalButton>
              )}
            </div>

          </div>
        </WoodenCard>
      </div>

      <style>{`
        @keyframes pulse-scale {
          0%, 100% { transform: scale(1); }
          50%       { transform: scale(1.1); }
        }
      `}</style>
    </div>
  );
};

export default NaoHesite;
