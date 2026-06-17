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
    description: 'Arremesse Tikkoins no cesto. Quem acertar mais da sua cor em 25 segundos vence.',
    objetivo: 'Quem acertar mais Tikkoins da sua cor no cesto ao fim dos 25 segundos vence.',
    materials: '12 Tikkoins (3 de cada cor: 🟦🟥🟩🟨) + Tampa da Caixa',
    regras: [
      'Tampa da Caixa no chão (vira cesto); marque linha 2-3 passos atrás com 1 Tikkoin',
      'Cada jogador escolhe 1 cor e pega seus 3 Tikkoins',
      'Quando o timer começar: TODOS arremessam ao mesmo tempo',
      'Lance 1 Tikkoin por vez — sem jogar tudo junto de uma vez',
      'Vale qualquer técnica: por cima, por baixo, debaixo da perna',
      'Tikkoin fora do cesto é perdido — não pode pegar de volta',
      'Tikkoins azuis com X contam como time amarelo',
      'Quem acertar mais Tikkoins da sua cor no cesto vence',
      '2 jogadores: cada um escolhe 1 cor, as outras 2 ficam fora',
      '3 jogadores: cada um escolhe 1 cor, 1 fica fora',
      '4 jogadores: 1 cor por jogador, todas as 4 em jogo',
      'Desempate: cada empatado pega 1 Tikkoin, conta 3, arremessam juntos — quem acertar vence',
    ],
    type: 'physical',
  },
  {
    id: 'cor-da-sorte',
    name: 'Cor da Sorte',
    emoji: '🎲',
    duration: 0,
    description: 'Aposte em uma cor antes do dado rolar. Acertou? Seus Tikkoins dobram.',
    objetivo: 'Ao fim de 3 rolagens do dado, quem tiver mais Tikkoins vence.',
    materials: 'Dado de 6 cores + 24 Tikkoins + APP',
    regras: [
      'Cada jogador começa com 3 Tikkoins da Banca (pilha central)',
      'A rodada tem 3 rolagens. Em cada uma:',
      '1) Cada jogador escolhe secretamente 1 COR e quantos Tikkoins apostar no app',
      '2) Separa os Tikkoins apostados à frente; toca "Esconder aposta" e passa o celular',
      '3) Quando todos apostarem, alguém rola o dado físico',
      '4) App revela as apostas de todos + a cor que saiu',
      '5) Acertou: recupera apostados + ganha 1 extra por cada (DOBRA)',
      '6) Errou: perde os apostados pra Banca',
      'c) Quem tiver mais Tikkoins ao fim das 3 rolagens vence',
    ],
    type: 'interactive',
    appScreen: '/cor-da-sorte',
  },
  {
    id: 'bingo-das-cores',
    name: 'Bingo das Cores',
    emoji: '🎰',
    duration: 60,
    description: 'Role o dado e descarte Tikkoins da cor sorteada. Primeiro a zerar vence.',
    objetivo: 'Ser o primeiro a ficar sem Tikkoins, ou ter o menor número ao fim dos 60 segundos.',
    materials: '24 Tikkoins + 1 Dado de cores + 1 saquinho opaco + Timer 60 segundos',
    regras: [
      'Cada jogador pega 5 Tikkoins aleatórios do saquinho (cores variadas)',
      'Inicia o timer de 60 segundos',
      'Alguém rola o dado de cores a cada rodada',
      'Cor normal (Verde/Azul/Amarelo/Vermelho): TODOS com Tikkoins dessa cor descartam 1 pro saquinho',
      'Laranja ou Rosa: todo mundo compra 1 Tikkoin aleatório do saquinho (surpresa!)',
      'Ganha quem zerar primeiro OU quem tiver menos Tikkoins ao fim dos 60s',
      'Variação rápida: descartar TODOS os Tikkoins da cor sorteada de uma vez',
    ],
    type: 'physical',
  },
  {
    id: 'tikkoin-quente',
    name: 'Tikkoin Quente',
    emoji: '🔥',
    duration: 60,
    description: 'Passe os Tikkoins enquanto a música toca. Quando parar, a cor na tela elimina alguém.',
    objetivo: 'Ser o último jogador de pé. Não fique com o Tikkoin da cor revelada!',
    materials: '4 Tikkoins (1 de cada cor: 🔴🟢🔵🟡) + APP',
    regras: [
      'Cada jogador pega 1 Tikkoin de cor diferente; sentam em círculo',
      'Aperte COMEÇAR no app — a música começa a tocar',
      'Enquanto a música toca, passem os Tikkoins pro lado direito continuamente',
      'Quando a música PARAR, todos congelam imediatamente',
      'O app mostra 1 cor — quem estiver segurando o Tikkoin daquela cor é ELIMINADO',
      'Se a cor mostrada não está em jogo, ninguém é eliminado — música volta a tocar',
      'O Tikkoin eliminado sai do jogo junto com o jogador',
      'Repete até sobrar 1 jogador — esse é o vencedor!',
    ],
    type: 'interactive',
    appScreen: '/tikkoin-quente',
  },
  {
    id: 'capitao-mandou',
    name: 'Capitão Mandou',
    emoji: '🗣️',
    duration: 0,
    minPlayers: 4,
    description: 'Ajudantes se alternam dando dicas. Sua dupla precisa adivinhar a palavra primeiro.',
    objetivo: 'A dupla que adivinhar a palavra primeiro vence. (Ideal para 4 jogadores)',
    materials: 'Nenhum!',
    regras: [
      'Dividam-se em 2 duplas. Cada dupla tem 1 Ajudante e 1 Acertador',
      'Os 2 Acertadores se afastam para não ouvir',
      'Os 2 Ajudantes (de duplas diferentes) escolhem 1 palavra secreta juntos em 30 segundos',
      'Chamam os Acertadores de volta',
      'Os Ajudantes se alternam: cada um fala 1 dica por vez (A → B → A → B)',
      'O Acertador só pode tentar adivinhar na vez do seu Ajudante',
      'Tentativa errada = dupla perde a rodada automaticamente',
      'A dupla que adivinhar primeiro vence',
      'Proibido: falar a palavra secreta, usar gestos ou dar mais de 1 palavra por dica',
    ],
    type: 'physical',
  },
  {
    id: 'respostas-ou-nada',
    name: 'Respostas ou Nada',
    emoji: '🏆',
    duration: 25,
    description: 'O jogador à sua esquerda escolhe um tema. Fale o máximo de respostas em 25 segundos.',
    objetivo: 'Falar o maior número de respostas válidas dentro de 25 segundos.',
    materials: 'App com timer',
    regras: [
      'O jogador à sua ESQUERDA escolhe o tema (ex: "Coisas vermelhas", "Animais que voam", "Países da Europa")',
      'Cada jogador joga sua rodada de 25 segundos individualmente',
      'Fale o máximo de respostas válidas do tema que conseguir',
      'Os outros fiscalizam: resposta válida = +1 ponto',
      'Resposta repetida = -1 ponto; nenhuma resposta = 0 pontos',
      'Ao fim de todos os turnos, quem tiver mais pontos vence',
      'Desempate: rodada extra de 10 segundos com tema novo',
    ],
    type: 'physical',
  },
  {
    id: 'nao-hesite',
    name: 'Não Hesite',
    emoji: '🤐',
    duration: 90,
    description: 'Narre uma história no passado sem hesitar. Os outros tentam te fazer travar.',
    objetivo: 'Contador: sobreviver 1 min 30 seg sem falhar. Interrogadores: fazer o Contador travar!',
    materials: 'App com timer',
    regras: [
      'Sorteie 1 jogador para ser o Contador de Histórias; os outros são Interrogadores',
      'O Contador escolhe um tema (ex: "A vez que fui pra lua", "Meu primeiro dia como presidente")',
      'Timer de 1 min 30 seg começa — Contador narra no tempo passado',
      'Interrogadores interrompem a qualquer momento com perguntas',
      'Contador FALHA se: usar hesitações ("hmmm", "ééé"), sair do tempo passado, contradizer algo dito, ou ficar em silêncio por 3+ segundos',
      'Contador sobreviveu os 90s = vitória do Contador',
      'Contador falhou = vitória dos Interrogadores',
    ],
    type: 'physical',
    appScreen: '/nao-hesite',
  },
  {
    id: 'contagem-dinamica',
    name: 'Contagem Dinâmica',
    emoji: '🔢',
    duration: 150,
    description: 'Contem de 1 a 10 em roda. Quem falar o 10 troca um número por uma ação. Errou? Eliminado.',
    objetivo: 'Ser o último jogador de pé. Não erre as substituições!',
    materials: 'Nenhum!',
    regras: [
      'Jogadores em roda, definam a ordem (horário ou anti-horário)',
      'Contem de 1 a 10, um número por vez, em ordem',
      'Quem falar o "10" substitui 1 número (1–9) por qualquer ação ou palavra (ex: "4 agora é um grito!")',
      'A contagem recomeça do 1 com a nova regra ativa',
      'A cada nova vez que chegar ao 10, mais 1 número é substituído',
      'Quem errar (falar o número em vez da ação, ou fazer a ação errada) é eliminado',
      'O jogo continua sem o eliminado — último de pé vence!',
      'Timer máximo: 2 minutos e 30 segundos. Se restar mais de 1 jogador ao fim do tempo, vence quem durou mais rodadas sem errar. Em empate, dividem a colocação',
    ],
    type: 'physical',
  },
  {
    id: 'batata-quente-cat',
    name: 'Batata Quente das Categorias',
    emoji: '🍠',
    duration: 0,
    minPlayers: 2,
    description: 'Passe o objeto enquanto a categoria circula. Travar ou errar te elimina.',
    objetivo: 'Ser o último jogador de pé. Travar ou errar a categoria te elimina!',
    materials: 'Um objeto qualquer como "Batata Quente"',
    regras: [
      'Todos em círculo com um objeto qualquer como a Batata Quente',
      'O anunciante grita uma categoria (ex: "Frutas!", "Coisas com roda!", "Países da América do Sul!")',
      'A Batata começa a circular no sentido horário',
      'Quem tiver a Batata deve falar 1 palavra da categoria e imediatamente passar',
      'Eliminado se: travar por 3+ segundos, falar palavra fora da categoria, ou repetir palavra já dita',
      'Após cada eliminação, recomeça com nova categoria',
      'Último de pé vence!',
    ],
    type: 'physical',
  },
  {
    id: 'palma-ou-gancho',
    name: 'Palma ou Gancho?',
    emoji: '✋',
    duration: 0,
    description: 'Todos revelam a mão ao mesmo tempo. Quem ficar na minoria é eliminado.',
    objetivo: '3-4 jogadores: último de pé vence. 2 jogadores: primeiro a 3 pontos vence.',
    materials: 'Nenhum!',
    regras: [
      'Todos em círculo, mão escondida atrás das costas',
      'Juntos, batem o punho na palma 3 vezes: "Um… Dois… Três…"',
      'Na terceira batida, todos revelam: Palma aberta ou Gancho',
      'Quem ficar na MINORIA é eliminado (ex: 3 palmas + 1 gancho → o gancho sai)',
      'Empate (metade palma, metade gancho) → ninguém sai, repete a rodada',
      '(2 jogadores) 1. Um é Escondedor e o outro é Adivinhador',
      '(2 jogadores) 2. Escondedor registra sua escolha (palma ou gancho) no app sem mostrar',
      '(2 jogadores) 3. Adivinhador chuta verbalmente',
      '(2 jogadores) 4. Acertou → ponto para o Adivinhador; Errou → ponto para o Escondedor',
      '(2 jogadores) 5. Trocam de papel a cada rodada',
      '(2 jogadores) 6. Primeiro a 3 pontos vence',
    ],
    type: 'physical',
    appScreen: '/palma-ou-gancho',
  },
  {
    id: 'corrente-quebrada',
    name: 'Corrente Quebrada',
    emoji: '⛓️',
    duration: 0,
    description: 'Cada palavra começa com a última letra da anterior. Travar ou repetir te elimina. (tempo controlado pelos jogadores)',
    objetivo: 'Ser o último jogador de pé mantendo a corrente de palavras.',
    materials: 'App com timer (4 segundos por jogada)',
    regras: [
      'Todos em roda; definam o sentido (horário) e um tema (ex: "Animais", "Cidades", "Comidas")',
      'Primeiro jogador fala qualquer palavra do tema',
      'Cada jogador seguinte fala uma palavra que comece com a ÚLTIMA LETRA da palavra anterior',
      'Cada jogador tem 4 segundos para responder',
      'Eliminado se: travar por 4+ segundos, falar palavra fora do tema, ou repetir palavra já dita',
      'Após cada eliminação, nova corrente começa com o mesmo tema',
      'Modo Difícil: 3 segundos + proibido palavras com menos de 4 letras',
      'Último de pé vence!',
    ],
    type: 'physical',
  },
  {
    id: 'escada-letras',
    name: 'Escada de Letras',
    emoji: '🔤',
    duration: 0,
    description: 'Cada palavra tem uma letra a mais que a anterior. Errou a contagem? Eliminado. (tempo controlado pelos jogadores)',
    objetivo: 'Não ser o jogador que erra a contagem de letras ou trava.',
    materials: '1 Dado de 6 números',
    regras: [
      'Jogadores em roda. O primeiro rola o dado — o número define o tamanho da primeira palavra',
      'Primeiro jogador fala uma palavra com exatamente esse número de letras',
      'O próximo deve falar uma palavra com EXATAMENTE 1 LETRA A MAIS que a anterior',
      'Cada jogador tem 3 segundos para falar',
      'O jogo termina assim que alguém falha (hesitar 3+ segundos ou número errado de letras)',
      'O eliminado fica em último lugar',
      'Os demais são ordenados pelo tamanho das palavras que falaram com sucesso (maior = 1º)',
    ],
    type: 'physical',
  },
  {
    id: 'alfabeto-tikkicubes',
    name: 'Alfabeto de Tikkoins',
    emoji: '🔡',
    duration: 0,
    description: 'Apostem Tikkoins, somem o total e descubram a letra. Grite a palavra certa primeiro.',
    objetivo: 'Acumular o maior número de Tikkoins ao fim de todas as rodadas.',
    materials: '12 Tikkoins (3 de cada cor) + 1 Dado de 6 faces',
    regras: [
      'Cada jogador escolhe 1 cor e começa com 3 Tikkoins da sua cor',
      'O jogo tem tantas rodadas quanto o número de jogadores (ex: 4 jogadores = 4 rodadas)',
      'Início de cada rodada: cada jogador aposta 0 a todos os seus Tikkoins na mesa',
      'O jogador da vez rola o dado para decidir o tema: 1=Animal, 2=Nomes, 3=Adjetivos, 4=Cidades/Países, 5=Profissões, 6=Qualquer coisa',
      'Todos contam MENTALMENTE o total de Tikkoins apostados na mesa',
      'Esse total define a letra (1=A, 2=B, 3=C... 26=Z)',
      'O primeiro a gritar uma palavra com essa letra E do tema certo leva TODOS os apostados',
      'Quem acumular mais Tikkoins ao fim de todas as rodadas vence',
    ],
    type: 'physical',
  },
];

