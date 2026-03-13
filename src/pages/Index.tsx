import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Gamepad2 } from "lucide-react";
import { motion } from "framer-motion";
import SkyBackground from "@/components/SkyBackground";
import CharacterAvatar, { getCharacter } from "@/components/game/CharacterAvatar";

const players = ["P1", "P2", "P3", "P4"];
const roundOptions = [10, 15, 20];
const MAX_PLAYERS = 4;

const Index = () => {
  const navigate = useNavigate();
  const [selectedPlayers, setSelectedPlayers] = useState<string[]>([]);
  const [selectedRounds, setSelectedRounds] = useState<number | null>(null);

  const togglePlayer = (label: string) => {
    setSelectedPlayers((prev) => {
      if (prev.includes(label)) return prev.filter((p) => p !== label);
      if (prev.length >= MAX_PLAYERS) return prev;
      return [...prev, label];
    });
  };

  const canStart = selectedPlayers.length >= 2 && selectedRounds !== null;

  const handleStart = () => {
    if (!canStart) return;
    navigate("/game", {
      state: {
        players: selectedPlayers,
        totalRounds: selectedRounds,
      },
    });
  };

  return (
    <SkyBackground>
      <div className="min-h-screen flex flex-col items-center px-5 py-6 max-w-md mx-auto">
        {/* Header */}
        <motion.div
          className="flex items-center gap-3 mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Gamepad2 className="w-8 h-8 text-coral" />
          <h1 className="text-2xl font-bold text-foreground font-display">Escolha o Squad!</h1>
        </motion.div>

        {/* Character Grid */}
        <section className="w-full mb-8">
          <div className="text-center mb-4">
            <h2 className="text-lg font-bold text-foreground">
              Monte sua equipe ✨
            </h2>
            <p className="text-sm text-foreground/50">
              {selectedPlayers.length} de {MAX_PLAYERS} selecionados
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {players.map((p) => {
              const char = getCharacter(p);
              const orderIndex = selectedPlayers.indexOf(p);
              const selected = orderIndex !== -1;

              return (
                <motion.button
                  key={p}
                  onClick={() => togglePlayer(p)}
                  className={`
                    relative aspect-square w-full rounded-3xl border-[3px] transition-all duration-200
                    flex flex-col items-center justify-center gap-2
                    font-bold text-lg
                    ${selected
                      ? "border-border bg-card/80 scale-[0.96]"
                      : "glass hover:scale-[1.03]"
                    }
                  `}
                  style={{
                    boxShadow: selected
                      ? `0 0 20px ${char.bgColor}40, var(--pop-shadow-white)`
                      : "var(--pop-shadow-white)",
                    borderColor: selected ? char.bgColor : undefined,
                  }}
                  whileTap={{ scale: 0.93 }}
                >
                  {/* Order badge */}
                  {selected && (
                    <motion.div
                      className="absolute -top-2 -right-2 w-8 h-8 rounded-full border-2 border-border flex items-center justify-center text-sm font-black text-primary-foreground shadow-md"
                      style={{ backgroundColor: char.bgColor }}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 400, damping: 15 }}
                    >
                      {orderIndex + 1}
                    </motion.div>
                  )}

                  <CharacterAvatar playerId={p} size="lg" bounce={selected} />
                  <span className={`text-sm font-bold ${selected ? "text-foreground" : "text-foreground/70"}`}>
                    {char.name}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </section>

        {/* Rounds */}
        <section className="w-full mb-8">
          <h2 className="text-center text-lg font-bold text-foreground mb-4 font-display">
            Quantas rodadas? 🎲
          </h2>
          <div className="flex justify-center gap-4">
            {roundOptions.map((r) => (
              <button
                key={r}
                onClick={() => setSelectedRounds(r)}
                className={`
                  flex-1 py-4 rounded-3xl border-[3px] font-bold text-2xl transition-all duration-200
                  ${selectedRounds === r
                    ? "border-coral bg-coral text-secondary-foreground scale-[0.96]"
                    : "border-border glass text-coral hover:scale-[1.03]"
                  }
                `}
                style={{
                  boxShadow: selectedRounds === r
                    ? "var(--pop-shadow-coral)"
                    : "var(--pop-shadow-white)",
                }}
              >
                {r}
              </button>
            ))}
          </div>
        </section>

        {/* Start Button */}
        <div className="w-full mt-auto pb-4">
          <motion.button
            disabled={!canStart}
            onClick={handleStart}
            className={`
              w-full py-5 rounded-3xl border-[3px] font-bold text-xl transition-all duration-300
              ${canStart
                ? "border-border bg-mint text-accent-foreground hover:scale-[1.02] active:scale-[0.98]"
                : "border-muted bg-muted text-muted-foreground cursor-not-allowed opacity-50"
              }
            `}
            style={canStart ? { boxShadow: "var(--pop-shadow-mint)" } : undefined}
            whileHover={canStart ? { scale: 1.02 } : {}}
            whileTap={canStart ? { scale: 0.97 } : {}}
          >
            {canStart
              ? `Vamos nessa! 🚀 (${selectedPlayers.length} jogadores)`
              : "Escolha 2-4 personagens e as rodadas"}
          </motion.button>
        </div>
      </div>
    </SkyBackground>
  );
};

export default Index;
