import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { TropicalBackground } from "@/components/layout/TropicalBackground";
import { WoodenCard } from "@/components/ui/WoodenCard";
import { TropicalButton } from "@/components/ui/TropicalButton";
import { COLORS } from "@/lib/tokens";

const playPlim = (freq: number, duration: number, volume: number) => {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const now = ctx.currentTime;
    [freq, freq * 2].forEach((f, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.value = f;
      const vol = volume * (i === 0 ? 1 : 0.3);
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(vol, now + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + duration);
    });
  } catch (_) {}
};

const playTique = () => playPlim(880, 0.15, 0.1);

const playReveal = () => {
  playPlim(523, 0.4, 0.25);
  setTimeout(() => playPlim(659, 0.4, 0.25), 90);
  setTimeout(() => playPlim(784, 0.5, 0.3),  180);
  setTimeout(() => playPlim(1047, 0.6, 0.35), 270);
};

const MINIGAMES = [
  {
    id: 'tikki-strike',
    name: 'Tikki Strike',
    emoji: '🎯',
    duration: 25,
    description: 'TODOS arremessam Tikkubes ao mesmo tempo. Caos absoluto de pontaria!',
    objetivo: 'Quem acertar mais Tikkubes da sua cor no cesto ao fim dos 25 segundos vence.',
    materials: '24 Tikkubes (6 de cada cor: 🟦🟥🟩🟨) + Tampa da Caixa',
    regras: [
      'Tampa da Caixa no chão (vira cesto); marque linha 2-3 passos atrás com 1 Tikkube',
      'Cada jogador escolhe 1 cor e pega seus 6 Tikkubes',
      'Quando o timer começar: TODOS arremessam ao mesmo tempo',
      'Lance 1 Tikkube por vez — sem jogar tudo junto de uma vez',
      'Vale qualquer técnica: por cima, por baixo, debaixo da perna',
      'Tikkube fora do cesto é perdido — não pode pegar de volta',
      'Quem acertar mais Tikkubes da sua cor no cesto vence',
      '2 jogadores: cada um escolhe 1 cor, as outras 2 ficam fora',
      '3 jogadores: cada um escolhe 1 cor, 1 fica fora',
      '4 jogadores: 1 cor por jogador, todas as 4 em jogo',
      'Desempate: cada empatado pega 1 Tikkube da sua cor, conta 3, arremessam ao mesmo tempo — quem acertar vence; se ambos acertarem ou errarem, repete',
    ],
    type: 'physical',
  },
  {
    id: 'cor-e-letra',
    name: 'Cor & Letra',
    emoji: '🃏',
    duration: 60,
    description: 'A cor sai do dado, mas a LETRA é o que importa!',
    objetivo: 'Ao fim dos 60 segundos, quem tiver mais Tikkubes vence.',
    materials: '12 Cartas-Coco + Dado de 6 cores + Tikkubes (incluindo mini-tikkubes)',
    regras: [
      'Embaralhe as 12 Cartas-Coco',
      'Tire 6 cartas aleatórias e espalhe na mesa, viradas pra cima',
      'Quando o timer começar, alguém rola o dado',
      'TODOS correm para pegar a carta cujo OBJETO começa com a letra da cor sorteada',
      'Acertou? +1 Tikkube (pega da pilha central)',
      'Errou? Devolve 1 Tikkube. Se saldo zerar, usa mini-tikkubes para representar saldo negativo',
      'Se a cor sorteada não tem carta válida na mesa: rola o dado de novo, sem penalidade',
      'Pode pausar o timer para reembaralhar cartas e renovar a mesa',
      'Quem tem mais Tikkubes ao fim dos 60s vence',
    ],
    type: 'physical',
  },
  {
    id: 'cor-da-sorte',
    name: 'Cor da Sorte',
    emoji: '🎲',
    duration: 90,
    description: 'Aposte secretamente em uma cor. Acertou? Seus Tikkubes dobram!',
    objetivo: 'Ao fim de 3 rolagens do dado, quem tiver mais Tikkubes vence.',
    materials: 'Dado de 6 cores + 24 Tikkubes + APP',
    regras: [
      'Cada jogador começa com 3 Tikkubes da Banca (pilha central)',
      'Rodada tem 3 rolagens. Em cada uma:',
      '  1) Cada jogador escolhe secretamente uma COR no app (aposta obrigatória)',
      '  2) Quando todos apostarem, alguém rola o dado físico',
      '  3) App revela as apostas de todos + a cor que saiu',
      '  4) Quem acertou: recupera apostados + ganha 1 Tikkube extra por cada apostado (DOBRA)',
      '  5) Quem errou: perde os apostados pra Banca',
      'Se houver empate no fim: rolagem extra de desempate com cores únicas',
      'Quem tem MAIS Tikkubes ao fim das 3 rolagens vence',
    ],
    type: 'interactive',
    appScreen: '/cor-da-sorte',
  },
  {
    id: 'bingo-das-cores',
    name: 'Bingo das Cores',
    emoji: '🎰',
    duration: 60,
    description: 'Complete uma fileira no seu cartão de cores antes dos outros!',
    objetivo: 'Preencher primeiro uma fileira (horizontal, vertical ou diagonal) no seu cartão de Bingo de cores.',
    materials: 'Cartões de Bingo de cores + Dado de 6 cores + Marcadores (Tikkubes)',
    regras: [
      'Cada jogador recebe um cartão de Bingo de cores (5×5)',
      'Jogadores se revezam rolando o dado de cores',
      'Quem tiver aquela cor no cartão marca com um Tikkube',
      'Qualquer jogador pode rolar o dado na sua vez',
      'Primeiro a completar uma fileira (horizontal, vertical ou diagonal) grita TIKKI BINGO!',
      'Vence quem completar a fileira primeiro',
      'Desempate: quem tiver mais fileiras completas ao fim do tempo vence',
    ],
    type: 'physical',
  },
  {
    id: 'tikkube-quente',
    name: 'Tikkube Quente',
    emoji: '🔥',
    duration: 60,
    description: 'A música toca e o Tikkube passa de mão em mão. Quando parar, a cor na tela define quem perde!',
    objetivo: 'Não segurar o Tikkube quando a música parar na sua cor!',
    materials: '1 Tikkube de qualquer cor + APP',
    regras: [
      'Um jogador segura o Tikkube quando a música começa',
      'Enquanto a música toca, passe o Tikkube para o jogador ao lado',
      'Quando a música parar, o app mostra uma cor',
      'Quem estiver segurando o Tikkube E for o personagem da cor mostrada perde 1 Tikkube',
      'Se ninguém for da cor mostrada, ninguém perde — pressione Continuar',
      'Pressione Continuar para a música tocar novamente',
      'Encerre o minigame quando quiser — quem tiver mais Tikkubes vence',
    ],
    type: 'interactive',
    appScreen: '/tikkube-quente',
  },
];

