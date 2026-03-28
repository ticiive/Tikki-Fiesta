import { Timer as TimerIcon, Waves } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

const Timer = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const chosenGame =
    (location.state as { chosenGame?: { title: string; description: string } })?.chosenGame;

  return (
    <div className="world-shell">
      <div className="mobile-island">
        <div className="island-screen justify-center">
          <div className="parchment-panel p-6 text-center">
            <div className="island-badge mx-auto flex h-16 w-16 items-center justify-center text-[#7a4b1d]">
              <TimerIcon className="h-8 w-8" />
            </div>
            <h1 className="font-display mt-4 text-5xl leading-none text-[#7a4b1d]">
              Ampulheta da Ilha
            </h1>
            <p className="subtle-copy mt-3 text-base leading-relaxed">
              {chosenGame
                ? `${chosenGame.title} foi sorteado.`
                : "O próximo desafio já está definido."}
            </p>
          </div>

          <div className="wood-panel px-5 py-6 text-center text-[#fff5df]">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-[1.35rem] border-2 border-[#7e4e29] bg-[linear-gradient(180deg,#fff2d4,#efc567)] text-[#7a4b1d]">
              <Waves className="h-8 w-8" />
            </div>
            <h2 className="font-display text-4xl leading-none">Em breve</h2>
            <p className="mt-3 text-sm font-bold leading-relaxed text-[#fee8cd]/86">
              Esta tela pode virar o minigame em si ou um cronômetro temático
              com areia e maré. Por enquanto, deixei o fluxo pronto para receber
              o desafio sorteado.
            </p>
          </div>

          <button
            onClick={() => navigate("/ranking", { state: { players: (location.state as { players?: unknown[] })?.players || [] } })}
            className="splash-hit gem-button gem-turquoise w-full px-8 py-5 text-sm uppercase tracking-[0.22em]"
          >
            Ver ranking
          </button>
        </div>
      </div>
    </div>
  );
};

export default Timer;
