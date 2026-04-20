import type { Player } from "@/types/game";
import { Coins, Star } from "lucide-react";

interface Props {
  player: Player;
}

const PlayerMiniCard = ({ player }: Props) => {
  return (
    <div
      className="flex-1 min-w-[120px] rounded-[2.5rem] border-[3px] border-coral bg-menta p-3 flex flex-col items-center gap-1 shadow-md hover:shadow-lg transition-shadow"
      style={{ boxShadow: undefined }}
    >
      <div className="w-10 h-10 rounded-xl bg-white/50 flex items-center justify-center text-xl shadow-sm">
        🎲
      </div>
      <span className="font-bold text-sm text-[#2D1B0D]">{player.label}</span>
      <div className="flex items-center gap-2 text-xs font-semibold text-[#2D1B0D]">
        <span className="flex items-center gap-0.5">
          <Coins className="w-3.5 h-3.5" /> {player.coins}
        </span>
        <span className="flex items-center gap-0.5">
          <Star className="w-3.5 h-3.5" /> {player.stars}
        </span>
      </div>
    </div>
  );
};

export default PlayerMiniCard;
