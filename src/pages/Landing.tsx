import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Dices, Crown, Swords, Star, Coins, ChevronDown, Gamepad2 } from "lucide-react";
import SplashScreen from "@/components/SplashScreen";

/* ── floating icons config ── */
const FLOATERS = [
  { Icon: Dices, x: "10%", y: "15%", size: 40, delay: 0, color: "text-tangerine" },
  { Icon: Crown, x: "80%", y: "12%", size: 36, delay: 0.4, color: "text-cobalt-light" },
  { Icon: Swords, x: "18%", y: "70%", size: 34, delay: 0.8, color: "text-neon-green" },
  { Icon: Star, x: "85%", y: "65%", size: 38, delay: 1.2, color: "text-tangerine-light" },
  { Icon: Coins, x: "50%", y: "80%", size: 32, delay: 0.6, color: "text-cobalt" },
  { Icon: Gamepad2, x: "72%", y: "38%", size: 30, delay: 1.0, color: "text-neon-green" },
];

const Landing = () => {
  const navigate = useNavigate();
  const [leaving, setLeaving] = useState(false);
  const [rulesOpen, setRulesOpen] = useState(false);
  const [isStarting, setIsStarting] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsStarting(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  const handlePlay = () => {
    setLeaving(true);
    setTimeout(() => navigate("/setup"), 600);
  };

  return (
    <AnimatePresence mode="wait">
      {isStarting && <SplashScreen key="splash" />}
      <motion.div
        className="relative h-screen w-screen flex flex-col items-center justify-center overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, hsl(var(--cobalt) / .15) 0%, hsl(var(--background)) 40%, hsl(var(--tangerine) / .10) 70%, hsl(var(--neon-green) / .08) 100%)",
        }}
        animate={leaving ? { scale: 1.15, opacity: 0 } : { scale: 1, opacity: 1 }}
        transition={{ duration: 0.55, ease: "easeInOut" }}
      >
        {/* ── Floating icons ── */}
        {FLOATERS.map(({ Icon, x, y, size, delay, color }, i) => (
          <motion.div
            key={i}
            className={`absolute pointer-events-none ${color} opacity-25`}
            style={{ left: x, top: y }}
            animate={{ y: [0, -18, 0, 12, 0], rotate: [0, 8, -6, 4, 0] }}
            transition={{ duration: 5 + i * 0.6, repeat: Infinity, delay, ease: "easeInOut" }}
          >
            <Icon size={size} strokeWidth={1.6} />
          </motion.div>
        ))}

        {/* ── Logo ── */}
        <motion.div
          className="flex flex-col items-center gap-1 mb-8 z-10"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          {/* Icon mark */}
          <div className="relative w-20 h-20 mb-2">
            {/* Bubble glow */}
            <motion.div
              className="absolute inset-0 rounded-full bg-neon-green/20 blur-xl"
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
            {/* Pawn shape */}
            <div
              className="relative w-full h-full rounded-full border-[4px] border-cobalt bg-card flex items-center justify-center"
              style={{ boxShadow: "var(--pop-shadow-cobalt)" }}
            >
              <Gamepad2 className="w-10 h-10 text-tangerine" />
            </div>
          </div>

          <h1
            className="text-5xl sm:text-6xl font-black tracking-tight text-cobalt"
            style={{ fontFamily: "'Fredoka', 'Quicksand', sans-serif" }}
          >
            POP <span className="text-tangerine">BOARD</span>
          </h1>
          <span className="text-sm font-bold text-cobalt/50 tracking-[0.35em] uppercase">
            play
          </span>
        </motion.div>

        {/* ── Play button ── */}
        <motion.button
          onClick={handlePlay}
          className="relative z-10 px-14 py-5 rounded-2xl border-[4px] border-neon-green bg-neon-green text-accent-foreground font-black text-2xl tracking-wide"
          style={{ boxShadow: "var(--pop-shadow-green)" }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, type: "spring", stiffness: 260, damping: 18 }}
          whileHover={{
            scale: 1.07,
            boxShadow: "0 0 30px hsl(140 70% 48% / 0.5), var(--pop-shadow-green)",
          }}
          whileTap={{ scale: 0.95 }}
        >
          🎮 JOGAR AGORA
        </motion.button>

        {/* ── How to Play ── */}
        <motion.div
          className="z-10 mt-8 w-full max-w-sm px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <button
            onClick={() => setRulesOpen((v) => !v)}
            className="w-full flex items-center justify-center gap-2 text-sm font-bold text-cobalt/60 hover:text-cobalt transition-colors"
          >
            Como Jogar
            <motion.span animate={{ rotate: rulesOpen ? 180 : 0 }} transition={{ duration: 0.25 }}>
              <ChevronDown size={18} />
            </motion.span>
          </button>

          <AnimatePresence>
            {rulesOpen && (
              <motion.div
                className="mt-3 rounded-2xl border-[3px] border-cobalt/20 bg-card p-5 text-sm text-foreground/80 leading-relaxed"
                style={{ boxShadow: "var(--pop-shadow-cobalt)" }}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <ul className="space-y-2 list-none">
                  <li>
                    <strong className="text-cobalt">1.</strong> Selecione de 2 a 4 jogadores e o
                    número de rodadas.
                  </li>
                  <li>
                    <strong className="text-cobalt">2.</strong> Cada jogador joga seu turno: ganhe{" "}
                    <Coins size={14} className="inline text-tangerine" /> moedas e{" "}
                    <Star size={14} className="inline text-tangerine" /> estrelas.
                  </li>
                  <li>
                    <strong className="text-cobalt">3.</strong> Após todos jogarem, um{" "}
                    <strong className="text-tangerine">minigame</strong> é sorteado!
                  </li>
                  <li>
                    <strong className="text-cobalt">4.</strong> Defina o ranking do minigame — 1º
                    lugar ganha +3 🪙, 2º +2, 3º +1.
                  </li>
                  <li>
                    <strong className="text-cobalt">5.</strong> Ao final de todas as rodadas, quem
                    tiver mais moedas e estrelas vence! 🏆
                  </li>
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* ── Footer ── */}
        <div className="absolute bottom-4 z-10 text-xs font-semibold text-cobalt/30">
          Desenvolvido por Pop Board Team — IBMEC 2026
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Landing;
