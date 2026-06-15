import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { TropicalBackground } from "@/components/layout/TropicalBackground";
import { TropicalButton } from "@/components/ui/TropicalButton";
import { CharacterAvatar } from "@/components/CharacterAvatar";
import { COLORS } from "@/lib/tokens";
import type { Player } from "@/types/game";

const CORES_DADO = [
  { id: 'verde',    label: 'Verde',    hex: '#22C55E' },
  { id: 'azul',     label: 'Azul',     hex: '#3B82F6' },
  { id: 'amarelo',  label: 'Amarelo',  hex: '#D97706' },
  { id: 'rosa',     label: 'Rosa',     hex: '#EC4899' },
  { id: 'vermelho', label: 'Vermelho', hex: '#EF4444' },
  { id: 'laranja',  label: 'Laranja',  hex: '#F97316' },
] as const;

type CorDado = typeof CORES_DADO[number];
type Fase = 'aposta' | 'bloqueio' | 'rolando' | 'revelacao' | 'fimDeJogo' | 'desempate';
type SubFaseDesempate = 'selecionando' | 'apostando' | 'bloqueio' | 'rolando' | 'revelacao';

interface Aposta {
  playerId: string;
  cor: CorDado;
}

/* ── Helpers de estilo reutilizáveis ──────────────────────────────── */
const cardEscuro: React.CSSProperties = {
  background: 'rgba(45,27,13,0.55)',
  borderRadius: '16px',
  border: `2px solid ${COLORS.madeiraEscura}`,
  boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
  padding: '14px 18px',
};

const badgeRolagem = (txt: string): React.CSSProperties => ({
  fontFamily: 'Fredoka, sans-serif',
  fontWeight: 700,
  fontSize: '0.85rem',
  color: COLORS.marromProfundo,
  background: 'rgba(244,228,193,0.75)',
  borderRadius: '999px',
  padding: '4px 14px',
  border: `1px solid ${COLORS.madeiraEscura}`,
});

const txtAreia = (sz = '1rem'): React.CSSProperties => ({
  fontFamily: 'Fredoka, sans-serif',
  fontWeight: 700,
  fontSize: sz,
  color: COLORS.areia,
});

const txtMarrom = (sz = '1rem'): React.CSSProperties => ({
  fontFamily: 'Fredoka, sans-serif',
  fontWeight: 700,
  fontSize: sz,
  color: COLORS.marromProfundo,
});

/* ── Botão colorido do dado ───────────────────────────────────────── */
const BotaoCor = ({
  cor, onClick, disabled = false, small = false,
}: {
  cor: CorDado;
  onClick: () => void;
  disabled?: boolean;
  small?: boolean;
}) => (
  <button
    disabled={disabled}
    onClick={disabled ? undefined : onClick}
    style={{
      background: cor.hex,
      borderRadius: small ? '10px' : '14px',
      border: `${small ? 2 : 3}px solid ${COLORS.madeiraEscura}`,
      boxShadow: disabled
        ? 'none'
        : `0 ${small ? 3 : 5}px 0 rgba(45,27,13,0.45), 0 ${small ? 4 : 7}px ${small ? 8 : 14}px rgba(0,0,0,0.25)`,
      padding: small ? '8px 10px' : '15px',
      fontFamily: 'Fredoka, sans-serif',
      fontWeight: 700,
      fontSize: small ? '0.82rem' : '1.05rem',
      color: '#fff',
      textShadow: '0 1px 4px rgba(0,0,0,0.5)',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.3 : 1,
      transition: 'transform 0.1s, box-shadow 0.1s',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 2,
    }}
    onMouseDown={e => {
      if (disabled) return;
      e.currentTarget.style.transform = 'translateY(3px)';
      e.currentTarget.style.boxShadow = `0 1px 0 rgba(45,27,13,0.45)`;
    }}
    onMouseUp={e => {
      e.currentTarget.style.transform = '';
      e.currentTarget.style.boxShadow = `0 ${small ? 3 : 5}px 0 rgba(45,27,13,0.45)`;
    }}
    onMouseLeave={e => {
      e.currentTarget.style.transform = '';
      e.currentTarget.style.boxShadow = disabled ? 'none' : `0 ${small ? 3 : 5}px 0 rgba(45,27,13,0.45)`;
    }}
  >
    {cor.label}
    {disabled && (
      <span style={{ fontSize: '0.62rem', opacity: 0.7, fontWeight: 400 }}>Já escolhida</span>
    )}
  </button>
);

