import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RotateCcw, ChevronLeft, ChevronRight } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const OrientationOverlay = () => {
  const isMobile = useIsMobile();
  const [isPortrait, setIsPortrait] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia("(orientation: portrait)");
    const onChange = (e: MediaQueryListEvent | MediaQueryList) => {
      setIsPortrait(e.matches);
    };
    onChange(mql);
    mql.addEventListener("change", onChange as (e: MediaQueryListEvent) => void);
    return () => mql.removeEventListener("change", onChange as (e: MediaQueryListEvent) => void);
  }, []);

  const show = isMobile && isPortrait;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black/95 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Corner arrows */}
          <ChevronRight className="absolute top-6 right-6 text-muted-foreground/40 w-8 h-8 animate-pulse" />
          <ChevronLeft className="absolute bottom-6 left-6 text-muted-foreground/40 w-8 h-8 animate-pulse" />

          {/* Rotating phone icon */}
          <motion.div
            className="text-primary mb-8"
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

          <p className="text-lg font-bold text-white text-center px-8 leading-relaxed">
            Vire o aparelho para jogar!
          </p>

          <motion.div
            className="mt-4 flex items-center gap-2 text-muted-foreground/60 text-sm"
            animate={{ x: [0, 6, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <RotateCcw size={16} />
            <span>Modo paisagem</span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default OrientationOverlay;
