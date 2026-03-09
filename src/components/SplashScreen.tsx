import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

const SplashScreen = () => (
  <motion.div
    className="fixed inset-0 z-[9998] flex flex-col items-center justify-center"
    style={{ background: "hsl(160 40% 90%)" }}
    initial={{ opacity: 1 }}
    exit={{ opacity: 0, scale: 1.1 }}
    transition={{ duration: 0.5, ease: "easeInOut" }}
  >
    {/* Soft radial glow */}
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        background:
          "radial-gradient(circle at 50% 45%, hsl(160 50% 82% / .6) 0%, transparent 70%)",
      }}
    />

    {/* Bouncing star */}
    <motion.div
      className="relative z-10 text-accent"
      animate={{ y: [0, -24, 0] }}
      transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
    >
      <motion.div
        animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.15, 1] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <Sparkles size={72} strokeWidth={1.8} />
      </motion.div>
    </motion.div>

    {/* Text */}
    <motion.p
      className="relative z-10 mt-8 text-2xl sm:text-3xl font-bold text-foreground/70"
      style={{ fontFamily: "'Fredoka', 'Quicksand', sans-serif" }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5 }}
    >
      Preparando a festa... 🌟
    </motion.p>

    {/* Subtle loading dots */}
    <div className="relative z-10 mt-6 flex gap-2">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-3 h-3 rounded-full bg-accent/60"
          animate={{ scale: [1, 1.4, 1], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
        />
      ))}
    </div>
  </motion.div>
);

export default SplashScreen;
