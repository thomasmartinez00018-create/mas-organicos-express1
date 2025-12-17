import React from 'react';
import { ArrowRight, Users, Activity } from 'lucide-react';
import { SERVICES } from '../constants';
import { Reveal } from './ui/Reveal';
import Button from './ui/Button';

interface ServicesProps {
  onSchedule: () => void;
}

const Services: React.FC<ServicesProps> = ({ onSchedule }) => {
  const clinicalServices = SERVICES.filter(s => s.category === 'clinical');
  const groupServices = SERVICES.filter(s => s.category === 'group');

  return (
    <>
      {/* Clinical Services Section */}
      <section id="servicios" className="py-16 md:py-24 bg-gray-50 scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <Reveal>
              <div>
                <span className="text-primary-600 font-bold tracking-wide uppercase text-xs font-sans">Consultorio</span>
                <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mt-2">Tratamientos Individuales</h2>
                <p className="mt-4 text-gray-600 max-w-2xl">
                  Sesiones 1 a 1 de 1 hora de duración. Combinamos terapia manual, fisioterapia y acupuntura para resolver tu dolencia.
                </p>
              </div>
            </Reveal>
            <Reveal delay={100}>
              <Button size="sm" variant="outline" onClick={onSchedule}>
                Consultar Disponibilidad
              </Button>
            </Reveal>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {clinicalServices.map((service, index) => (
              <Reveal key={service.id} delay={index * 100}>
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 h-full flex flex-col group relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <service.icon className="w-24 h-24 text-primary-600" />
                  </div>
                  <div className="mb-6">
                    <div className="w-14 h-14 bg-primary-50 rounded-xl flex items-center justify-center text-primary-600 group-hover:bg-primary-600 group-hover:text-white transition-colors duration-300">
                      <service.icon className="w-7 h-7" />
                    </div>
                  </div>
                  <h3 className="text-xl font-serif font-bold text-gray-900 mb-3">{service.title}</h3>
                  <p className="text-gray-600 leading-relaxed mb-6 flex-grow">
                    {service.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Group Classes Section */}
      <section id="clases" className="py-16 md:py-24 bg-white scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16">
            <Reveal>
              <span className="text-accent-600 font-bold tracking-wide uppercase text-xs font-sans">Comunidad Kinac</span>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mt-2 mb-4">Clases y Talleres Grupales</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Espacios de movimiento supervisado para mantenerte sano, activo y en compañía.
              </p>
            </Reveal>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {groupServices.map((service, index) => (
              <Reveal key={service.id} delay={index * 100}>
                <div className="bg-accent-50/50 p-8 rounded-2xl border border-accent-100 hover:border-accent-200 hover:shadow-lg transition-all duration-300 h-full flex flex-col items-center text-center">
                  <div className="mb-6 relative">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-accent-500 shadow-sm z-10 relative">
                      <service.icon className="w-8 h-8" />
                    </div>
                    <div className="absolute inset-0 bg-accent-200 rounded-full blur-xl opacity-20"></div>
                  </div>
                  <h3 className="text-xl font-serif font-bold text-gray-900 mb-3">{service.title}</h3>
                  <p className="text-gray-600 leading-relaxed mb-6">
                    {service.description}
                  </p>
                  <button 
                    onClick={onSchedule}
                    className="mt-auto inline-flex items-center text-accent-600 font-bold hover:text-accent-700 focus:outline-none"
                  >
                    Consultar Horarios <ArrowRight className="ml-2 w-4 h-4" />
                  </button>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Services;