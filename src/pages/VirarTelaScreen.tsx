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
      className="fixed inset-0 flex flex-col items-center justify-center p-4 overflow-y-auto"
      style={{
        background: 'linear-gradient(160deg, #0ea5c9 0%, #0d9488 100%)',
        height: '100dvh',
      }}
    >
      <motion.div
        className="flex flex-col items-center gap-4 max-w-2xl w-full"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <motion.div
          className="text-5xl"
          animate={{ rotate: [0, -10, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          📱
        </motion.div>

        <h1
          className="text-center text-white drop-shadow-lg"
          style={{ fontFamily: 'Fredoka, sans-serif', fontWeight: 700, fontSize: 'clamp(1.6rem, 6vw, 2.4rem)' }}
        >
          Vire seu celular!
        </h1>

        <p
          className="text-white/85 text-center"
          style={{ fontFamily: 'Quicksand, sans-serif', fontWeight: 600, fontSize: 'clamp(0.9rem, 3vw, 1.1rem)' }}
        >
          Tikki Fiesta funciona melhor na horizontal 🌴
        </p>

        {isLandscape && (
          <p
            className="text-white/90 text-sm text-center"
            style={{ fontFamily: 'Quicksand, sans-serif' }}
          >
            ✅ Você já está na horizontal — pode jogar!
          </p>
        )}

        <button
          onClick={handlePlay}
          className="mt-2 px-8 py-4 font-bold text-white rounded-full shadow-2xl transition-transform hover:scale-105 active:scale-95"
          style={{
            fontFamily: 'Fredoka, sans-serif',
            fontSize: 'clamp(1rem, 4vw, 1.3rem)',
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
