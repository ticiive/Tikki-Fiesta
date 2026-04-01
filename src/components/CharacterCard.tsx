import { UserPlus } from "lucide-react";

interface CharacterCardProps {
  label: string;
  selected: boolean;
  onClick: () => void;
}

const CharacterCard = ({ label, selected, onClick }: CharacterCardProps) => {
  return (
    <button
      onClick={onClick}
      className={`
        aspect-square w-full rounded-3xl border-[3px] transition-all duration-200
        flex flex-col items-center justify-center gap-2
        font-bold text-lg
        ${
          selected
            ? "border-tangerine bg-tangerine/15 scale-[0.96]"
            : "border-cobalt-light bg-card hover:scale-[1.03]"
        }
      `}
      
      style={{
        boxShadow: selected
          ? "var(--pop-shadow-tangerine)"
          : "var(--pop-shadow-cobalt)",
      }}
    >
      <div
        className={`
          w-14 h-14 rounded-2xl flex items-center justify-center text-3xl
          ${selected ? "bg-tangerine text-secondary-foreground" : "bg-muted text-cobalt"}
        `}
      >
        {selected ? "🎮" : <UserPlus className="w-7 h-7" />}
      </div>
      <span className={`text-sm font-semibold ${selected ? "text-tangerine" : "text-cobalt"}`}>
        {label}
      </span>
    </button>
  );
};

export default CharacterCard;
