import { useEffect, useRef, useState, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { TropicalBackground } from "@/components/layout/TropicalBackground";
import { WoodenCard } from "@/components/ui/WoodenCard";
import { TropicalButton } from "@/components/ui/TropicalButton";
import { COLORS } from "@/lib/tokens";

const RADIUS = 120;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const beep = () => {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    osc.frequency.value = 800;
    osc.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.15);
  } catch (_) {}
};

const TIMER_KEY = 'tikki-fiesta-timer-state';

const Timer = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const effectiveState = (location.state as any) ?? (() => {
    try { const s = localStorage.getItem(TIMER_KEY); return s ? JSON.parse(s) : null; } catch { return null; }
  })();

  const { players, currentRound, totalRounds, isGameOver, minigame, playedMinigames = [], embateContext } =
    (effectiveState as {
      players: any[];
      currentRound: number;
      totalRounds: number;
      isGameOver: boolean;
      minigame?: { id: string; name: string; emoji: string; duration: number };
      playedMinigames?: string[];
      embateContext?: { challengerId: string; opponentId: string; betAmount: number };
    }) || {};

  const duration = minigame?.duration ?? 30;
  const isRespostasOuNada = minigame?.id === 'respostas-ou-nada';
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isPaused, setIsPaused] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isPausedRef = useRef(false);

  const isUrgent = timeLeft <= 10;
  const dashOffset = CIRCUMFERENCE * (1 - timeLeft / duration);
  const arcColor = isUrgent ? COLORS.alerta : COLORS.coral;
  const numberColor = isUrgent ? COLORS.alerta : COLORS.marromProfundo;

  const goNext = () => {
    if (embateContext) {
      navigate("/embate-resultado", {
        state: { players, currentRound, totalRounds, playedMinigames, embateContext },
      });
    } else {
      navigate("/ranking-minigame", {
        state: { players, currentRound, totalRounds, isGameOver, playedMinigames },
      });
    }
  };

  useEffect(() => {
    if (location.state) {
      try { localStorage.setItem(TIMER_KEY, JSON.stringify(location.state)); } catch {}
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!effectiveState) navigate("/game");
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleTogglePause = useCallback(() => {
    const next = !isPausedRef.current;
    isPausedRef.current = next;
    setIsPaused(next);
  }, []);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      if (isPausedRef.current) return;
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current!);
  }, []);

  useEffect(() => {
    if (timeLeft === 0) {
      if (isRespostasOuNada) {
        setIsDone(true);
      } else {
        goNext();
      }
    }
  }, [timeLeft]);

  const handleRestart = useCallback(() => {
    setIsDone(false);
    setTimeLeft(duration);
    isPausedRef.current = false;
    setIsPaused(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      if (isPausedRef.current) return;
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [duration]);

  useEffect(() => {
    if (isUrgent && timeLeft > 0) beep();
  }, [timeLeft]);

  if (!effectiveState) return null;

  const label = String(timeLeft).padStart(2, "0");
  const circleSize = "clamp(140px, 35vh, 240px)";

  return (
    <div className="min-h-screen w-full overflow-x-hidden flex items-center justify-center px-4 py-3" style={{ minHeight: '100dvh' }}>
      <TropicalBackground />

      {/* Wrapper relativo para os decorativos saírem para fora do WoodenCard */}
      <div className="relative max-w-xl w-full" style={{ overflow: "visible" }}>

        {/* ── Canto TL: folha de palmeira ── */}
        <div className="absolute pointer-events-none select-none"
          style={{ top: -24, left: -32, zIndex: 10, transform: "rotate(-15deg)" }}>
          <svg width="80" height="95" viewBox="0 0 80 95" fill="none">
            <path d="M12,85 Q-8,45 38,5 Q55,32 50,62 Q36,78 12,85 Z" fill="#2D6B31" />
            <path d="M12,85 Q28,44 38,5" stroke="#1B4D1E" strokeWidth="2" strokeLinecap="round" />
            <path d="M22,65 Q35,50 42,30" stroke="#1B4D1E" strokeWidth="1" opacity="0.6" />
            <path d="M18,72 Q30,55 37,38" stroke="#1B4D1E" strokeWidth="1" opacity="0.5" />
          </svg>
        </div>

        {/* ── Canto TR: flor hibisco ── */}
        <div className="absolute pointer-events-none select-none"
          style={{ top: -18, right: -28, zIndex: 10, transform: "rotate(20deg)" }}>
          <svg width="68" height="68" viewBox="0 0 68 68" fill="none">
            {([0, 72, 144, 216, 288] as number[]).map((deg, i) => (
              <ellipse key={i} cx="34" cy="16" rx="8" ry="16"
                fill="#E8476A" opacity="0.92"
                transform={`rotate(${deg} 34 34)`} />
            ))}
            <circle cx="34" cy="34" r="7" fill="#FFD700" />
            <circle cx="34" cy="34" r="4" fill="#FFA500" />
            <circle cx="34" cy="34" r="2" fill="#FF6B00" />
          </svg>
        </div>

        {/* ── Canto BL: concha ── */}
        <div className="absolute pointer-events-none select-none"
          style={{ bottom: -20, left: -24, zIndex: 10, transform: "rotate(-10deg)" }}>
          <svg width="52" height="56" viewBox="0 0 52 56" fill="none">
            <path
              d="M26,52 Q6,46 3,30 Q0,14 15,6 Q30,0 42,12 Q52,24 47,38 Q42,50 30,52 Q22,53 17,46 Q12,39 16,30 Q20,22 27,23 Q34,24 35,32 Q36,39 29,41 Z"
              fill="#D4A373" stroke="#A07850" strokeWidth="1.5" />
            <path d="M26,48 Q10,42 8,28 Q6,16 18,10"  stroke="#A07850" strokeWidth="1"   fill="none" opacity="0.5" />
            <path d="M26,44 Q14,39 13,28 Q12,19 22,15" stroke="#A07850" strokeWidth="0.8" fill="none" opacity="0.4" />
          </svg>
        </div>

        {/* ── Canto BR: folhinhas ── */}
        <div className="absolute pointer-events-none select-none"
          style={{ bottom: -16, right: -20, zIndex: 10, transform: "rotate(15deg)" }}>
          <svg width="58" height="52" viewBox="0 0 58 52" fill="none">
            <path d="M5,42 Q8,10 32,4 Q26,26 5,42 Z"         fill="#5CB85C" />
            <path d="M5,42 Q18,18 32,4"                       stroke="#3A8A3A" strokeWidth="1.2" fill="none" />
            <path d="M18,48 Q28,18 52,12 Q44,34 18,48 Z"      fill="#4CAE4C" />
            <path d="M18,48 Q36,26 52,12"                     stroke="#3A8A3A" strokeWidth="1.2" fill="none" />
          </svg>
        </div>

        {/* ── Painel principal ── */}
        <WoodenCard variant="main" irregularCorners>
          <div className="flex flex-col items-center gap-3 short:gap-2 px-4 py-4 short:py-2">

            {/* Cabeçalho centralizado */}
            <div className="flex items-center gap-2">
              <span style={{ fontSize: "clamp(1.4rem, 4vw, 2rem)", lineHeight: 1 }}>{minigame?.emoji ?? "⏱️"}</span>
              <h1 style={{
                fontFamily: "Fredoka, sans-serif",
                fontWeight: 700,
                fontSize: "clamp(1rem, 3vw, 1.6rem)",
                color: COLORS.marromProfundo,
                textShadow: "1px 1px 0 rgba(255,255,255,0.4)",
              }}>
                {minigame?.name ?? "Minigame"}
              </h1>
            </div>

            {/* Círculo — elemento central dominante */}
            <div className="relative flex items-center justify-center"
              style={{ width: circleSize, height: circleSize }}>
              <svg
                viewBox="0 0 260 260"
                style={{ width: "100%", height: "100%", filter: "drop-shadow(3px 5px 0 rgba(45,27,13,0.45))" }}
              >
                <circle cx="130" cy="130" r={RADIUS} fill={COLORS.areia} />
                <circle cx="130" cy="130" r={RADIUS} fill="none"
                  stroke={COLORS.madeiraEscura} strokeWidth={14} />
                <circle
                  cx="130" cy="130" r={RADIUS}
                  fill="none"
                  stroke={arcColor}
                  strokeWidth={10}
                  strokeLinecap="round"
                  strokeDasharray={CIRCUMFERENCE}
                  strokeDashoffset={dashOffset}
                  style={{
                    transform: "rotate(-90deg)",
                    transformOrigin: "130px 130px",
                    transition: "stroke-dashoffset 0.8s linear, stroke 0.3s ease",
                  }}
                />
              </svg>

              <div
                className="absolute inset-0 flex items-center justify-center"
                style={{ animation: isUrgent && !isPaused ? "pulse-scale 1s ease-in-out infinite" : "none" }}
              >
                <div className="flex flex-col items-center" style={{ gap: 2 }}>
                  <span style={{
                    fontFamily: "Fredoka, sans-serif",
                    fontWeight: 700,
                    fontSize: "clamp(48px, 10vh, 90px)",
                    lineHeight: 1,
                    color: isPaused ? COLORS.madeiraMedia : numberColor,
                    transition: "color 0.3s ease",
                  }}>
                    {label}
                  </span>
                  {isPaused && (
                    <span style={{
                      fontFamily: "Fredoka, sans-serif",
                      fontSize: "clamp(0.7rem, 2vw, 0.9rem)",
                      color: COLORS.madeiraMedia,
                      fontWeight: 700,
                      letterSpacing: '0.05em',
                    }}>
                      PAUSADO
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Botões abaixo do círculo, centralizados */}
            <div className="flex flex-wrap items-center justify-center gap-3 short:gap-2">
              {isDone && isRespostasOuNada ? (
                <>
                  <TropicalButton variant="primary" size="md" onClick={handleRestart}>
                    ▶ Jogar de novo
                  </TropicalButton>
                  <TropicalButton variant="secondary" size="md" onClick={goNext}>
                    🏁 Terminar minigame
                  </TropicalButton>
                </>
              ) : (
                <>
                  <TropicalButton variant="secondary" size="sm" onClick={goNext}>
                    ⏭️ Pular Timer
                  </TropicalButton>
                </>
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

export default Timer;
