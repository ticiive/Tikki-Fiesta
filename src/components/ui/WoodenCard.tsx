import type { ReactNode, CSSProperties } from 'react';
import { cn } from '@/lib/utils';
import { COLORS, WOOD_BG, WOOD_INSET_MAIN, WOOD_INSET_CARD } from '@/lib/tokens';

interface WoodenCardProps {
  variant: 'main' | 'card';
  ringColor?: string;
  irregularCorners?: boolean;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}

export const WoodenCard = ({ variant, ringColor, irregularCorners, children, className, style }: WoodenCardProps) => {
  const isMain = variant === 'main';

  const projectedShadow = isMain
    ? `0 12px 0 rgba(45,27,13,0.8), 0 16px 30px rgba(45,27,13,0.4)`
    : `4px 6px 0 rgba(45,27,13,0.55)`;

  const ringShadow = ringColor ? `, 0 0 12px ${ringColor}66` : '';

  const boxShadow = isMain
    ? `${WOOD_INSET_MAIN}, ${projectedShadow}${ringShadow}`
    : `${WOOD_INSET_CARD}, ${projectedShadow}${ringShadow}`;

  const borderRadius = irregularCorners
    ? '20px 28px 24px 32px'
    : isMain ? '1.5rem' : '1rem';

  const cardStyle: CSSProperties = {
    background:   WOOD_BG,
    border:       `${isMain ? 10 : 4}px solid ${COLORS.madeiraEscura}`,
    borderRadius,
    boxShadow,
    outline:      ringColor ? `3px solid ${ringColor}` : 'none',
    outlineOffset: ringColor ? '-3px' : '0',
    transition:   'outline 300ms ease, box-shadow 300ms ease, transform 300ms ease',
    ...style,
  };

  return (
    <div className={cn('relative', className)} style={cardStyle}>
      <div className="relative" style={{ zIndex: 1 }}>
        {children}
      </div>
    </div>
  );
};

export default WoodenCard;
