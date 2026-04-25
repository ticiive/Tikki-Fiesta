import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { TropicalBackground } from "@/components/layout/TropicalBackground";
import { WoodenPanel } from "@/components/layout/WoodenPanel";
import { WoodenCard } from "@/components/ui/WoodenCard";
import { TropicalButton } from "@/components/ui/TropicalButton";
import { COLORS } from "@/lib/tokens";
import type { Player } from "@/types/game";

const POSITION_BADGES = [
  { bg: COLORS.prata,       text: COLORS.marromProfundo },
  { bg: COLORS.bronze,      text: COLORS.cremeClaro     },
  { bg: COLORS.areiaEscura, text: COLORS.marromProfundo },
];

const Ranking = () => {
  const location = useLocation();
  const navigate  = useNavigate();

  const players: Player[] = (location.state as any)?.players ?? [];
  const sorted = [...players].sort((a, b) => {
    if (b.stars !== a.stars) return b.stars - a.stars;
    if (b.coins !== a.coins) return b.coins - a.coins;
    return b.trophies - a.trophies;
  });
  const winner = sorted[0];
  const others = sorted.slice(1);

  return (
    <div className="h-screen w-screen overflow-y-auto flex items-center justify-center px-4 py-3">
      <TropicalBackground />

      <WoodenPanel compact className="max-w-2xl w-full mx-auto">

        {/* Título */}
        <h1
          className="text-center"
          style={{
            fontFamily: 'Fredoka, sans-serif',
            fontWeight: 700,
            fontSize: 'clamp(1.3rem, 4vw, 2.2rem)',
            color: COLORS.coral,
            textShadow: `0 2px 4px rgba(45,27,13,0.4)`,
            marginBottom: '0.5rem',
          }}
        >
          🏆 Fim de Jogo! 🏆
        </h1>

        {/* Conteúdo principal: winner + others */}
        <div className="flex flex-col items-center gap-3 mb-3">

          {/* Card do vencedor */}
          {winner && (
            <div className="w-full max-w-xs sm:max-w-sm">
              <WoodenCard variant="card" irregularCorners ringColor={winner.color}>
                <div className="flex flex-col items-center gap-1" style={{ padding: 'clamp(0.5rem, 2vw, 1rem)' }}>
                  <span style={{
                    fontFamily: 'Fredoka, sans-serif',
                    fontWeight: 700,
                    fontSize: 'clamp(0.85rem, 2vw, 1.1rem)',
                    color: COLORS.ouro,
                    textShadow: `0 1px 3px rgba(45,27,13,0.5)`,
                    letterSpacing: '0.05em',
                  }}>
                    👑 CAMPEÃO!
                  </span>
                  <motion.span
                    animate={{ scale: [1, 1.08, 1] }}
                    transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                    style={{ fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', lineHeight: 1, display: 'block' }}
                  >
                    {winner.avatar}
                  </motion.span>
                  <span style={{
                    fontFamily: 'Fredoka, sans-serif',
                    fontWeight: 700,
                    fontSize: 'clamp(1rem, 2.5vw, 1.5rem)',
                    color: COLORS.cremeClaro,
                    textShadow: `0 1px 3px rgba(45,27,13,0.6)`,
                  }}>
                    {winner.label}
                  </span>
                  <span style={{
                    fontFamily: 'Fredoka, sans-serif',
                    fontSize: 'clamp(0.7rem, 1.8vw, 0.9rem)',
                    color: COLORS.areia,
                    opacity: 0.9,
                  }}>
                    🥥 {winner.coins} · 🗿 {winner.stars} · 🏆 {winner.trophies}
                  </span>
                </div>
              </WoodenCard>
            </div>
          )}

          {/* Cards dos demais jogadores */}
          {others.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2 w-full">
              {others.map((p, i) => {
                const badge = POSITION_BADGES[i] ?? POSITION_BADGES[2];
                return (
                  <div key={p.id} style={{ flex: '0 1 260px' }}>
                    <WoodenCard variant="card" ringColor={p.color}>
                      <div style={{ display: 'flex', alignItems: 'center', padding: 'clamp(0.3rem, 1vw, 0.55rem) 0.75rem', gap: '0.5rem' }}>
                        <div style={{
                          width: 42,
                          flexShrink: 0,
                          background: badge.bg,
                          borderRadius: '0.4rem',
                          padding: '0.2rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          border: `2px solid ${COLORS.madeiraEscura}`,
                          boxShadow: '2px 2px 0 rgba(45,27,13,0.4)',
                        }}>
                          <span style={{ fontFamily: 'Fredoka, sans-serif', fontWeight: 700, fontSize: 'clamp(0.8rem, 2vw, 1rem)', color: badge.text, lineHeight: 1 }}>
                            {i + 2}º
                          </span>
                        </div>
                        <span style={{ fontSize: 'clamp(1.3rem, 3vw, 1.7rem)', lineHeight: 1, flexShrink: 0 }}>{p.avatar}</span>
                        <span style={{ flex: 1, fontFamily: 'Fredoka, sans-serif', fontWeight: 700, fontSize: 'clamp(0.85rem, 2vw, 1.05rem)', color: COLORS.cremeClaro, textShadow: `0 1px 2px rgba(45,27,13,0.5)` }}>
                          {p.label}
                        </span>
                        <span style={{ fontFamily: 'Fredoka, sans-serif', fontSize: 'clamp(0.65rem, 1.5vw, 0.8rem)', color: COLORS.areia, opacity: 0.85, whiteSpace: 'nowrap' }}>
                          🥥{p.coins} · 🗿{p.stars}
                        </span>
                      </div>
                    </WoodenCard>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Botões */}
        <div className="flex flex-row gap-3 justify-center">
          <TropicalButton variant="primary" size="lg" onClick={() => navigate('/')}>
            🎮 Nova Partida
          </TropicalButton>
          <TropicalButton variant="secondary" size="md" onClick={() => navigate('/')}>
            🏠 Voltar ao Início
          </TropicalButton>
        </div>

      </WoodenPanel>
    </div>
  );
};

export default Ranking;