/* ── Grid de 6 cores ──────────────────────────────────────────────── */
const GridCores = ({
  onSelect, desabilitadas = new Set(), small = false,
}: {
  onSelect: (cor: CorDado) => void;
  desabilitadas?: Set<string>;
  small?: boolean;
}) => (
  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: small ? '7px' : '10px' }}>
    {CORES_DADO.map(cor => (
      <BotaoCor
        key={cor.id}
        cor={cor}
        small={small}
        disabled={desabilitadas.has(cor.id)}
        onClick={() => onSelect(cor)}
      />
    ))}
  </div>
);

/* ── Tela de bloqueio reutilizável ────────────────────────────────── */
const TelaBloqueio = ({
  proximo, onContinuar,
}: {
  proximo: Player;
  onContinuar: () => void;
}) => (
  <div
    className="h-screen w-screen flex flex-col items-center justify-center px-6"
    style={{ background: '#120800' }}
  >
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.22 }}
      className="flex flex-col items-center gap-7 text-center"
    >
      <span style={{ fontSize: '3.5rem', lineHeight: 1 }}>🔒</span>
      <p style={txtAreia('1.25rem')}>Passe o celular para</p>
      <div style={{
        display: 'flex', alignItems: 'center', gap: '12px',
        background: 'rgba(255,255,255,0.06)',
        borderRadius: '16px', padding: '12px 20px',
        border: '2px solid rgba(255,255,255,0.1)',
      }}>
        <CharacterAvatar player={proximo} size={48} />
        <span style={{ ...txtAreia('1.6rem'), color: COLORS.ouro }}>{proximo.label}</span>
      </div>
      <TropicalButton variant="primary" size="lg" onClick={onContinuar}>
        Já tô segurando, revelar 👁️
      </TropicalButton>
    </motion.div>
  </div>
);

