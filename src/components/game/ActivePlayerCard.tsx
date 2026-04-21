import type { Player } from "@/types/game";

interface Props {
  player: Player;
  onUpdateCoins: (delta: number) => void;
  onUpdateStars: (delta: number) => void;
  onEndTurn: () => void;
}

const InventoryRow = ({
  icon,
  value,
  onAdd,
  onRemove,
}: {
  icon: string;
  value: number;
  onAdd: () => void;
  onRemove: () => void;
}) => (
  <div className="flex items-center gap-6 bg-white/40 p-3 rounded-2xl border-2 border-[#5D3A1A]">
    <img src={icon} alt="item" className="w-12 h-12 shrink-0 object-contain drop-shadow-md" />
    <span className="text-5xl font-extrabold min-w-[3ch] text-center text-[#2D1B0D] drop-shadow-sm">
      {value}
    </span>
    <div className="flex items-center gap-4 ml-auto">
      <button
        onClick={onRemove}
        className="w-12 h-12 rounded-full bg-coral/80 border-4 border-[#5D3A1A] flex items-center justify-center font-black text-2xl text-white shadow-lg hover:shadow-xl hover:scale-110 active:scale-95 transition-all"
      >
        -
      </button>
      <button
        onClick={onAdd}
        className="w-12 h-12 rounded-full bg-menta/80 border-4 border-[#5D3A1A] flex items-center justify-center font-black text-2xl text-[#2D1B0D] shadow-lg hover:shadow-xl hover:scale-110 active:scale-95 transition-all"
      >
        +
      </button>
    </div>
  </div>
);

const ActivePlayerCard = ({ player, onUpdateCoins, onUpdateStars, onEndTurn }: Props) => {
  return (
    <div
      className="relative h-full rounded-[40px] border-[6px] border-[#5D3A1A] bg-[#E2711D] bg-[url('/img/desenho-card-principal.png')] bg-cover bg-center p-6 flex gap-8 shadow-xl"
    >
      {/* Left: Avatar + Actions */}
      <div className="flex flex-col items-center justify-start gap-4 shrink-0">
        {/* Avatar simulated bamboo border via multiple borders / repeating gradients on the border if possible, or just a solid color with dashes */}
        <div 
          className="w-40 h-40 rounded-full border-[10px] border-[#D4A373] bg-white flex items-center justify-center text-7xl shadow-[4px_4px_0px_rgba(0,0,0,0.3)] shrink-0 overflow-hidden relative"
          style={{ borderStyle: 'dashed' /* simulates bamboo joints */ }}
        >
          <div className="absolute inset-0 bg-[#E9C46A] opacity-20 pointer-events-none rounded-full" />
          <span className="relative z-10">{player.avatar}</span>
        </div>
        <h2 className="text-3xl font-extrabold text-[#FDF5E6] drop-shadow-md bg-[#2D1B0D]/80 px-4 py-1 rounded-xl">
          {player.label}
        </h2>

        {/* 3 placeholder circular buttons */}
        <div className="flex gap-3 mt-auto mb-2">
          <button className="w-14 h-14 rounded-full bg-[#4A2F1D] border-2 border-[#2D1B0D] shadow-[inset_0px_4px_4px_rgba(0,0,0,0.5)] active:scale-95 transition-transform" />
          <button className="w-14 h-14 rounded-full bg-[#4A2F1D] border-2 border-[#2D1B0D] shadow-[inset_0px_4px_4px_rgba(0,0,0,0.5)] active:scale-95 transition-transform" />
          <button className="w-14 h-14 rounded-full bg-[#4A2F1D] border-2 border-[#2D1B0D] shadow-[inset_0px_4px_4px_rgba(0,0,0,0.5)] active:scale-95 transition-transform" />
        </div>
      </div>

      {/* Center: Counters */}
      <div className="flex-1 flex flex-col justify-center gap-6">
        <InventoryRow 
          icon="/img/buzios.png" 
          value={player.coins} 
          onAdd={() => onUpdateCoins(1)} 
          onRemove={() => onUpdateCoins(-1)} 
        />
        <InventoryRow 
          icon="/img/perola-negra.png" 
          value={player.stars} 
          onAdd={() => onUpdateStars(1)} 
          onRemove={() => onUpdateStars(-1)} 
        />
      </div>

      {/* Right: End Turn Button */}
      <div className="flex items-end shrink-0">
        <button
          onClick={onEndTurn}
          className="px-8 py-4 rounded-full bg-coral text-white font-black text-lg hover:bg-coral/90 hover:scale-110 active:scale-95 transition-all whitespace-nowrap shadow-lg hover:shadow-2xl"
        >
          ENCERRAR RODADA 🔄
        </button>
      </div>
    </div>
  );
};

export default ActivePlayerCard;
