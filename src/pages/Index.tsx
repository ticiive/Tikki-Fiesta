import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { UserPlus } from "lucide-react";
import { TropicalBackground } from "@/components/layout/TropicalBackground";
import { WoodenPanel } from "@/components/layout/WoodenPanel";
import { WoodenCard } from "@/components/ui/WoodenCard";
import { TropicalButton } from "@/components/ui/TropicalButton";
import { CHARACTERS } from "@/data/characters";

const roundOptions = [3, 5, 10];

const CARD_TILTS: Record<string, number> = {
  P1: -3, P2: 2, P3: -1, P4: 4, P5: -2, P6: 3,
};

const visibleCharacters = CHARACTERS.slice(0, 6);

const Index = () => {
  const navigate = useNavigate();
  const [selectedPlayers, setSelectedPlayers] = useState<string[]>([]);
  const [selectedRounds, setSelectedRounds] = useState<number | null>(null);

  const togglePlayer = (id: string) => {
    setSelectedPlayers((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const canStart = selectedPlayers.length >= 2 && selectedRounds !== null;

  const handleStart = () => {
    if (!canStart) return;
    navigate("/game", { state: { players: selectedPlayers, totalRounds: selectedRounds } });
  };

  return (
    <div className="min-h-screen px-[5%] py-[5vh] relative overflow-x-hidden">
      <TropicalBackground />

      <WoodenPanel className="max-w-6xl mx-auto">
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

        {/* ── Grid 3×2 de personagens ──────────────────────────────────── */}
        <div className="grid grid-cols-3 gap-5 mb-8">
          {visibleCharacters.map((char) => {
            const isSelected = selectedPlayers.includes(char.id);
            const tilt = CARD_TILTS[char.id] ?? 0;

            return (
              <button
                key={char.id}
                onClick={() => togglePlayer(char.id)}
                style={{
                  width: '100%',
                  aspectRatio: '1',
                  maxWidth: 160,
                  justifySelf: 'center',
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  cursor: 'pointer',
                }}
              >
                <WoodenCard
                  variant="card"
                  irregularCorners
                  ringColor={isSelected ? char.color : undefined}
                  style={{
                    height: '100%',
                    transform: isSelected
                      ? 'rotate(0deg) scale(1.08)'
                      : `rotate(${tilt}deg) scale(1)`,
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 8,
                      padding: '0.5rem',
                    }}
                  >
                    <div
                      style={{
                        width: 56, height: 56,
                        borderRadius: '50%',
                        border: `3px solid ${char.color}`,
                        boxShadow: isSelected ? `0 0 10px ${char.color}88` : 'none',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.8rem',
                        background: isSelected ? `${char.color}22` : 'rgba(255,255,255,0.12)',
                        transition: 'all 300ms ease',
                      }}
                    >
                      {isSelected ? char.avatar : <UserPlus size={26} color={char.color} />}
                    </div>
                    <span
                      style={{
                        fontFamily: 'Fredoka, sans-serif',
                        fontWeight: 700,
                        fontSize: '1rem',
                        color: isSelected ? char.color : '#FDF5E6',
                        textShadow: '1px 1px 0 rgba(0,0,0,0.5)',
                        transition: 'color 300ms ease',
                      }}
                    >
                      {char.label}
                    </span>
                  </div>
                </WoodenCard>
              </button>
            );
          })}
        </div>

        {/* ── Seleção de rodadas ─────────────────────────────────────── */}
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
                <motion.div
                  key={r}
                  animate={{ y: isSel ? 2 : 0, scale: isSel ? 1.05 : 1 }}
                  whileHover={!isSel ? { y: -2 } : {}}
                  whileTap={{ scale: 0.96 }}
                  transition={{ duration: 0.15 }}
                >
                  <TropicalButton
                    variant={isSel ? 'secondary' : 'primary'}
                    size="md"
                    onClick={() => setSelectedRounds(r)}
                  >
                    {r}
                  </TropicalButton>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* ── Botão Iniciar Partida ─────────────────────────────────── */}
        <motion.div
          whileHover={canStart ? { scale: 1.03, y: -2 } : {}}
          whileTap={canStart ? { scale: 0.97, y: 0 } : {}}
        >
          <TropicalButton
            variant="primary"
            size="lg"
            disabled={!canStart}
            onClick={handleStart}
            className="w-full"
          >
            {canStart ? '🎮 Iniciar Partida' : 'Selecione 2+ jogadores e rodadas'}
          </TropicalButton>
        </motion.div>
      </WoodenPanel>
    </div>
  );
};

export default Index;
