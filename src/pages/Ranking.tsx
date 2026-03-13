import { Trophy } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import type { Player } from "@/types/game";
import SkyBackground from "@/components/SkyBackground";
import CharacterAvatar from "@/components/game/CharacterAvatar";

const Ranking = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const players: Player[] = (location.state as any)?.players || [];
  const sorted = [...players].sort((a, b) => b.stars - a.stars || b.coins - a.coins);

  return (
    <SkyBackground>
      <div className="min-h-screen flex flex-col items-center px-5 py-6 max-w-md mx-auto">
        <Trophy className="w-16 h-16 text-sunflower mb-4" />
        <h1 className="text-3xl font-bold text-foreground mb-6 font-display">Ranking Final 🏆</h1>

        <div className="w-full flex flex-col gap-3 mb-8">
          {sorted.map((p, i) => (
            <motion.div
              key={p.id}
              className="flex items-center gap-4 p-4 rounded-3xl border-[3px] border-border glass"
              style={{ boxShadow: i === 0 ? "var(--pop-shadow-sunflower)" : "var(--pop-shadow-white)" }}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.15, type: "spring", stiffness: 300, damping: 25 }}
            >
              <span className="text-2xl font-bold text-sunflower min-w-[2ch]">{i + 1}º</span>
              <CharacterAvatar playerId={p.id} size="sm" bounce={i === 0} />
              <span className="text-lg font-bold text-foreground flex-1">{p.label}</span>
              <span className="text-sm font-semibold text-foreground/50">
                ⭐ {p.stars} · 🪙 {p.coins}
              </span>
            </motion.div>
          ))}
        </div>

        <motion.button
          onClick={() => navigate("/")}
          className="px-8 py-4 rounded-3xl border-[3px] border-border bg-mint text-accent-foreground font-bold text-lg"
          style={{ boxShadow: "var(--pop-shadow-mint)" }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Novo Jogo 🎮
        </motion.button>
      </div>
    </SkyBackground>
  );
};

export default Ranking;
