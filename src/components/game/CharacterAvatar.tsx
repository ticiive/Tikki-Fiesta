import { motion } from "framer-motion";

export interface CharacterData {
  id: string;
  name: string;
  emoji: string;
  bgColor: string;
  accentColor: string;
  detail: string;
}

export const CHARACTERS: Record<string, CharacterData> = {
  P1: {
    id: "P1",
    name: "Sunny",
    emoji: "⭐",
    bgColor: "hsl(45 95% 55%)",
    accentColor: "hsl(350 70% 65%)",
    detail: "cheeks",
  },
  P2: {
    id: "P2",
    name: "Mossy",
    emoji: "🌿",
    bgColor: "hsl(140 55% 50%)",
    accentColor: "hsl(340 70% 65%)",
    detail: "flower",
  },
  P3: {
    id: "P3",
    name: "Bubbles",
    emoji: "💧",
    bgColor: "hsl(190 70% 55%)",
    accentColor: "hsl(0 0% 95%)",
    detail: "headphones",
  },
  P4: {
    id: "P4",
    name: "Ember",
    emoji: "🔥",
    bgColor: "hsl(16 90% 55%)",
    accentColor: "hsl(220 60% 45%)",
    detail: "cap",
  },
};

export const getCharacter = (playerId: string): CharacterData => {
  return CHARACTERS[playerId] || {
    id: playerId,
    name: playerId,
    emoji: "🎮",
    bgColor: "hsl(200 60% 55%)",
    accentColor: "hsl(0 0% 90%)",
    detail: "none",
  };
};

interface CharacterAvatarProps {
  playerId: string;
  size?: "sm" | "md" | "lg";
  bounce?: boolean;
  showName?: boolean;
}

const sizeMap = {
  sm: "w-10 h-10 text-lg",
  md: "w-14 h-14 text-2xl",
  lg: "w-20 h-20 text-4xl",
};

const CharacterAvatar = ({ playerId, size = "md", bounce = false, showName = false }: CharacterAvatarProps) => {
  const char = getCharacter(playerId);
  const dim = sizeMap[size];

  return (
    <div className="flex flex-col items-center gap-1">
      <motion.div
        className={`${dim} rounded-full flex items-center justify-center vinyl-3d relative`}
        style={{
          backgroundColor: char.bgColor,
          border: "3px solid hsla(0, 0%, 100%, 0.8)",
          boxShadow: `0 4px 14px hsla(0, 0%, 0%, 0.18), inset 0 2px 6px hsla(0, 0%, 100%, 0.45)`,
        }}
        animate={bounce ? { y: [0, -8, 0] } : {}}
        transition={bounce ? { duration: 0.4, ease: "easeOut" } : {}}
        whileHover={{ scale: 1.1, y: -4 }}
      >
        <span className="drop-shadow-sm">{char.emoji}</span>

        {/* Cheek blush for Sunny */}
        {char.detail === "cheeks" && (
          <>
            <div
              className="absolute rounded-full opacity-60"
              style={{
                width: "18%", height: "14%",
                bottom: "22%", left: "12%",
                backgroundColor: char.accentColor,
              }}
            />
            <div
              className="absolute rounded-full opacity-60"
              style={{
                width: "18%", height: "14%",
                bottom: "22%", right: "12%",
                backgroundColor: char.accentColor,
              }}
            />
          </>
        )}

        {/* Flower for Mossy */}
        {char.detail === "flower" && (
          <div
            className="absolute -top-1 -right-0.5 text-xs"
            style={{ fontSize: size === "sm" ? "8px" : size === "md" ? "11px" : "15px" }}
          >
            🌸
          </div>
        )}

        {/* Headphones for Bubbles */}
        {char.detail === "headphones" && (
          <div
            className="absolute -top-1 text-xs"
            style={{ fontSize: size === "sm" ? "8px" : size === "md" ? "10px" : "14px" }}
          >
            🎧
          </div>
        )}

        {/* Cap for Ember */}
        {char.detail === "cap" && (
          <div
            className="absolute -top-1.5 text-xs"
            style={{
              fontSize: size === "sm" ? "9px" : size === "md" ? "12px" : "16px",
              transform: "scaleX(-1)",
            }}
          >
            🧢
          </div>
        )}
      </motion.div>

      {showName && (
        <span className="text-xs font-bold text-foreground/70">{char.name}</span>
      )}
    </div>
  );
};

export default CharacterAvatar;
