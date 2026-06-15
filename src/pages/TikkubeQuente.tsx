import { useEffect, useRef, useState, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { TropicalBackground } from "@/components/layout/TropicalBackground";
import { WoodenCard } from "@/components/ui/WoodenCard";
import { TropicalButton } from "@/components/ui/TropicalButton";
import { COLORS } from "@/lib/tokens";

const CORES = [
  { id: 'verde',    label: 'Verde',    hex: '#22C55E' },
  { id: 'azul',     label: 'Azul',     hex: '#3B82F6' },
  { id: 'vermelho', label: 'Vermelho', hex: '#EF4444' },
  { id: 'amarelo',  label: 'Amarelo',  hex: '#EAB308' },
];

type GameState = 'ready' | 'playing' | 'stopped';

const TIKKUBE_KEY = 'tikki-fiesta-tikkube-state';

const TikkubeQuente = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const effectiveState = (location.state as any) ?? (() => {
    try { const s = localStorage.getItem(TIKKUBE_KEY); return s ? JSON.parse(s) : null; } catch { return null; }
  })();

  const { players, currentRound, totalRounds, isGameOver, playedMinigames = [] } =
    (effectiveState as {
      players: any[];
      currentRound: number;
      totalRounds: number;
      isGameOver: boolean;
      playedMinigames?: string[];
    }) || {};

  const [gameState, setGameState] = useState<GameState>('ready');
  const [corAtual, setCorAtual] = useState<typeof CORES[number] | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const stopTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    audioRef.current = new Audio(`${import.meta.env.BASE_URL}sounds/tikkoin-quente.mp3`);
    audioRef.current.loop = true;
    return () => {
      audioRef.current?.pause();
      audioRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (location.state) {
      try { localStorage.setItem(TIKKUBE_KEY, JSON.stringify(location.state)); } catch {}
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!effectiveState) navigate("/game");
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const stopMusic = useCallback(() => {
    if (stopTimeoutRef.current) clearTimeout(stopTimeoutRef.current);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    const cor = CORES[Math.floor(Math.random() * CORES.length)];
    setCorAtual(cor);
    setGameState('stopped');
  }, []);

  const startMusic = useCallback(() => {
    setCorAtual(null);
    setGameState('playing');
    audioRef.current?.play();
    const delay = (5 + Math.random() * 10) * 1000;
    stopTimeoutRef.current = setTimeout(stopMusic, delay);
  }, [stopMusic]);

  useEffect(() => {
    return () => {
      if (stopTimeoutRef.current) clearTimeout(stopTimeoutRef.current);
      audioRef.current?.pause();
    };
  }, []);

  const handleEncerrar = () => {
    if (stopTimeoutRef.current) clearTimeout(stopTimeoutRef.current);
    audioRef.current?.pause();
    navigate('/ranking-minigame', {
      state: { players, currentRound, totalRounds, isGameOver, playedMinigames },
    });
  };

  if (!effectiveState) return null;

  return (
    <div className="w-screen overflow-hidden flex items-center justify-center px-4 py-3" style={{ height: '100dvh' }}>
      <TropicalBackground />

      <div className="relative max-w-md w-full" style={{ overflow: 'visible' }}>
        <WoodenCard variant="main" irregularCorners>
          <div className="flex flex-col items-center gap-4 px-5 py-6">

            {/* Header */}
            <div className="flex items-center gap-2">
              <span style={{ fontSize: '2rem', lineHeight: 1 }}>🔥</span>
              <h1 style={{
                fontFamily: 'Fredoka, sans-serif',
                fontWeight: 700,
                fontSize: 'clamp(1.2rem, 3vw, 1.7rem)',
                color: COLORS.marromProfundo,
                textShadow: '1px 1px 0 rgba(255,255,255,0.4)',
              }}>
                Tikkoin Quente
              </h1>
            </div>

            {/* Estado visual */}
            {gameState === 'ready' && (
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontFamily: 'Quicksand, sans-serif', fontSize: '1rem', color: COLORS.marromProfundo, marginBottom: '1rem' }}>
                  Quando a música tocar, passe o Tikkoin!<br />
                  Quem segurar quando parar perde — se for da cor!
                </p>
                <TropicalButton variant="primary" size="lg" onClick={startMusic}>
                  ▶️ Começar Música
                </TropicalButton>
              </div>
            )}

            {gameState === 'playing' && (
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '4rem', lineHeight: 1, marginBottom: '0.5rem', animation: 'spin 1s linear infinite' }}>🎵</div>
                <p style={{
                  fontFamily: 'Fredoka, sans-serif',
                  fontWeight: 700,
                  fontSize: '1.4rem',
                  color: COLORS.marromProfundo,
                }}>
                  Música tocando...
                </p>
                <p style={{ fontFamily: 'Quicksand, sans-serif', fontSize: '0.9rem', color: COLORS.marromProfundo, opacity: 0.7, marginTop: '0.25rem' }}>
                  Passe o Tikkoin!
                </p>
              </div>
            )}

            {gameState === 'stopped' && corAtual && (
              <div style={{ textAlign: 'center' }}>
                <p style={{
                  fontFamily: 'Fredoka, sans-serif',
                  fontWeight: 700,
                  fontSize: '1rem',
                  color: COLORS.marromProfundo,
                  marginBottom: '0.5rem',
                }}>
                  A música parou! Cor da vez:
                </p>
                <div style={{
                  width: 120,
                  height: 120,
                  borderRadius: '50%',
                  background: corAtual.hex,
                  border: `5px solid ${COLORS.madeiraEscura}`,
                  boxShadow: `0 0 24px ${corAtual.hex}88`,
                  margin: '0 auto 0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <span style={{
                    fontFamily: 'Fredoka, sans-serif',
                    fontWeight: 700,
                    fontSize: '1.1rem',
                    color: '#fff',
                    textShadow: '0 1px 3px rgba(0,0,0,0.6)',
                  }}>
                    {corAtual.label}
                  </span>
                </div>
                <p style={{ fontFamily: 'Quicksand, sans-serif', fontSize: '0.9rem', color: COLORS.marromProfundo, marginBottom: '1rem' }}>
                  Quem segura o Tikkoin e é <strong>{corAtual.label}</strong> perde 1!
                </p>
                <TropicalButton variant="primary" size="md" onClick={startMusic}>
                  ▶️ Continuar jogo
                </TropicalButton>
              </div>
            )}

            {/* Botão encerrar */}
            <TropicalButton variant="secondary" size="sm" onClick={handleEncerrar}>
              🏁 Encerrar Minigame
            </TropicalButton>

          </div>
        </WoodenCard>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default TikkubeQuente;
