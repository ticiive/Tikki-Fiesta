import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { useMusic } from "@/contexts/MusicContext";
import { COLORS } from "@/lib/tokens";

interface ConfiguracoesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ConfiguracoesModal = ({ isOpen, onClose }: ConfiguracoesModalProps) => {
  const { musicEnabled, volume, toggleMusic, setVolume } = useMusic();

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent
        className="max-w-sm w-[92vw] p-0 border-0 bg-transparent shadow-none overflow-visible"
        style={{ borderRadius: '28px 36px 24px 40px' }}
      >
        {/* WoodenPanel inline — evita importar WoodenPanel e perder border-radius do DialogContent */}
        <div
          style={{
            borderRadius: '28px 36px 24px 40px',
            border: `10px solid ${COLORS.madeiraEscura}`,
            background: [
              'linear-gradient(135deg, rgba(93,58,26,0.4) 0%, transparent 40%)',
              `linear-gradient(90deg, ${COLORS.madeiraMedia} 0%, ${COLORS.madeiraClara} 50%, ${COLORS.madeiraMedia} 100%)`,
            ].join(', '),
            boxShadow: [
              'inset 0 0 0 4px #6D4A22',
              `inset 0 0 0 8px ${COLORS.madeiraMedia}`,
              'inset 0 0 40px rgba(45,27,13,0.3)',
              '0 12px 0 rgba(45,27,13,0.8)',
              '0 16px 30px rgba(45,27,13,0.4)',
            ].join(', '),
            padding: '1.5rem 1.25rem 1.25rem',
            position: 'relative',
          }}
        >
          {/* Título */}
          <DialogTitle
            className="text-center mb-5"
            style={{
              fontFamily: 'Fredoka, sans-serif',
              fontWeight: 700,
              fontSize: 'clamp(1.3rem, 4vw, 1.75rem)',
              color: COLORS.marromProfundo,
            }}
          >
            ⚙️ Configurações
          </DialogTitle>

          <div className="flex flex-col gap-5">
            {/* Seção Música */}
            <div
              className="rounded-xl px-4 py-4 flex flex-col gap-4"
              style={{
                background: 'rgba(244,228,193,0.55)',
                border: `1.5px solid ${COLORS.madeiraEscura}`,
              }}
            >
              {/* Toggle */}
              <div className="flex items-center justify-between gap-4">
                <div className="flex flex-col gap-0.5">
                  <span
                    style={{
                      fontFamily: 'Fredoka, sans-serif',
                      fontWeight: 700,
                      fontSize: 'clamp(0.95rem, 3vw, 1.1rem)',
                      color: COLORS.marromProfundo,
                    }}
                  >
                    🎵 Música de fundo
                  </span>
                  <span
                    style={{
                      fontFamily: 'Quicksand, sans-serif',
                      fontSize: '0.78rem',
                      color: COLORS.marromProfundo,
                      opacity: 0.65,
                    }}
                  >
                    {musicEnabled ? 'Ligada' : 'Desligada'}
                  </span>
                </div>
                <Switch
                  checked={musicEnabled}
                  onCheckedChange={toggleMusic}
                  aria-label="Ativar música de fundo"
                  style={
                    {
                      background: musicEnabled ? COLORS.turquoise : undefined,
                    } as React.CSSProperties
                  }
                />
              </div>

              {/* Slider de volume */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span
                    style={{
                      fontFamily: 'Fredoka, sans-serif',
                      fontWeight: 600,
                      fontSize: 'clamp(0.85rem, 2.5vw, 0.95rem)',
                      color: COLORS.marromProfundo,
                      opacity: musicEnabled ? 1 : 0.4,
                    }}
                  >
                    🔊 Volume
                  </span>
                  <span
                    style={{
                      fontFamily: 'Fredoka, sans-serif',
                      fontSize: '0.85rem',
                      color: COLORS.marromProfundo,
                      opacity: musicEnabled ? 0.75 : 0.3,
                    }}
                  >
                    {Math.round(volume * 100)}%
                  </span>
                </div>
                <Slider
                  min={0}
                  max={100}
                  step={1}
                  value={[Math.round(volume * 100)]}
                  onValueChange={([val]) => setVolume(val / 100)}
                  disabled={!musicEnabled}
                  className="w-full"
                  style={{ opacity: musicEnabled ? 1 : 0.35 }}
                />
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ConfiguracoesModal;
