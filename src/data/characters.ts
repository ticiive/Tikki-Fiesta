export interface Character {
  label: string;   // nome do personagem
  avatar: string;  // emoji representativo
  color: string;   // cor hex temática usada em rings, glows e destaques
}

export const CHARACTER_MAP: Record<string, Character> = {
  P1: { label: 'Coco',      avatar: '🥥', color: '#8B5E34' },
  P2: { label: 'Hibisco',   avatar: '🌺', color: '#FF6B9D' },
  P3: { label: 'Palma',     avatar: '🌴', color: '#2D7A4B' },
  P4: { label: 'Concha',    avatar: '🐚', color: '#D4832A' },
  P5: { label: 'Tartaruga', avatar: '🐢', color: '#5A8F3D' },
  P6: { label: 'Pérola',    avatar: '🫧', color: '#9E7FB8' },
  P7: { label: 'Estrela',   avatar: '⭐', color: '#FFCD3C' },
  P8: { label: 'Peixe',     avatar: '🐠', color: '#FF6B4A' },
};

// Lista ordenada — útil na tela de Configuração para renderizar os 8 cards de seleção
export const CHARACTERS = Object.entries(CHARACTER_MAP).map(([id, char]) => ({
  id,
  ...char,
}));
