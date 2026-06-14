import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export const ROUTE_KEY = 'tikki-fiesta-route';
const GAME_KEY = 'tikki-fiesta-game-state';

const SKIP_SAVE = ['/', '/configurar', '/virar-celular'];

export function RouteSaver() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!SKIP_SAVE.includes(location.pathname)) {
      try { localStorage.setItem(ROUTE_KEY, location.pathname); } catch {}
    }
  }, [location.pathname]);

  useEffect(() => {
    if (location.pathname !== '/') return;
    try {
      const savedRoute = localStorage.getItem(ROUTE_KEY);
      const savedGame = localStorage.getItem(GAME_KEY);
      if (savedRoute && savedGame) {
        navigate(savedRoute, { replace: true });
      }
    } catch {}
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return null;
}

export function clearSavedRoute() {
  try { localStorage.removeItem(ROUTE_KEY); } catch {}
}