const Sorteio = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { players, currentRound, totalRounds, isGameOver, playedMinigames = [] } =
    (location.state as {
      players: any[];
      currentRound: number;
      totalRounds: number;
      isGameOver: boolean;
      playedMinigames?: string[];
    }) || {};

  const preservedMinigame = (location.state as any)?.preservedMinigame;

  const [phase, setPhase] = useState<"shuffling" | "revealed">(
    preservedMinigame ? "revealed" : "shuffling"
  );
  const [chosenGame] = useState(() => {
    if (preservedMinigame) return preservedMinigame;
    const available = MINIGAMES.filter(m => !playedMinigames.includes(m.id));
    const pool = available.length > 0 ? available : MINIGAMES;
    return pool[Math.floor(Math.random() * pool.length)];
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setPhase("revealed");
      playReveal();
    }, 2200);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (phase !== "shuffling") return;
    const interval = setInterval(playTique, 400);
    return () => clearInterval(interval);
  }, [phase]);

  useEffect(() => {
    if (!location.state) navigate("/");
  }, [location.state, navigate]);

  if (!location.state) return null;

  const updatedPlayed = preservedMinigame
    ? playedMinigames
    : [...playedMinigames, chosenGame.id];

  const handleStart = () => {
    if ((chosenGame as any).type === 'interactive' && (chosenGame as any).appScreen) {
      navigate((chosenGame as any).appScreen, {
        state: { players, currentRound, totalRounds, isGameOver, minigame: chosenGame, playedMinigames: updatedPlayed },
      });
    } else {
      navigate("/timer", {
        state: { players, currentRound, totalRounds, isGameOver, minigame: chosenGame, playedMinigames: updatedPlayed },
      });
    }
  };

  const handleComoJogar = () => {
    navigate("/como-jogar", {
      state: { minigame: chosenGame, players, currentRound, totalRounds, isGameOver, playedMinigames: updatedPlayed },
    });
  };

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center overflow-hidden px-4">
      <TropicalBackground />

      {/* Badge de rodada */}
      <div className="absolute top-4 left-4">
        <span
          className="text-sm font-bold tracking-wide"
          style={{ fontFamily: 'Fredoka, sans-serif', color: COLORS.marromProfundo }}
        >
          🎲 Rodada {currentRound}/{totalRounds}
        </span>
      </div>

      <AnimatePresence mode="wait">
        {phase === "shuffling" ? (

          /* ── Fase 1: cards embaralhando ─────────────────────────────── */
          <motion.div
            key="shuffle"
            className="relative w-64 h-40"
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
          >
            {[0, 1, 2, 3, 4].map((i) => (
              <motion.div
                key={i}
                style={{ position: 'absolute', inset: 0, zIndex: 5 - i, willChange: 'transform' }}
                animate={{
                  x:      [0, (i % 2 === 0 ? 1 : -1) * 80, 0, (i % 2 === 0 ? -1 : 1) * 60, 0],
                  rotate: [0, (i % 2 === 0 ? 8 : -8), 0, (i % 2 === 0 ? -5 : 5), 0],
                  y:      [0, -10 * (i % 3), 5, -8, 0],
                }}
                transition={{ duration: 0.6, repeat: 3, delay: i * 0.05, ease: "easeInOut" }}
              >
                <WoodenCard variant="card" irregularCorners style={{ height: '100%' }}>
                  <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: '2rem', opacity: 0.4 }}>🃏</span>
                  </div>
                </WoodenCard>
              </motion.div>
            ))}
          </motion.div>

        ) : (

          /* ── Fase 2: card revelado + botões ─────────────────────────── */
          <motion.div
            key="revealed"
            className="flex flex-col items-center gap-6"
            initial={{ opacity: 0, scale: 0.5, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            {/* perspective no pai para o rotateY funcionar corretamente */}
            <div className="w-72 sm:w-80" style={{ perspective: '600px', overflow: 'visible' }}>
              <motion.div
                initial={{ rotateY: 90 }}
                animate={{ rotateY: 0 }}
                transition={{ delay: 0.1, duration: 0.4 }}
              >
                <WoodenCard variant="card" irregularCorners>

                  {/* ── Decorativos nos cantos do card ─────────────────── */}
                  {/* TL — folha de palmeira */}
                  <div className="absolute select-none" style={{ top: -15, left: -15, zIndex: 10, pointerEvents: 'none', transform: 'rotate(-15deg)', opacity: 0.9 }}>
                    <svg width="55" height="65" viewBox="0 0 80 95" fill="none">
                      <path d="M12,85 Q-8,45 38,5 Q55,32 50,62 Q36,78 12,85 Z" fill="#2D6B31" />
                      <path d="M12,85 Q28,44 38,5" stroke="#1B4D1E" strokeWidth="2" strokeLinecap="round" />
                      <path d="M22,65 Q35,50 42,30" stroke="#1B4D1E" strokeWidth="1" opacity="0.6" />
                      <path d="M18,72 Q30,55 37,38" stroke="#1B4D1E" strokeWidth="1" opacity="0.5" />
                    </svg>
                  </div>
                  {/* TR — flor hibisco */}
                  <div className="absolute select-none" style={{ top: -18, right: -15, zIndex: 10, pointerEvents: 'none', transform: 'rotate(20deg)', opacity: 0.9 }}>
                    <svg width="52" height="52" viewBox="0 0 68 68" fill="none">
                      {([0, 72, 144, 216, 288] as number[]).map((deg, i) => (
                        <ellipse key={i} cx="34" cy="16" rx="8" ry="16" fill="#E8476A" opacity="0.92"
                          transform={`rotate(${deg} 34 34)`} />
                      ))}
                      <circle cx="34" cy="34" r="7" fill="#FFD700" />
                      <circle cx="34" cy="34" r="4" fill="#FFA500" />
                      <circle cx="34" cy="34" r="2" fill="#FF6B00" />
                    </svg>
                  </div>
                  {/* BL — concha */}
                  <div className="absolute select-none" style={{ bottom: -10, left: -10, zIndex: 10, pointerEvents: 'none', transform: 'rotate(-10deg)', opacity: 0.9 }}>
                    <svg width="44" height="48" viewBox="0 0 52 56" fill="none">
                      <path d="M26,52 Q6,46 3,30 Q0,14 15,6 Q30,0 42,12 Q52,24 47,38 Q42,50 30,52 Q22,53 17,46 Q12,39 16,30 Q20,22 27,23 Q34,24 35,32 Q36,39 29,41 Z"
                        fill="#D4A373" stroke="#A07850" strokeWidth="1.5" />
                      <path d="M26,48 Q10,42 8,28 Q6,16 18,10" stroke="#A07850" strokeWidth="1" fill="none" opacity="0.5" />
                      <path d="M26,44 Q14,39 13,28 Q12,19 22,15" stroke="#A07850" strokeWidth="0.8" fill="none" opacity="0.4" />
                    </svg>
                  </div>
                  {/* BR — folhinhas */}
                  <div className="absolute select-none" style={{ bottom: -12, right: -10, zIndex: 10, pointerEvents: 'none', transform: 'rotate(15deg)', opacity: 0.9 }}>
                    <svg width="44" height="40" viewBox="0 0 58 52" fill="none">
                      <path d="M5,42 Q8,10 32,4 Q26,26 5,42 Z" fill="#5CB85C" />
                      <path d="M5,42 Q18,18 32,4" stroke="#3A8A3A" strokeWidth="1.2" fill="none" />
                      <path d="M18,48 Q28,18 52,12 Q44,34 18,48 Z" fill="#4CAE4C" />
                      <path d="M18,48 Q36,26 52,12" stroke="#3A8A3A" strokeWidth="1.2" fill="none" />
                    </svg>
                  </div>

                  <div className="p-4 flex flex-col items-center gap-3">
                    <h2
                      className="font-bold text-center tracking-tight"
                      style={{
                        fontFamily: 'Fredoka, sans-serif',
                        fontSize: 'clamp(1.2rem, 3.5vw, 1.8rem)',
                        color: '#FDF5E6',
                        textShadow: '0 1px 3px rgba(0,0,0,0.5)',
                      }}
                    >
                      {chosenGame.name}
                    </h2>
                    <motion.div
                      animate={{ scale: [1, 1.15, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      style={{ fontSize: 'clamp(3rem, 10vw, 5rem)', lineHeight: 1 }}
                    >
                      {chosenGame.emoji}
                    </motion.div>
                    <p style={{
                      fontFamily: 'Quicksand, sans-serif',
                      fontSize: 'clamp(0.85rem, 2vw, 1rem)',
                      color: COLORS.marromProfundo,
                      textAlign: 'center',
                      lineHeight: 1.4,
                      opacity: 0.85,
                      background: 'linear-gradient(180deg, #F8E9C9 0%, #F0DAB5 50%, #F4E4C1 100%)',
                      boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.6), inset 0 -1px 2px rgba(120,80,40,0.1)',
                      borderRadius: '14px',
                      padding: '8px 12px',
                      margin: '0 8px',
                    }}>
                      {chosenGame.description}
                    </p>
                  </div>
                </WoodenCard>
              </motion.div>
            </div>

            {/* Botões de ação */}
            <div className="flex flex-col items-center gap-3">
              <TropicalButton variant="primary" size="lg" onClick={handleStart}>
                🎮 INICIAR MINIGAME
              </TropicalButton>
              <TropicalButton variant="secondary" size="md" onClick={handleComoJogar}>
                📖 Como Jogar?
              </TropicalButton>
            </div>
          </motion.div>

        )}
      </AnimatePresence>
    </div>
  );
};

export default Sorteio;
