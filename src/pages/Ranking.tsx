import { Trophy } from "lucide-react";
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
      <div className="mobile-island">
        <div className="island-screen">
          <header className="parchment-panel p-5 text-center">
            <div className="island-badge mx-auto flex h-16 w-16 items-center justify-center text-[#7a4b1d]">
              <Trophy className="h-8 w-8" />
            </div>
            <h1 className="font-display mt-4 text-5xl leading-none text-[#7a4b1d]">
              Ranking Final
            </h1>
            <p className="subtle-copy mt-3 text-sm leading-relaxed">
              A maré baixou e o mapa revelou quem acumulou mais glória.
            </p>
          </header>

          <section className="parchment-panel flex-1 px-4 py-5">
            <div className="flex flex-col gap-3">
              {sorted.map((player, index) => (
                <div
                  key={player.id}
                  className={index === 0 ? "wood-panel px-4 py-4 text-[#fff5df]" : "parchment-panel px-4 py-4"}
                >
                  <div className="flex items-center gap-4">
                    <div className={index === 0 ? "island-badge flex h-12 w-12 items-center justify-center text-xl font-black" : "stone-badge flex h-12 w-12 items-center justify-center text-xl font-black"}>
                      {index + 1}
                    </div>
                    <CharacterAvatar playerId={player.id} size="sm" bounce={index === 0} />
                    <div className="flex-1">
                      <h2 className={`${index === 0 ? "font-display text-4xl text-[#fff4df]" : "font-display text-4xl text-[#7a4b1d]"} leading-none`}>
                        {player.label}
                      </h2>
                      <p className={`${index === 0 ? "text-[#fce6ca]/85" : "subtle-copy"} mt-2 text-sm font-black uppercase tracking-[0.2em]`}>
                        {player.stars} estrelas • {player.coins} moedas
                      </p>
                    </div>
                    <span className={`text-3xl ${index === 0 ? "" : "text-[#b98a3e]"}`}>
                      {index === 0 ? "👑" : "🐚"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <button
            onClick={() => navigate("/")}
            className="splash-hit gem-button gem-magenta mt-auto w-full px-8 py-5 text-sm uppercase tracking-[0.22em]"
          >
            Novo jogo
          </button>
        </div>
      </div>
    </div>
  );
};

export default Ranking;
