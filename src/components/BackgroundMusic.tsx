import { useEffect, useRef } from "react";
import { useMusic } from "@/contexts/MusicContext";

export const BackgroundMusic = () => {
  const { musicEnabled, volume } = useMusic();
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = volume;
  }, [volume]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (!musicEnabled) {
      audio.pause();
      return;
    }

    const tryPlay = () => {
      audio.play().catch(() => {});
    };

    tryPlay();

    const events = ["click", "touchstart", "keydown"] as const;
    const handler = () => {
      tryPlay();
      events.forEach((e) => window.removeEventListener(e, handler));
    };
    events.forEach((e) => window.addEventListener(e, handler));

    return () => {
      events.forEach((e) => window.removeEventListener(e, handler));
    };
  }, [musicEnabled]);

  return (
    <audio
      ref={audioRef}
      src={`${import.meta.env.BASE_URL}audio/background-music.mp3`}
      loop
      preload="none"
      onError={() => {}}
    />
  );
};

export default BackgroundMusic;
