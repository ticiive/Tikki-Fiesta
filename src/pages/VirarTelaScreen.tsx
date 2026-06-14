import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

export function VirarTelaScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLandscape, setIsLandscape] = useState(false);

  useEffect(() => {
    const check = () => setIsLandscape(window.innerWidth > window.innerHeight);
    check();
    window.addEventListener('resize', check);
    window.addEventListener('orientationchange', check);
    return () => {
      window.removeEventListener('resize', check);
      window.removeEventListener('orientationchange', check);
    };
  }, []);

  const handlePlay = () => {
    navigate('/game', { state: location.state });
  };

  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center p-8 overflow-hidden"
      style={{
        background: 'linear-gradient(160deg, #0ea5c9 0%, #0d9488 100%)',
        height: '100dvh',
      }}
    >
      {/* Onda decorativa */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32 opacity-20"
        style={{
          background: 'radial-gradient(ellipse 120% 80% at 50% 120%, #fff 0%, transparent 70%)',
        }}
      />

      <motion.div
        className="flex flex-col items-center gap-6 relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        {/* Ícone animado */}
        <motion.div
          className="flex items-center gap-3 text-7xl"
          animate={{ rotate: [0, -8, 0] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
        >
          📱
        </motion.div>

        <div className="flex items-center gap-3 text-5xl opacity-70">
          <span>↻</span>
        </div>

        <motion.div
          className="text-7xl"
          style={{ display: 'inline-block', transform: 'rotate(90deg)' }}
        >
          📱
        </motion.div>

        <h1
          className="text-center text-white drop-shadow-lg mt-2"
          style={{ fontFamily: 'Fredoka, sans-serif', fontWeight: 700, fontSize: 'clamp(1.8rem, 7vw, 2.8rem)' }}
        >
          Vire seu celular!
        </h1>

        <p
          className="text-white/85 text-center"
          style={{ fontFamily: 'Quicksand, sans-serif', fontWeight: 600, fontSize: 'clamp(0.95rem, 3.5vw, 1.2rem)' }}
        >
          Tikki Fiesta funciona melhor na horizontal 🌴
        </p>

        {isLandscape && (
          <motion.p
            className="text-white/75 text-sm text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ fontFamily: 'Quicksand, sans-serif' }}
          >
            ✅ Você já está na horizontal — pode jogar!
          </motion.p>
        )}

        <button
          onClick={handlePlay}
          className="mt-2 px-8 py-4 font-bold text-white rounded-full shadow-2xl transition-transform hover:scale-105 active:scale-95"
          style={{
            fontFamily: 'Fredoka, sans-serif',
            fontSize: 'clamp(1.1rem, 4vw, 1.4rem)',
            background: '#E91E4D',
            border: '3px solid rgba(255,255,255,0.3)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.3), 0 4px 0 rgba(0,0,0,0.4)',
          }}
        >
          🎲 Já virei, vamos jogar!
        </button>
      </motion.div>
    </div>
  );
}

export default VirarTelaScreen;
