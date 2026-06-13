import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { TropicalBackground } from "@/components/layout/TropicalBackground";
import { WoodenPanel } from "@/components/layout/WoodenPanel";
import { TropicalButton } from "@/components/ui/TropicalButton";
import { COLORS } from "@/lib/tokens";

const GRADIENT_FADE = 'linear-gradient(to bottom, transparent, #8B5E34)';

const SectionTitle = ({ children }: { children: string }) => (
  <p style={{
    fontFamily: 'Fredoka, sans-serif',
    fontWeight: 700,
    fontSize: 'clamp(0.85rem, 2.5vh, 1.05rem)',
    color: '#FFFFFF',
    textShadow: '0 1px 2px rgba(0,0,0,0.5)',
    marginBottom: '0.2rem',
  }}>
    {children}
  </p>
);

const BodyText = ({ children }: { children: string }) => (
  <p style={{
    fontFamily: 'Quicksand, sans-serif',
    fontSize: 'clamp(0.78rem, 2.2vh, 0.95rem)',
    color: '#FFFFFF',
    textShadow: '0 1px 2px rgba(0,0,0,0.4)',
    lineHeight: 1.45,
  }}>
    {children}
  </p>
);

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

  const descricaoSection = (
    <div>
      <SectionTitle>📝 Descrição</SectionTitle>
      <BodyText>{minigame.description}</BodyText>
    </div>
  );

  const objetivoSection = (
    <div>
      <SectionTitle>🎯 Objetivo</SectionTitle>
      <BodyText>{minigame.objetivo}</BodyText>
    </div>
  );

  const materiaisSection = minigame.materials ? (
    <div>
      <SectionTitle>🧩 Materiais</SectionTitle>
      <BodyText>{minigame.materials}</BodyText>
    </div>
  ) : null;

  const regrasSection = (
    <div>
      <SectionTitle>📜 Regras</SectionTitle>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
        {minigame.regras.map((regra, i) => (
          <li key={i} style={{ display: 'flex', gap: '0.4rem', alignItems: 'flex-start' }}>
            <span style={{ color: COLORS.coral, fontWeight: 700, flexShrink: 0, marginTop: '0.05rem', fontSize: 'clamp(0.75rem, 2vh, 0.9rem)' }}>🌴</span>
            <span style={{ fontFamily: 'Quicksand, sans-serif', fontSize: 'clamp(0.75rem, 2vh, 0.9rem)', color: '#FFFFFF', textShadow: '0 1px 2px rgba(0,0,0,0.4)', lineHeight: 1.4 }}>
              {regra}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <div className="min-h-screen w-full overflow-x-hidden flex items-center justify-center px-4 py-3" style={{ minHeight: '100dvh' }}>
      <TropicalBackground />

      <WoodenPanel compact className="max-w-2xl w-full mx-auto">

        {/* Header: emoji + nome */}
        <div className="flex items-center justify-center gap-2 mb-2">
          <span style={{ fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', lineHeight: 1 }}>{minigame.emoji}</span>
          <h1 style={{
            fontFamily: 'Fredoka, sans-serif',
            fontWeight: 700,
            fontSize: 'clamp(1.1rem, 3.5vw, 1.8rem)',
            color: COLORS.marromProfundo,
            textShadow: '1px 1px 0 rgba(255,255,255,0.4)',
          }}>
            {minigame.name}
          </h1>
        </div>

        {/* ── Portrait: coluna única com scroll ── */}
        <div className="sm:hidden relative mb-3">
          <div
            style={{ overflowY: 'auto', maxHeight: 'clamp(160px, 42vh, 380px)' }}
            className="flex flex-col gap-3 pr-1"
          >
            {descricaoSection}
            {objetivoSection}
            {materiaisSection}
            {regrasSection}
          </div>
          <div
            className="absolute bottom-0 left-0 right-0 pointer-events-none"
            style={{ height: '2rem', background: GRADIENT_FADE }}
          />
        </div>

        {/* ── Landscape (sm:): 2 colunas ── */}
        <div className="hidden sm:flex gap-3 mb-3">

          {/* Coluna esquerda: Descrição + Objetivo */}
          <div className="flex-1 relative">
            <div
              style={{ overflowY: 'auto', maxHeight: '40vh' }}
              className="flex flex-col gap-3 pr-1"
            >
              {descricaoSection}
              {objetivoSection}
            </div>
            <div
              className="absolute bottom-0 left-0 right-0 pointer-events-none"
              style={{ height: '2rem', background: GRADIENT_FADE }}
            />
          </div>

          {/* Coluna direita: Materiais + Regras */}
          <div className="flex-1 relative">
            <div
              style={{ overflowY: 'auto', maxHeight: '40vh' }}
              className="flex flex-col gap-3 pr-1"
            >
              {materiaisSection}
              {regrasSection}
            </div>
            <div
              className="absolute bottom-0 left-0 right-0 pointer-events-none"
              style={{ height: '2rem', background: GRADIENT_FADE }}
            />
          </div>

        </div>

        {/* Botão sempre fora do scroll */}
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
