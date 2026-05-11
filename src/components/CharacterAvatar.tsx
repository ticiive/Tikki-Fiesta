import { useState } from "react";

interface CharacterAvatarProps {
  player: {
    image?: string;
    avatar: string;
    label: string;
  };
  size?: number;
  className?: string;
}

export const CharacterAvatar = ({ player, size = 48, className }: CharacterAvatarProps) => {
  const [showFallback, setShowFallback] = useState(false);

  if (!player.image || showFallback) {
    return (
      <span
        className={className}
        style={{
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
      width={size}
      height={size}
      className={className}
      onError={() => setShowFallback(true)}
      style={{
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
