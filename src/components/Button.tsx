import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  className?: string;
  disabled?: boolean;
}

export default function Button({ 
  children, 
  onClick, 
  variant = 'primary', 
  className = '',
  disabled = false
}: ButtonProps) {
  const baseClasses = 'px-6 py-3 rounded-xl font-medium transition-all duration-200';
  
  const variantClasses = {
    primary: 'bg-brun-terreux text-white hover:bg-opacity-90',
    secondary: 'bg-beige text-noir-chaud hover:bg-opacity-80 border-2 border-brun-terreux',
    outline: 'bg-transparent text-brun-terreux border-2 border-brun-terreux hover:bg-brun-terreux hover:text-white',
    danger: 'bg-red-500 text-white hover:bg-red-600'
  };

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      className={`${baseClasses} ${variantClasses[variant]} ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </motion.button>
  );
}
