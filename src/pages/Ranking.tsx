import { Trophy } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import type { Player } from "@/types/game";
import { TropicalBackground } from "@/components/layout/TropicalBackground";

const Ranking = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const players: Player[] = (location.state as any)?.players || [];

  const sorted = [...players].sort((a, b) => b.stars - a.stars || b.coins - a.coins);

  return (
    <div className="min-h-screen flex flex-col items-center px-5 py-6 max-w-2xl mx-auto">
      <TropicalBackground />
      <MotionBounce delay={0} className="w-full flex items-center justify-center gap-3 mb-6">
        <Trophy className="w-16 h-16 text-coral" />
        <h1 className="text-3xl font-bold text-coral">🏆 Ranking Final</h1>
      </MotionBounce>

      <div className="w-full flex flex-col gap-3 mb-8">
        {sorted.map((p, i) => (
          <MotionBounce key={p.id} delay={0.1 + i * 0.1}>
            <div
              className="flex items-center gap-4 p-4 rounded-[2.5rem] border-[3px] border-coral bg-areia shadow-lg hover:shadow-xl transition-shadow"
            >
              <span className="text-2xl font-bold text-coral min-w-[2ch]">
                {i + 1}º
              </span>
              <span className="text-lg font-bold text-[#2D1B0D] flex-1">{p.label}</span>
              <span className="text-sm font-semibold text-[#2D1B0D]">
                ⭐ {p.stars} · 🪙 {p.coins}
              </span>
            </div>
          </MotionBounce>
        ))}
      </div>

      <MotionBounce delay={0.8}>
        <button
          onClick={() => navigate("/")}
          className="px-8 py-4 rounded-full bg-coral text-white font-bold text-lg hover:bg-coral/90 hover:scale-105 active:scale-95 transition-all shadow-lg hover:shadow-2xl"
        >
          Novo Jogo 🎮
        </button>
      </MotionBounce>
    </div>
  );
};

export default Ranking;
