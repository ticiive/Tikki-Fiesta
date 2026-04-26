import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

interface MusicContextValue {
  musicEnabled: boolean;
  volume: number;
  toggleMusic: () => void;
  setVolume: (val: number) => void;
}

const MusicContext = createContext<MusicContextValue | null>(null);

const load = (key: string, fallback: string) => {
  try { return localStorage.getItem(`popboard.${key}`) ?? fallback; } catch { return fallback; }
};

const save = (key: string, val: string) => {
  try { localStorage.setItem(`popboard.${key}`, val); } catch { /* noop */ }
};

export const MusicProvider = ({ children }: { children: ReactNode }) => {
  const [musicEnabled, setMusicEnabled] = useState(() => load("musicEnabled", "true") === "true");
  const [volume, setVolumeState] = useState(() => parseFloat(load("musicVolume", "0.5")));

  const toggleMusic = useCallback(() => {
    setMusicEnabled((prev) => {
      const next = !prev;
      save("musicEnabled", String(next));
      return next;
    });
  }, []);

  const setVolume = useCallback((val: number) => {
    const clamped = Math.min(1, Math.max(0, val));
    setVolumeState(clamped);
    save("musicVolume", String(clamped));
  }, []);

  return (
    <MusicContext.Provider value={{ musicEnabled, volume, toggleMusic, setVolume }}>
      {children}
    </MusicContext.Provider>
  );
};

export const useMusic = () => {
  const ctx = useContext(MusicContext);
  if (!ctx) throw new Error("useMusic must be used inside MusicProvider");
  return ctx;
};
