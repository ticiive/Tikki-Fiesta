import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { TropicalBackground } from "@/components/layout/TropicalBackground";
import { WoodenCard } from "@/components/ui/WoodenCard";
import { TropicalButton } from "@/components/ui/TropicalButton";
import { COLORS } from "@/lib/tokens";

const playTique = () => {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.frequency.value = 400;
    gain.gain.value = 0.15;
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.08);
  } catch (_) {}
};

const playReveal = () => {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const gain = ctx.createGain();
    gain.gain.value = 0.3;
    gain.connect(ctx.destination);
    [523, 659, 784].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      osc.frequency.value = freq;
      osc.connect(gain);
      osc.start(ctx.currentTime + i * 0.12);
      osc.stop(ctx.currentTime + i * 0.12 + 0.15);
    });
  } catch (_) {}
};

const MINIGAMES = [
  { id: '1', name: 'Corrida na Praia', emoji: '🏃', duration: 60 },
  { id: '2', name: 'Caça ao Tesouro',  emoji: '🗺️', duration: 90 },
  { id: '3', name: 'Pesca',            emoji: '🎣', duration: 45 },
  { id: '4', name: 'Surfe',            emoji: '🏄', duration: 60 },
  { id: '5', name: 'Quebra-coco',      emoji: '💥', duration: 30 },
  { id: '6', name: 'Nado',             emoji: '🏊', duration: 60 },
];

const Sorteio = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { players, currentRound, totalRounds, isGameOver } =
    (location.state as {
      players: any[];
      currentRound: number;
      totalRounds: number;
      isGameOver: boolean;
    }) || {};

  const [phase, setPhase] = useState<"shuffling" | "revealed">("shuffling");
  const [chosenGame] = useState(
    () => MINIGAMES[Math.floor(Math.random() * MINIGAMES.length)]
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setPhase("revealed");
      playReveal();
    }, 2200);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (phase !== "shuffling") return;
    const interval = setInterval(playTique, 300);
    return () => clearInterval(interval);
  }, [phase]);

  useEffect(() => {
    if (!location.state) navigate("/");
  }, [location.state, navigate]);

  if (!location.state) return null;

  const handleStart = () => {
    navigate("/timer", {
      state: { players, currentRound, totalRounds, isGameOver, minigame: chosenGame },
    });
  };

  const handleSkip = () => {
    if (isGameOver) {
      navigate("/ranking", { state: { players } });
    } else {
      navigate("/game", {
        state: {
          players: players.map((p: any) => p.label || p),
          totalRounds,
          currentRound,
        },
      });
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center overflow-hidden px-4">
      <TropicalBackground />

      {/* Badge de rodada */}
      <div className="absolute top-4 left-4">
        <span
          className="text-sm font-bold tracking-wide"
          style={{ fontFamily: 'Fredoka, sans-serif', color: COLORS.marromProfundo }}
        >
          🎲 Rodada {currentRound}/{totalRounds}
        </span>
      </div>

      <AnimatePresence mode="wait">
        {phase === "shuffling" ? (

          /* ── Fase 1: cards embaralhando ─────────────────────────────── */
          <motion.div
            key="shuffle"
            className="relative w-64 h-40"
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
          >
            {[0, 1, 2, 3, 4].map((i) => (
              <motion.div
                key={i}
                style={{ position: 'absolute', inset: 0, zIndex: 5 - i }}
                animate={{
                  x:      [0, (i % 2 === 0 ? 1 : -1) * 80, 0, (i % 2 === 0 ? -1 : 1) * 60, 0],
                  rotate: [0, (i % 2 === 0 ? 8 : -8), 0, (i % 2 === 0 ? -5 : 5), 0],
                  y:      [0, -10 * (i % 3), 5, -8, 0],
                }}
                transition={{ duration: 0.6, repeat: 3, delay: i * 0.05, ease: "easeInOut" }}
              >
                <WoodenCard variant="card" irregularCorners style={{ height: '100%' }}>
                  <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: '2rem', opacity: 0.4 }}>🃏</span>
                  </div>
                </WoodenCard>
              </motion.div>
            ))}
          </motion.div>

        ) : (

          /* ── Fase 2: card revelado + botões ─────────────────────────── */
          <motion.div
            key="revealed"
            className="flex flex-col items-center gap-6"
            initial={{ opacity: 0, scale: 0.5, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            {/* perspective no pai para o rotateY funcionar corretamente */}
            <div className="w-72 sm:w-80" style={{ perspective: '600px' }}>
              <motion.div
                initial={{ rotateY: 90 }}
                animate={{ rotateY: 0 }}
                transition={{ delay: 0.1, duration: 0.4 }}
              >
                <WoodenCard variant="card" irregularCorners>
                  <div className="p-6 flex flex-col items-center gap-4">
                    <motion.div
                      animate={{ scale: [1, 1.15, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      style={{ fontSize: '4rem', lineHeight: 1 }}
                    >
                      {chosenGame.emoji}
                    </motion.div>
                    <h2
                      className="text-2xl sm:text-3xl font-bold text-center tracking-tight"
                      style={{
                        fontFamily: 'Fredoka, sans-serif',
                        color: '#FDF5E6',
                        textShadow: '0 1px 3px rgba(0,0,0,0.5)',
                      }}
                    >
                      {chosenGame.name}
                    </h2>
                  </div>
                </WoodenCard>
              </motion.div>
            </div>

            {/* Botões de ação */}
            <div className="flex flex-col items-center gap-3">
              <TropicalButton variant="primary" size="lg" onClick={handleStart}>
                🎮 INICIAR MINIGAME
              </TropicalButton>
              <TropicalButton variant="secondary" size="md" onClick={handleSkip}>
                {isGameOver ? 'Ir para Ranking 🏆' : 'Pular e Continuar ▶'}
              </TropicalButton>
            </div>
          </motion.div>

        )}
      </AnimatePresence>
    </div>
  );
};

export default Sorteio;
