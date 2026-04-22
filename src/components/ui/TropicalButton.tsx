import type { ReactNode } from 'react';
import { COLORS } from '@/lib/tokens';

interface TropicalButtonProps {
  variant: 'primary' | 'secondary' | 'plus' | 'minus';
  size?: 'sm' | 'md' | 'lg';
  children?: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

const PILL_PADDING = {
  sm: { padding: '6px 12px',  fontSize: '0.875rem' },
  md: { padding: '8px 20px',  fontSize: '1rem'     },
  lg: { padding: '12px 24px', fontSize: '1.125rem' },
} as const;

const CIRCLE_SIZE = {
  sm: 36,
  md: 44,
  lg: 52,
} as const;

const SHADOW = {
  sm: '2px 2px 0 #3D2010',
  md: '3px 3px 0 #3D2010',
  lg: '4px 4px 0 #3D2010',
} as const;

export const TropicalButton = ({
  variant,
  size = 'md',
  children,
  onClick,
  disabled = false,
  className = '',
}: TropicalButtonProps) => {
  const isCircular = variant === 'plus' || variant === 'minus';

  const base: React.CSSProperties = {
    fontFamily: 'Fredoka, sans-serif',
    fontWeight: 700,
    border: `3px solid ${COLORS.madeiraEscura}`,
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1,
    transition: 'transform 150ms ease',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const variantStyle: React.CSSProperties = isCircular
    ? {
        width:  CIRCLE_SIZE[size],
        height: CIRCLE_SIZE[size],
        borderRadius: '50%',
        flexShrink: 0,
        fontSize: size === 'sm' ? '1rem' : size === 'lg' ? '1.5rem' : '1.25rem',
        background: variant === 'plus' ? COLORS.menta : COLORS.coral,
        color:      variant === 'plus' ? COLORS.marromProfundo : '#ffffff',
      }
    : {
        borderRadius: '9999px',
        boxShadow: disabled ? 'none' : SHADOW[size],
        background: variant === 'primary' ? COLORS.coral : COLORS.areia,
        color:      variant === 'primary' ? '#ffffff'     : COLORS.coral,
        textShadow: variant === 'primary' ? '0 1px 2px rgba(0,0,0,0.2)' : 'none',
        ...PILL_PADDING[size],
      };

  return (
    <button
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={className}
      style={{ ...base, ...variantStyle }}
      onMouseDown={(e) => { if (!disabled) (e.currentTarget.style.transform = 'scale(0.93)'); }}
      onMouseUp={(e)   => { (e.currentTarget.style.transform = 'scale(1)'); }}
      onMouseLeave={(e) => { (e.currentTarget.style.transform = 'scale(1)'); }}
    >
      {children}
    </button>
  );
};

export default TropicalButton;
