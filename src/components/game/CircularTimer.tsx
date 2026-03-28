import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Pause, Play, Waves } from "lucide-react";

interface CircularTimerProps {
  initialTime: number;
  onTimeUp: () => void;
  size?: number;
}

const RADIUS = 90;
const STROKE = 12;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const DANGER_THRESHOLD = 4;

const CircularTimer = ({
  initialTime,
  onTimeUp,
  size = 250,
}: CircularTimerProps) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [isRunning, setIsRunning] = useState(true);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const onTimeUpRef = useRef(onTimeUp);
  onTimeUpRef.current = onTimeUp;

  const isDanger = timeLeft <= DANGER_THRESHOLD && timeLeft > 0;
  const progress = timeLeft / initialTime;
  const offset = CIRCUMFERENCE * (1 - progress);

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (!isRunning || timeLeft <= 0) {
      clearTimer();
      if (timeLeft <= 0) onTimeUpRef.current();
      return;
    }

    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);

    return clearTimer;
  }, [isRunning, timeLeft, clearTimer]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const display = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  const strokeColor = isDanger ? "#ff7b72" : "#10b9cf";
  const viewBox = `0 0 ${RADIUS * 2 + STROKE} ${RADIUS * 2 + STROKE}`;
  const center = RADIUS + STROKE / 2;

  return (
    <div className="flex flex-col items-center gap-6">
      <motion.div
        className="relative"
        style={{ width: size, height: size }}
        animate={isDanger ? { scale: [1, 1.06, 1] } : { scale: 1 }}
        transition={isDanger ? { duration: 0.5, repeat: Infinity } : {}}
      >
        <div className="absolute inset-4 rounded-full bg-[radial-gradient(circle,#fffef8_0%,#dcfbff_45%,#8aeaf3_100%)] shadow-[inset_0_0_0_10px_rgba(255,255,255,0.3)]" />
        <svg width={size} height={size} viewBox={viewBox} className="rotate-[-90deg]">
          <circle
            cx={center}
            cy={center}
            r={RADIUS}
            fill="none"
            stroke="rgba(255,255,255,0.48)"
            strokeWidth={STROKE}
          />
          <motion.circle
            cx={center}
            cy={center}
            r={RADIUS}
            fill="none"
            stroke={strokeColor}
            strokeWidth={STROKE}
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={offset}
            initial={false}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="island-badge inline-flex items-center gap-2 px-4 py-2 text-[11px] font-black uppercase tracking-[0.2em]">
            <Waves className="h-4 w-4" />
            Cronômetro
          </div>
          <motion.span
            className={`mt-4 font-display text-7xl leading-none ${isDanger ? "text-[#ff6d77]" : "text-[#1b8892]"}`}
            animate={isDanger ? { opacity: [1, 0.4, 1] } : { opacity: 1 }}
            transition={isDanger ? { duration: 0.5, repeat: Infinity } : {}}
          >
            {display}
          </motion.span>
        </div>
      </motion.div>

      <button
        onClick={() => setIsRunning((running) => !running)}
        className="splash-hit pebble-button flex h-16 w-16 items-center justify-center"
        disabled={timeLeft <= 0}
        type="button"
      >
        {isRunning ? (
          <Pause className="h-7 w-7" />
        ) : (
          <Play className="ml-1 h-7 w-7" />
        )}
      </button>
    </div>
  );
};

export default CircularTimer;
