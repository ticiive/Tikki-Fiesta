import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { TropicalBackground } from "@/components/layout/TropicalBackground";
import { WoodenPanel } from "@/components/layout/WoodenPanel";
import { TropicalButton } from "@/components/ui/TropicalButton";
import { COLORS } from "@/lib/tokens";

const ComoJogar = () => {
  const location = useLocation();
  const navigate  = useNavigate();

  const { minigame, players, currentRound, totalRounds, isGameOver, playedMinigames = [], embateContext } =
    (location.state as {
      minigame: {
        id: string;
        name: string;
        emoji: string;
        duration: number;
        description: string;
        objetivo: string;
        materials?: string;
        regras: string[];
      };
      players: any[];
      currentRound: number;
      totalRounds: number;
      isGameOver: boolean;
      playedMinigames?: string[];
      embateContext?: { challengerId: string; opponentId: string; betAmount: number };
    }) || {};

  useEffect(() => {
    if (!location.state) navigate("/");
  }, [location.state, navigate]);

  if (!location.state) return null;

  const handleVoltar = () => {
    navigate("/sorteio", {
      state: { players, currentRound, totalRounds, isGameOver, preservedMinigame: minigame, playedMinigames, embateContext },
    });
  };

  const sectionTitle = (text: string) => (
    <p style={{
      fontFamily: 'Fredoka, sans-serif',
      fontWeight: 700,
      fontSize: '1.05rem',
      color: '#FFFFFF',
      textShadow: '0 1px 2px rgba(0,0,0,0.5)',
      marginBottom: '0.25rem',
    }}>
      {text}
    </p>
  );

  const bodyText = (text: string) => (
    <p style={{
      fontFamily: 'Quicksand, sans-serif',
      fontSize: '0.95rem',
      color: '#FFFFFF',
      textShadow: '0 1px 2px rgba(0,0,0,0.4)',
      lineHeight: 1.5,
    }}>
      {text}
    </p>
  );

  return (
    <div className="h-screen w-screen overflow-hidden flex items-center justify-center px-4 py-3">
      <TropicalBackground />

      <WoodenPanel compact className="max-w-2xl w-full mx-auto">

        {/* Header: emoji + nome */}
        <div className="flex items-center justify-center gap-3 mb-3">
          <span style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', lineHeight: 1 }}>{minigame.emoji}</span>
          <h1 style={{
            fontFamily: 'Fredoka, sans-serif',
            fontWeight: 700,
            fontSize: 'clamp(1.4rem, 4vw, 2rem)',
            color: COLORS.marromProfundo,
            textShadow: '1px 1px 0 rgba(255,255,255,0.4)',
          }}>
            {minigame.name}
          </h1>
        </div>

        {/* Seções de conteúdo — scroll interno em landscape apertado */}
        <div style={{ overflowY: 'auto', maxHeight: 'clamp(160px, 45vh, 400px)' }} className="flex flex-col gap-3 mb-3 pr-1">

          {/* Descrição */}
          <div>
            {sectionTitle('📝 Descrição')}
            {bodyText(minigame.description)}
          </div>

          {/* Objetivo */}
          <div>
            {sectionTitle('🎯 Objetivo')}
            {bodyText(minigame.objetivo)}
          </div>

          {/* Materiais */}
          {minigame.materials && (
            <div>
              {sectionTitle('🧩 Materiais')}
              {bodyText(minigame.materials)}
            </div>
          )}

          {/* Regras */}
          <div>
            {sectionTitle('📜 Regras')}
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              {minigame.regras.map((regra, i) => (
                <li key={i} style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                  <span style={{ color: COLORS.coral, fontWeight: 700, flexShrink: 0, marginTop: '0.05rem' }}>🌴</span>
                  <span style={{ fontFamily: 'Quicksand, sans-serif', fontSize: '0.9rem', color: '#FFFFFF', textShadow: '0 1px 2px rgba(0,0,0,0.4)', lineHeight: 1.45 }}>
                    {regra}
                  </span>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Botão voltar */}
        <div className="flex justify-center">
          <TropicalButton variant="primary" size="lg" onClick={handleVoltar}>
            ← Voltar ao Sorteio
          </TropicalButton>
        </div>

      </WoodenPanel>
    </div>
  );
};

export default ComoJogar;
