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
      'Desempate: cada empatado pega 1 Tikkube, conta 3, arremessam juntos — quem acertar vence',
    ],
    type: 'physical',
  },
  {
    id: 'cor-e-letra',
    name: 'Cor & Letra',
    emoji: '🃏',
    duration: 60,
    description: 'A cor sai do dado, mas a LETRA é o que importa! O cérebro vê a cor, mas a letra manda.',
    objetivo: 'Ao fim dos 60 segundos, quem tiver mais Tikkubes vence.',
    materials: '12 Cartas-Coco + Dado de 6 cores + Tikkubes (incluindo mini-tikkubes)',
    regras: [
      'Embaralhe as 12 Cartas-Coco e espalhe 6 na mesa viradas pra cima',
      'Quando o timer começar, alguém rola o dado',
      'TODOS correm para pegar a carta cujo OBJETO começa com a inicial da cor sorteada',
      'Se não houver carta com essa inicial, pegue a com a inicial mais próxima no alfabeto',
      'Quem pegar a carta certa: +1 Tikkube',
      'Quem pegar carta errada: -1 Tikkube (saldo negativo usa mini-tikkubes)',
      'Devolva as cartas disputadas à mesa e role o dado de novo',
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
      'A rodada tem 3 rolagens. Em cada uma:',
      '1) Cada jogador escolhe secretamente 1 COR e quantos Tikkubes apostar no app',
      '2) Separa os Tikkubes apostados à frente; toca "Esconder aposta" e passa o celular',
      '3) Quando todos apostarem, alguém rola o dado físico',
      '4) App revela as apostas de todos + a cor que saiu',
      '5) Acertou: recupera apostados + ganha 1 extra por cada (DOBRA)',
      '6) Errou: perde os apostados pra Banca',
      'Quem tiver mais Tikkubes ao fim das 3 rolagens vence',
    ],
    type: 'interactive',
    appScreen: '/cor-da-sorte',
  },
  {
    id: 'bingo-das-cores',
    name: 'Bingo das Cores',
    emoji: '🎰',
    duration: 60,
    description: 'Descarte todos os seus Tikkubes antes do tempo acabar! Role o dado e descarte os que baterem com a cor.',
    objetivo: 'Ser o primeiro a ficar sem Tikkubes, ou ter o menor número ao fim dos 60 segundos.',
    materials: '24 Tikkubes + 1 Dado de cores + 1 saquinho opaco + Timer 60 segundos',
    regras: [
      'Cada jogador pega 5 Tikkubes aleatórios do saquinho (cores variadas)',
      'Inicia o timer de 60 segundos',
      'Alguém rola o dado de cores a cada rodada',
      'Cor normal (Verde/Azul/Amarelo/Vermelho): TODOS com cubos dessa cor descartam 1 pro saquinho',
      'Laranja ou Rosa: todo mundo compra 1 Tikkube aleatório do saquinho (surpresa!)',
      'Ganha quem zerar primeiro OU quem tiver menos cubos ao fim dos 60s',
      'Variação rápida: descartar TODOS os cubos da cor sorteada de uma vez',
    ],
    type: 'physical',
  },
  {
    id: 'tikkube-quente',
    name: 'Tikkube Quente',
    emoji: '🔥',
    duration: 60,
    description: 'A música toca e os Tikkubes passam de mão em mão. Quando parar, a cor na tela define quem sai!',
    objetivo: 'Ser o último jogador de pé. Não fique com o Tikkube da cor revelada!',
    materials: '4 Tikkubes (1 de cada cor: 🔴🟢🔵🟡) + APP',
    regras: [
      'Cada jogador pega 1 Tikkube de cor diferente; sentam em círculo',
      'Aperte COMEÇAR no app — a música começa a tocar',
      'Enquanto a música toca, passem os Tikkubes pro lado direito continuamente',
      'Quando a música PARAR, todos congelam imediatamente',
      'O app mostra 1 cor — quem estiver segurando o Tikkube daquela cor é ELIMINADO',
      'Se a cor mostrada não está em jogo, ninguém é eliminado — música volta a tocar',
      'O Tikkube eliminado sai do jogo junto com o jogador',
      'Repete até sobrar 1 jogador — esse é o vencedor!',
    ],
    type: 'interactive',
    appScreen: '/tikkube-quente',
  },
  {
    id: 'tubarao-pegar',
    name: 'Cuidado, Tubarão!',
    emoji: '🦈',
    duration: 0,
    description: 'Role o dado e gire no próprio eixo em um pé só. Se sair 6, o tubarão passou longe!',
    objetivo: 'Ser o último jogador de pé. Não perca o equilíbrio!',
    materials: '1 Dado',
    regras: [
      'Todos ficam em pé num espaço aberto',
      'Na sua vez, role o dado:',
      '1 a 5 → dê essa quantidade de voltas no próprio eixo em um pé só',
      '6 → o tubarão passou longe! Você não dá volta nenhuma',
      'Passe o dado pro próximo jogador',
      'Quem perder o equilíbrio e cair é eliminado',
      'Continua até sobrar 1 jogador — esse é o vencedor!',
      'Desempate (dois caem juntos): cada um rola o dado; quem tirar mais alto sobrevive',
    ],
    type: 'physical',
  },
  {
    id: 'capitao-mandou',
    name: 'Capitão Mandou',
    emoji: '🗣️',
    duration: 0,
    minPlayers: 4,
    description: 'Dois ajudantes de duplas rivais escolhem juntos a palavra secreta. Suas duplas competem para adivinhar!',
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
    id: 'bala-canhao',
    name: 'Bala de Canhão',
    emoji: '💣',
    duration: 0,
    description: 'Atacantes tentam derrubar o pino escondido na base do Defensor usando bolinhas de isopor!',
    objetivo: 'Atacantes: derrubar o pino. Defensor: sobreviver até as 6 bolinhas acabarem.',
    materials: '32 blocos (10×10mm) + 1 pino + 6 bolinhas de isopor',
    regras: [
      'Defina 1 jogador como Defensor; os demais são a Equipe Atacante',
      'Defensor usa os 32 blocos para construir uma base e esconder o pino atrás dela',
      'Atacantes ficam a 2 passos de distância e recebem as 6 bolinhas divididas igualmente',
      'Ao sinal, atacantes arremessam as bolinhas tentando derrubar o pino',
      'Defensor não pode tocar na base ou no pino após o início',
      'Pino derrubado por qualquer motivo = vitória dos Atacantes',
      'Todas as 6 bolinhas usadas e pino de pé = vitória do Defensor',
    ],
    type: 'physical',
  },
  {
    id: 'respostas-ou-nada',
    name: 'Respostas ou Nada',
    emoji: '🏆',
    duration: 15,
    description: 'Um tema, 15 segundos, o maior número de respostas possível. Velocidade e conhecimento!',
    objetivo: 'Falar o maior número de respostas válidas dentro de 15 segundos.',
    materials: 'App com timer',
    regras: [
      'Escolha um tema (ex: "Coisas vermelhas", "Animais que voam", "Países da Europa")',
      'Cada jogador joga sua rodada de 15 segundos individualmente',
      'Fale o máximo de respostas válidas do tema que conseguir',
      'Os outros fiscalizam: resposta válida = +1 ponto',
      'Resposta repetida = -1 ponto; nenhuma resposta = 0 pontos',
      'Ao fim de todos os turnos, quem tiver mais pontos vence',
      'Desempate: rodada extra de 10 segundos com tema novo',
    ],
    type: 'physical',
  },
  {
    id: 'pilha-pirata',
    name: 'Pilha Pirata',
    emoji: '🏗️',
    duration: 30,
    description: 'Empilhe o máximo de Tikkubes com UMA mão em 30 segundos. A torre mais alta vence!',
    objetivo: 'Construir a torre de Tikkubes mais alta que se sustente de pé ao fim do timer.',
    materials: '24 Tikkubes + App com timer',
    regras: [
      '2 jogadores: 12 Tikkubes cada. 3 jogadores: 6 cada (6 sobram de bônus). 4 jogadores: 6 cada',
      'Cada jogador começa com os Tikkubes em pilha bagunçada — não pode começar empilhado',
      'Uma mão fica nas costas o tempo todo; só vale empilhar com 1 mão',
      'TODOS empilham ao mesmo tempo quando o timer começar',
      'Se a torre cair, recomece do zero',
      'Ao fim dos 30s, tire a mão imediatamente — não toque mais na torre',
      'Torre mais alta de pé vence; torre caída no fim = conta o que sobrou em pé',
      '3 jogadores: quem terminar primeiro pode pegar da reserva central para aumentar ainda mais',
    ],
    type: 'physical',
  },
  {
    id: 'nao-hesite',
    name: 'Não Hesite',
    emoji: '🤐',
    duration: 90,
    description: 'Narre uma história no passado sem hesitar, travar ou sair do tempo. Os outros tentarão te fazer errar!',
    objetivo: 'Contador: sobreviver 1 min 30 seg sem falhar. Interrogadores: fazer o Contador travar!',
    materials: 'App com timer',
    regras: [
      'Sorteie 1 jogador para ser o Contador de Histórias; os outros são Interrogadores',
      'O Contador escolhe um tema (ex: "A vez que fui pra lua", "Meu primeiro dia como presidente")',
      'Timer de 1 min 30 seg começa — Contador narra no tempo passado',
      'Interrogadores interrompem a qualquer momento com perguntas',
      'Contador FALHA se: usar hesitações ("hmmm", "ééé"), sair do tempo passado, contradizer algo dito, ou ficar em silêncio por 3+ segundos',
      'Contador sobreviveu os 90s = vitória do Contador (50 pontos)',
      'Contador falhou = 50 pontos divididos igualmente entre os Interrogadores',
    ],
    type: 'physical',
  },
  {
    id: 'contagem-dinamica',
    name: 'Contagem Dinâmica',
    emoji: '🔢',
    duration: 0,
    description: 'Contem de 1 a 10, mas quem falar o 10 pode trocar um número por uma ação. O caos aumenta a cada rodada!',
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
    ],
    type: 'physical',
  },
  {
    id: 'batata-quente-cat',
    name: 'Batata Quente das Categorias',
    emoji: '🍠',
    duration: 0,
    minPlayers: 3,
    description: 'A Batata Quente circula e quem a segurar precisa falar uma palavra da categoria imediatamente!',
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
    id: 'caca-a-cor',
    name: 'Caça à Cor',
    emoji: '🎯',
    duration: 0,
    description: 'Role o dado e colete Tikkubes da cor sorteada. Magenta é curinga, Laranja é roubo!',
    objetivo: 'Quando o centro esvaziar, vence quem tiver mais Tikkubes DA MESMA COR.',
    materials: '24 Tikkubes + 1 Dado de cores (6 faces)',
    regras: [
      'Espalhe todos os 24 Tikkubes no centro da mesa',
      'Na sua vez, role o dado:',
      'Azul/Vermelho/Verde/Amarelo → pegue 1 Tikkube dessa cor do centro',
      'Magenta → pegue 1 Tikkube de qualquer cor que quiser (curinga)',
      'Laranja → roube 1 Tikkube de outro jogador à sua escolha',
      'Passe o dado pro próximo no sentido horário',
      'O jogo termina quando o centro esvaziar',
      'Vence quem tiver mais Tikkubes DA MESMA COR (não o total!)',
      '2 jogadores: use apenas 12 Tikkubes (3 de cada cor)',
    ],
    type: 'physical',
  },
  {
    id: 'palma-ou-gancho',
    name: 'Palma ou Gancho?',
    emoji: '✋',
    duration: 0,
    description: 'Todos revelam a mão ao mesmo tempo. Quem ficar na minoria é eliminado!',
    objetivo: '3-4 jogadores: último de pé vence. 2 jogadores: primeiro a 3 pontos vence.',
    materials: 'Nenhum!',
    regras: [
      'Todos em círculo, mão escondida atrás das costas',
      'Juntos, batem o punho na palma 3 vezes: "Um… Dois… Três…"',
      'Na terceira batida, todos revelam: Palma aberta ou Gancho',
      'Quem ficar na MINORIA é eliminado (ex: 3 palmas + 1 gancho → o gancho sai)',
      'Empate (metade palma, metade gancho) → ninguém sai, repete a rodada',
      '(2 jogadores) Um é Escondedor, outro é Adivinhador; Escondedor registra no app; Adivinhador chuta verbalmente; Acertou = ponto do Adivinhador; Errou = ponto do Escondedor; trocam papéis; primeiro a 3 pontos vence',
    ],
    type: 'physical',
  },
  {
    id: 'sumo-tikkubes',
    name: 'Sumô de Tikkubes',
    emoji: '🛡️',
    duration: 0,
    description: 'Arremesse seus Tikkubes para derrubar os dos adversários da mesa. Mais cubos de pé = vitória!',
    objetivo: 'Ter o maior número de Tikkubes da sua cor sobre a mesa quando todos os cubos forem lançados.',
    materials: '24 Tikkubes (6 de cada cor)',
    regras: [
      'Cada jogador escolhe 1 cor e pega os 6 Tikkubes correspondentes',
      'Coloque 1 Tikkube de cada cor na arena (centro da mesa)',
      'Jogadores ficam a 2 passos da mesa; defina ordem no sentido horário',
      'Na sua vez, arremesse 1 dos seus Tikkubes restantes na arena',
      'Objetivo: derrubar cubos adversários para fora da mesa; manter os seus em cima',
      'Tikkubes que caírem da mesa são removidos do jogo',
      'Continua até todos os Tikkubes serem lançados',
      'Quem tiver mais cubos da sua cor em cima da mesa no final vence',
    ],
    type: 'physical',
  },
  {
    id: 'furacao-cores',
    name: 'Furacão Cores',
    emoji: '🌀',
    duration: 45,
    description: 'O Batedor grita a cor do dado. Todos FECHAM OS OLHOS e tentam pegar Tikkubes dessa cor!',
    objetivo: 'Ter o maior número de Tikkubes no Depósito ao fim do timer. Pegar cor errada = eliminação!',
    materials: '24 Tikkubes + 1 Dado de Cores + App (Timer 45s)',
    regras: [
      'Espalhe os 24 Tikkubes no centro (Zona Neutra). Cada jogador define seu Depósito à frente',
      'O Batedor rola o dado e grita a cor que saiu',
      'TODOS FECHAM OS OLHOS e tentam pegar o máximo de Tikkubes daquela cor',
      'Abram os olhos: quem tiver Tikkube de cor ERRADA no Depósito é eliminado!',
      'Se a cor não existe mais no centro: pode roubar do Depósito de adversários (cuidado!)',
      'Magenta → devolva 1 cubo + 1 do Depósito pra Zona Neutra',
      'Laranja → retire do jogo + todos empurram cubos do Depósito pro jogador à sua direita',
      'Ao fim dos 45s: quem tiver mais Tikkubes no Depósito vence',
    ],
    type: 'physical',
  },
  {
    id: 'corrente-quebrada',
    name: 'Corrente Quebrada',
    emoji: '⛓️',
    duration: 0,
    description: 'Cada palavra deve começar com a ÚLTIMA LETRA da anterior. Travar ou errar te elimina!',
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
    description: 'Cada jogador fala uma palavra com mais uma letra que a anterior. O primeiro a errar perde!',
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
    name: 'Alfabeto de Tikkicubes',
    emoji: '🔡',
    duration: 0,
    description: 'Apostem Tikkubes, somem as apostas e descubram a letra. Grite a palavra certa primeiro e leve tudo!',
    objetivo: 'Acumular o maior número de Tikkubes ao fim de todas as rodadas.',
    materials: '24 Tikkubes (6 de cada cor) + 1 Dado de 6 faces',
    regras: [
      'Cada jogador escolhe 1 cor e pega todos os 6 Tikkubes correspondentes',
      'O jogo tem tantas rodadas quanto o número de jogadores (ex: 4 jogadores = 4 rodadas)',
      'Início de cada rodada: cada jogador aposta 0 a todos os seus Tikkubes na mesa',
      'O jogador da vez rola o dado para decidir o tema: 1=Animal, 2=Nomes, 3=Adjetivos, 4=Cidades/Países, 5=Profissões, 6=Qualquer coisa',
      'Todos contam MENTALMENTE o total de Tikkubes apostados na mesa',
      'Esse total define a letra (1=A, 2=B, 3=C... 26=Z)',
      'O primeiro a gritar uma palavra com essa letra E do tema certo leva TODOS os apostados',
      'Quem acumular mais Tikkubes ao fim de todas as rodadas vence',
    ],
    type: 'physical',
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
  const embateContext = (location.state as any)?.embateContext as
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
    if ((chosenGame as any).type === 'interactive' && (chosenGame as any).appScreen) {
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
            className="flex flex-col items-center gap-6"
            initial={{ opacity: 0, scale: 0.5, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            {/* perspective no pai para o rotateY funcionar corretamente */}
            <div className="w-full max-w-[288px] sm:max-w-xs" style={{ perspective: '600px', overflow: 'visible' }}>
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
