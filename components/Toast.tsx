import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, ShoppingBag } from 'lucide-react';

interface ToastProps {
  message: string;
  isVisible: boolean;
  onClose: () => void;
  onOpenCart: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, isVisible, onClose, onOpenCart }) => {
  const MotionDiv = motion.div as any;

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(onClose, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  return (
    <AnimatePresence>
      {isVisible && (
        <MotionDiv
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[80] flex items-center gap-4 bg-secondary text-white px-6 py-4 rounded-xl shadow-2xl shadow-secondary/40 border border-white/10 min-w-[320px] max-w-[90vw]"
        >
          <div className="bg-green-500 rounded-full p-1">
            <CheckCircle className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <p className="font-bold text-sm">{message}</p>
            <button 
              onClick={onOpenCart}
              className="text-xs text-accent hover:text-white underline mt-0.5 font-medium transition-colors"
            >
              Ver mi pedido
            </button>
          </div>
          <button 
            onClick={onOpenCart}
            className="bg-white/10 hover:bg-white/20 p-2 rounded-lg transition-colors"
          >
            <ShoppingBag className="w-5 h-5" />
          </button>
        </MotionDiv>
      )}
    </AnimatePresence>
  );
};