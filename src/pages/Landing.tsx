import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Compass, Flame, Shell, Gem, ChevronDown, Star, Coins, Anchor } from "lucide-react";
import IslandBackground from "@/components/IslandBackground";

const FLOATERS = [
  { Icon: Shell, x: "8%", y: "18%", size: 32, delay: 0, color: "text-island-turquoise-light" },
  { Icon: Gem, x: "85%", y: "14%", size: 28, delay: 0.5, color: "text-island-magenta-light" },
  { Icon: Flame, x: "12%", y: "68%", size: 30, delay: 1.0, color: "text-island-fire" },
  { Icon: Compass, x: "88%", y: "62%", size: 34, delay: 0.3, color: "text-island-sand-bright" },
  { Icon: Anchor, x: "50%", y: "82%", size: 28, delay: 1.5, color: "text-island-turquoise" },
];

const Landing = () => {
  const navigate = useNavigate();
  const [leaving, setLeaving] = useState(false);
  const [rulesOpen, setRulesOpen] = useState(false);

  const handlePlay = () => {
    setLeaving(true);
    setTimeout(() => navigate("/setup"), 600);
  };

  return (
    <IslandBackground>
      <AnimatePresence mode="wait">
        <motion.div
          className="relative h-screen w-screen flex flex-col items-center justify-center overflow-hidden"
          animate={leaving ? { scale: 1.15, opacity: 0 } : { scale: 1, opacity: 1 }}
          transition={{ duration: 0.55, ease: "easeInOut" }}
        >
          {/* Floating tribal icons */}
          {FLOATERS.map(({ Icon, x, y, size, delay, color }, i) => (
            <motion.div
              key={i}
              className={`absolute pointer-events-none ${color} opacity-30`}
              style={{ left: x, top: y }}
              animate={{ y: [0, -14, 0, 10, 0], rotate: [0, 6, -5, 3, 0] }}
              transition={{ duration: 5 + i * 0.5, repeat: Infinity, delay, ease: "easeInOut" }}
            >
              <Icon size={size} strokeWidth={1.8} />
            </motion.div>
          ))}

          {/* Tribal Logo / Totem */}
          <motion.div
            className="flex flex-col items-center gap-1 mb-8 z-10"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            {/* Totem icon */}
            <div className="relative w-24 h-24 mb-3">
              <motion.div
                className="absolute inset-0 rounded-full bg-island-fire/20 blur-xl"
                animate={{ scale: [1, 1.4, 1] }}
                transition={{ duration: 3.5, repeat: Infinity }}
              />
              <div
                className="relative w-full h-full rounded-full border-[4px] border-island-palm bg-island-parchment flex items-center justify-center"
                style={{ boxShadow: "var(--pop-shadow-wood)" }}
              >
                <span className="text-5xl" role="img" aria-label="totem">🗿</span>
              </div>
            </div>

            {/* Game title — "carved stone" style */}
            <h1
              className="text-5xl sm:text-6xl font-bold tracking-tight font-display"
              style={{ color: "hsl(var(--island-palm))" }}
            >
              POP{" "}
              <span style={{ color: "hsl(var(--island-turquoise))" }}>
                BOARD
              </span>
            </h1>
            <span
              className="text-sm font-bold tracking-[0.35em] uppercase"
              style={{ color: "hsl(var(--island-palm-light))" }}
            >
              island edition
            </span>
          </motion.div>

          {/* CTA Button — Turquoise stone gem */}
          <motion.button
            onClick={handlePlay}
            className="relative z-10 px-14 py-5 rounded-2xl stone-btn text-2xl tracking-wide cursor-pointer"
            style={{
              background: "linear-gradient(135deg, hsl(var(--island-turquoise)), hsl(var(--island-turquoise-glow)))",
              boxShadow: "var(--pop-shadow-turquoise)",
            }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, type: "spring", stiffness: 260, damping: 18 }}
            whileHover={{
              scale: 1.07,
              boxShadow: "0 0 30px hsla(178, 65%, 45%, 0.45), var(--pop-shadow-turquoise)",
            }}
            whileTap={{ scale: 0.93 }}
          >
            ⚔️ EXPLORAR ILHA
          </motion.button>

          {/* How to Play — Parchment card */}
          <motion.div
            className="z-10 mt-8 w-full max-w-sm px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <button
              onClick={() => setRulesOpen((v) => !v)}
              className="w-full flex items-center justify-center gap-2 text-sm font-bold transition-colors cursor-pointer"
              style={{ color: "hsl(var(--island-palm-light))" }}
            >
              📜 Como Jogar
              <motion.span animate={{ rotate: rulesOpen ? 180 : 0 }} transition={{ duration: 0.25 }}>
                <ChevronDown size={18} />
              </motion.span>
            </button>

            <AnimatePresence>
              {rulesOpen && (
                <motion.div
                  className="mt-3 parchment p-5 text-sm leading-relaxed"
                  style={{ color: "hsl(var(--island-palm))" }}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ul className="space-y-2 list-none">
                    <li>
                      <strong style={{ color: "hsl(var(--island-turquoise))" }}>1.</strong> Escolha de 2 a 4 aventureiros e o número de rodadas.
                    </li>
                    <li>
                      <strong style={{ color: "hsl(var(--island-turquoise))" }}>2.</strong> Cada um joga seu turno: ganhe{" "}
                      <Coins size={14} className="inline text-island-fire" /> moedas e{" "}
                      <Star size={14} className="inline text-island-fire" /> estrelas.
                    </li>
                    <li>
                      <strong style={{ color: "hsl(var(--island-turquoise))" }}>3.</strong> Após todos jogarem, um{" "}
                      <strong className="text-island-magenta">minigame tribal</strong> é sorteado!
                    </li>
                    <li>
                      <strong style={{ color: "hsl(var(--island-turquoise))" }}>4.</strong> Defina o pódio — 1º lugar ganha +3 💎
                    </li>
                    <li>
                      <strong style={{ color: "hsl(var(--island-turquoise))" }}>5.</strong> O explorador com mais tesouros vence! 🏆
                    </li>
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Footer */}
          <div
            className="absolute bottom-4 z-10 text-xs font-semibold"
            style={{ color: "hsl(var(--island-palm-light) / 0.5)" }}
          >
            Desenvolvido por Pop Board Team — IBMEC 2026
          </div>
        </motion.div>
      </AnimatePresence>
    </IslandBackground>
  );
};

export default Landing;
