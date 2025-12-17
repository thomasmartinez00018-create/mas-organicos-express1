import React from 'react';
import { motion } from 'framer-motion';
import { ArrowDown } from 'lucide-react';

export const Hero: React.FC = () => {
  const scrollToProducts = () => {
    document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' });
  };

  const MotionSpan = motion.span as any;
  const MotionH1 = motion.h1 as any;
  const MotionP = motion.p as any;
  const MotionButton = motion.button as any;

  return (
    <section className="relative h-[85vh] flex items-center justify-center overflow-hidden bg-secondary">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://i.postimg.cc/pVnSQStF/Gemini-Generated-Image-mp41cjmp41cjmp41.png" 
          alt="Pan Dulce Artesanal en mesa rústica" 
          className="w-full h-full object-cover"
        />
        {/* Capas de oscurecimiento para garantizar legibilidad */}
        <div className="absolute inset-0 bg-secondary/50 mix-blend-multiply"></div>
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <MotionSpan 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="inline-block px-4 py-1 mb-4 rounded-full bg-accent/90 text-white text-sm font-bold uppercase tracking-wider backdrop-blur-md"
        >
          Edición Limitada 2025
        </MotionSpan>
        
        <MotionH1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="font-serif text-5xl md:text-7xl font-bold text-primary mb-6 leading-tight drop-shadow-lg"
        >
          Navidad Real.<br/>
          <span className="text-white/90 font-normal italic text-4xl md:text-6xl">Sin conservantes, sin estrés.</span>
        </MotionH1>

        <MotionP 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-primary/90 text-lg md:text-xl mb-8 max-w-2xl mx-auto font-sans font-medium"
        >
          Reservá tus Packs Navideños y asegurá tu stock de alimentos orgánicos.
        </MotionP>

        <MotionButton 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8 }}
          onClick={scrollToProducts}
          className="bg-accent hover:bg-accent/90 text-white text-lg font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all flex items-center gap-2 mx-auto"
        >
          Ver Packs Navideños
          <ArrowDown className="w-5 h-5" />
        </MotionButton>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-primary to-transparent z-10"></div>
    </section>
  );
};