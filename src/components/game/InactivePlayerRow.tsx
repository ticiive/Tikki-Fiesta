import type { Player } from "@/types/game";

interface Props {
  players: Player[];
}

const InactivePlayerRow = ({ players }: Props) => {
  return (
    <div className="h-full flex gap-4 p-4 overflow-x-auto">
      {players.map((p) => (
        <div
          key={p.id}
          className="flex-1 min-w-[200px] rounded-[2.5rem] border-[4px] border-[#5D3A1A] bg-areia p-4 flex items-center gap-4 shadow-lg hover:shadow-xl transition-shadow"
        >
          {/* Avatar Container */}
          <div className="flex flex-col items-center gap-2 shrink-0">
            <div className="w-16 h-16 rounded-full border-4 border-coral bg-menta flex items-center justify-center text-3xl shadow-md">
              🎲
            </div>
            <span className="font-extrabold text-[#2D1B0D] px-2 py-0.5 bg-black/5 rounded-lg text-sm truncate max-w-[80px]">
              {p.label}
            </span>
          </div>

          {/* Vertical Compact List */}
          <div className="flex flex-col gap-2 flex-1">
            <div className="flex items-center justify-between bg-white/50 px-2 py-1 rounded-lg">
              <img src="/img/buzios.png" className="w-6 h-6 object-contain" alt="Búzio" />
              <span className="font-bold text-[#2D1B0D] text-lg">{p.coins}</span>
            </div>
            <div className="flex items-center justify-between bg-white/50 px-2 py-1 rounded-lg">
              <img src="/img/perola-negra.png" className="w-6 h-6 object-contain" alt="Pérola" />
              <span className="font-bold text-[#2D1B0D] text-lg">{p.stars}</span>
            </div>
            <div className="flex items-center justify-between bg-white/50 px-2 py-1 rounded-lg">
              <img src="/img/trofeu-madeira.png" className="w-6 h-6 object-contain" alt="Troféu" />
              <span className="font-bold text-[#2D1B0D] text-lg">0</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default InactivePlayerRow;
