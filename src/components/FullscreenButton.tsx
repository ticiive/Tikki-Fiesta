import { useState, useEffect } from 'react';
import { Maximize2, Minimize2, Smartphone } from 'lucide-react';

function isIOS() {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
}

function isStandalone() {
  return (window.navigator as any).standalone === true ||
         window.matchMedia('(display-mode: standalone)').matches;
}

const btnStyle = {
  background: 'rgba(255,255,255,0.75)',
  backdropFilter: 'blur(6px)',
  boxShadow: '0 2px 12px rgba(0,0,0,0.25)',
  border: '1.5px solid rgba(0,0,0,0.08)',
};

export function FullscreenButton() {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showIOSHelp, setShowIOSHelp] = useState(false);

  if (isStandalone()) return null;

  const ios = isIOS();

  useEffect(() => {
    if (ios) return;
    const handleChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handleChange);
    return () => document.removeEventListener('fullscreenchange', handleChange);
  }, [ios]);

  const handleClick = () => {
    if (ios) {
      setShowIOSHelp(true);
      return;
    }
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  return (
    <>
      <button
        onClick={handleClick}
        className="fixed top-3 left-3 z-50 p-2.5 rounded-full transition-transform hover:scale-110 active:scale-95"
        style={btnStyle}
        aria-label={ios ? 'Tela cheia' : isFullscreen ? 'Sair do fullscreen' : 'Entrar em fullscreen'}
      >
        {ios
          ? <Smartphone size={18} strokeWidth={2.2} color="#2D1B0D" />
          : isFullscreen
            ? <Minimize2 size={18} strokeWidth={2.2} color="#2D1B0D" />
            : <Maximize2 size={18} strokeWidth={2.2} color="#2D1B0D" />
        }
      </button>

      {showIOSHelp && (
        <div
          className="fixed inset-0 bg-black/70 z-[100] flex items-center justify-center p-6"
          onClick={() => setShowIOSHelp(false)}
        >
          <div
            className="bg-white rounded-2xl p-6 max-w-sm w-full text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <h2
              className="text-2xl font-bold mb-3"
              style={{ fontFamily: 'Fredoka, sans-serif', color: '#2D1B0D' }}
            >
              📱 Tela Cheia no iPhone
            </h2>
            <p className="mb-4 text-gray-600 text-sm">
              O Safari não suporta tela cheia em sites. Para jogar em tela cheia:
            </p>
            <ol className="text-left text-gray-700 text-sm mb-5 space-y-2">
              <li>1. Toque no botão <strong>Compartilhar</strong> 🔗 do Safari</li>
              <li>2. Role e toque em <strong>"Adicionar à Tela de Início"</strong></li>
              <li>3. Abra o ícone do <strong>Tikki Fiesta</strong> na tela inicial</li>
              <li>4. Pronto — abre em tela cheia como um app 🌴</li>
            </ol>
            <button
              onClick={() => setShowIOSHelp(false)}
              className="px-6 py-3 text-white font-bold rounded-full transition-transform hover:scale-105 active:scale-95"
              style={{ fontFamily: 'Fredoka, sans-serif', background: '#E91E4D' }}
            >
              Entendi!
            </button>
          </div>
        </div>
      )}
    </>
  );
}
