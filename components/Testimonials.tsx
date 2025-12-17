import React from 'react';
import { Star, Quote } from 'lucide-react';
import { TESTIMONIALS } from '../constants';
import { Reveal } from './ui/Reveal';

const Testimonials: React.FC = () => {
  return (
    <section className="py-16 md:py-24 bg-primary-900 text-white relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10 pointer-events-none">
        <div className="absolute top-10 right-10 w-96 h-96 bg-primary-400 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 left-10 w-72 h-72 bg-accent-500 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12 md:mb-16">
          <Reveal>
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">Historias de Recuperación</h2>
            <p className="text-primary-100 text-lg max-w-2xl mx-auto">
              La confianza de nuestros pacientes es nuestra mejor carta de presentación.
            </p>
          </Reveal>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((t, index) => (
            <Reveal key={t.id} delay={index * 150}>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/10 hover:bg-white/15 transition-colors">
                <div className="mb-6">
                  <div className="flex gap-1 text-accent-400 mb-4">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-current" />
                    ))}
                  </div>
                  <Quote className="w-10 h-10 text-primary-300 opacity-50" />
                </div>
                <p className="text-lg text-gray-100 mb-6 italic font-serif">"{t.content}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary-200 flex items-center justify-center text-primary-900 font-bold">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-white">{t.name}</h4>
                    <p className="text-sm text-primary-200">{t.role}</p>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <div className="mt-12 md:mt-16 flex justify-center">
            <Reveal delay={400}>
                <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-lg">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg" alt="Google" className="h-5" />
                    <div className="flex text-yellow-500">
                        <Star className="w-4 h-4 fill-current"/>
                        <Star className="w-4 h-4 fill-current"/>
                        <Star className="w-4 h-4 fill-current"/>
                        <Star className="w-4 h-4 fill-current"/>
                        <Star className="w-4 h-4 fill-current"/>
                    </div>
                    <span className="text-gray-800 font-bold text-sm">4.9 de 120 reseñas</span>
                </div>
            </Reveal>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;