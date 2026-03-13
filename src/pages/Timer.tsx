import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import CircularTimer from "@/components/game/CircularTimer";
import SkyBackground from "@/components/SkyBackground";

const DEFAULT_TIME = 30;

const Timer = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { players, currentRound, totalRounds, isGameOver } =
    (location.state as { players: any[]; currentRound: number; totalRounds: number; isGameOver: boolean }) || {};

  const [finished, setFinished] = useState(false);

  useEffect(() => {
    if (!location.state) navigate("/");
  }, [location.state, navigate]);

  if (!location.state) return null;

  const handleTimeUp = () => setFinished(true);
  const handleContinue = () => {
    navigate("/minigame-ranking", { state: { players, currentRound, totalRounds, isGameOver } });
  };

  return (
    <SkyBackground>
      <div className="h-screen w-screen flex flex-col items-center justify-center overflow-hidden px-4 gap-6">
        <h1 className="text-2xl font-bold text-foreground tracking-tight font-display">
          ⏱ MINIGAME
        </h1>
        <CircularTimer initialTime={DEFAULT_TIME} onTimeUp={handleTimeUp} />
        {finished && (
          <motion.button
            onClick={handleContinue}
            className="px-10 py-4 rounded-3xl border-[3px] border-border bg-coral text-secondary-foreground font-bold text-lg tracking-wide"
            style={{ boxShadow: "var(--pop-shadow-coral)" }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileTap={{ scale: 0.95 }}
          >
            {isGameOver ? "🏆 Ver Pódio" : "▶ Continuar Jogo"}
          </motion.button>
        )}
      </div>
    </SkyBackground>
  );
};

export default Timer;
