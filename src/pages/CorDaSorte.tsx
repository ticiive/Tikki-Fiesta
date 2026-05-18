import { useState } from "react";
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

interface Aposta {
  playerId: string;
  cor: CorDado;
}

type Fase = 'aposta' | 'bloqueio' | 'revelacao';

const CorDaSorte = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { players, currentRound, totalRounds, isGameOver } =
    (location.state as {
      players: Player[];
      currentRound: number;
      totalRounds: number;
      isGameOver: boolean;
    }) || {};

  const [rolagem, setRolagem] = useState(1);
  const [fase, setFase] = useState<Fase>('aposta');
  const [jogadorAtual, setJogadorAtual] = useState(0);
  const [apostas, setApostas] = useState<Aposta[]>([]);

  if (!location.state) {
    navigate("/");
    return null;
  }

  const player = players[jogadorAtual];
  const proximoJogador = players[jogadorAtual + 1];
  const isUltimoJogador = jogadorAtual === players.length - 1;
  const isUltimaRolagem = rolagem === 3;

  const handleEscolherCor = (cor: CorDado) => {
    setApostas(prev => [...prev, { playerId: player.id, cor }]);
    setFase(isUltimoJogador ? 'revelacao' : 'bloqueio');
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
  };

  const handleEncerrar = () => {
    navigate("/ranking-minigame", {
      state: { players, currentRound, totalRounds, isGameOver },
    });
  };

  /* ── FASE BLOQUEIO ──────────────────────────────────────────────── */
  if (fase === 'bloqueio') {
    return (
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

          <p style={{
            fontFamily: 'Fredoka, sans-serif',
            fontWeight: 700,
            fontSize: '1.25rem',
            color: COLORS.areia,
            lineHeight: 1.4,
          }}>
            Passe o celular para
          </p>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            background: 'rgba(255,255,255,0.06)',
            borderRadius: '16px',
            padding: '12px 20px',
            border: '2px solid rgba(255,255,255,0.1)',
          }}>
            <CharacterAvatar player={proximoJogador} size={48} />
            <span style={{
              fontFamily: 'Fredoka, sans-serif',
              fontWeight: 700,
              fontSize: '1.6rem',
              color: COLORS.ouro,
            }}>
              {proximoJogador?.label}
            </span>
          </div>

          <TropicalButton variant="primary" size="lg" onClick={handleJaTaSegurando}>
            Já tô segurando, revelar 👁️
          </TropicalButton>
        </motion.div>
      </div>
    );
  }

  /* ── FASE REVELAÇÃO ─────────────────────────────────────────────── */
  if (fase === 'revelacao') {
    const apostasComJogador = apostas.map(a => ({
      ...a,
      player: players.find(p => p.id === a.playerId)!,
    }));

    return (
      <div className="h-screen w-screen overflow-y-auto flex flex-col items-center justify-center px-4 py-6">
        <TropicalBackground />

        <motion.div
          key={`revelacao-${rolagem}`}
          initial={{ opacity: 0, scale: 0.88 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 280, damping: 22 }}
          className="relative z-10 w-full max-w-sm flex flex-col items-center gap-4"
        >
          <h2 style={{
            fontFamily: 'Fredoka, sans-serif',
            fontWeight: 700,
            fontSize: '1.5rem',
            color: COLORS.marromProfundo,
            textShadow: '0 1px 0 rgba(255,255,255,0.3)',
            textAlign: 'center',
          }}>
            🎲 Rolagem {rolagem}/3 — Apostas!
          </h2>

          {/* Lista de apostas */}
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {apostasComJogador.map((a, i) => (
              <motion.div
                key={a.playerId}
                initial={{ opacity: 0, x: -24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1, type: 'spring', stiffness: 260, damping: 20 }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  background: 'rgba(244,228,193,0.88)',
                  borderRadius: '14px',
                  padding: '10px 14px',
                  border: `2px solid ${COLORS.madeiraEscura}`,
                  boxShadow: '0 3px 0 rgba(45,27,13,0.35)',
                }}
              >
                <CharacterAvatar player={a.player} size={40} />
                <span style={{
                  flex: 1,
                  fontFamily: 'Fredoka, sans-serif',
                  fontWeight: 700,
                  fontSize: '1rem',
                  color: COLORS.marromProfundo,
                }}>
                  {a.player.label}
                </span>
                <div style={{
                  width: 42,
                  height: 42,
                  borderRadius: '10px',
                  background: a.cor.hex,
                  border: `2px solid ${COLORS.madeiraEscura}`,
                  boxShadow: '2px 2px 0 rgba(45,27,13,0.3)',
                  flexShrink: 0,
                }} />
                <span style={{
                  fontFamily: 'Fredoka, sans-serif',
                  fontSize: '0.8rem',
                  color: COLORS.madeiraMedia,
                  minWidth: '44px',
                }}>
                  {a.cor.label}
                </span>
              </motion.div>
            ))}
          </div>

          {/* Instrução para líder */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: apostas.length * 0.1 + 0.15 }}
            style={{
              width: '100%',
              padding: '10px 16px',
              borderRadius: '12px',
              background: 'rgba(255,215,0,0.2)',
              border: `2px solid ${COLORS.ouro}`,
              textAlign: 'center',
            }}
          >
            <p style={{
              fontFamily: 'Fredoka, sans-serif',
              fontWeight: 700,
              fontSize: '1.05rem',
              color: COLORS.marromProfundo,
            }}>
              🎲 Líder, rola o dado físico!
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: apostas.length * 0.1 + 0.3 }}
          >
            {isUltimaRolagem ? (
              <TropicalButton variant="primary" size="lg" onClick={handleEncerrar}>
                Encerrar minigame 🏁
              </TropicalButton>
            ) : (
              <TropicalButton variant="primary" size="lg" onClick={handleProximaRolagem}>
                Próxima rolagem →
              </TropicalButton>
            )}
          </motion.div>
        </motion.div>
      </div>
    );
  }

  /* ── FASE APOSTA ────────────────────────────────────────────────── */
  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col items-center justify-center px-4 py-6">
      <TropicalBackground />

      <div className="relative z-10 w-full max-w-sm flex flex-col items-center gap-5">

        {/* Badge rolagem */}
        <span style={{
          fontFamily: 'Fredoka, sans-serif',
          fontWeight: 700,
          fontSize: '0.85rem',
          color: COLORS.marromProfundo,
          background: 'rgba(244,228,193,0.75)',
          borderRadius: '999px',
          padding: '4px 14px',
          border: `1px solid ${COLORS.madeiraEscura}`,
        }}>
          Rolagem {rolagem}/3
        </span>

        {/* Card do jogador atual */}
        <div style={{
          background: 'rgba(45,27,13,0.55)',
          borderRadius: '16px',
          border: `2px solid ${COLORS.madeiraEscura}`,
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          padding: '14px 18px',
        }}>
          <p style={{
            fontFamily: 'Fredoka, sans-serif',
            fontSize: '0.8rem',
            color: COLORS.areia,
            opacity: 0.7,
            textAlign: 'center',
            marginBottom: '8px',
          }}>
            Vez de:
          </p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
            <CharacterAvatar player={player} size={44} />
            <span style={{
              fontFamily: 'Fredoka, sans-serif',
              fontWeight: 700,
              fontSize: '1.35rem',
              color: COLORS.areia,
            }}>
              {player.label}
            </span>
          </div>
        </div>

        {/* Instrução */}
        <AnimatePresence mode="wait">
          <motion.div
            key="cores"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            style={{ width: '100%' }}
          >
            <p style={{
              fontFamily: 'Fredoka, sans-serif',
              fontSize: '0.9rem',
              color: COLORS.marromProfundo,
              textAlign: 'center',
              marginBottom: '10px',
              background: 'rgba(244,228,193,0.7)',
              borderRadius: '8px',
              padding: '4px 0',
            }}>
              Escolha uma cor para apostar:
            </p>

            {/* Grid de cores */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              {CORES_DADO.map(cor => (
                <button
                  key={cor.id}
                  onClick={() => handleEscolherCor(cor)}
                  style={{
                    background: cor.hex,
                    borderRadius: '14px',
                    border: `3px solid ${COLORS.madeiraEscura}`,
                    boxShadow: `0 5px 0 rgba(45,27,13,0.45), 0 7px 14px rgba(0,0,0,0.25)`,
                    padding: '16px',
                    fontFamily: 'Fredoka, sans-serif',
                    fontWeight: 700,
                    fontSize: '1.05rem',
                    color: '#fff',
                    textShadow: '0 1px 4px rgba(0,0,0,0.5)',
                    cursor: 'pointer',
                    transition: 'transform 0.1s, box-shadow 0.1s',
                  }}
                  onMouseDown={e => {
                    e.currentTarget.style.transform = 'translateY(3px)';
                    e.currentTarget.style.boxShadow = `0 2px 0 rgba(45,27,13,0.45)`;
                  }}
                  onMouseUp={e => {
                    e.currentTarget.style.transform = '';
                    e.currentTarget.style.boxShadow = `0 5px 0 rgba(45,27,13,0.45), 0 7px 14px rgba(0,0,0,0.25)`;
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = '';
                    e.currentTarget.style.boxShadow = `0 5px 0 rgba(45,27,13,0.45), 0 7px 14px rgba(0,0,0,0.25)`;
                  }}
                >
                  {cor.label}
                </button>
              ))}
            </div>

            {/* Lembrete físico */}
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
