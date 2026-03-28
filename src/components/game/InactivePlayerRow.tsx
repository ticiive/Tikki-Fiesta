import type { Player } from "@/types/game";
import CharacterAvatar from "@/components/game/CharacterAvatar";

interface Props {
  players: Player[];
}

const InactivePlayerRow = ({ players }: Props) => {
  return (
    <div className="flex flex-col gap-3">
      {players.map((player, index) => (
        <div
          key={player.id}
          className={`${index === 0 ? "leafy-card" : "driftwood-card"} flex items-center gap-4 p-4`}
        >
          <div className="rounded-[1.2rem] bg-white/22 px-2 py-2">
            <CharacterAvatar playerId={player.id} size="sm" bounce={index === 0} />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-3">
              <strong className={`truncate text-lg font-black ${index === 0 ? "text-white" : "text-[#2f6769]"}`}>
                {player.label}
              </strong>
              <span className={`rounded-full px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em] ${index === 0 ? "bg-white/18 text-white" : "bg-[#ffffffaa] text-[#2f6769]"}`}>
                {index === 0 ? "Próximo" : "Na fila"}
              </span>
            </div>
            <div className={`mt-2 flex flex-wrap gap-2 text-sm font-black ${index === 0 ? "text-white/84" : "text-[#477c80]"}`}>
              <span>🥥 {player.coins}</span>
              <span>🐚 {player.stars}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default InactivePlayerRow;
