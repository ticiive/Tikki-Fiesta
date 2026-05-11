import { useState } from "react";

interface CharacterAvatarProps {
  player: {
    image?: string;
    avatar: string;
    label: string;
  };
  size?: number;
  className?: string;
  fill?: boolean;
}

export const CharacterAvatar = ({ player, size = 48, className, fill = false }: CharacterAvatarProps) => {
  const [showFallback, setShowFallback] = useState(false);

  if (!player.image || showFallback) {
    return (
      <span
        className={className}
        style={fill ? {
          fontSize: 'clamp(2rem, 8vw, 5rem)',
          lineHeight: 1,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
        } : {
          fontSize: size * 0.7,
          lineHeight: 1,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: size,
          height: size,
        }}
      >
        {player.avatar}
      </span>
    );
  }

  return (
    <img
      src={`${import.meta.env.BASE_URL}${player.image}`}
      alt={player.label}
      {...(fill ? {} : { width: size, height: size })}
      className={className}
      onError={() => setShowFallback(true)}
      style={fill ? {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
      } : {
        width: size,
        height: size,
        borderRadius: '50%',
        objectFit: 'cover',
        flexShrink: 0,
      }}
    />
  );
};

export default CharacterAvatar;
