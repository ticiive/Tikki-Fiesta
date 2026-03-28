import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Coins, Dices, Shell, Sparkles, Timer, Trophy, Waves } from "lucide-react";

const MINIGAMES = [
  {
    title: "Coco Sprint",
    icon: Coins,
    description: "Quem agir mais rápido ganha um bônus de moedas.",
    badge: "🥥 Velocidade",
  },
  {
    title: "Splash Dice",
    icon: Dices,
    description: "Role os dados e deixe a maré decidir a vantagem.",
    badge: "🌊 Sorte",
  },
  {
    title: "Sunset Rush",
    icon: Timer,
    description: "Resolva o desafio antes da contagem chegar ao fim.",
    badge: "☀️ Tempo",
  },
  {
    title: "Shell Crown",
    icon: Trophy,
    description: "O melhor desempenho da rodada rende glória extra.",
    badge: "🐚 Pódio",
  },
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
    if (!location.state) navigate("/setup");
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
      <div className="gameplay-stage">
        <div className="landscape-board items-center">
          <aside className="landscape-side">
            <section className="leafy-card p-5">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-white/82">
                Sorteio tropical
              </p>
              <h2 className="font-display mt-2 text-5xl leading-none text-white">
                Rodada {currentRound}
              </h2>
              <p className="mt-3 text-sm font-bold text-white/84">
                de {totalRounds} ondas
              </p>
            </section>
            <section className="surf-card p-5 text-[#13717a]">
              <div className="flex items-center gap-2">
                <Waves className="h-4 w-4" />
                <p className="text-xs font-black uppercase tracking-[0.2em]">
                  Evento
                </p>
              </div>
              <p className="mt-3 text-sm font-bold">
                O minigame define o clima da próxima etapa com visual fresh de
                praia mobile.
              </p>
            </section>
          </aside>

          <main className="landscape-main items-center justify-center">
            <AnimatePresence mode="wait">
              {phase === "shuffling" ? (
                <motion.div
                  key="shuffle"
                  className="relative mt-2 h-64 w-full max-w-md"
                  exit={{ opacity: 0, scale: 0.88 }}
                  transition={{ duration: 0.3 }}
                >
                  {Array.from({ length: 4 }).map((_, index) => (
                    <motion.div
                      key={index}
                      className={`${index % 2 === 0 ? "surf-card" : "driftwood-card"} absolute inset-0 p-6`}
                      style={{ zIndex: 4 - index }}
                      animate={{
                        x: [0, (index % 2 === 0 ? 1 : -1) * 84, 0, (index % 2 === 0 ? -1 : 1) * 56, 0],
                        rotate: [0, index % 2 === 0 ? 8 : -8, 0, index % 2 === 0 ? -5 : 5, 0],
                        y: [0, -12 * (index % 3), 6, -10, 0],
                      }}
                      transition={{ duration: 0.64, repeat: 3, delay: index * 0.06, ease: "easeInOut" }}
                    >
                      <div className="flex h-full items-center justify-center text-6xl">
                        🐚
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  key="reveal"
                  className="flex w-full max-w-2xl flex-col items-center gap-6"
                  initial={{ opacity: 0, scale: 0.5, y: 30 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ type: "spring", stiffness: 280, damping: 22 }}
                >
                  <motion.div
                    className="surf-card w-full p-8 text-center"
                    initial={{ rotateY: 90 }}
                    animate={{ rotateY: 0 }}
                    transition={{ delay: 0.1, duration: 0.4 }}
                  >
                    <div className="island-badge mx-auto inline-flex items-center gap-2 px-4 py-2 text-xs font-black uppercase tracking-[0.22em]">
                      <Sparkles className="h-4 w-4" />
                      {chosenGame.badge}
                    </div>

                    <motion.div
                      animate={{ scale: [1, 1.12, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="mx-auto mt-5 flex h-24 w-24 items-center justify-center rounded-full border-2 border-white/70 bg-white/35 text-[#0d7983]"
                    >
                      <ChosenIcon className="h-11 w-11" />
                    </motion.div>

                    <h1 className="font-display mt-6 text-6xl leading-none text-white">
                      {chosenGame.title}
                    </h1>
                    <p className="mx-auto mt-4 max-w-xl text-base font-bold leading-relaxed text-white/88">
                      {chosenGame.description}
                    </p>
                  </motion.div>

                  <div className="flex w-full flex-wrap justify-center gap-3">
                    <button
                      onClick={handleStart}
                      className="splash-hit gem-button gem-magenta px-8 py-4 text-sm uppercase tracking-[0.22em]"
                      type="button"
                    >
                      Iniciar minigame
                    </button>
                    <button
                      onClick={handleSkip}
                      className="splash-hit gem-button gem-turquoise px-8 py-4 text-sm uppercase tracking-[0.22em]"
                      type="button"
                    >
                      {isGameOver ? "Ir para ranking" : "Pular etapa"}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </main>

          <aside className="landscape-side">
            <section className="parchment-panel p-5">
              <div className="flex items-center gap-2">
                <Shell className="h-4 w-4 text-[#157f89]" />
                <p className="text-xs font-black uppercase tracking-[0.2em] text-[#468185]">
                  Estilo visual
                </p>
              </div>
              <ul className="mt-4 grid gap-2 text-sm font-bold text-[#468185]">
                <li>Água turquesa intensa</li>
                <li>Peças redondas com outline forte</li>
                <li>Conchas e cocos no lugar de ícones genéricos</li>
              </ul>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Sorteio;
