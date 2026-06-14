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
    if (hasRestored.current) {
      console.log('[RESTORE] Ignorado — já executou uma vez (StrictMode double-invoke)');
      return;
    }
    hasRestored.current = true;

    const savedRoute = localStorage.getItem(ROUTE_KEY);
    const savedGame = localStorage.getItem(GAME_KEY);

    console.log('[RESTORE] Rota salva no storage:', savedRoute, '| jogo salvo:', !!savedGame, '| pathname atual:', location.pathname);

    if (!savedRoute) {
      console.log('[RESTORE] Não restaurou porque: nenhuma rota salva no localStorage');
      return;
    }
    if (!savedGame) {
      console.log('[RESTORE] Não restaurou porque: nenhum jogo salvo no localStorage');
      return;
    }
    if (location.pathname !== '/' && location.pathname !== '') {
      console.log('[RESTORE] Não restaurou porque: não está na raiz (pathname =', location.pathname, ')');
      return;
    }

    console.log('[RESTORE] Navegando para:', savedRoute);
    navigate(savedRoute, { replace: true });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Salva rota sempre que mudar (exceto rotas iniciais)
  useEffect(() => {
    if (SKIP_SAVE.includes(location.pathname)) {
      console.log('[SAVE] Rota ignorada (skip list):', location.pathname);
      return;
    }
    console.log('[SAVE] Salvando rota:', location.pathname);
    try { localStorage.setItem(ROUTE_KEY, location.pathname); } catch {}
  }, [location.pathname]);

  return null;
}

export function clearSavedRoute() {
  try { localStorage.removeItem(ROUTE_KEY); } catch {}
}
