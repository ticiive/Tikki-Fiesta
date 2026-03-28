import { UserPlus } from "lucide-react";

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
  return (
    <button
      onClick={onClick}
      className={`
        splash-hit wood-panel relative flex aspect-square w-full flex-col items-center justify-center gap-3 px-4 py-5 text-center font-bold text-lg transition-all duration-200
        ${selected ? "scale-[0.98] saturate-110" : "hover:scale-[1.02]"}
      `}
    >
      {selected && order && (
        <div className="stone-badge absolute -top-2 -right-2 flex h-9 w-9 items-center justify-center text-sm font-black animate-in zoom-in duration-300">
          {order}
        </div>
      )}

      <div
        className={`
          flex h-16 w-16 items-center justify-center rounded-[1.25rem] border-2 text-3xl transition-all duration-200
          ${
            selected
              ? "border-[#8f4f2b] bg-[linear-gradient(180deg,#fff6de,#efcf7a)] text-[#7a4b1d]"
              : "border-[#6d4425]/60 bg-[linear-gradient(180deg,rgba(255,247,229,0.72),rgba(237,210,160,0.65))] text-[#6c4325]"
          }
        `}
      >
        {selected ? "🗺️" : <UserPlus className="h-7 w-7" />}
      </div>

      <div className={`${selected ? "parchment-panel w-full px-4 py-2" : "w-full px-2 py-1"}`}>
        <span
          className={`block text-sm font-extrabold uppercase tracking-[0.18em] ${
            selected ? "text-[#7d4b1d]" : "text-[#5f381f]"
          }`}
        >
          {selected ? "Na Trilha" : "Explorador"}
        </span>
      </div>

      <span className="text-base font-black text-[#fff4de]">{label}</span>
    </button>
  );
};

export default CharacterCard;
