import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Shell, Sun, Waves } from "lucide-react";
import CharacterCard from "@/components/CharacterCard";
import RoundButton from "@/components/RoundButton";
import IslandBackground from "@/components/IslandBackground";

const players = ["P1", "P2", "P3", "P4"];
const roundOptions = [10, 15, 20];
const MAX_PLAYERS = 4;

const Index = () => {
  const navigate = useNavigate();
  const [selectedPlayers, setSelectedPlayers] = useState<string[]>([]);
  const [selectedRounds, setSelectedRounds] = useState<number | null>(null);

  const togglePlayer = (label: string) => {
    setSelectedPlayers((prev) => {
      if (prev.includes(label)) {
        return prev.filter((player) => player !== label);
      }

      if (prev.length >= MAX_PLAYERS) {
        return prev;
      }

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
    <IslandBackground>
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-center px-5 py-8">
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
          <section className="parchment-panel p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="island-badge inline-flex items-center gap-2 px-4 py-2 text-xs font-black uppercase tracking-[0.22em]">
                  <Sun className="h-4 w-4" />
                  Setup de Praia
                </span>
                <h1 className="font-display mt-4 text-6xl leading-none text-[#14828d]">
                  Monte o Time
                </h1>
                <p className="subtle-copy mt-4 max-w-xl text-base leading-relaxed">
                  Escolha quem vai entrar na água e defina o número de ondas da
                  partida antes de começar.
                </p>
              </div>
              <div className="surf-card flex h-20 w-20 items-center justify-center text-4xl">
                🌺
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4">
              {players.map((player) => {
                const orderIndex = selectedPlayers.indexOf(player);

                return (
                  <CharacterCard
                    key={player}
                    label={player}
                    selected={orderIndex !== -1}
                    order={orderIndex !== -1 ? orderIndex + 1 : undefined}
                    onClick={() => togglePlayer(player)}
                  />
                );
              })}
            </div>
          </section>

          <aside className="flex flex-col gap-5">
            <section className="leafy-card p-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.22em] text-white/82">
                    Jogadores na areia
                  </p>
                  <h2 className="font-display mt-2 text-5xl leading-none text-white">
                    {selectedPlayers.length}/{MAX_PLAYERS}
                  </h2>
                </div>
                <div className="rounded-full bg-white/18 px-4 py-2 text-sm font-black uppercase tracking-[0.18em] text-white">
                  limite {MAX_PLAYERS}
                </div>
              </div>
              <p className="mt-4 text-sm font-bold leading-relaxed text-white/86">
                Você precisa de pelo menos 2 jogadores para começar.
              </p>
            </section>

            <section className="driftwood-card p-5">
              <div className="flex items-center gap-3">
                <div className="island-badge flex h-12 w-12 items-center justify-center">
                  <Waves className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="section-title">Quantidade de Ondas</h2>
                  <p className="subtle-copy mt-1 text-sm">
                    Escolha o ritmo da partida.
                  </p>
                </div>
              </div>
              <div className="mt-5 flex gap-3">
                {roundOptions.map((round) => (
                  <RoundButton
                    key={round}
                    value={round}
                    selected={selectedRounds === round}
                    onClick={() => setSelectedRounds(round)}
                  />
                ))}
              </div>
            </section>

            <section className="surf-card p-5 text-[#0f6f78]">
              <div className="flex items-center gap-3">
                <Shell className="h-5 w-5" />
                <p className="text-xs font-black uppercase tracking-[0.22em]">
                  Resumo
                </p>
              </div>
              <ul className="mt-4 grid gap-2 text-sm font-black">
                <li>Interface com água turquesa e painéis inspirados em conchas.</li>
                <li>Gameplay em landscape com HUD nas margens.</li>
                <li>Botões em estilo pebble/coconut para ações rápidas.</li>
              </ul>
            </section>

            <button
              onClick={handleStart}
              disabled={!canStart}
              className={`splash-hit gem-button px-8 py-5 text-lg uppercase tracking-[0.24em] ${
                canStart ? "gem-magenta" : "gem-turquoise opacity-65"
              }`}
              type="button"
            >
              {canStart ? "Começar partida" : "Selecione jogadores"}
            </button>
          </aside>
        </div>
      </div>
    </IslandBackground>
  );
};

export default Index;
