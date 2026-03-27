import { motion } from "framer-motion";

/* Stylized palm leaf SVG */
const PalmLeaf = ({ flip = false, className = "" }: { flip?: boolean; className?: string }) => (
  <svg
    width="120"
    height="200"
    viewBox="0 0 120 200"
    fill="none"
    className={className}
    style={{ transform: flip ? "scaleX(-1)" : undefined }}
  >
    <path
      d="M60 200 C60 140, 20 100, 5 60 C15 80, 40 90, 60 120 C60 90, 30 50, 10 20 C25 45, 50 65, 60 100 C55 60, 25 30, 15 5 C35 30, 55 55, 60 80 C65 55, 85 30, 105 5 C95 30, 65 60, 60 100 C70 65, 95 45, 110 20 C90 50, 60 90, 60 120 C80 90, 105 80, 115 60 C100 100, 60 140, 60 200Z"
      fill="hsl(145 60% 35%)"
      stroke="hsl(145 60% 22%)"
      strokeWidth="2"
    />
  </svg>
);

/* Small rounded stones for corners */
const Stones = ({ className = "" }: { className?: string }) => (
  <svg width="80" height="40" viewBox="0 0 80 40" className={className} fill="none">
    <ellipse cx="15" cy="28" rx="14" ry="10" fill="hsl(200 10% 60%)" stroke="hsl(200 10% 40%)" strokeWidth="2" />
    <ellipse cx="40" cy="30" rx="11" ry="8" fill="hsl(200 10% 55%)" stroke="hsl(200 10% 38%)" strokeWidth="2" />
    <ellipse cx="62" cy="29" rx="13" ry="9" fill="hsl(200 10% 58%)" stroke="hsl(200 10% 42%)" strokeWidth="2" />
  </svg>
);

/* Floating water ripple */
const WaterRipple = ({ delay, left }: { delay: number; left: string }) => (
  <motion.div
    className="absolute pointer-events-none"
    style={{ bottom: "8%", left }}
    initial={{ opacity: 0, scale: 0.6 }}
    animate={{ opacity: [0, 0.4, 0], scale: [0.6, 1.4, 1.8] }}
    transition={{ duration: 4, repeat: Infinity, delay, ease: "easeOut" }}
  >
    <svg width="60" height="20" viewBox="0 0 60 20" fill="none">
      <ellipse cx="30" cy="10" rx="28" ry="8" stroke="hsla(178, 55%, 65%, 0.5)" strokeWidth="1.5" fill="none" />
    </svg>
  </motion.div>
);

const IslandBackground = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="relative min-h-screen w-full overflow-hidden sand-texture">
      {/* Base gradient: sand → turquoise water */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            linear-gradient(
              180deg,
              hsl(200 70% 78%) 0%,
              hsl(178 55% 65%) 25%,
              hsl(178 45% 60%) 45%,
              hsl(38 50% 80%) 70%,
              hsl(38 55% 82%) 85%,
              hsl(35 45% 85%) 100%
            )
          `,
        }}
      />

      {/* Water shimmer */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "repeating-linear-gradient(90deg, transparent, hsla(178 70% 70% / 0.08) 4px, transparent 8px)",
        }}
        animate={{ x: [0, 20, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Water ripples */}
      <WaterRipple delay={0} left="15%" />
      <WaterRipple delay={2} left="55%" />
      <WaterRipple delay={3.5} left="80%" />

      {/* Palm leaves — left edge */}
      <motion.div
        className="absolute -left-6 top-0 pointer-events-none opacity-60"
        animate={{ rotate: [0, 2, -1, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >
        <PalmLeaf />
      </motion.div>

      {/* Palm leaves — right edge */}
      <motion.div
        className="absolute -right-6 top-0 pointer-events-none opacity-60"
        animate={{ rotate: [0, -2, 1, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      >
        <PalmLeaf flip />
      </motion.div>

      {/* Corner stones — bottom-left */}
      <div className="absolute bottom-2 left-2 pointer-events-none opacity-50">
        <Stones />
      </div>

      {/* Corner stones — bottom-right */}
      <div className="absolute bottom-2 right-2 pointer-events-none opacity-50" style={{ transform: "scaleX(-1)" }}>
        <Stones />
      </div>

      {/* Subtle vignette for depth */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          boxShadow: "inset 0 0 100px 30px hsla(25, 40%, 15%, 0.15)",
        }}
      />

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export default IslandBackground;
