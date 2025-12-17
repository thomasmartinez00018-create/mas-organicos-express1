import React, { useEffect, useRef, useState } from 'react';

interface RevealProps {
  children: React.ReactNode;
  width?: "fit-content" | "100%";
  delay?: number;
  priority?: boolean; // Prop para forzar carga inmediata (Hero)
}

export const Reveal: React.FC<RevealProps> = ({ 
  children, 
  width = "100%", 
  delay = 0, 
  priority = false 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Si es prioritario (como el Hero), mostramos inmediatamente
    // Usamos un pequeño timeout para permitir que React renderice y se vea la transición
    if (priority) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 100); 
      return () => clearTimeout(timer);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { 
        threshold: 0.1, // Solo requiere 10% visible
        rootMargin: "0px 0px -50px 0px" 
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    // Failsafe: Si por alguna razón el observer falla (pestaña en background, etc),
    // forzamos la visibilidad después de 1.5 segundos para evitar pantallas en blanco.
    const failsafe = setTimeout(() => {
      setIsVisible(true);
    }, 1500);

    return () => {
      if (ref.current) observer.unobserve(ref.current);
      clearTimeout(failsafe);
    };
  }, [priority]);

  return (
    <div ref={ref} style={{ width }} className="relative overflow-hidden">
      <div
        className={`transition-all duration-1000 ease-out transform ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
        style={{ transitionDelay: `${delay}ms` }}
      >
        {children}
      </div>
    </div>
  );
};