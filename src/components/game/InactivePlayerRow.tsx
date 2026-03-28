import type { Player } from "@/types/game";
import { Coins, Star } from "lucide-react";

interface Props {
  players: Player[];
}

const InactivePlayerRow = ({ players }: Props) => {
  return (
    <div className="grid h-full grid-cols-1 gap-3 overflow-auto pr-1 sm:grid-cols-3">
      {players.map((player, index) => (
        <div
          key={player.id}
          className={`stake-tab ${index === 0 ? "is-selected" : ""} flex min-h-[8.2rem] flex-col justify-between px-4 py-4`}
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-[0.24em] text-[#ffe7c8]/80">
                Próximo
              </span>
              <h3 className="font-display mt-1 text-3xl leading-none text-[#fff5df]">
                {player.label}
              </h3>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-[1rem] border-2 border-[#7f4f2b] bg-[linear-gradient(180deg,#fff1cf,#efc56f)] text-2xl text-[#7d4b1d]">
              🐚
            </div>
          </div>

          <div className="mt-3 grid gap-2 text-sm font-black text-[#fff2dd]">
            <div className="rounded-xl bg-[rgba(255,248,231,0.13)] px-3 py-2">
              <span className="flex items-center gap-2">
                <Coins className="h-4 w-4 text-[#ffe08c]" />
                {player.coins} moedas
              </span>
            </div>
            <div className="rounded-xl bg-[rgba(255,248,231,0.13)] px-3 py-2">
              <span className="flex items-center gap-2">
                <Star className="h-4 w-4 text-[#ffe08c]" />
                {player.stars} estrelas
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default InactivePlayerRow;
