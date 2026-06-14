import { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export const ROUTE_KEY = 'tikki-fiesta-route';
const GAME_KEY = 'tikki-fiesta-game-state';

const SKIP_SAVE = ['/', '/configurar', '/virar-celular'];

export function RouteSaver() {
  const location = useLocation();
  const navigate = useNavigate();
  const hasRestored = useRef(false);

  // Restaura rota ao montar — uma vez só
  useEffect(() => {
    if (hasRestored.current) return;
    hasRestored.current = true;

    const savedRoute = localStorage.getItem(ROUTE_KEY);
    const savedGame = localStorage.getItem(GAME_KEY);

    if (savedRoute && savedGame && (location.pathname === '/' || location.pathname === '')) {
      navigate(savedRoute, { replace: true });
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Salva rota sempre que mudar (exceto rotas iniciais)
  useEffect(() => {
    if (!SKIP_SAVE.includes(location.pathname)) {
      try { localStorage.setItem(ROUTE_KEY, location.pathname); } catch {}
    }
  }, [location.pathname]);

  return null;
}

export function clearSavedRoute() {
  try { localStorage.removeItem(ROUTE_KEY); } catch {}
}
