import { motion } from "framer-motion";

const PalmLeaves = ({ side }: { side: "left" | "right" }) => (
  <motion.div
    className={`absolute top-0 ${side === "left" ? "-left-6" : "-right-6"} pointer-events-none opacity-90`}
    animate={{ rotate: side === "left" ? [0, 2, -1, 0] : [0, -2, 1, 0] }}
    transition={{ duration: side === "left" ? 7 : 7.8, repeat: Infinity, ease: "easeInOut" }}
  >
    <svg
      width="190"
      height="240"
      viewBox="0 0 190 240"
      fill="none"
      style={{ transform: side === "right" ? "scaleX(-1)" : undefined }}
    >
      <path
        d="M92 238C92 178 54 130 18 82C45 92 66 101 92 129C79 96 55 58 24 20C58 47 82 73 95 111C104 78 126 48 164 18C137 58 111 95 99 129C128 100 149 89 174 82C138 130 100 178 92 238Z"
        fill="#4cc36f"
        stroke="#1f7c4b"
        strokeWidth="5"
        strokeLinejoin="round"
      />
      <path
        d="M92 240C95 186 92 134 91 88"
        stroke="#2d8f55"
        strokeWidth="7"
        strokeLinecap="round"
      />
    </svg>
  </motion.div>
);

const ShellCluster = ({ side }: { side: "left" | "right" }) => (
  <div className={`absolute bottom-5 ${side === "left" ? "left-5" : "right-5"} pointer-events-none opacity-90`}>
    <svg width="120" height="70" viewBox="0 0 120 70" fill="none">
      <path d="M20 48C20 32 32 20 47 20C60 20 72 32 72 48C72 54 68 58 62 58H30C24 58 20 54 20 48Z" fill="#fff7ea" stroke="#2f9ab1" strokeWidth="3" />
      <path d="M48 58V25" stroke="#8acfe0" strokeWidth="2" />
      <path d="M38 56L34 31" stroke="#8acfe0" strokeWidth="2" />
      <path d="M58 56L62 31" stroke="#8acfe0" strokeWidth="2" />
      <ellipse cx="92" cy="44" rx="18" ry="13" fill="#ffd9c9" stroke="#2f9ab1" strokeWidth="3" />
      <ellipse cx="92" cy="44" rx="7" ry="5" fill="#fff2ea" />
    </svg>
  </div>
);

const WaterRipple = ({ left, delay }: { left: string; delay: number }) => (
  <motion.div
    className="absolute bottom-[14%] pointer-events-none"
    style={{ left }}
    initial={{ opacity: 0.2, scale: 0.7 }}
    animate={{ opacity: [0.15, 0.4, 0.15], scale: [0.7, 1.2, 1.55] }}
    transition={{ duration: 4.4, repeat: Infinity, delay, ease: "easeOut" }}
  >
    <svg width="86" height="28" viewBox="0 0 86 28" fill="none">
      <ellipse cx="43" cy="14" rx="38" ry="10" stroke="rgba(255,255,255,0.55)" strokeWidth="2" />
    </svg>
  </motion.div>
);

const IslandBackground = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="relative min-h-screen w-full overflow-hidden sand-texture">
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(circle at 28% 24%, rgba(255,255,255,0.28) 0 10%, transparent 11%),
            radial-gradient(circle at 72% 18%, rgba(255,255,255,0.18) 0 12%, transparent 13%),
            linear-gradient(180deg, #7ef0ee 0%, #24cbe2 28%, #12a6d3 48%, #ffeab5 76%, #ffd98f 100%)
          `,
        }}
      />

      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "repeating-linear-gradient(90deg, transparent, rgba(255,255,255,0.08) 6px, transparent 12px)",
        }}
        animate={{ x: [0, 22, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      <WaterRipple left="14%" delay={0} />
      <WaterRipple left="56%" delay={1.7} />
      <WaterRipple left="80%" delay={3.1} />

      <PalmLeaves side="left" />
      <PalmLeaves side="right" />
      <ShellCluster side="left" />
      <ShellCluster side="right" />

      <div
        className="absolute inset-0 pointer-events-none"
        style={{ boxShadow: "inset 0 0 120px 32px rgba(12,112,138,0.12)" }}
      />

      <div className="relative z-10">{children}</div>
    </div>
  );
};

export default IslandBackground;
