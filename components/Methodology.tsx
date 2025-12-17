import React from 'react';
import { CheckCircle2, GraduationCap, ArrowRight } from 'lucide-react';
import { Reveal } from './ui/Reveal';
import Button from './ui/Button';

interface MethodologyProps {
  onSchedule: () => void;
}

const Methodology: React.FC<MethodologyProps> = ({ onSchedule }) => {
  const benefits = [
    "Atención 1 a 1 en sesiones de 1 hora.",
    "Licenciados UBA especializados.",
    "Aparatología moderna (Magneto, Electro, Ultrasonido).",
    "Ambiente social cálido y motivador."
  ];

  return (
    <section id="metodologia" className="py-16 md:py-24 bg-white overflow-hidden border-t border-gray-100 scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          <div className="relative order-2 lg:order-1">
            <Reveal>
              <div className="grid grid-cols-2 gap-4">
                <div className="h-48 md:h-80 rounded-2xl overflow-hidden shadow-lg border border-gray-100 mt-8 relative group">
                  <img 
                    src="https://i.postimg.cc/s1RGzx8V/video-Silvina-haciendo-masaajes-1.avif" 
                    alt="Licenciada Silvina realizando rehabilitación" 
                    className="w-full h-full object-cover object-center"
                  />
                </div>
                <div className="h-48 md:h-80 rounded-2xl overflow-hidden shadow-lg border border-gray-100 relative group">
                  <img 
                    src="https://i.postimg.cc/G9rtNN8w/image.png" 
                    alt="Paciente recibiendo tratamiento kinesiología hombro" 
                    className="w-full h-full object-cover object-center"
                  />
                </div>
              </div>
              {/* Decorative dots */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-pattern-dots opacity-20 hidden lg:block"></div>
              <div className="absolute -bottom-8 -left-8 w-64 h-64 bg-primary-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 -z-10"></div>
            </Reveal>
          </div>

          <div className="order-1 lg:order-2">
            <Reveal>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-sm font-semibold mb-4">
                <GraduationCap className="w-4 h-4" />
                Equipo Profesional UBA
              </div>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-6">
                Más que un consultorio, <br className="hidden md:block"/>
                <span className="text-primary-700">un lugar de encuentro y bienestar.</span>
              </h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                En Kinac no sos un número. Nuestro equipo de Licenciados se formó en la Universidad de Buenos Aires (UBA) y se especializa en Rehabilitación Deportiva y Terapia Manual.
                <br/><br/>
                Combinamos la rigurosidad clínica en sesiones individuales de 1 hora con la calidez de nuestras actividades grupales, donde los pacientes comparten su recuperación y generan vínculos.
              </p>

              <ul className="space-y-4 mb-8">
                {benefits.map((benefit, idx) => (
                  <li key={idx} className="flex items-start">
                    <CheckCircle2 className="w-6 h-6 text-accent-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-700 font-medium">{benefit}</span>
                  </li>
                ))}
              </ul>

              <Button onClick={onSchedule} className="w-full md:w-auto">
                Conocer al equipo <ArrowRight className="ml-2 w-5 h-5"/>
              </Button>
            </Reveal>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Methodology;