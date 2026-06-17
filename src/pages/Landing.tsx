import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { COLORS } from "@/lib/tokens";

const STORAGE_KEY = 'tikki-fiesta-game-state';

const Landing = () => {
  const navigate = useNavigate();
  const [hasSavedGame, setHasSavedGame] = useState(false);
  const [showInstallBanner, setShowInstallBanner] = useState(false);

  useEffect(() => {
    try {
      setHasSavedGame(!!localStorage.getItem(STORAGE_KEY));
    } catch {}

    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isStandalone = (window.navigator as any).standalone === true ||
      window.matchMedia('(display-mode: standalone)').matches;
    const dismissed = localStorage.getItem('tikki-install-dismissed');
    if (isIOS && !isStandalone && !dismissed) {
      setTimeout(() => setShowInstallBanner(true), 1500);
    }
  }, []);

  const handleContinue = () => {
    navigate('/game');
  };

  const handleNewGame = () => {
    try {
      [
        STORAGE_KEY,
        'tikki-fiesta-route',
        'tikki-fiesta-sorteio-state',
        'tikki-fiesta-timer-state',
        'tikki-fiesta-cordasorte-state',
        'tikki-fiesta-tikkoin-state',
        'tikki-fiesta-nao-hesite-state',
        'tikki-fiesta-palma-state',
        'tikki-fiesta-respostas-state',
        'tikki-fiesta-ranking-state',
        'tikki-fiesta-embate-state',
      ].forEach(k => localStorage.removeItem(k));
    } catch {}
    navigate('/configurar');
  };

  const handleStart = () => {
    navigate('/configurar');
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden flex flex-col items-center justify-center" style={{ height: '100dvh' }}>

      {/* Vídeo de fundo */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        style={{ zIndex: 0 }}
      >
        <source src={`${import.meta.env.BASE_URL}videos/background-waves.mp4`} type="video/mp4" />
      </video>

      {/* Overlay escuro suave */}
      <div className="absolute inset-0 bg-black/35" style={{ zIndex: 1 }} />

      {/* Conteúdo central */}
      <motion.div
        className="relative flex flex-col items-center gap-8 px-6"
        style={{ zIndex: 2 }}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        {/* Hero: máscara + título */}
        <div className="flex flex-col items-center gap-4">
          <motion.img
            src={`${import.meta.env.BASE_URL}img/tikkimask.png`}
            alt="Tikki"
            className="drop-shadow-2xl"
            style={{ width: 'clamp(80px, 18vw, 140px)', height: 'auto' }}
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          />
          <h1
            style={{
              fontFamily: 'Fredoka, sans-serif',
              fontWeight: 700,
              fontSize: 'clamp(2.5rem, 8vw, 5rem)',
              color: '#FDF5E6',
              textShadow: `0 4px 24px rgba(0,0,0,0.7), 0 2px 0 ${COLORS.madeiraEscura}`,
              letterSpacing: '0.04em',
              lineHeight: 1,
              textAlign: 'center',
            }}
          >
            Tikki Fiesta
          </h1>
        </div>

        {/* Botões */}
        <div className="flex flex-col items-center gap-3 w-full max-w-xs">
          {hasSavedGame ? (
            <>
              <button
                onClick={handleContinue}
                className="w-full py-4 text-xl font-bold rounded-full shadow-2xl transition-transform hover:scale-105 active:scale-95"
                style={{
                  fontFamily: 'Fredoka, sans-serif',
                  background: COLORS.coral,
                  color: '#fff',
                  border: `3px solid rgba(255,255,255,0.3)`,
                  boxShadow: `0 8px 32px rgba(0,0,0,0.4), 0 4px 0 ${COLORS.madeiraEscura}`,
                }}
              >
                🔄 Continuar Jogo
              </button>
              <button
                onClick={handleNewGame}
                className="w-full py-3 text-lg font-bold rounded-full shadow-xl transition-transform hover:scale-105 active:scale-95"
                style={{
                  fontFamily: 'Fredoka, sans-serif',
                  background: 'rgba(255,255,255,0.18)',
                  color: '#FDF5E6',
                  border: '2px solid rgba(255,255,255,0.45)',
                  backdropFilter: 'blur(8px)',
                }}
              >
                🌴 Novo Jogo
              </button>
            </>
          ) : (
            <button
              onClick={handleStart}
              className="w-full py-4 text-2xl font-bold rounded-full shadow-2xl transition-transform hover:scale-105 active:scale-95"
              style={{
                fontFamily: 'Fredoka, sans-serif',
                background: COLORS.coral,
                color: '#fff',
                border: `3px solid rgba(255,255,255,0.3)`,
                boxShadow: `0 8px 32px rgba(0,0,0,0.4), 0 4px 0 ${COLORS.madeiraEscura}`,
              }}
            >
              🌴 Começar Jogo
            </button>
          )}
        </div>
      </motion.div>

      {showInstallBanner && (
        <div
          className="fixed bottom-4 left-4 right-4 rounded-2xl p-4 shadow-2xl z-50 flex items-center gap-3"
          style={{ background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(8px)' }}
        >
          <span className="text-3xl shrink-0">📱</span>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-sm" style={{ fontFamily: 'Fredoka, sans-serif', color: '#2D1B0D' }}>
              Quer tela cheia?
            </p>
            <p className="text-xs text-gray-500 leading-snug">
              Toque em Compartilhar 🔗 → "Adicionar à Tela de Início"
            </p>
          </div>
          <button
            onClick={() => {
              try { localStorage.setItem('tikki-install-dismissed', 'true'); } catch {}
              setShowInstallBanner(false);
            }}
            className="shrink-0 text-gray-400 text-lg leading-none p-1"
            aria-label="Fechar"
          >✕</button>
        </div>
      )}
    </div>
  );
};

export default Landing;
