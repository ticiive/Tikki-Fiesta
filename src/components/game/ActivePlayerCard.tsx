import type { Player } from "@/types/game";
import { Sparkles, Waves } from "lucide-react";
import { motion } from "framer-motion";
import CharacterAvatar from "@/components/game/CharacterAvatar";

interface Props {
  player: Player;
  onUpdateCoins: (delta: number) => void;
  onUpdateStars: (delta: number) => void;
  onEndTurn: () => void;
}

const shellMarks = (value: number, max: number) =>
  Array.from({ length: max }, (_, index) => index < value);

const ShellMeter = ({ value, max }: { value: number; max: number }) => (
  <div className="shell-meter" aria-hidden="true">
    {shellMarks(Math.min(value, max), max).map((filled, index) => (
      <span key={index} className={filled ? "filled" : undefined} />
    ))}
  </div>
);

const CoralMeter = ({ value, max }: { value: number; max: number }) => (
  <div className="totem-meter" aria-hidden="true">
    {shellMarks(Math.min(value, max), max).map((filled, index) => (
      <span
        key={index}
        className={filled ? "filled" : undefined}
        style={{ height: `${1 + index * 0.35}rem` }}
      />
    ))}
  </div>
);

const SmallAction = ({
  label,
  onClick,
  tone = "pebble",
}: {
  label: string;
  onClick: () => void;
  tone?: "pebble" | "coconut";
}) => (
  <button
    onClick={onClick}
    className={`splash-hit min-w-[3.3rem] px-3 py-2 text-sm font-black transition-transform hover:-translate-y-0.5 active:translate-y-0.5 ${
      tone === "pebble" ? "pebble-button" : "coconut-button"
    }`}
    type="button"
  >
    {label}
  </button>
);

const ActivePlayerCard = ({
  player,
  onUpdateCoins,
  onUpdateStars,
  onEndTurn,
}: Props) => {
  return (
    <motion.div
      className="surf-card flex h-full flex-col gap-5 p-5"
      initial={{ scale: 0.97, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 24 }}
    >
      <div className="grid flex-1 gap-4 lg:grid-cols-[minmax(16rem,20rem)_minmax(0,1fr)]">
        <div className="leafy-card flex flex-col items-center justify-between p-5 text-center">
          <div className="island-badge inline-flex items-center gap-2 px-4 py-2 text-xs font-black uppercase tracking-[0.2em]">
            <Sparkles className="h-4 w-4" />
            Jogador do sol
          </div>

          <div className="rounded-[1.7rem] border-2 border-white/60 bg-white/28 px-4 py-4 shadow-[0_14px_28px_rgba(14,118,105,0.16)]">
            <CharacterAvatar playerId={player.id} size="lg" bounce />
          </div>

          <div>
            <h2 className="font-display text-5xl leading-none text-white">
              {player.label}
            </h2>
            <p className="mt-2 text-sm font-black uppercase tracking-[0.18em] text-white/78">
              Hora de dominar a maré
            </p>
          </div>

          <div className="grid w-full gap-3">
            <div className="rounded-[1.4rem] bg-white/18 px-4 py-3">
              <span className="text-xs font-black uppercase tracking-[0.22em] text-white/82">
                Praia ativa
              </span>
              <div className="mt-2 flex items-center justify-center gap-2 text-lg font-black text-white">
                <span>🌺</span>
                <span>Centro do tabuleiro</span>
              </div>
            </div>
            <button
              onClick={onEndTurn}
              className="splash-hit gem-button gem-magenta w-full px-6 py-4 text-sm uppercase tracking-[0.22em]"
              type="button"
            >
              Passar a onda
            </button>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-rows-[minmax(0,1fr)_auto]">
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="driftwood-card p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.22em] text-[#5d7265]">
                    🥥 Moedas
                  </p>
                  <strong className="mt-2 block text-5xl font-black text-[#345e60]">
                    {player.coins}
                  </strong>
                </div>
                <ShellMeter value={Math.ceil(player.coins / 5)} max={8} />
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                <SmallAction label="-10" onClick={() => onUpdateCoins(-10)} tone="coconut" />
                <SmallAction label="-1" onClick={() => onUpdateCoins(-1)} tone="coconut" />
                <SmallAction label="+1" onClick={() => onUpdateCoins(1)} />
                <SmallAction label="+10" onClick={() => onUpdateCoins(10)} />
              </div>
            </div>

            <div className="driftwood-card p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.22em] text-[#5d7265]">
                    🐚 Estrelas
                  </p>
                  <strong className="mt-2 block text-5xl font-black text-[#345e60]">
                    {player.stars}
                  </strong>
                </div>
                <CoralMeter value={player.stars} max={6} />
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                <SmallAction label="-" onClick={() => onUpdateStars(-1)} tone="coconut" />
                <SmallAction label="+" onClick={() => onUpdateStars(1)} />
              </div>
            </div>
          </div>

          <div className="parchment-panel flex items-center justify-between gap-4 px-5 py-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-[#417e82]">
                Ritual tropical
              </p>
              <h3 className="font-display mt-1 text-4xl leading-none text-[#17879a]">
                Ajuste e siga
              </h3>
              <p className="mt-2 max-w-xl text-sm font-bold text-[#487b7f]">
                Use conchas e cocos para atualizar a pontuação e avance quando o
                turno estiver pronto para o próximo jogador.
              </p>
            </div>
            <div className="surf-card flex items-center gap-2 px-4 py-3 text-[#0d6d76]">
              <Waves className="h-5 w-5" />
              <span className="text-sm font-black uppercase tracking-[0.18em]">
                Maré em movimento
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ActivePlayerCard;
