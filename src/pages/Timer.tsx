import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Shell, Sun, Waves } from "lucide-react";
import CircularTimer from "@/components/game/CircularTimer";

const DEFAULT_TIME = 30;

const Timer = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { players, currentRound, totalRounds, isGameOver, chosenGame } =
    (location.state as {
      players: unknown[];
      currentRound: number;
      totalRounds: number;
      isGameOver: boolean;
      chosenGame?: { title: string };
    }) || {};

  const [finished, setFinished] = useState(false);

  useEffect(() => {
    if (!location.state) navigate("/setup");
  }, [location.state, navigate]);

  if (!location.state) return null;

  const handleContinue = () => {
    navigate("/minigame-ranking", {
      state: { players, currentRound, totalRounds, isGameOver },
    });
  };

  return (
    <div className="world-shell">
      <div className="gameplay-stage">
        <div className="landscape-board items-center">
          <aside className="landscape-side">
            <section className="leafy-card p-5">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-white/82">
                Desafio atual
              </p>
              <h2 className="font-display mt-2 text-5xl leading-none text-white">
                {chosenGame?.title ?? "Praia turbo"}
              </h2>
            </section>
            <section className="surf-card p-5 text-[#15717a]">
              <div className="flex items-center gap-2">
                <Sun className="h-4 w-4" />
                <p className="text-xs font-black uppercase tracking-[0.2em]">
                  Regras rápidas
                </p>
              </div>
              <p className="mt-3 text-sm font-bold">
                Acompanhe o cronômetro no centro e siga para o pódio tropical ao
                final da contagem.
              </p>
            </section>
          </aside>

          <main className="landscape-main items-center justify-center">
            <div className="parchment-panel w-full max-w-2xl p-8 text-center">
              <div className="island-badge mx-auto inline-flex items-center gap-2 px-4 py-2 text-xs font-black uppercase tracking-[0.22em]">
                <Waves className="h-4 w-4" />
                Timer de praia
              </div>
              <h1 className="font-display mt-5 text-6xl leading-none text-[#14828d]">
                Hora de agir
              </h1>
              <p className="subtle-copy mx-auto mt-4 max-w-lg text-base leading-relaxed">
                Tudo aqui foi ajustado para parecer um minigame mobile tropical,
                com água brilhante e botões arredondados.
              </p>

              <div className="mt-8">
                <CircularTimer
                  initialTime={DEFAULT_TIME}
                  onTimeUp={() => setFinished(true)}
                />
              </div>
            </div>
          </main>

          <aside className="landscape-side">
            <section className="driftwood-card p-5">
              <div className="flex items-center gap-2 text-[#476f72]">
                <Shell className="h-4 w-4" />
                <p className="text-xs font-black uppercase tracking-[0.2em]">
                  Próxima parada
                </p>
              </div>
              <p className="mt-4 text-sm font-bold text-[#476f72]">
                {isGameOver
                  ? "Depois do cronômetro, o pódio final fecha a jornada."
                  : "Depois do cronômetro, os jogadores montam o ranking do minigame."}
              </p>
            </section>

            {finished && (
              <motion.button
                onClick={handleContinue}
                className="splash-hit gem-button gem-magenta px-8 py-5 text-sm uppercase tracking-[0.22em]"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileTap={{ scale: 0.98 }}
                type="button"
              >
                {isGameOver ? "Ver ranking final" : "Ir para o pódio"}
              </motion.button>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Timer;
