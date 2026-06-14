import { useState, useEffect } from 'react';
import { Maximize2, Minimize2 } from 'lucide-react';

export function FullscreenButton() {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handleChange);
    return () => document.removeEventListener('fullscreenchange', handleChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  return (
    <button
      onClick={toggleFullscreen}
      className="fixed top-3 right-3 z-50 p-2.5 rounded-full transition-transform hover:scale-110 active:scale-95"
      style={{
        background: 'rgba(255,255,255,0.75)',
        backdropFilter: 'blur(6px)',
        boxShadow: '0 2px 12px rgba(0,0,0,0.25)',
        border: '1.5px solid rgba(0,0,0,0.08)',
      }}
      aria-label={isFullscreen ? 'Sair do fullscreen' : 'Entrar em fullscreen'}
    >
      {isFullscreen
        ? <Minimize2 size={18} strokeWidth={2.2} color="#2D1B0D" />
        : <Maximize2 size={18} strokeWidth={2.2} color="#2D1B0D" />
      }
    </button>
  );
}
