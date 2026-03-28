import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Hourglass, Waves } from "lucide-react";
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
      <div className="mobile-island">
        <div className="island-screen justify-center gap-5">
          <div className="parchment-panel p-6 text-center">
            <div className="island-badge mx-auto flex h-16 w-16 items-center justify-center text-[#7a4b1d]">
              <Hourglass className="h-8 w-8" />
            </div>
            <h1 className="font-display mt-4 text-5xl leading-none text-[#7a4b1d]">
              Ampulheta da Ilha
            </h1>
            <p className="subtle-copy mt-3 text-base leading-relaxed">
              {chosenGame?.title
                ? `${chosenGame.title} já começou.`
                : "A maré virou e o desafio começou."}
            </p>
          </div>

          <div className="wood-panel px-5 py-6 text-center text-[#fff5df]">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-[1.35rem] border-2 border-[#7e4e29] bg-[linear-gradient(180deg,#fff2d4,#efc567)] text-[#7a4b1d]">
              <Waves className="h-8 w-8" />
            </div>
            <CircularTimer initialTime={DEFAULT_TIME} onTimeUp={() => setFinished(true)} />
          </div>

          {finished && (
            <motion.button
              onClick={handleContinue}
              className="splash-hit gem-button gem-magenta w-full px-8 py-5 text-sm uppercase tracking-[0.22em]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileTap={{ scale: 0.98 }}
            >
              {isGameOver ? "Ver pódio" : "Continuar jogo"}
            </motion.button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Timer;
