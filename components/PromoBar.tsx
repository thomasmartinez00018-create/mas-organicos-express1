import React, { useState, useEffect } from 'react';
import { Gift, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

export const PromoBar: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState('');
  const MotionDiv = motion.div as any;

  useEffect(() => {
    // Configurado para el Miércoles 17/12 a las 23:59:59 del año corriente
    const currentYear = new Date().getFullYear();
    const deadline = new Date(`December 17, ${currentYear} 23:59:59`).getTime();

    const updateTimer = () => {
      const now = new Date().getTime();
      const distance = deadline - now;

      if (distance < 0) {
        setTimeLeft('¡Últimas horas!');
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));

      setTimeLeft(`${days}d ${hours}h ${minutes}m`);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 60000); // Actualiza cada minuto para rendimiento
    return () => clearInterval(interval);
  }, []);

  return (
    <MotionDiv 
      initial={{ height: 0 }}
      animate={{ height: 'auto' }}
      className="bg-accent text-white text-xs md:text-sm font-medium py-2 px-4 relative z-[60] overflow-hidden"
    >
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-center gap-2 md:gap-6 text-center">
        <div className="flex items-center gap-2 animate-pulse">
          <Gift className="w-4 h-4 md:w-5 md:h-5" />
          <span className="font-bold uppercase tracking-wider">Bonus Navideño</span>
        </div>
        
        <p>
          Reservá antes del <span className="font-bold underline">Miércoles 17/12</span> y llevate <strong className="text-secondary bg-white/20 px-2 py-0.5 rounded">Maní con Chocolate de Regalo</strong> 🍫
        </p>

        <div className="flex items-center gap-1.5 bg-black/10 px-3 py-1 rounded-full text-xs font-bold">
          <Clock className="w-3 h-3" />
          <span>Quedan: {timeLeft}</span>
        </div>
      </div>
    </MotionDiv>
  );
};