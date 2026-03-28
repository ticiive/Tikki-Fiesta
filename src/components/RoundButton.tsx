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
        splash-hit gem-button flex-1 px-3 py-4 text-2xl font-black tracking-wide text-[#fff9ef]
        ${selected ? "gem-magenta" : "gem-turquoise"}
      `}
    >
      <span className="block text-xs uppercase tracking-[0.3em] text-[#fff6e0]/80">
        Rodadas
      </span>
      {value}
    </button>
  );
};

export default RoundButton;
