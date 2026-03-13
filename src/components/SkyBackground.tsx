import { motion } from "framer-motion";

const clouds = [
  { width: 140, top: "8%", delay: 0, duration: 25, opacity: 0.7 },
  { width: 100, top: "22%", delay: 5, duration: 30, opacity: 0.5 },
  { width: 170, top: "55%", delay: 10, duration: 35, opacity: 0.4 },
  { width: 90, top: "75%", delay: 15, duration: 28, opacity: 0.35 },
  { width: 120, top: "40%", delay: 8, duration: 32, opacity: 0.45 },
];

const Cloud = ({ width, opacity }: { width: number; opacity: number }) => {
  const h = width * 0.4;
  return (
    <svg width={width} height={h} viewBox={`0 0 ${width} ${h}`} fill="none">
      <ellipse cx={width * 0.5} cy={h * 0.65} rx={width * 0.45} ry={h * 0.3} fill={`hsla(0, 0%, 100%, ${opacity})`} />
      <ellipse cx={width * 0.3} cy={h * 0.45} rx={width * 0.25} ry={h * 0.35} fill={`hsla(0, 0%, 100%, ${opacity})`} />
      <ellipse cx={width * 0.6} cy={h * 0.35} rx={width * 0.3} ry={h * 0.38} fill={`hsla(0, 0%, 100%, ${opacity})`} />
    </svg>
  );
};

const SkyBackground = ({ children }: { children: React.ReactNode }) => {
  return (
    <div
      className="relative min-h-screen w-full overflow-hidden"
      style={{
        background: "linear-gradient(180deg, hsl(200 80% 72%) 0%, hsl(200 70% 85%) 40%, hsl(200 60% 92%) 100%)",
      }}
    >
      {/* Floating clouds */}
      {clouds.map((c, i) => (
        <motion.div
          key={i}
          className="absolute pointer-events-none"
          style={{ top: c.top }}
          initial={{ x: "-20%" }}
          animate={{ x: "110vw" }}
          transition={{
            duration: c.duration,
            repeat: Infinity,
            delay: c.delay,
            ease: "linear",
          }}
        >
          <Cloud width={c.width} opacity={c.opacity} />
        </motion.div>
      ))}

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export default SkyBackground;
