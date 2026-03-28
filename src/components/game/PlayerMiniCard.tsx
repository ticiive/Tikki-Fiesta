import type { Player } from "@/types/game";
import { Coins, Star } from "lucide-react";

interface Props {
  player: Player;
}

const PlayerMiniCard = ({ player }: Props) => {
  return (
    <div className="stake-tab flex min-w-[120px] flex-1 flex-col items-center gap-2 px-4 py-4 text-[#fff3df]">
      <div className="flex h-10 w-10 items-center justify-center rounded-[0.9rem] border-2 border-[#7d4c27] bg-[linear-gradient(180deg,#fff1d3,#efc768)] text-xl text-[#7a4b1d]">
        🐚
      </div>
      <span className="font-display text-2xl leading-none">{player.label}</span>
      <div className="grid gap-1 text-xs font-black uppercase tracking-[0.16em]">
        <span className="flex items-center gap-1">
          <Coins className="h-3.5 w-3.5 text-[#ffe08c]" /> {player.coins}
        </span>
        <span className="flex items-center gap-1">
          <Star className="h-3.5 w-3.5 text-[#ffe08c]" /> {player.stars}
        </span>
      </div>
    </div>
  );
};

export default PlayerMiniCard;
