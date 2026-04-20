import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Dices, Coins, Swords, Timer } from "lucide-react";

const MINIGAMES = [
  {
    title: "DESAFIO DE MOEDAS",
    icon: Coins,
    description: "O jogador mais rápido ganha 10 moedas!",
    bg: "bg-secondary/15",
  },
  {
    title: "DUELO DE DADOS",
    icon: Dices,
    description: "Role os dados e torça pelo melhor resultado!",
    bg: "bg-primary/10",
  },
  {
    title: "CORRIDA CONTRA O TEMPO",
    icon: Timer,
    description: "Complete o desafio antes do tempo acabar!",
    bg: "bg-accent/15",
  },
  {
    title: "BATALHA ÉPICA",
    icon: Swords,
    description: "Enfrente seu oponente em um duelo estratégico!",
    bg: "bg-destructive/10",
  },
  {
    title: "GRANDE PRÊMIO",
    icon: Trophy,
    description: "Quem acertar leva 5 estrelas de bônus!",
    bg: "bg-secondary/20",
  },
];

const CARD_COLORS = [
  "border-cobalt",
  "border-tangerine",
  "border-neon-green",
  "border-cobalt-light",
  "border-tangerine-light",
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
    const timer = setTimeout(() => setPhase("revealed"), 2200);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!location.state) navigate("/");
  }, [location.state, navigate]);

  if (!location.state) return null;

  const handleStart = () => {
    navigate("/timer", {
      state: { players, currentRound, totalRounds, isGameOver },
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

  const ChosenIcon = chosenGame.icon;

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center overflow-hidden bg-background px-4">
      {/* Round info */}
      <div className="absolute top-4 left-4">
        <span className="text-sm font-bold text-[#2D1B0D] tracking-wide">
          🎲 Rodada {currentRound}/{totalRounds}
        </span>
      </div>

      <AnimatePresence mode="wait">
        {phase === "shuffling" ? (
          <motion.div
            key="shuffle"
            className="relative w-64 h-40"
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
          >
            {[0, 1, 2, 3, 4].map((i) => (
              <motion.div
                key={i}
                className={`absolute inset-0 rounded-2xl border-[4px] ${CARD_COLORS[i]} bg-card shadow-lg`}
                style={{ zIndex: 5 - i }}
                animate={{
                  x: [0, (i % 2 === 0 ? 1 : -1) * 80, 0, (i % 2 === 0 ? -1 : 1) * 60, 0],
                  rotate: [0, (i % 2 === 0 ? 8 : -8), 0, (i % 2 === 0 ? -5 : 5), 0],
                  y: [0, -10 * (i % 3), 5, -8, 0],
                }}
                transition={{
                  duration: 0.6,
                  repeat: 3,
                  delay: i * 0.05,
                  ease: "easeInOut",
                }}
              >
                <div className="w-full h-full flex items-center justify-center">
                  <Dices className="w-12 h-12 text-cobalt-light opacity-40" />
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="revealed"
            className="flex flex-col items-center gap-6"
            initial={{ opacity: 0, scale: 0.5, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            {/* Revealed card */}
            <motion.div
              className={`relative w-72 sm:w-80 rounded-3xl border-[4px] border-foreground/80 ${chosenGame.bg} bg-card p-6 flex flex-col items-center gap-4`}
              style={{ boxShadow: "6px 6px 0px hsl(var(--foreground) / 0.15)" }}
              initial={{ rotateY: 90 }}
              animate={{ rotateY: 0 }}
              transition={{ delay: 0.1, duration: 0.4 }}
            >
              <motion.div
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <ChosenIcon className="w-16 h-16 text-tangerine" />
              </motion.div>

              <h2 className="text-2xl sm:text-3xl font-bold text-cobalt text-center tracking-tight">
                {chosenGame.title}
              </h2>

              <p className="text-base text-muted-foreground font-semibold text-center leading-snug">
                {chosenGame.description}
              </p>
            </motion.div>

            {/* Action buttons */}
            <div className="flex flex-col items-center gap-3">
              <motion.button
                onClick={handleStart}
                className="px-10 py-4 rounded-full bg-coral text-white font-bold text-lg tracking-wide shadow-lg hover:shadow-2xl"
                style={{ boxShadow: undefined }}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
              >
                🎮 INICIAR MINIGAME
              </motion.button>

              <motion.button
                onClick={handleSkip}
                className="px-6 py-2 rounded-full text-sm font-bold bg-menta text-[#2D1B0D] hover:bg-menta/80 transition-colors shadow-md"
                whileTap={{ scale: 0.95 }}
              >
                {isGameOver ? "Ir para Ranking 🏆" : "Pular e Continuar ▶"}
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Sorteio;
