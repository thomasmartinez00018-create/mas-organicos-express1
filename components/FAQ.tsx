import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';
import { FAQS } from '../constants';
import { Reveal } from './ui/Reveal';
import Button from './ui/Button';

interface FAQProps {
  onSchedule: () => void;
}

const FAQ: React.FC<FAQProps> = ({ onSchedule }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <Reveal>
            <h2 className="text-3xl font-serif font-bold text-gray-900 mb-4">Preguntas Frecuentes</h2>
            <p className="text-gray-600">Resolvemos tus dudas antes de la primera visita.</p>
          </Reveal>
        </div>

        <div className="space-y-4 mb-12">
          {FAQS.map((faq, index) => (
            <Reveal key={faq.id} delay={index * 100}>
              <div 
                className={`bg-white rounded-xl border transition-all duration-300 ${openIndex === index ? 'border-primary-500 shadow-md' : 'border-gray-200 hover:border-primary-300'}`}
              >
                <button
                  className="w-full px-6 py-5 flex justify-between items-center focus:outline-none"
                  onClick={() => toggleFAQ(index)}
                >
                  <span className={`font-semibold text-lg text-left ${openIndex === index ? 'text-primary-700' : 'text-gray-800'}`}>
                    {faq.question}
                  </span>
                  {openIndex === index ? (
                    <ChevronUp className="w-5 h-5 text-primary-600" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </button>
                <div 
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="px-6 pb-6 text-gray-600 leading-relaxed">
                    {faq.answer}
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={400}>
            <div className="bg-primary-50 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4 border border-primary-100">
                <div className="flex items-center gap-3">
                    <div className="bg-white p-3 rounded-full text-primary-600 shadow-sm">
                        <HelpCircle className="w-6 h-6"/>
                    </div>
                    <div className="text-center md:text-left">
                        <h4 className="font-bold text-gray-900">¿Tenés otra consulta?</h4>
                        <p className="text-sm text-gray-600">Escribinos directamente por WhatsApp.</p>
                    </div>
                </div>
                <Button variant="outline" size="sm" onClick={onSchedule}>
                    Hacer una pregunta
                </Button>
            </div>
        </Reveal>
      </div>
    </section>
  );
};

export default FAQ;