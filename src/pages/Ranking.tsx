import { Trophy, Waves } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import type { Player } from "@/types/game";
import CharacterAvatar from "@/components/game/CharacterAvatar";

const Ranking = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const players: Player[] = (location.state as { players?: Player[] })?.players || [];

  const sorted = [...players].sort(
    (left, right) => right.stars - left.stars || right.coins - left.coins,
  );

  return (
    <div className="world-shell">
      <div className="gameplay-stage">
        <div className="landscape-board">
          <aside className="landscape-side">
            <section className="leafy-card p-5">
              <div className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-white" />
                <p className="text-xs font-black uppercase tracking-[0.22em] text-white/82">
                  Ranking final
                </p>
              </div>
              <h2 className="font-display mt-3 text-5xl leading-none text-white">
                Pódio
              </h2>
            </section>
          </aside>

          <main className="landscape-main">
            <section className="parchment-panel p-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.22em] text-[#4a8085]">
                    Resultado geral
                  </p>
                  <h1 className="font-display mt-2 text-5xl leading-none text-[#14828d]">
                    Campeões da Praia
                  </h1>
                </div>
                <div className="island-badge flex items-center gap-2 px-4 py-2 text-xs font-black uppercase tracking-[0.18em]">
                  <Waves className="h-4 w-4" />
                  Fim da jornada
                </div>
              </div>

              <div className="mt-6 grid gap-3">
                {sorted.map((player, index) => (
                  <div
                    key={player.id}
                    className={index === 0 ? "leafy-card flex items-center gap-4 p-4" : "driftwood-card flex items-center gap-4 p-4"}
                  >
                    <div className={index === 0 ? "island-badge flex h-12 w-12 items-center justify-center text-lg font-black" : "stone-badge flex h-12 w-12 items-center justify-center text-lg font-black"}>
                      {index + 1}
                    </div>
                    <CharacterAvatar playerId={player.id} size="sm" bounce={index === 0} />
                    <div className="min-w-0 flex-1">
                      <h2 className={`truncate font-display text-4xl leading-none ${index === 0 ? "text-white" : "text-[#1a7e87]"}`}>
                        {player.label}
                      </h2>
                      <p className={`mt-2 text-sm font-black uppercase tracking-[0.18em] ${index === 0 ? "text-white/82" : "text-[#5f7874]"}`}>
                        🐚 {player.stars} estrelas • 🥥 {player.coins} moedas
                      </p>
                    </div>
                    <span className="text-3xl">{index === 0 ? "👑" : "🌺"}</span>
                  </div>
                ))}
              </div>
            </section>
          </main>

          <aside className="landscape-side">
            <button
              onClick={() => navigate("/")}
              className="splash-hit gem-button gem-magenta px-8 py-5 text-sm uppercase tracking-[0.22em]"
              type="button"
            >
              Novo jogo
            </button>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Ranking;
