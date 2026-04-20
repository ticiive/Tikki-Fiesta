import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MotionBounce } from "@/components/MotionBounce";
import CharacterCard from "@/components/CharacterCard";
import RoundButton from "@/components/RoundButton";
import { Gamepad2 } from "lucide-react";

const players = ["P1", "P2", "P3", "P4", "P5", "P6"];
const roundOptions = [3, 5, 10];

const Index = () => {
  const navigate = useNavigate();
  const [selectedPlayers, setSelectedPlayers] = useState<string[]>([]);
  const [selectedRounds, setSelectedRounds] = useState<number | null>(null);

  const togglePlayer = (label: string) => {
    setSelectedPlayers((prev) =>
      prev.includes(label) ? prev.filter((p) => p !== label) : [...prev, label]
    );
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
    <div className="min-h-screen bg-background flex flex-col items-center px-5 py-6 max-w-2xl mx-auto">
      {/* Header */}
      <MotionBounce delay={0} className="w-full flex items-center justify-center gap-3 mb-8">
        <div className="flex items-center gap-3">
          <Gamepad2 className="w-10 h-10 text-coral" />
          <h1 className="text-3xl font-bold text-coral">🏝️ Pop Board Play</h1>
        </div>
      </MotionBounce>

      {/* Character Grid */}
      <section className="w-full mb-8">
        <MotionBounce delay={0.1}>
          <h2 className="text-center text-xl font-bold text-[#2D1B0D] mb-4">
            Escolha os jogadores! 🎲
          </h2>
        </MotionBounce>
        <div className="grid grid-cols-2 gap-4">
          {players.map((p, idx) => (
            <MotionBounce key={p} delay={0.15 + idx * 0.05}>
              <CharacterCard
                label={p}
                selected={selectedPlayers.includes(p)}
                onClick={() => togglePlayer(p)}
              />
            </MotionBounce>
          ))}
        </div>
      </section>

      {/* Rounds Section */}
      <section className="w-full mb-8">
        <MotionBounce delay={0.4}>
          <h2 className="text-center text-xl font-bold text-[#2D1B0D] mb-4">
            Quantas rodadas vamos jogar? 🎯
          </h2>
        </MotionBounce>
        <div className="flex gap-4 justify-center">
          {roundOptions.map((r, idx) => (
            <MotionBounce key={r} delay={0.45 + idx * 0.05}>
              <RoundButton
                value={r}
                selected={selectedRounds === r}
                onClick={() => setSelectedRounds(r)}
              />
            </MotionBounce>
          ))}
        </div>
      </section>

      {/* Start Button */}
      <div className="w-full mt-auto pb-4">
        <MotionBounce delay={0.6} className="w-full">
          <button
            disabled={!canStart}
            onClick={handleStart}
            className={`
              w-full py-4 px-6 rounded-full border-none font-bold text-lg transition-all duration-300
              ${
                canStart
                  ? "bg-coral text-white hover:bg-coral/90 hover:scale-105 active:scale-95 shadow-lg hover:shadow-2xl"
                  : "bg-gray-400 text-gray-200 cursor-not-allowed opacity-50 shadow-md"
              }
            `}
          >
            {canStart ? "🎮 Iniciar Jogo!" : "Selecione 2+ jogadores e rodadas"}
          </button>
        </MotionBounce>
      </div>
    </div>
  );
};

export default Index;
