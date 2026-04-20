import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface MotionBounceProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
}

/**
 * MotionBounce - Reusable wrapper with spring bounce entrance animation
 * Perfect for cards, buttons, and UI elements
 */
export const MotionBounce: React.FC<MotionBounceProps> = ({
  children,
  delay = 0,
  duration = 0.6,
  className = '',
}) => {
  return (
    <motion.div
      className={className}
      initial={{
        y: -20,
        opacity: 0,
        scale: 0.95,
      }}
      animate={{
        y: 0,
        opacity: 1,
        scale: 1,
      }}
      transition={{
        type: 'spring',
        stiffness: 260,
        damping: 20,
        delay,
        duration,
      }}
    >
      {children}
    </motion.div>
  );
};
