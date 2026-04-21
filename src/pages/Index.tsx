import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { UserPlus } from "lucide-react";

const players = ["P1", "P2", "P3", "P4", "P5", "P6"];
const roundOptions = [3, 5, 10];

// Cor temática de cada jogador — usada no anel do avatar e no glow de seleção
const PLAYER_COLORS: Record<string, string> = {
  P1: '#FF4757', P2: '#1E90FF', P3: '#2ED573',
  P4: '#FFA502', P5: '#8B5CF6', P6: '#FF6EB4',
};

// Rotação inicial de cada card — estética cartunesca (nenhum perfeitamente alinhado)
const CARD_TILTS: Record<string, number> = {
  P1: -3, P2: 2, P3: -1, P4: 4, P5: -2, P6: 3,
};

/*
 * Textura de madeira: dois gradientes sobrepostos.
 * Diagonal escuro no canto superior-esquerdo (sombra de relevo) +
 * veios horizontais alternando claro/escuro (grão da madeira).
 */
const WOOD_BG = [
  'linear-gradient(135deg, rgba(93,58,26,0.4) 0%, transparent 40%)',
  'linear-gradient(90deg, #8B5E34 0%, #A0693E 50%, #8B5E34 100%)',
].join(', ');

/*
 * Sombra interna em 3 camadas: simula espessura física da borda de madeira.
 * Camada 1 (4px): linha escura de divisão borda/interior
 * Camada 2 (8px): área intermediária mais clara
 * Camada 3 (blur): profundidade/escurecimento central
 */
const WOOD_INSET_MAIN = [
  'inset 0 0 0 4px #6D4A22',
  'inset 0 0 0 8px #8B5E34',
  'inset 0 0 40px rgba(45,27,13,0.3)',
].join(', ');

// Versão reduzida para os cards (borda 6px, não 10px)
const WOOD_INSET_CARD = [
  'inset 0 0 0 2px #6D4A22',
  'inset 0 0 0 4px #8B5E34',
  'inset 0 0 20px rgba(45,27,13,0.25)',
].join(', ');