/* ── Tela "rola o dado" reutilizável ──────────────────────────────── */
const TelaRolando = ({ onJaRolei }: { onJaRolei: () => void }) => (
  <div className="h-screen w-screen flex flex-col items-center justify-center px-4">
    <TropicalBackground />
    <motion.div
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      className="relative z-10 flex flex-col items-center gap-5 text-center"
    >
      <motion.span
        animate={{ rotate: [0, -15, 15, -10, 10, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 1.2, repeat: Infinity, repeatDelay: 0.8 }}
        style={{ fontSize: 'clamp(80px, 20vw, 120px)', lineHeight: 1 }}
      >
        🎲
      </motion.span>
      <p style={{
        ...txtMarrom('1.45rem'),
        textShadow: '0 1px 0 rgba(255,255,255,0.35)',
        background: 'rgba(244,228,193,0.8)',
        borderRadius: '12px',
        padding: '8px 16px',
      }}>
        Rola o dado físico AGORA!
      </p>
      <p style={{
        fontFamily: 'Quicksand, sans-serif',
        fontSize: '0.9rem',
        color: COLORS.marromProfundo,
        background: 'rgba(244,228,193,0.6)',
        borderRadius: '8px',
        padding: '4px 12px',
      }}>
        Veja qual cor saiu na vida real
      </p>
      <TropicalButton variant="primary" size="lg" onClick={onJaRolei}>
        ✅ Já rolei, ver as apostas
      </TropicalButton>
    </motion.div>
  </div>
);

/* ══════════════════════════════════════════════════════════════════ */
const COR_KEY = 'tikki-fiesta-cordasorte-state';

const CorDaSorte = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const effectiveState = (location.state as any) ?? (() => {
    try { const s = localStorage.getItem(COR_KEY); return s ? JSON.parse(s) : null; } catch { return null; }
  })();

  const { players, currentRound, totalRounds, isGameOver, playedMinigames = [] } =
    (effectiveState as {
      players: Player[];
      currentRound: number;
      totalRounds: number;
      isGameOver: boolean;
      playedMinigames?: string[];
    }) || {};

  /* ── Estado principal ── */
  const [rolagem, setRolagem] = useState(1);
  const [fase, setFase] = useState<Fase>('aposta');
  const [jogadorAtual, setJogadorAtual] = useState(0);
  const [apostas, setApostas] = useState<Aposta[]>([]);
  const [corRolada, setCorRolada] = useState<CorDado | null>(null);

  /* ── Estado de desempate ── */
  const [empatadoIds, setEmpatadoIds] = useState<Set<string>>(new Set());
  const [subFaseDesempate, setSubFaseDesempate] = useState<SubFaseDesempate>('selecionando');
  const [apostasDesempate, setApostasDesempate] = useState<Aposta[]>([]);
  const [jogadorDesempateIdx, setJogadorDesempateIdx] = useState(0);
  const [corRoladaDesempate, setCorRoladaDesempate] = useState<CorDado | null>(null);

  useEffect(() => {
    if (location.state) {
      try { localStorage.setItem(COR_KEY, JSON.stringify(location.state)); } catch {}
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!effectiveState) { navigate("/game"); return null; }

  const isUltimoJogador = jogadorAtual === players.length - 1;
  const isUltimaRolagem = rolagem === 3;

  /* ── Handlers principais ── */
  const handleEscolherCor = (cor: CorDado) => {
    setApostas(prev => [...prev, { playerId: players[jogadorAtual].id, cor }]);
    setFase(isUltimoJogador ? 'rolando' : 'bloqueio');
  };

  const handleJaTaSegurando = () => {
    setJogadorAtual(prev => prev + 1);
    setFase('aposta');
  };

  const handleProximaRolagem = () => {
    setRolagem(prev => prev + 1);
    setFase('aposta');
    setJogadorAtual(0);
    setApostas([]);
    setCorRolada(null);
  };

  const handleEncerrarMinigame = () => {
    setFase('fimDeJogo');
  };

  const handleIrProRanking = () => {
    navigate('/ranking-minigame', { state: { players, currentRound, totalRounds, isGameOver, playedMinigames } });
  };

  /* ── Handlers de desempate ── */
  const empatadosArr = players.filter(p => empatadoIds.has(p.id));

  const handleToggleEmpatado = (id: string) => {
    setEmpatadoIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const handleIniciarDesempate = () => {
    setApostasDesempate([]);
    setJogadorDesempateIdx(0);
    setCorRoladaDesempate(null);
    setSubFaseDesempate('apostando');
  };

  const handleEscolherCorDesempate = (cor: CorDado) => {
    const playerId = empatadosArr[jogadorDesempateIdx].id;
    setApostasDesempate(prev => [...prev, { playerId, cor }]);
    const isUltimo = jogadorDesempateIdx === empatadosArr.length - 1;
    setSubFaseDesempate(isUltimo ? 'rolando' : 'bloqueio');
  };

  const handleJaTaSegurando_D = () => {
    setJogadorDesempateIdx(prev => prev + 1);
    setSubFaseDesempate('apostando');
  };

  const handleRepetirDesempate = () => {
    setApostasDesempate([]);
    setJogadorDesempateIdx(0);
    setCorRoladaDesempate(null);
    setSubFaseDesempate('apostando');
  };

  /* ══════════════════════════════════════════════════════════════
     RENDERIZAÇÃO POR FASE
  ══════════════════════════════════════════════════════════════ */

  /* ── FASE BLOQUEIO (principal) ───────────────────────────── */
  if (fase === 'bloqueio') {
    return (
      <TelaBloqueio
        proximo={players[jogadorAtual + 1]}
        onContinuar={handleJaTaSegurando}
      />
    );
  }

  /* ── FASE ROLANDO (principal) ────────────────────────────── */
  if (fase === 'rolando') {
    return <TelaRolando onJaRolei={() => setFase('revelacao')} />;
  }

  /* ── FASE REVELAÇÃO (principal) ──────────────────────────── */
  if (fase === 'revelacao') {
    const apostasRich = apostas.map(a => ({
      ...a,
      player: players.find(p => p.id === a.playerId)!,
      acertou: corRolada ? a.cor.id === corRolada.id : null,
    }));

    return (
      <div className="h-screen w-screen overflow-y-auto flex flex-col items-center justify-center px-4 py-6">
        <TropicalBackground />
        <motion.div
          key={`rev-${rolagem}`}
          initial={{ opacity: 0, scale: 0.88 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 280, damping: 22 }}
          className="relative z-10 w-full max-w-sm flex flex-col items-center gap-4"
        >
          <h2 style={{
            ...txtMarrom('1.4rem'),
            textShadow: '0 1px 0 rgba(255,255,255,0.3)',
            background: 'rgba(244,228,193,0.75)',
            borderRadius: '10px',
            padding: '6px 14px',
          }}>
            🎲 Rolagem {rolagem}/3 — Apostas!
          </h2>

          {/* Lista de apostas */}
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {apostasRich.map((a, i) => (
              <motion.div
                key={a.playerId}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.09, type: 'spring', stiffness: 260, damping: 20 }}
                style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  background: 'rgba(244,228,193,0.88)',
                  borderRadius: '13px', padding: '9px 13px',
                  border: `2px solid ${COLORS.madeiraEscura}`,
                  boxShadow: '0 3px 0 rgba(45,27,13,0.3)',
                }}
              >
                <CharacterAvatar player={a.player} size={38} />
                <span style={{ flex: 1, ...txtMarrom('0.95rem') }}>{a.player.label}</span>
                <div style={{
                  width: 38, height: 38, borderRadius: '8px',
                  background: a.cor.hex,
                  border: `2px solid ${COLORS.madeiraEscura}`,
                  boxShadow: '2px 2px 0 rgba(45,27,13,0.25)',
                  flexShrink: 0,
                }} />
                {a.acertou !== null && (
                  <span style={{ fontSize: '1.3rem', marginLeft: 2 }}>
                    {a.acertou ? '✅' : '❌'}
                  </span>
                )}
              </motion.div>
            ))}
          </div>

          {/* Seleção da cor do dado OU botão de ação */}
          <AnimatePresence mode="wait">
            {corRolada === null ? (
              <motion.div
                key="select-cor"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                style={{ width: '100%' }}
              >
                <p style={{
                  ...txtMarrom('0.88rem'),
                  textAlign: 'center', marginBottom: '8px',
                  background: 'rgba(244,228,193,0.7)',
                  borderRadius: '8px', padding: '4px 0',
                }}>
                  Que cor saiu no dado?
                </p>
                <GridCores small onSelect={c => setCorRolada(c)} />
              </motion.div>
            ) : (
              <motion.div
                key="action-btn"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                {isUltimaRolagem ? (
                  <TropicalButton variant="primary" size="lg" onClick={handleEncerrarMinigame}>
                    Encerrar minigame 🏁
                  </TropicalButton>
                ) : (
                  <TropicalButton variant="primary" size="lg" onClick={handleProximaRolagem}>
                    Próxima rolagem →
                  </TropicalButton>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    );
  }

  /* ── FASE FIM DE JOGO ────────────────────────────────────── */
  if (fase === 'fimDeJogo') {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center px-6">
        <TropicalBackground />
        <motion.div
          initial={{ opacity: 0, scale: 0.88 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 22 }}
          className="relative z-10 flex flex-col items-center gap-6 text-center"
        >
          <span style={{ fontSize: '3rem' }}>🏁</span>
          <p style={{
            ...txtMarrom('1.5rem'),
            textShadow: '0 1px 0 rgba(255,255,255,0.3)',
            background: 'rgba(244,228,193,0.8)',
            borderRadius: '12px', padding: '8px 20px',
          }}>
            Minigame encerrado!
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <TropicalButton variant="primary" size="lg" onClick={handleIrProRanking}>
              Ir pro Ranking 🏆
            </TropicalButton>
            <TropicalButton
              variant="secondary"
              size="md"
              onClick={() => { setFase('desempate'); setEmpatadoIds(new Set()); setSubFaseDesempate('selecionando'); }}
            >
              🎲 Teve empate? Rolagem extra
            </TropicalButton>
          </div>
        </motion.div>
      </div>
    );
  }

  /* ══════════════════════════════════════════════════════════
     FASE DESEMPATE (sub-fases)
  ══════════════════════════════════════════════════════════ */
  if (fase === 'desempate') {

    /* ── Sub: selecionando empatados ── */
    if (subFaseDesempate === 'selecionando') {
      return (
        <div className="h-screen w-screen overflow-y-auto flex flex-col items-center justify-center px-4 py-6">
          <TropicalBackground />
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative z-10 w-full max-w-sm flex flex-col items-center gap-4"
          >
            <h2 style={{
              ...txtMarrom('1.35rem'),
              background: 'rgba(244,228,193,0.8)',
              borderRadius: '10px', padding: '6px 14px',
              textAlign: 'center',
            }}>
              🎲 Rolagem Extra de Desempate
            </h2>
            <p style={{
              fontFamily: 'Quicksand, sans-serif',
              fontSize: '0.9rem',
              color: COLORS.marromProfundo,
              background: 'rgba(244,228,193,0.65)',
              borderRadius: '8px', padding: '5px 10px',
              textAlign: 'center',
            }}>
              Selecione os jogadores empatados:
            </p>

            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {players.map(p => {
                const sel = empatadoIds.has(p.id);
                return (
                  <button
                    key={p.id}
                    onClick={() => handleToggleEmpatado(p.id)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '12px',
                      background: sel ? 'rgba(233,30,77,0.18)' : 'rgba(244,228,193,0.75)',
                      borderRadius: '13px', padding: '10px 14px',
                      border: `2px solid ${sel ? COLORS.coral : COLORS.madeiraEscura}`,
                      cursor: 'pointer',
                      transition: 'all 0.15s',
                      boxShadow: sel ? `0 0 0 2px ${COLORS.coral}` : '0 2px 0 rgba(45,27,13,0.25)',
                    }}
                  >
                    <CharacterAvatar player={p} size={38} />
                    <span style={{ flex: 1, ...txtMarrom('1rem'), textAlign: 'left' }}>{p.label}</span>
                    <span style={{ fontSize: '1.3rem' }}>{sel ? '✅' : '⬜'}</span>
                  </button>
                );
              })}
            </div>

            <TropicalButton
              variant="primary"
              size="lg"
              disabled={empatadoIds.size < 2}
              onClick={handleIniciarDesempate}
            >
              Iniciar Desempate →
            </TropicalButton>
            <TropicalButton variant="secondary" size="sm" onClick={() => setFase('fimDeJogo')}>
              ← Voltar
            </TropicalButton>
          </motion.div>
        </div>
      );
    }

    /* ── Sub: apostando no desempate ── */
    if (subFaseDesempate === 'apostando') {
      const playerD = empatadosArr[jogadorDesempateIdx];
      const coresUsadas = new Set(apostasDesempate.map(a => a.cor.id));

      return (
        <div className="h-screen w-screen overflow-hidden flex flex-col items-center justify-center px-4 py-6">
          <TropicalBackground />
          <div className="relative z-10 w-full max-w-sm flex flex-col items-center gap-5">
            <span style={badgeRolagem('')}>Desempate · cada um escolhe 1 cor única</span>

            <div style={cardEscuro}>
              <p style={{ ...txtAreia('0.8rem'), opacity: 0.7, textAlign: 'center', marginBottom: '8px' }}>
                Vez de:
              </p>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                <CharacterAvatar player={playerD} size={44} />
                <span style={txtAreia('1.3rem')}>{playerD.label}</span>
              </div>
            </div>

            <p style={{
              ...txtMarrom('0.9rem'),
              background: 'rgba(244,228,193,0.7)', borderRadius: '8px', padding: '4px 0',
              textAlign: 'center', width: '100%',
            }}>
              Escolha uma cor (cores únicas):
            </p>
            <GridCores onSelect={handleEscolherCorDesempate} desabilitadas={coresUsadas} />
          </div>
        </div>
      );
    }

    /* ── Sub: bloqueio no desempate ── */
    if (subFaseDesempate === 'bloqueio') {
      return (
        <TelaBloqueio
          proximo={empatadosArr[jogadorDesempateIdx + 1]}
          onContinuar={handleJaTaSegurando_D}
        />
      );
    }

    /* ── Sub: rolando no desempate ── */
    if (subFaseDesempate === 'rolando') {
      return <TelaRolando onJaRolei={() => setSubFaseDesempate('revelacao')} />;
    }

    /* ── Sub: revelação no desempate ── */
    if (subFaseDesempate === 'revelacao') {
      const apostasRich = apostasDesempate.map(a => ({
        ...a,
        player: players.find(p => p.id === a.playerId)!,
        acertou: corRoladaDesempate ? a.cor.id === corRoladaDesempate.id : null,
      }));
      const vencedores = apostasDesempate.filter(a => corRoladaDesempate && a.cor.id === corRoladaDesempate.id);
      const vencedorUnico = vencedores.length === 1;

      return (
        <div className="h-screen w-screen overflow-y-auto flex flex-col items-center justify-center px-4 py-6">
          <TropicalBackground />
          <motion.div
            key={`desempate-rev-${apostasDesempate.length}`}
            initial={{ opacity: 0, scale: 0.88 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 280, damping: 22 }}
            className="relative z-10 w-full max-w-sm flex flex-col items-center gap-4"
          >
            <h2 style={{
              ...txtMarrom('1.3rem'),
              background: 'rgba(244,228,193,0.8)',
              borderRadius: '10px', padding: '6px 14px', textAlign: 'center',
            }}>
              🎲 Desempate — Apostas!
            </h2>

            {/* Lista apostas desempate */}
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {apostasRich.map((a, i) => (
                <motion.div
                  key={a.playerId}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.09 }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '10px',
                    background: 'rgba(244,228,193,0.88)',
                    borderRadius: '13px', padding: '9px 13px',
                    border: `2px solid ${COLORS.madeiraEscura}`,
                    boxShadow: '0 3px 0 rgba(45,27,13,0.3)',
                  }}
                >
                  <CharacterAvatar player={a.player} size={38} />
                  <span style={{ flex: 1, ...txtMarrom('0.95rem') }}>{a.player.label}</span>
                  <div style={{
                    width: 38, height: 38, borderRadius: '8px',
                    background: a.cor.hex,
                    border: `2px solid ${COLORS.madeiraEscura}`,
                    flexShrink: 0,
                  }} />
                  {a.acertou !== null && (
                    <span style={{ fontSize: '1.3rem', marginLeft: 2 }}>
                      {a.acertou ? '✅' : '❌'}
                    </span>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Seleção da cor OU resultado */}
            <AnimatePresence mode="wait">
              {corRoladaDesempate === null ? (
                <motion.div
                  key="d-select"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  style={{ width: '100%' }}
                >
                  <p style={{
                    ...txtMarrom('0.88rem'),
                    textAlign: 'center', marginBottom: '8px',
                    background: 'rgba(244,228,193,0.7)',
                    borderRadius: '8px', padding: '4px 0',
                  }}>
                    Que cor saiu no dado?
                  </p>
                  <GridCores small onSelect={c => setCorRoladaDesempate(c)} />
                </motion.div>
              ) : (
                <motion.div
                  key="d-result"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center gap-3"
                  style={{ width: '100%' }}
                >
                  {vencedorUnico ? (
                    <>
                      <div style={{
                        background: 'rgba(255,215,0,0.2)',
                        border: `2px solid ${COLORS.ouro}`,
                        borderRadius: '12px', padding: '10px 16px', textAlign: 'center',
                      }}>
                        <p style={txtMarrom('1.05rem')}>
                          🏆 {players.find(p => p.id === vencedores[0].playerId)?.label} venceu o desempate!
                        </p>
                      </div>
                      <TropicalButton variant="primary" size="lg" onClick={handleIrProRanking}>
                        Ir pro Ranking 🏆
                      </TropicalButton>
                    </>
                  ) : (
                    <>
                      <div style={{
                        background: 'rgba(239,68,68,0.15)',
                        border: `2px solid ${COLORS.alerta}`,
                        borderRadius: '12px', padding: '10px 16px', textAlign: 'center',
                      }}>
                        <p style={txtMarrom('1rem')}>
                          {vencedores.length === 0
                            ? '😬 Ninguém acertou — repete!'
                            : '🤝 Vários acertaram — repete!'}
                        </p>
                      </div>
                      <TropicalButton variant="primary" size="lg" onClick={handleRepetirDesempate}>
                        Rolagem extra novamente 🎲
                      </TropicalButton>
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      );
    }
  }

  /* ── FASE APOSTA (default) ───────────────────────────────── */
  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col items-center justify-center px-4 py-6">
      <TropicalBackground />
      <div className="relative z-10 w-full max-w-sm flex flex-col items-center gap-5">

        <span style={badgeRolagem('')}>Rolagem {rolagem}/3</span>

        <div style={cardEscuro}>
          <p style={{ ...txtAreia('0.8rem'), opacity: 0.7, textAlign: 'center', marginBottom: '8px' }}>
            Vez de:
          </p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
            <CharacterAvatar player={players[jogadorAtual]} size={44} />
            <span style={txtAreia('1.35rem')}>{players[jogadorAtual].label}</span>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key="cores-aposta"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            style={{ width: '100%' }}
          >
            <p style={{
              ...txtMarrom('0.9rem'),
              textAlign: 'center', marginBottom: '10px',
              background: 'rgba(244,228,193,0.7)',
              borderRadius: '8px', padding: '4px 0',
            }}>
              Escolha uma cor para apostar:
            </p>
            <GridCores onSelect={handleEscolherCor} />
            <p style={{
              fontFamily: 'Quicksand, sans-serif',
              fontSize: '0.78rem',
              color: COLORS.marromProfundo,
              textAlign: 'center',
              marginTop: '10px',
              background: 'rgba(244,228,193,0.6)',
              borderRadius: '8px',
              padding: '5px 8px',
              opacity: 0.8,
            }}>
              💡 Lembre de separar seus Tikkubes apostados fisicamente
            </p>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CorDaSorte;
