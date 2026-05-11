export interface Player {
  id: string;
  label: string;      // nome visível: "Pirata", "Sereia"…
  avatar: string;     // emoji fallback: "🏴", "🧜‍♀️"…
  image?: string;     // caminho relativo ao PNG: "personagens/pirata.png"
  color: string;      // cor hex temática: "#E91E4D"…
  coins: number;      // búzios
  stars: number;      // pérolas
  trophies: number;   // troféus
}
