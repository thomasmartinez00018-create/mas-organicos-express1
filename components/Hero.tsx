import React from 'react';
import { Star, MapPin } from 'lucide-react';
import Button from './ui/Button';
import { Reveal } from './ui/Reveal';

interface HeroProps {
  onSchedule: () => void;
}

const Hero: React.FC<HeroProps> = ({ onSchedule }) => {
  return (
    <section className="relative pt-28 pb-16 lg:pt-40 lg:pb-28 overflow-hidden bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          
          {/* Left: Copy (Mobile: Order 1, Desktop: Order 1) */}
          <div className="order-1 flex flex-col items-center lg:items-start text-center lg:text-left">
            <Reveal priority>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-50 text-primary-700 text-sm font-semibold mb-6 border border-primary-100">
                <MapPin className="w-4 h-4" />
                <span>Recoleta, Buenos Aires</span>
              </div>
            </Reveal>

            <Reveal delay={100} priority>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-gray-900 leading-tight mb-6">
                Recuperá tu movimiento, <span className="text-primary-600">potenciá tu bienestar.</span>
              </h1>
            </Reveal>

            <Reveal delay={200} priority>
              <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-lg leading-relaxed font-light">
                Rehabilitación Deportiva, Kinesiología 1 a 1 y Clases de Movimiento. 
                Un espacio profesional y social donde volver a entrenar sin miedo.
              </p>
            </Reveal>

            <Reveal delay={300} priority>
              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                <Button 
                  size="lg" 
                  className="w-full sm:w-auto shadow-xl shadow-primary-900/10" 
                  onClick={onSchedule}
                >
                  Solicitar Evaluación
                </Button>
              </div>
            </Reveal>

            <Reveal delay={400} priority>
              <div className="mt-8 flex items-center gap-4">
                <div className="flex -space-x-2">
                  {[1,2,3,4].map(i => (
                     <img key={i} className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover" src={`https://picsum.photos/seed/kinac${i}/100/100`} alt="user" />
                  ))}
                  <div className="h-8 w-8 rounded-full bg-gray-100 ring-2 ring-white flex items-center justify-center text-xs font-bold text-gray-500">+</div>
                </div>
                <div className="text-sm">
                  <div className="flex text-accent-500 mb-0.5">
                    {[1,2,3,4,5].map(i => <Star key={i} className="w-3 h-3 fill-current" />)}
                  </div>
                  <p className="font-medium text-gray-700">Comunidad Activa</p>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Right: Image (Mobile: Order 2, Desktop: Order 2) */}
          <div className="order-2 relative mt-8 lg:mt-0">
            <Reveal delay={200} priority>
              <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-video md:aspect-auto md:h-[600px] border-4 border-white ring-1 ring-gray-100">
                 {/* Raw image, no filters */}
                 <img 
                   src="https://i.postimg.cc/DmK4h0Dw/Video-recorriendo-la-sala-de-ejercicio-2.avif" 
                   alt="Sala de ejercicios Kinac Recoleta" 
                   className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                 />
              </div>
              
              {/* Floating Card */}
              <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-xl hidden md:block border border-gray-100 z-20">
                 <div className="flex items-center gap-3">
                   <div className="bg-primary-50 p-2 rounded-lg">
                     <Star className="w-6 h-6 text-primary-600 fill-primary-600" />
                   </div>
                   <div>
                     <p className="text-sm text-gray-500 font-medium">Equipamiento Moderno</p>
                     <p className="text-lg font-bold text-gray-900 font-serif">Espacio Profesional</p>
                   </div>
                 </div>
              </div>
            </Reveal>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;