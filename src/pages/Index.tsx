import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Compass, Flame, Waves } from "lucide-react";
import CharacterCard from "@/components/CharacterCard";
import RoundButton from "@/components/RoundButton";

const players = ["P1", "P2", "P3", "P4", "P5", "P6"];
const roundOptions = [10, 15, 20];
const MAX_PLAYERS = 4;

const Index = () => {
  const navigate = useNavigate();
  const [selectedPlayers, setSelectedPlayers] = useState<string[]>([]);
  const [selectedRounds, setSelectedRounds] = useState<number | null>(null);

  const togglePlayer = (label: string) => {
    setSelectedPlayers((prev) => {
      if (prev.includes(label)) {
        return prev.filter((p) => p !== label);
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
    <div className="world-shell">
      <div className="mobile-island">
        <div className="island-screen">
          <header className="parchment-panel p-5">
            <div className="mb-3 flex items-start justify-between gap-4">
              <div>
                <span className="subtle-copy text-xs uppercase tracking-[0.3em]">
                  Ilha do Tabuleiro
                </span>
                <h1 className="font-display mt-2 text-5xl leading-none text-[#7a4b1d]">
                  Preparar Jornada
                </h1>
              </div>
              <div className="island-badge flex h-14 w-14 items-center justify-center text-[#7a4b1d]">
                <Compass className="h-7 w-7" />
              </div>
            </div>

            <p className="subtle-copy text-left text-sm leading-relaxed">
              Monte a mesa como se estivesse abrindo um mapa vivo: escolha os
              exploradores, marque a duração da aventura e siga para a ilha.
            </p>
          </header>

          <section className="parchment-panel px-4 py-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <h2 className="section-title">
                  <Flame className="h-5 w-5 text-tangerine" />
                  Escolha os jogadores
                </h2>
                <p className="subtle-copy mt-1 text-sm">
                  Até {MAX_PLAYERS} exploradores por partida.
                </p>
              </div>
              <div className="stake-tab is-selected px-4 py-3 text-center">
                <span className="block text-xs uppercase tracking-[0.22em]">
                  Selecionados
                </span>
                <strong className="text-lg">
                  {selectedPlayers.length}/{MAX_PLAYERS}
                </strong>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
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

          <section className="wood-panel px-4 py-5">
            <div className="mb-4 flex items-center gap-3">
              <div className="island-badge flex h-11 w-11 items-center justify-center text-[#7a4b1d]">
                <Waves className="h-5 w-5" />
              </div>
              <div>
                <h2 className="section-title text-[#fff0d8]">
                  Rota de Rodadas
                </h2>
                <p className="text-sm font-extrabold uppercase tracking-[0.2em] text-[#fbe8cf]/80">
                  Escolha o ritmo da aventura
                </p>
              </div>
            </div>

            <div className="flex gap-3">
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

          <div className="mt-auto">
            <div className="lagoon-divider mb-4" />
            <button
              disabled={!canStart}
              onClick={handleStart}
              className={`
                splash-hit gem-button w-full px-6 py-5 text-lg uppercase tracking-[0.22em]
                ${canStart ? "gem-magenta" : "gem-turquoise"}
              `}
            >
              <span className="block text-xs text-[#fff3dc]/80">
                {canStart ? "Mapa pronto" : "Faltam escolhas"}
              </span>
              {canStart
                ? `Iniciar com ${selectedPlayers.length} jogadores`
                : "Selecione 2 a 4 jogadores"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
