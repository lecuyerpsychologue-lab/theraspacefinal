import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { cn } from '../lib/utils';

interface CardProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  color?: string;
  colSpan?: number;
  rowSpan?: number;
  animate?: boolean;
}

export function Card({
  children,
  onClick,
  className,
  color = 'bg-white',
  colSpan = 1,
  rowSpan = 1,
  animate = true
}: CardProps) {
  const baseStyles = 'rounded-2xl p-6 shadow-sm cursor-pointer overflow-hidden';
  
  const gridStyles = {
    gridColumn: `span ${colSpan}`,
    gridRow: `span ${rowSpan}`
  };
  
  const Component = animate ? motion.div : 'div';
  const animationProps = animate ? {
    whileHover: { scale: 1.02, y: -4 },
    whileTap: { scale: 0.98 },
    transition: { type: 'spring', stiffness: 300, damping: 20 }
  } : {};
  
  return (
    <Component
      onClick={onClick}
      className={cn(baseStyles, color, className)}
      style={gridStyles}
      {...animationProps}
    >
      {children}
    </Component>
  );
}
