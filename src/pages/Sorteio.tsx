import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Coins, Dices, Flame, Swords, Timer, Trophy } from "lucide-react";

const MINIGAMES = [
  {
    title: "Desafio de Moedas",
    icon: Coins,
    description: "O explorador mais rápido conquista 10 moedas brilhantes.",
    badge: "Tesouro",
    surface: "parchment-panel",
  },
  {
    title: "Duelo de Dados",
    icon: Dices,
    description: "Role os dados e deixe a sorte decidir o rumo do mapa.",
    badge: "Dados",
    surface: "wood-panel",
  },
  {
    title: "Corrida Contra o Tempo",
    icon: Timer,
    description: "Resolva o desafio antes da maré virar a ampulheta.",
    badge: "Maré",
    surface: "parchment-panel",
  },
  {
    title: "Batalha Épica",
    icon: Swords,
    description: "Dois aventureiros entram em duelo estratégico por glória.",
    badge: "Duelo",
    surface: "wood-panel",
  },
  {
    title: "Grande Prêmio",
    icon: Trophy,
    description: "Quem acertar primeiro recebe estrelas de bônus.",
    badge: "Troféu",
    surface: "parchment-panel",
  },
];

const CARD_STYLES = [
  "parchment-panel",
  "wood-panel",
  "parchment-panel",
  "wood-panel",
  "parchment-panel",
];

const Sorteio = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { players, currentRound, totalRounds, isGameOver } =
    (location.state as {
      players: Array<{ id: string; label: string; coins: number; stars: number }>;
      currentRound: number;
      totalRounds: number;
      isGameOver: boolean;
    }) || {};

  const [phase, setPhase] = useState<"shuffling" | "revealed">("shuffling");
  const [chosenGame] = useState(
    () => MINIGAMES[Math.floor(Math.random() * MINIGAMES.length)],
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
      state: { players, currentRound, totalRounds, isGameOver, chosenGame },
    });
  };

  const handleSkip = () => {
    if (isGameOver) {
      navigate("/ranking", { state: { players } });
      return;
    }

    navigate("/game", {
      state: {
        players: players.map((player) => player.label || player),
        totalRounds,
        currentRound,
      },
    });
  };

  const ChosenIcon = chosenGame.icon;

  return (
    <div className="world-shell">
      <div className="mobile-island">
        <div className="island-screen items-center justify-center">
          <div className="parchment-panel w-full px-4 py-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <span className="subtle-copy text-xs uppercase tracking-[0.3em]">
                  Sorteio de evento
                </span>
                <h1 className="font-display mt-2 text-4xl leading-none text-[#7a4b1d]">
                  Rodada {currentRound}
                  <span className="ml-2 text-3xl text-[#af7b38]">/ {totalRounds}</span>
                </h1>
              </div>
              <div className="stake-tab is-selected px-4 py-3 text-center">
                <span className="block text-xs uppercase tracking-[0.22em]">
                  Baralho
                </span>
                <strong className="text-lg">Misturando</strong>
              </div>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {phase === "shuffling" ? (
              <motion.div
                key="shuffle"
                className="relative mt-6 h-52 w-72"
                exit={{ opacity: 0, scale: 0.88 }}
                transition={{ duration: 0.3 }}
              >
                {CARD_STYLES.map((cardStyle, index) => (
                  <motion.div
                    key={index}
                    className={`absolute inset-0 ${cardStyle} p-4`}
                    style={{ zIndex: CARD_STYLES.length - index }}
                    animate={{
                      x: [0, (index % 2 === 0 ? 1 : -1) * 78, 0, (index % 2 === 0 ? -1 : 1) * 54, 0],
                      rotate: [0, index % 2 === 0 ? 8 : -8, 0, index % 2 === 0 ? -5 : 5, 0],
                      y: [0, -10 * (index % 3), 5, -8, 0],
                    }}
                    transition={{
                      duration: 0.6,
                      repeat: 3,
                      delay: index * 0.05,
                      ease: "easeInOut",
                    }}
                  >
                    <div className="flex h-full items-center justify-center">
                      <Dices className="h-14 w-14 text-[#7a4b1d]/40" />
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="revealed"
                className="mt-6 flex w-full flex-col items-center gap-6"
                initial={{ opacity: 0, scale: 0.5, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <motion.div
                  className={`${chosenGame.surface} w-full max-w-[21rem] px-6 py-6 text-center`}
                  initial={{ rotateY: 90 }}
                  animate={{ rotateY: 0 }}
                  transition={{ delay: 0.1, duration: 0.4 }}
                >
                  <div className="island-badge mx-auto mb-4 inline-flex items-center gap-2 px-4 py-2 text-xs font-black uppercase tracking-[0.22em]">
                    <Flame className="h-4 w-4" />
                    {chosenGame.badge}
                  </div>

                  <motion.div
                    animate={{ scale: [1, 1.12, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-[1.5rem] border-2 border-[#865226] bg-[linear-gradient(180deg,#fff6df,#efcf7a)] text-[#7a4b1d]"
                  >
                    <ChosenIcon className="h-10 w-10" />
                  </motion.div>

                  <h2 className="font-display text-5xl leading-none text-[#7a4b1d]">
                    {chosenGame.title}
                  </h2>

                  <p className="subtle-copy mt-4 text-base leading-relaxed">
                    {chosenGame.description}
                  </p>
                </motion.div>

                <div className="flex w-full flex-col items-center gap-3">
                  <motion.button
                    onClick={handleStart}
                    className="splash-hit gem-button gem-magenta w-full max-w-[21rem] px-8 py-4 text-sm uppercase tracking-[0.22em]"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Iniciar minigame
                  </motion.button>

                  <motion.button
                    onClick={handleSkip}
                    className="splash-hit gem-button gem-turquoise w-full max-w-[21rem] px-8 py-4 text-sm uppercase tracking-[0.22em]"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {isGameOver ? "Ir para ranking" : "Pular e continuar"}
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Sorteio;
