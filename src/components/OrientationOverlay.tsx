import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { RotateCcw, Waves } from "lucide-react";
import { useLocation } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";

const GAMEPLAY_ROUTES = new Set([
  "/game",
  "/sorteio",
  "/timer",
  "/ranking",
  "/minigame-ranking",
]);

const OrientationOverlay = () => {
  const isMobile = useIsMobile();
  const location = useLocation();
  const [isPortrait, setIsPortrait] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia("(orientation: portrait)");
    const onChange = (event: MediaQueryListEvent | MediaQueryList) => {
      setIsPortrait(event.matches);
    };

    onChange(mql);
    mql.addEventListener("change", onChange as (event: MediaQueryListEvent) => void);

    return () =>
      mql.removeEventListener("change", onChange as (event: MediaQueryListEvent) => void);
  }, []);

  const show = isMobile && isPortrait && GAMEPLAY_ROUTES.has(location.pathname);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#0d6b88]/92 px-6 text-center backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="surf-card flex h-24 w-24 items-center justify-center text-[#0d6b76]"
            animate={{ rotate: [0, -90, -90, 0] }}
            transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut", times: [0, 0.38, 0.72, 1] }}
          >
            <svg
              width="56"
              height="56"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
              <line x1="12" y1="18" x2="12" y2="18.01" />
            </svg>
          </motion.div>

          <h2 className="font-display mt-8 text-5xl leading-none text-white">
            Vire para jogar
          </h2>
          <p className="mt-4 max-w-sm text-base font-bold leading-relaxed text-white/86">
            As telas de partida foram desenhadas em modo paisagem, com as
            estatísticas distribuídas nas laterais como um jogo mobile tropical.
          </p>

          <div className="mt-6 flex items-center gap-2 rounded-full bg-white/14 px-4 py-2 text-sm font-black uppercase tracking-[0.18em] text-white/84">
            <RotateCcw className="h-4 w-4" />
            <span>Modo horizontal</span>
            <Waves className="h-4 w-4" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default OrientationOverlay;
