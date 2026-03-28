interface RoundButtonProps {
  value: number;
  selected: boolean;
  onClick: () => void;
}

const RoundButton = ({ value, selected, onClick }: RoundButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={`
        splash-hit flex-1 px-3 py-4 text-center transition-all duration-200
        ${selected ? "gem-button gem-magenta" : "gem-button gem-turquoise"}
      `}
      type="button"
    >
      <span className="block text-[11px] font-black uppercase tracking-[0.28em] text-white/82">
        Ondas
      </span>
      <strong className="mt-1 block text-3xl font-black text-white">
        {value}
      </strong>
    </button>
  );
};

export default RoundButton;
