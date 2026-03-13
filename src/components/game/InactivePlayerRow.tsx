import type { Player } from "@/types/game";
import { Coins, Star } from "lucide-react";
import CharacterAvatar from "@/components/game/CharacterAvatar";

interface Props {
  players: Player[];
}

const InactivePlayerRow = ({ players }: Props) => {
  return (
    <div className="h-full flex gap-3 p-3">
      {players.map((p) => (
        <div
          key={p.id}
          className="flex-1 rounded-3xl border-[3px] border-border glass p-3 flex items-center gap-3"
          style={{ boxShadow: "var(--pop-shadow-white)" }}
        >
          <CharacterAvatar playerId={p.id} size="sm" />

          <div className="flex flex-col gap-0.5">
            <span className="font-bold text-sm text-foreground">{p.label}</span>
            <div className="flex items-center gap-1 text-xs font-semibold text-foreground/50">
              <Coins className="w-3.5 h-3.5 text-sunflower" />
              <span>Moedas: {p.coins}</span>
            </div>
            <div className="flex items-center gap-1 text-xs font-semibold text-foreground/50">
              <Star className="w-3.5 h-3.5 text-sunflower" />
              <span>Estrelas: {p.stars}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default InactivePlayerRow;