const Index = () => {
  const navigate = useNavigate();
  const [selectedPlayers, setSelectedPlayers] = useState<string[]>([]);
  const [selectedRounds, setSelectedRounds] = useState<number | null>(null);

  const togglePlayer = (label: string) => {
    setSelectedPlayers((prev) =>
      prev.includes(label) ? prev.filter((p) => p !== label) : [...prev, label]
    );
  };

  const canStart = selectedPlayers.length >= 2 && selectedRounds !== null;

  const handleStart = () => {
    if (!canStart) return;
    navigate("/game", { state: { players: selectedPlayers, totalRounds: selectedRounds } });
  };

  return (
    <div className="min-h-screen px-[5%] py-[5vh] relative overflow-x-hidden">

      {/* ── Background fixo ───────────────────────────────────────────────
       * Gradiente radial: centro areia (#F4E4C1) → meio azul claro → borda turquoise
       * SVG overlay: 4 círculos concêntricos brancos translúcidos (espessuras variadas)
       * para criar profundidade visual sem animação.
       */}
      <div
        className="fixed inset-0 z-[-10]"
        style={{
          background:
            'radial-gradient(ellipse at center, #F4E4C1 0%, #B8E8F0 50%, #1FBFCF 100%)',
        }}
      >
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="xMidYMid slice"
        >
          {/* Espessuras propositalmente diferentes: 0.25 / 0.35 / 0.35 / 0.5 */}
          <circle cx="50" cy="50" r="15" fill="none" stroke="white" strokeWidth="0.25" opacity="0.15" />
          <circle cx="50" cy="50" r="28" fill="none" stroke="white" strokeWidth="0.35" opacity="0.20" />
          <circle cx="50" cy="50" r="42" fill="none" stroke="white" strokeWidth="0.35" opacity="0.25" />
          <circle cx="50" cy="50" r="56" fill="none" stroke="white" strokeWidth="0.5"  opacity="0.30" />
        </svg>
      </div>

      {/*
       * ── Painel de madeira principal ──────────────────────────────────────
       *
       * Cinco técnicas simultâneas para aparência não-genérica:
       *   a) border-radius com 4 valores distintos → cantos "entalhados à mão"
       *   b) border sólida 10px + 3 insets em camadas → relevo/espessura física
       *   c) 2 gradientes sobrepostos → textura de veios de madeira
       *   d) box-shadow externo assimétrico (y > x) → peso e materialidade
       *   e) Decorativos SVG com offsets negativos → quebram borda propositalmente
       *   f) Elipses SVG (nós de madeira) z-0 atrás do conteúdo → imperfeição natural
       */}
      <div
        className="relative max-w-6xl mx-auto"
        style={{
          borderRadius: '28px 36px 24px 40px',          // a) Cantos irregulares
          border: '10px solid #5D3A1A',                 // b) Borda espessa
          background: WOOD_BG,                          // c) Textura de madeira
          boxShadow: [
            WOOD_INSET_MAIN,                            // b) Relevo interno
            '0 12px 0 0 rgba(45,27,13,0.8)',            // d) Sombra "chão" espessa
            '0 16px 30px rgba(45,27,13,0.4)',           // d) Blur de profundidade
          ].join(', '),
          overflow: 'visible',                          // e) Decorativos extravasam
        }}
      >

        {/* f) Nós de madeira — elipses em posições/rotações irregulares ─── */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{ zIndex: 0, borderRadius: 'inherit' }}
          viewBox="0 0 1000 600"
          preserveAspectRatio="none"
        >
          <ellipse cx="140" cy="110" rx="72" ry="38" fill="rgba(45,27,13,0.28)" transform="rotate(-22 140 110)" />
          <ellipse cx="820" cy="390" rx="55" ry="28" fill="rgba(45,27,13,0.22)" transform="rotate(16 820 390)"  />
          <ellipse cx="440" cy="530" rx="64" ry="32" fill="rgba(45,27,13,0.20)" transform="rotate(-7 440 530)"  />
        </svg>

        {/* e) Canto TL — folha de palmeira saindo para fora da moldura ───── */}
        <div
          className="absolute pointer-events-none select-none"
          style={{ top: -24, left: -32, zIndex: 10, transform: 'rotate(-15deg)' }}
        >
          <svg width="80" height="95" viewBox="0 0 80 95" fill="none">
            <path d="M12,85 Q-8,45 38,5 Q55,32 50,62 Q36,78 12,85 Z" fill="#2D6B31" />
            <path d="M12,85 Q28,44 38,5" stroke="#1B4D1E" strokeWidth="2" strokeLinecap="round" />
            <path d="M22,65 Q35,50 42,30" stroke="#1B4D1E" strokeWidth="1" opacity="0.6" />
            <path d="M18,72 Q30,55 37,38" stroke="#1B4D1E" strokeWidth="1" opacity="0.5" />
          </svg>
        </div>

        {/* e) Canto TR — flor hibisco saindo para fora da moldura ─────────── */}
        <div
          className="absolute pointer-events-none select-none"
          style={{ top: -18, right: -28, zIndex: 10, transform: 'rotate(20deg)' }}
        >
          <svg width="68" height="68" viewBox="0 0 68 68" fill="none">
            {([0, 72, 144, 216, 288] as number[]).map((deg, i) => (
              <ellipse
                key={i}
                cx="34" cy="16" rx="8" ry="16"
                fill="#E8476A" opacity="0.92"
                transform={`rotate(${deg} 34 34)`}
              />
            ))}
            <circle cx="34" cy="34" r="7" fill="#FFD700" />
            <circle cx="34" cy="34" r="4" fill="#FFA500" />
            <circle cx="34" cy="34" r="2" fill="#FF6B00" />
          </svg>
        </div>

        {/* e) Canto BL — concha do mar saindo para fora da moldura ─────────── */}
        <div
          className="absolute pointer-events-none select-none"
          style={{ bottom: -20, left: -24, zIndex: 10, transform: 'rotate(-10deg)' }}
        >
          <svg width="52" height="56" viewBox="0 0 52 56" fill="none">
            <path
              d="M26,52 Q6,46 3,30 Q0,14 15,6 Q30,0 42,12 Q52,24 47,38 Q42,50 30,52 Q22,53 17,46 Q12,39 16,30 Q20,22 27,23 Q34,24 35,32 Q36,39 29,41 Z"
              fill="#D4A373" stroke="#A07850" strokeWidth="1.5"
            />
            <path d="M26,48 Q10,42 8,28 Q6,16 18,10"  stroke="#A07850" strokeWidth="1"   fill="none" opacity="0.5" />
            <path d="M26,44 Q14,39 13,28 Q12,19 22,15" stroke="#A07850" strokeWidth="0.8" fill="none" opacity="0.4" />
          </svg>
        </div>

        {/* e) Canto BR — duas folhinhas saindo para fora da moldura ─────────── */}
        <div
          className="absolute pointer-events-none select-none"
          style={{ bottom: -16, right: -20, zIndex: 10, transform: 'rotate(15deg)' }}
        >
          <svg width="58" height="52" viewBox="0 0 58 52" fill="none">
            <path d="M5,42 Q8,10 32,4 Q26,26 5,42 Z"         fill="#5CB85C" />
            <path d="M5,42 Q18,18 32,4"                       stroke="#3A8A3A" strokeWidth="1.2" fill="none" />
            <path d="M18,48 Q28,18 52,12 Q44,34 18,48 Z"      fill="#4CAE4C" />
            <path d="M18,48 Q36,26 52,12"                     stroke="#3A8A3A" strokeWidth="1.2" fill="none" />
          </svg>
        </div>

        {/* ── Conteúdo interno ─────────────────────────────────────────────── */}
        <div className="relative p-8 md:p-10" style={{ zIndex: 1 }}>

          <h1
            className="text-center text-4xl font-bold mb-8"
            style={{
              fontFamily: 'Fredoka, sans-serif',
              color: '#2D1B0D',
              textShadow: '2px 2px 0 rgba(255,255,255,0.4)',
            }}
          >
            Escolha seus personagens 🎲
          </h1>

          {/* ── Grid 3×2 de personagens ────────────────────────────────────── */}
          <div className="grid grid-cols-3 gap-5 mb-8">
            {players.map((p) => {
              const color = PLAYER_COLORS[p];
              const isSelected = selectedPlayers.includes(p);

              return (
                // pronto para animação flip futura — estrutura em frente/verso preservada
                <button
                  key={p}
                  onClick={() => togglePlayer(p)}
                  style={{
                    width: '100%',
                    aspectRatio: '1',
                    maxWidth: 160,
                    justifySelf: 'center',
                    // Mesmas técnicas da moldura, em escala menor
                    borderRadius: '20px 28px 24px 32px',  // a) Cantos irregulares
                    border: '6px solid #5D3A1A',           // b) Borda em camadas
                    background: WOOD_BG,                   // c) Textura de madeira
                    boxShadow: isSelected
                      ? [
                          WOOD_INSET_CARD,
                          `0 0 0 4px ${color}`,           // ring colorido do jogador
                          `0 6px 20px ${color}88`,         // glow projetado
                        ].join(', ')
                      : [
                          WOOD_INSET_CARD,
                          '4px 6px 0 rgba(45,27,13,0.55)', // sombra projetada normal
                        ].join(', '),
                    // Selecionado: endireita e escala; não selecionado: torto intencional
                    transform: isSelected
                      ? 'rotate(0deg) scale(1.08)'
                      : `rotate(${CARD_TILTS[p]}deg) scale(1)`,
                    transition: 'all 300ms ease',
                    cursor: 'pointer',
                    position: 'relative',
                    overflow: 'hidden',
                    transformStyle: 'preserve-3d',
                  }}
                >
                  {/* Frente do card */}
                  <div
                    style={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 8,
                      padding: '0.5rem',
                      backfaceVisibility: 'hidden',
                    }}
                  >
                    {/* Avatar com anel colorido do jogador */}
                    <div
                      style={{
                        width: 56, height: 56,
                        borderRadius: '50%',
                        border: `3px solid ${color}`,
                        boxShadow: isSelected ? `0 0 10px ${color}88` : 'none',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.8rem',
                        background: isSelected ? `${color}22` : 'rgba(255,255,255,0.12)',
                        transition: 'all 300ms ease',
                      }}
                    >
                      {isSelected ? '🎮' : <UserPlus size={26} color={color} />}
                    </div>
                    <span
                      style={{
                        fontFamily: 'Fredoka, sans-serif',
                        fontWeight: 700,
                        fontSize: '1rem',
                        color: isSelected ? color : '#FDF5E6',
                        textShadow: '1px 1px 0 rgba(0,0,0,0.5)',
                        transition: 'color 300ms ease',
                      }}
                    >
                      {p}
                    </span>
                  </div>

                  {/* Verso do card — oculto, reservado para animação flip futura */}
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      backfaceVisibility: 'hidden',
                      transform: 'rotateY(180deg)',
                      background: '#5D3A1A',
                    }}
                  />
                </button>
              );
            })}
          </div>

          {/* ── Seleção de rodadas ─────────────────────────────────────────── */}
          <div className="mb-8">
            <p
              className="text-center text-xl font-bold mb-4"
              style={{
                fontFamily: 'Fredoka, sans-serif',
                color: '#2D1B0D',
                textShadow: '1px 1px 0 rgba(255,255,255,0.4)',
              }}
            >
              Quantas rodadas? 🎯
            </p>
            <div className="flex gap-4 justify-center">
              {roundOptions.map((r) => {
                const isSel = selectedRounds === r;
                return (
                  <motion.button
                    key={r}
                    onClick={() => setSelectedRounds(r)}
                    animate={{
                      y: isSel ? 2 : 0,
                      scale: isSel ? 1.05 : 1,
                    }}
                    whileHover={!isSel ? { y: -2 } : {}}
                    whileTap={{ scale: 0.96 }}
                    transition={{ duration: 0.15 }}
                    style={{
                      minWidth: '4rem',      // tamanho uniforme: "3" e "10" ocupam o mesmo espaço
                      padding: '0.75rem 1.5rem',
                      fontFamily: 'Fredoka, sans-serif',
                      fontSize: '1.5rem',
                      fontWeight: 700,
                      borderRadius: '0.75rem',
                      border: '3px solid #5D3A1A',
                      cursor: 'pointer',
                      background: isSel ? '#F4E4C1' : '#FF7F50',
                      color: isSel ? '#FF7F50' : 'white',
                      // Sombra reduzida no selecionado → efeito "pressionado"
                      boxShadow: isSel ? '2px 2px 0 #3D2010' : '4px 4px 0 #3D2010',
                      textShadow: isSel ? 'none' : '1px 1px 0 rgba(0,0,0,0.2)',
                    }}
                  >
                    {r}
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* ── Botão Iniciar Partida ──────────────────────────────────────── */}
          <motion.button
            disabled={!canStart}
            onClick={handleStart}
            whileHover={canStart ? { scale: 1.03, y: -2 } : {}}
            whileTap={canStart ? { scale: 0.97, y: 0 } : {}}
            className="w-full"
            style={{
              padding: '1rem 2rem',
              fontFamily: 'Fredoka, sans-serif',
              fontSize: '1.25rem',
              fontWeight: 700,
              borderRadius: '1.8rem 1.4rem 1.6rem 2rem', // coerência com a moldura
              border: `4px solid ${canStart ? '#5D3A1A' : '#9ca3af'}`,
              background: canStart ? '#FF7F50' : '#d1d5db',
              color: canStart ? 'white' : '#9ca3af',
              boxShadow: canStart ? '6px 6px 0 #3D2010' : '3px 3px 0 #9ca3af',
              cursor: canStart ? 'pointer' : 'not-allowed',
              textShadow: canStart ? '1px 1px 0 rgba(0,0,0,0.25)' : 'none',
            }}
          >
            {canStart ? '🎮 Iniciar Partida' : 'Selecione 2+ jogadores e rodadas'}
          </motion.button>

        </div>
      </div>
    </div>
  );
};

export default Index;
