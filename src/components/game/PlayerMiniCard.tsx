import type { Player } from "@/types/game";
import CharacterAvatar from "@/components/game/CharacterAvatar";

interface Props {
  player: Player;
}

const PlayerMiniCard = ({ player }: Props) => {
  return (
    <div className="driftwood-card flex min-w-[150px] flex-1 flex-col items-center gap-3 p-4 text-center">
      <div className="rounded-[1rem] bg-white/22 px-2 py-2">
        <CharacterAvatar playerId={player.id} size="sm" />
      </div>
      <span className="font-display text-3xl leading-none text-[#24818a]">
        {player.label}
      </span>
      <div className="grid gap-1 text-xs font-black uppercase tracking-[0.16em] text-[#4a7d80]">
        <span>🥥 {player.coins}</span>
        <span>🐚 {player.stars}</span>
      </div>
    </div>
  );
};

export default PlayerMiniCard;
