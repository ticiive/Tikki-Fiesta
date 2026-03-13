import type { Player } from "@/types/game";
import { Coins, Star } from "lucide-react";
import CharacterAvatar from "@/components/game/CharacterAvatar";

interface Props {
  player: Player;
}

const PlayerMiniCard = ({ player }: Props) => {
  return (
    <div
      className="flex-1 min-w-[120px] rounded-3xl border-[3px] border-border glass p-3 flex flex-col items-center gap-1"
      style={{ boxShadow: "var(--pop-shadow-white)" }}
    >
      <CharacterAvatar playerId={player.id} size="sm" />
      <span className="font-bold text-sm text-foreground">{player.label}</span>
      <div className="flex items-center gap-2 text-xs font-semibold text-foreground/50">
        <span className="flex items-center gap-0.5">
          <Coins className="w-3.5 h-3.5 text-sunflower" /> {player.coins}
        </span>
        <span className="flex items-center gap-0.5">
          <Star className="w-3.5 h-3.5 text-sunflower" /> {player.stars}
        </span>
      </div>
    </div>
  );
};

export default PlayerMiniCard;
