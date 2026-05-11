export interface Character {
  label: string;
  avatar: string;   // emoji fallback
  image?: string;   // caminho relativo ao PNG em public/
  color: string;
}

export const CHARACTER_MAP: Record<string, Character> = {
  P1: { label: 'Pirata',        avatar: '🏴',    color: '#E91E4D', image: 'personagens/pirata.png'       },
  P2: { label: 'Sereia',        avatar: '🧜‍♀️', color: '#2EC4B6', image: 'personagens/sereia.png'       },
  P3: { label: 'Indígena',      avatar: '🌴',    color: '#5BA661', image: 'personagens/indigena.png'     },
  P4: { label: 'Turista',       avatar: '📷',    color: '#FFB627', image: 'personagens/turista.png'      },
  P5: { label: 'Tubarão',       avatar: '🦈',    color: '#5DA0CD', image: 'personagens/tubarao.png'      },
  P6: { label: 'Personagem 6',  avatar: '⭐',    color: '#FFD700', image: 'personagens/personagem6.png'  },
};

// Lista ordenada — usada na tela de Configuração para renderizar os 6 cards de seleção
export const CHARACTERS = Object.entries(CHARACTER_MAP).map(([id, char]) => ({
  id,
  ...char,
}));
