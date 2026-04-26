import { useEffect, useRef } from "react";
import { useMusic } from "@/contexts/MusicContext";

export const BackgroundMusic = () => {
  const { musicEnabled, volume } = useMusic();
  const audioRef = useRef<HTMLAudioElement>(null);
  const hasInteracted = useRef(false);

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

    if (hasInteracted.current) {
      audio.play().catch(() => {});
      return;
    }

    const handleFirstInteraction = () => {
      hasInteracted.current = true;
      if (musicEnabled) audio.play().catch(() => {});
    };

    window.addEventListener("click", handleFirstInteraction, { once: true });
    window.addEventListener("touchstart", handleFirstInteraction, { once: true });

    return () => {
      window.removeEventListener("click", handleFirstInteraction);
      window.removeEventListener("touchstart", handleFirstInteraction);
    };
  }, [musicEnabled]);

  return (
    <audio
      ref={audioRef}
      src="/audio/background-music.mp3"
      loop
      preload="none"
      onError={() => {}}
    />
  );
};

export default BackgroundMusic;
