import type { Player } from "@/types/game";
import { Coins, Shield, Sparkles, Star, Swords, Zap } from "lucide-react";
import { motion } from "framer-motion";
import CharacterAvatar from "@/components/game/CharacterAvatar";

interface Props {
  player: Player;
  onUpdateCoins: (delta: number) => void;
  onUpdateStars: (delta: number) => void;
  onEndTurn: () => void;
}

const clampMeter = (value: number, max: number) =>
  Array.from({ length: max }, (_, index) => index < value);

const ShellMeter = ({ value, max }: { value: number; max: number }) => (
  <div className="shell-meter" aria-hidden="true">
    {clampMeter(Math.min(value, max), max).map((filled, index) => (
      <span key={index} className={filled ? "filled" : undefined} />
    ))}
  </div>
);

const TotemMeter = ({ value, max }: { value: number; max: number }) => (
  <div className="totem-meter" aria-hidden="true">
    {clampMeter(Math.min(value, max), max).map((filled, index) => (
      <span
        key={index}
        className={filled ? "filled" : undefined}
        style={{ height: `${1.15 + index * 0.38}rem` }}
      />
    ))}
  </div>
);

const CircleBtn = ({
  label,
  onClick,
  tone = "lagoon",
}: {
  label: string;
  onClick: () => void;
  tone?: "lagoon" | "ember";
}) => (
  <button
    onClick={onClick}
    className={`splash-hit flex h-11 min-w-11 items-center justify-center rounded-full border-2 px-3 text-sm font-black transition-all hover:-translate-y-0.5 active:translate-y-0.5 ${
      tone === "lagoon"
        ? "border-[#1f6d71] bg-[linear-gradient(180deg,#8cf5ea,#2fbcb7)] text-[#0f4d53] shadow-[0_5px_0_rgba(20,104,109,0.72)]"
        : "border-[#9a5a17] bg-[linear-gradient(180deg,#ffe5a7,#f0aa3d)] text-[#704010] shadow-[0_5px_0_rgba(146,93,27,0.68)]"
    }`}
    type="button"
  >
    {label}
  </button>
);

const statCardBase =
  "rounded-[1.15rem] border-2 border-[#8d6138]/80 bg-[linear-gradient(180deg,rgba(255,248,229,0.72),rgba(233,208,155,0.76))] p-4";

const ActivePlayerCard = ({
  player,
  onUpdateCoins,
  onUpdateStars,
  onEndTurn,
}: Props) => {
  return (
    <motion.div
      className="parchment-panel flex h-full flex-col gap-4 p-4"
      initial={{ scale: 0.96, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 24 }}
    >
      <div className="flex items-start gap-4">
        <div className="wood-panel flex w-[6.8rem] shrink-0 flex-col items-center justify-between px-3 py-4 text-center">
          <div className="rounded-[1.35rem] border-2 border-[#7f4c25] bg-[linear-gradient(180deg,#fff7df,#efcf79)] px-2 py-2">
            <CharacterAvatar playerId={player.id} size="lg" />
          </div>
          <div className="mt-3">
            <h2 className="font-display text-3xl leading-none text-[#fff4de]">
              {player.label}
            </h2>
            <p className="mt-1 flex items-center justify-center gap-1 text-xs font-extrabold uppercase tracking-[0.18em] text-[#fde7c8]/80">
              <Sparkles className="h-3 w-3" />
              Jogador ativo
            </p>
          </div>
          <div className="mt-4 flex gap-2">
            {[Zap, Shield, Swords].map((Icon, index) => (
              <button
                key={index}
                className="splash-hit flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#734224] bg-[linear-gradient(180deg,#ffd987,#ef9438)] text-[#734224] shadow-[0_4px_0_rgba(111,67,29,0.7)] transition-all hover:-translate-y-0.5 active:translate-y-0.5"
                type="button"
              >
                <Icon className="h-4 w-4" />
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-3">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className={statCardBase}>
              <div className="mb-2 flex items-center gap-2 text-[#734224]">
                <Coins className="h-5 w-5" />
                <span className="text-xs font-extrabold uppercase tracking-[0.26em]">
                  Moedas
                </span>
              </div>
              <div className="mb-3 flex items-end justify-between gap-3">
                <strong className="text-4xl font-black text-[#6b3d18]">
                  {player.coins}
                </strong>
                <ShellMeter value={Math.ceil(player.coins / 5)} max={8} />
              </div>
              <div className="flex flex-wrap gap-2">
                <CircleBtn label="-10" onClick={() => onUpdateCoins(-10)} tone="ember" />
                <CircleBtn label="-1" onClick={() => onUpdateCoins(-1)} tone="ember" />
                <CircleBtn label="+1" onClick={() => onUpdateCoins(1)} />
                <CircleBtn label="+10" onClick={() => onUpdateCoins(10)} />
              </div>
            </div>

            <div className={statCardBase}>
              <div className="mb-2 flex items-center gap-2 text-[#734224]">
                <Star className="h-5 w-5" />
                <span className="text-xs font-extrabold uppercase tracking-[0.26em]">
                  Estrelas
                </span>
              </div>
              <div className="mb-3 flex items-end justify-between gap-3">
                <strong className="text-4xl font-black text-[#6b3d18]">
                  {player.stars}
                </strong>
                <TotemMeter value={player.stars} max={6} />
              </div>
              <div className="flex flex-wrap gap-2">
                <CircleBtn label="-" onClick={() => onUpdateStars(-1)} tone="ember" />
                <CircleBtn label="+" onClick={() => onUpdateStars(1)} />
              </div>
            </div>
          </div>

          <div className="wood-panel flex flex-1 flex-col justify-between gap-4 px-4 py-4 text-[#fff3df]">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.28em] text-[#ffe7c8]/80">
                Ritual da rodada
              </p>
              <h3 className="font-display mt-2 text-3xl leading-none">
                Fechar turno
              </h3>
              <p className="mt-2 max-w-md text-sm font-bold leading-relaxed text-[#fff1da]/86">
                Ajuste os recursos, confirme os bônus e passe a tocha para o
                próximo explorador quando tudo estiver pronto.
              </p>
            </div>

            <button
              onClick={onEndTurn}
              className="splash-hit gem-button gem-magenta ml-auto px-6 py-4 text-sm uppercase tracking-[0.22em]"
              type="button"
            >
              Próximo turno
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ActivePlayerCard;
