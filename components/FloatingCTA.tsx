import React, { useState, useEffect } from 'react';
import { MessageCircle } from 'lucide-react';

interface FloatingCTAProps {
  onClick: () => void;
}

const FloatingCTA: React.FC<FloatingCTAProps> = ({ onClick }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show button after scrolling down 300px
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div 
      className={`fixed bottom-6 right-6 z-40 transition-all duration-500 transform ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
      }`}
    >
      <button
        onClick={onClick}
        className="group relative flex items-center justify-center w-14 h-14 bg-primary-600 text-white rounded-full shadow-lg hover:bg-primary-700 hover:scale-110 hover:shadow-xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-primary-300"
        aria-label="Agendar Turno"
      >
        {/* Pulse Effect */}
        <span className="absolute inset-0 rounded-full bg-primary-400 opacity-75 animate-ping group-hover:animate-none"></span>
        
        {/* Icon */}
        <MessageCircle className="w-7 h-7 relative z-10" />
        
        {/* Tooltip for Desktop */}
        <span className="absolute right-full mr-4 bg-gray-900 text-white text-xs font-bold py-1 px-3 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none hidden md:block">
          Agendar Turno
        </span>
      </button>
    </div>
  );
};

export default FloatingCTA;