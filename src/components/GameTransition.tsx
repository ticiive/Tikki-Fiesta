import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";

interface GameTransitionProps {
  onComplete: () => void;
}

const GameTransition = ({ onComplete }: GameTransitionProps) => {
  const isMobile = useIsMobile();
  const [isPortrait, setIsPortrait] = useState(false);
  const [timerDone, setTimerDone] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setTimerDone(true), 2600);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(orientation: portrait)");
    const onChange = (event: MediaQueryListEvent | MediaQueryList) => {
      setIsPortrait(event.matches);
    };

    onChange(mediaQuery);
    mediaQuery.addEventListener("change", onChange as (event: MediaQueryListEvent) => void);

    return () =>
      mediaQuery.removeEventListener("change", onChange as (event: MediaQueryListEvent) => void);
  }, []);

  useEffect(() => {
    if (timerDone && (!isMobile || !isPortrait)) {
      onComplete();
    }
  }, [timerDone, isMobile, isPortrait, onComplete]);

  const waitingRotation = isMobile && isPortrait;

  return (
    <motion.div
      className="fixed inset-0 z-[9998] flex flex-col items-center justify-center bg-[linear-gradient(180deg,#68e7eb,#1fb7dc_55%,#ffdca2)] px-6 text-center"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <motion.div
        className="surf-card flex h-24 w-24 items-center justify-center text-5xl"
        animate={{ y: [0, -10, 0], rotate: [0, 4, -3, 0] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
      >
        🌴
      </motion.div>

      <h2 className="font-display mt-8 text-6xl leading-none text-white">
        Praia liberada
      </h2>
      <p className="mt-4 max-w-md text-lg font-black leading-relaxed text-white/88">
        {waitingRotation
          ? "Gire o aparelho para entrar na partida horizontal."
          : "Entrando na arena tropical com HUD nas laterais."}
      </p>

      <AnimatePresence>
        {!timerDone && (
          <motion.div className="mt-6 flex gap-2" exit={{ opacity: 0 }}>
            {["🥥", "🐚", "🌺"].map((item, index) => (
              <motion.span
                key={item}
                className="text-2xl"
                animate={{ y: [0, -8, 0], opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 1, repeat: Infinity, delay: index * 0.18 }}
              >
                {item}
              </motion.span>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default GameTransition;
