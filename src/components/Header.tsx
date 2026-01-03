import { motion } from 'framer-motion';
import { AlertCircle } from 'lucide-react';

interface HeaderProps {
  onSOSClick: () => void;
}

export function Header({ onSOSClick }: HeaderProps) {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex justify-between items-center mb-8 px-4 py-6"
    >
      <h1 className="font-playfair text-4xl md:text-5xl font-bold text-warm-black">
        TheraSpace
      </h1>
      
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onSOSClick}
        className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-full font-inter font-medium"
      >
        <AlertCircle size={20} />
        <span>SOS</span>
      </motion.button>
    </motion.header>
  );
}
