import { Shell } from "lucide-react";
import CharacterAvatar, { getCharacter } from "@/components/game/CharacterAvatar";

interface CharacterCardProps {
  label: string;
  selected: boolean;
  order?: number;
  onClick: () => void;
}

const CharacterCard = ({
  label,
  selected,
  order,
  onClick,
}: CharacterCardProps) => {
  const character = getCharacter(label);

  return (
    <button
      onClick={onClick}
      className={`
        splash-hit relative flex aspect-square w-full flex-col items-center justify-between rounded-[1.8rem] border-[3px] p-4 text-center transition-all duration-200
        ${
          selected
            ? "leafy-card scale-[0.98]"
            : "driftwood-card hover:-translate-y-1 hover:scale-[1.02]"
        }
      `}
      type="button"
    >
      {selected && order && (
        <div className="stone-badge absolute -right-2 -top-2 flex h-10 w-10 items-center justify-center text-sm font-black">
          {order}
        </div>
      )}

      <div className="island-badge inline-flex items-center gap-2 px-3 py-1 text-[11px] font-black uppercase tracking-[0.2em]">
        <Shell className="h-3.5 w-3.5" />
        {selected ? "Escolhido" : "Livre"}
      </div>

      <div className="rounded-[1.4rem] border-2 border-white/60 bg-white/50 px-3 py-3 shadow-[0_8px_18px_rgba(24,112,127,0.12)]">
        <CharacterAvatar playerId={label} size="lg" bounce={selected} />
      </div>

      <div className="w-full rounded-[1.3rem] bg-white/18 px-3 py-3">
        <span className="block text-lg font-black text-white">
          {character.name}
        </span>
        <span className="mt-1 block text-xs font-black uppercase tracking-[0.18em] text-white/80">
          {selected ? "Pronto para a praia" : "Toque para entrar"}
        </span>
      </div>
    </button>
  );
};

export default CharacterCard;
