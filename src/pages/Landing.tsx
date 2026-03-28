import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Coins, Shell, Sparkles, Star, Sun, Waves } from "lucide-react";
import IslandBackground from "@/components/IslandBackground";

const FLOATERS = [
  { Icon: Shell, x: "10%", y: "20%", delay: 0, color: "text-white/80" },
  { Icon: Sparkles, x: "84%", y: "16%", delay: 0.6, color: "text-[#fff1a8]" },
  { Icon: Sun, x: "88%", y: "64%", delay: 0.2, color: "text-[#ffd35c]" },
  { Icon: Waves, x: "14%", y: "70%", delay: 0.9, color: "text-[#baf8ff]" },
];

const Landing = () => {
  const navigate = useNavigate();
  const [leaving, setLeaving] = useState(false);
  const [rulesOpen, setRulesOpen] = useState(false);

  const handlePlay = () => {
    setLeaving(true);
    setTimeout(() => navigate("/setup"), 520);
  };

  return (
    <IslandBackground>
      <AnimatePresence mode="wait">
        <motion.div
          className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden px-5 py-10"
          animate={leaving ? { scale: 1.08, opacity: 0 } : { scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          {FLOATERS.map(({ Icon, x, y, delay, color }, index) => (
            <motion.div
              key={index}
              className={`absolute pointer-events-none ${color} opacity-70`}
              style={{ left: x, top: y }}
              animate={{ y: [0, -12, 0, 8, 0], rotate: [0, 8, -5, 3, 0] }}
              transition={{ duration: 5.5 + index * 0.4, repeat: Infinity, delay, ease: "easeInOut" }}
            >
              <Icon className="h-8 w-8" strokeWidth={1.8} />
            </motion.div>
          ))}

          <motion.div
            className="relative z-10 flex w-full max-w-5xl flex-col items-center gap-8"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: "easeOut" }}
          >
            <div className="surf-card flex h-28 w-28 items-center justify-center text-6xl shadow-[0_22px_34px_rgba(19,122,135,0.22)]">
              🏝️
            </div>

            <div className="text-center">
              <span className="island-badge inline-flex items-center gap-2 px-4 py-2 text-xs font-black uppercase tracking-[0.22em]">
                <Waves className="h-4 w-4" />
                Modern Tropical Beach
              </span>
              <h1 className="font-display mt-5 text-6xl leading-none text-white drop-shadow-[0_8px_18px_rgba(11,112,131,0.3)] sm:text-7xl">
                Pop Board
              </h1>
              <p className="mx-auto mt-4 max-w-2xl text-lg font-black leading-relaxed text-white/88">
                Um party board game com água turquesa, areia brilhante e uma
                interface fresh de mobile game tropical.
              </p>
            </div>

            <motion.button
              onClick={handlePlay}
              className="splash-hit gem-button gem-turquoise px-12 py-5 text-lg uppercase tracking-[0.24em]"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              Entrar na praia
            </motion.button>

            <div className="w-full max-w-3xl">
              <button
                onClick={() => setRulesOpen((value) => !value)}
                className="mx-auto flex items-center gap-2 rounded-full bg-white/16 px-4 py-2 text-sm font-black uppercase tracking-[0.18em] text-white/90"
                type="button"
              >
                Como jogar
                <motion.span animate={{ rotate: rulesOpen ? 180 : 0 }} transition={{ duration: 0.25 }}>
                  <ChevronDown className="h-4 w-4" />
                </motion.span>
              </button>

              <AnimatePresence>
                {rulesOpen && (
                  <motion.div
                    className="parchment-panel mt-4 p-5 text-sm text-[#2f777c]"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="driftwood-card p-4">
                        <p className="text-xs font-black uppercase tracking-[0.2em] text-[#5c7974]">
                          Fluxo da partida
                        </p>
                        <ul className="mt-3 grid gap-2 font-bold">
                          <li>1. Escolha de 2 a 4 jogadores e a quantidade de rodadas.</li>
                          <li>2. Cada turno rende moedas 🥥 e estrelas 🐚.</li>
                          <li>3. Depois do ciclo, um minigame tropical é sorteado.</li>
                        </ul>
                      </div>
                      <div className="leafy-card p-4">
                        <p className="text-xs font-black uppercase tracking-[0.2em] text-white/84">
                          Recompensas
                        </p>
                        <div className="mt-3 grid gap-2 text-white">
                          <span className="flex items-center gap-2 font-black">
                            <Coins className="h-4 w-4" /> O ranking do minigame distribui bônus.
                          </span>
                          <span className="flex items-center gap-2 font-black">
                            <Star className="h-4 w-4" /> O maior placar final leva a partida.
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </IslandBackground>
  );
};

export default Landing;
