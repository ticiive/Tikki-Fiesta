import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";

interface GameTransitionProps {
  onComplete: () => void;
}

const GameTransition = ({ onComplete }: GameTransitionProps) => {
  const isMobile = useIsMobile();
  const [isPortrait, setIsPortrait] = useState(false);
  const [timerDone, setTimerDone] = useState(false);

  // 3-second mandatory timer
  useEffect(() => {
    const timer = setTimeout(() => setTimerDone(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  // Orientation listener
  useEffect(() => {
    const mql = window.matchMedia("(orientation: portrait)");
    const onChange = (e: MediaQueryListEvent | MediaQueryList) => {
      setIsPortrait(e.matches);
    };
    onChange(mql);
    mql.addEventListener("change", onChange as (e: MediaQueryListEvent) => void);
    return () => mql.removeEventListener("change", onChange as (e: MediaQueryListEvent) => void);
  }, []);

  // Only proceed when timer is done AND (not mobile OR landscape)
  useEffect(() => {
    if (timerDone && (!isMobile || !isPortrait)) {
      onComplete();
    }
  }, [timerDone, isMobile, isPortrait, onComplete]);

  const showOrientationWarning = isMobile && isPortrait;

  return (
    <motion.div
      className="fixed inset-0 z-[9998] flex flex-col items-center justify-center bg-black"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Phone rotation animation */}
      <motion.div
        className="text-neon-green mb-8"
        animate={{ rotate: [0, -90, -90, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", times: [0, 0.4, 0.7, 1] }}
      >
        <svg
          width="80"
          height="80"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
          <line x1="12" y1="18" x2="12" y2="18.01" />
        </svg>
      </motion.div>

      {/* Text */}
      <motion.p
        className="text-xl sm:text-2xl font-bold text-white text-center px-8 leading-relaxed"
        style={{ fontFamily: "'Fredoka', 'Quicksand', sans-serif" }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        {showOrientationWarning && timerDone
          ? "Vire o aparelho para jogar! 📱"
          : "Tudo pronto! Agora vire o aparelho para uma melhor experiência 🎮"}
      </motion.p>

      {/* Loading dots (only during initial 3s) */}
      <AnimatePresence>
        {!timerDone && (
          <motion.div
            className="mt-6 flex gap-2"
            exit={{ opacity: 0 }}
          >
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-3 h-3 rounded-full bg-neon-green/60"
                animate={{ scale: [1, 1.4, 1], opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default GameTransition;
