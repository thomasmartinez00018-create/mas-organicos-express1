import React from 'react';
import { Truck, Store } from 'lucide-react';
import { motion } from 'framer-motion';

export const PromoBar: React.FC = () => {
  const MotionDiv = motion.div as any;

  return (
    <MotionDiv 
      initial={{ height: 0 }}
      animate={{ height: 'auto' }}
      className="bg-accent text-white text-xs md:text-sm font-bold py-3 px-4 relative z-[60] overflow-hidden shadow-md"
    >
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-center gap-2 md:gap-12 text-center uppercase tracking-tight">
        <div className="flex items-center gap-2.5">
          <Truck className="w-4 h-4 md:w-5 md:h-5" />
          <span>Envíos a domicilio: Compra mínima desde <strong className="bg-white text-accent px-1.5 py-0.5 rounded shadow-sm">$30.000</strong></span>
        </div>
        
        <div className="hidden md:block w-px h-5 bg-white/30"></div>
        
        <div className="flex items-center gap-2.5">
          <Store className="w-4 h-4 md:w-5 md:h-5" />
          <span>Retiro en Tienda (Pacheco/Benavidez): <strong className="text-secondary-light">¡SIN MÍNIMO DE COMPRA!</strong></span>
        </div>
      </div>
    </MotionDiv>
  );
};