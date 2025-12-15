import React from 'react';
import { ShoppingBasket } from 'lucide-react';
import { motion } from 'framer-motion';

interface HeaderProps {
  cartItemCount: number;
  onOpenCart: () => void;
}

export const Header: React.FC<HeaderProps> = ({ cartItemCount, onOpenCart }) => {
  const MotionHeader = motion.header as any;
  const MotionSpan = motion.span as any;

  return (
    <MotionHeader 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="relative z-50 bg-secondary/95 backdrop-blur-sm border-b border-primary/10 shadow-lg py-4 px-6"
    >
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <img 
            src="https://i.postimg.cc/LnVSCyWW/BLANCO.png" 
            alt="Más Orgánicos" 
            className="h-20 md:h-28 w-auto object-contain"
          />
        </div>

        <button 
          onClick={onOpenCart}
          className="relative p-3 hover:bg-white/10 rounded-full transition-colors group"
          aria-label="Abrir carrito"
        >
          <ShoppingBasket className="w-8 h-8 md:w-9 md:h-9 text-primary group-hover:text-white transition-colors" />
          {cartItemCount > 0 && (
            <MotionSpan 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute top-0 right-0 bg-accent text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full border-2 border-secondary"
            >
              {cartItemCount}
            </MotionSpan>
          )}
        </button>
      </div>
    </MotionHeader>
  );
};