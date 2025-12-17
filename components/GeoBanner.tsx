import React from 'react';
import { MapPin, Tag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface GeoBannerProps {
  isBenavidez: boolean;
  onToggle: () => void;
}

export const GeoBanner: React.FC<GeoBannerProps> = ({ isBenavidez, onToggle }) => {
  const MotionDiv = motion.div as any;

  return (
    <div className="bg-secondary-light border-y border-white/5 py-4 px-4 relative z-40 shadow-md">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-primary">
          <div className="bg-white/10 p-2 rounded-full">
            <Tag className="w-5 h-5 text-accent" />
          </div>
          <div>
            <p className="font-bold">¿Venís al local de Benavidez? (Av. Perón 4187, Local 5)</p>
            <p className="text-sm opacity-90">Tenés <span className="text-accent font-bold">20% OFF</span> en tu primera compra retirando en persona.</p>
          </div>
        </div>

        <button 
          onClick={onToggle}
          className={`relative flex items-center gap-3 px-5 py-2.5 rounded-full transition-all duration-300 border ${
            isBenavidez 
              ? 'bg-accent text-white border-accent shadow-[0_0_15px_rgba(217,119,6,0.5)]' 
              : 'bg-transparent text-primary border-primary/30 hover:bg-white/5'
          }`}
        >
          <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
             isBenavidez ? 'border-white bg-white' : 'border-primary'
          }`}>
             {isBenavidez && <MapPin className="w-3 h-3 text-accent" />}
          </div>
          <span className="font-medium text-sm">
            {isBenavidez ? '¡20% OFF Activado!' : 'Voy al Local (Activar Descuento)'}
          </span>
        </button>
      </div>
      
      <AnimatePresence>
        {isBenavidez && (
          <MotionDiv 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <p className="text-center text-primary/80 text-xs font-medium mt-2">
              Se aplicará el descuento seleccionando <strong>"Retiro Benavidez"</strong> al finalizar.
            </p>
          </MotionDiv>
        )}
      </AnimatePresence>
    </div>
  );
};