const SORTEIO_KEY = 'tikki-fiesta-sorteio-state';

const Sorteio = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const effectiveState = (location.state as any) ?? (() => {
    try { const s = localStorage.getItem(SORTEIO_KEY); return s ? JSON.parse(s) : null; } catch { return null; }
  })();

  const { players, currentRound, totalRounds, isGameOver, playedMinigames = [] } =
    (effectiveState as {
      players: any[];
      currentRound: number;
      totalRounds: number;
      isGameOver: boolean;
      playedMinigames?: string[];
    }) || {};

  const preservedMinigame = (effectiveState as any)?.preservedMinigame;
  const embateContext = (effectiveState as any)?.embateContext as
    | { challengerId: string; opponentId: string; betAmount: number }
    | undefined;

  const [phase, setPhase] = useState<"shuffling" | "revealed">(
    preservedMinigame ? "revealed" : "shuffling"
  );
  const [chosenGame] = useState(() => {
    if (preservedMinigame) return preservedMinigame;
    if (embateContext) {
      const embatePool = MINIGAMES.filter(
        m => (m as any).type === 'physical' && ((m as any).minPlayers ?? 2) <= 2
      );
      return embatePool[Math.floor(Math.random() * embatePool.length)];
    }
    const available = MINIGAMES.filter(m => !playedMinigames.includes(m.id));
    const pool = available.length > 0 ? available : MINIGAMES;
    return pool[Math.floor(Math.random() * pool.length)];
  });

  useEffect(() => {
    if (location.state) {
      try { localStorage.setItem(SORTEIO_KEY, JSON.stringify(location.state)); } catch {}
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
    if (!effectiveState) navigate("/game");
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!effectiveState) return null;

  // When we've exhausted all minigames, start a fresh cycle with only the new pick
  const wasReset = !preservedMinigame && !embateContext &&
    MINIGAMES.filter(m => !playedMinigames.includes(m.id)).length === 0;

  const updatedPlayed = embateContext
    ? playedMinigames  // don't track embate minigames in regular play history
    : preservedMinigame
      ? playedMinigames
      : wasReset
        ? [chosenGame.id]
        : [...playedMinigames, chosenGame.id];

  const handleStart = () => {
    if ((chosenGame as any).appScreen) {
      navigate((chosenGame as any).appScreen, {
        state: { players, currentRound, totalRounds, isGameOver, minigame: chosenGame, playedMinigames: updatedPlayed, embateContext },
      });
    } else {
      navigate("/timer", {
        state: { players, currentRound, totalRounds, isGameOver, minigame: chosenGame, playedMinigames: updatedPlayed, embateContext },
      });
    }
  };

  const handleComoJogar = () => {
    navigate("/como-jogar", {
      state: { minigame: chosenGame, players, currentRound, totalRounds, isGameOver, playedMinigames: updatedPlayed, embateContext },
    });
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center overflow-x-hidden px-4 py-4" style={{ minHeight: '100dvh' }}>
      <TropicalBackground />

      {/* Badge de rodada / embate */}
      <div className="absolute top-4 left-4">
        <span
          className="text-sm font-bold tracking-wide"
          style={{ fontFamily: 'Fredoka, sans-serif', color: COLORS.marromProfundo }}
        >
          {embateContext ? '⚔️ EMBATE' : `🎲 Rodada ${currentRound}/${totalRounds}`}
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
            className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8"
            initial={{ opacity: 0, scale: 0.5, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            {/* perspective no pai para o rotateY funcionar corretamente */}
            <div className="w-full max-w-[288px] sm:max-w-xs sm:flex-none" style={{ perspective: '600px', overflow: 'visible' }}>
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
                      color: '#FFFFFF',
                      textShadow: '0 1px 2px rgba(0,0,0,0.5)',
                      textAlign: 'center',
                      lineHeight: 1.4,
                      background: 'rgba(45,27,13,0.35)',
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
            <div className="flex flex-col items-center sm:justify-center gap-3">
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
