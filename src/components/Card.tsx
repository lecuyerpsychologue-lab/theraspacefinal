import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  backgroundColor?: string;
  hoverable?: boolean;
}

export default function Card({ 
  children, 
  onClick, 
  className = '', 
  backgroundColor = 'bg-white',
  hoverable = true
}: CardProps) {
  return (
    <motion.div
      whileHover={hoverable ? { scale: 1.02, y: -4 } : {}}
      whileTap={hoverable && onClick ? { scale: 0.98 } : {}}
      className={`${backgroundColor} rounded-2xl p-6 shadow-lg ${onClick ? 'cursor-pointer' : ''} ${className}`}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
}
