import type { Player } from "@/types/game";
import { Coins, Star, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import CharacterAvatar from "@/components/game/CharacterAvatar";

interface Props {
  player: Player;
  onUpdateCoins: (delta: number) => void;
  onUpdateStars: (delta: number) => void;
  onEndTurn: () => void;
}

const CircleBtn = ({
  label,
  onClick,
  size = "md",
}: {
  label: string;
  onClick: () => void;
  size?: "sm" | "md";
}) => {
  const dim = size === "sm" ? "w-9 h-9 text-sm" : "w-11 h-11 text-base";
  return (
    <button
      onClick={onClick}
      className={`${dim} rounded-full border-2 border-border bg-card/60 text-foreground font-bold hover:bg-card/90 active:scale-90 transition-all flex items-center justify-center backdrop-blur-sm`}
    >
      {label}
    </button>
  );
};

const ActivePlayerCard = ({ player, onUpdateCoins, onUpdateStars, onEndTurn }: Props) => {
  return (
    <motion.div
      className="relative h-full rounded-3xl border-[3px] border-border glass p-4 flex gap-4"
      style={{ boxShadow: "var(--pop-shadow-white)" }}
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
    >
      {/* Left: Avatar + Info */}
      <div className="flex flex-col items-center justify-between py-2">
        <CharacterAvatar playerId={player.id} size="lg" />
        <div className="flex flex-col items-center">
          <h2 className="text-xl font-bold text-foreground mt-1 font-display">
            {player.label}
          </h2>
          <p className="text-xs text-foreground/50 font-semibold flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> Sua vez de jogar! ✨
          </p>
        </div>
        {/* Quick action placeholder */}
        <div className="flex gap-2 mt-auto">
          {["⚡", "🛡️", "⚔️"].map((emoji, i) => (
            <button
              key={i}
              className="w-10 h-10 rounded-full glass flex items-center justify-center border-2 border-border hover:scale-110 active:scale-90 transition-all text-sm"
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>

      {/* Center: Counters */}
      <div className="flex-1 flex flex-col justify-center gap-4">
        {/* Coins */}
        <div className="flex items-center gap-3">
          <Coins className="w-8 h-8 text-sunflower shrink-0" />
          <span className="text-4xl font-bold text-foreground min-w-[3ch] text-center font-display">
            {player.coins}
          </span>
          <div className="flex items-center gap-1.5 ml-auto">
            <CircleBtn label="-10" onClick={() => onUpdateCoins(-10)} size="sm" />
            <CircleBtn label="-1" onClick={() => onUpdateCoins(-1)} />
            <CircleBtn label="+1" onClick={() => onUpdateCoins(1)} />
            <CircleBtn label="+10" onClick={() => onUpdateCoins(10)} size="sm" />
          </div>
        </div>

        {/* Stars */}
        <div className="flex items-center gap-3">
          <Star className="w-8 h-8 text-sunflower shrink-0" />
          <span className="text-4xl font-bold text-foreground min-w-[3ch] text-center font-display">
            {player.stars}
          </span>
          <div className="flex items-center gap-1.5 ml-auto">
            <CircleBtn label="-" onClick={() => onUpdateStars(-1)} />
            <CircleBtn label="+" onClick={() => onUpdateStars(1)} />
          </div>
        </div>
      </div>

      {/* Right: End Turn */}
      <div className="flex items-end">
        <motion.button
          onClick={onEndTurn}
          className="px-5 py-3 rounded-3xl border-[3px] border-border bg-coral text-secondary-foreground font-bold text-sm whitespace-nowrap"
          style={{ boxShadow: "var(--pop-shadow-coral)" }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.95 }}
        >
          PRÓXIMO TURNO 🔄
        </motion.button>
      </div>
    </motion.div>
  );
};

export default ActivePlayerCard;
