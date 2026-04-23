export const COLORS = {
  coral:          '#FF7F50',
  menta:          '#AAF0D1',
  areia:          '#F4E4C1',
  areiaEscura:    '#E8D5A8',
  madeiraEscura:  '#5D3A1A',
  madeiraMedia:   '#8B5E34',
  madeiraClara:   '#A0693E',
  marromProfundo: '#2D1B0D',
  turquoise:      '#1FBFCF',
  verde:          '#2D7A4B',
  alerta:         '#E74C3C',
} as const;

export const WOOD_BG = [
  'linear-gradient(135deg, rgba(93,58,26,0.4) 0%, transparent 40%)',
  `linear-gradient(90deg, ${COLORS.madeiraMedia} 0%, ${COLORS.madeiraClara} 50%, ${COLORS.madeiraMedia} 100%)`,
].join(', ');

export const WOOD_INSET_MAIN = [
  'inset 0 0 0 4px #6D4A22',
  `inset 0 0 0 8px ${COLORS.madeiraMedia}`,
  'inset 0 0 40px rgba(45,27,13,0.3)',
].join(', ');

export const WOOD_INSET_CARD = [
  'inset 0 0 0 2px #6D4A22',
  'inset 0 0 20px rgba(45,27,13,0.2)',
].join(', ');
