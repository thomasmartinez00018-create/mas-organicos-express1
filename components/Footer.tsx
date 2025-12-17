import React from 'react';
import { MapPin, Phone, Mail, Instagram, MessageCircle } from 'lucide-react';
import { CONTACT_INFO, NAV_LINKS } from '../constants';
import Button from './ui/Button';

interface FooterProps {
  onSchedule: () => void;
}

const Footer: React.FC<FooterProps> = ({ onSchedule }) => {
  return (
    <footer id="ubicacion" className="bg-gray-900 text-gray-300 scroll-mt-24">
      {/* Map Section */}
      <div className="w-full h-80 bg-gray-200 relative">
        <iframe 
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3284.2238497676646!2d-58.4046777!3d-34.5912444!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95bcca9096b79c3d%3A0x6b4f745789a8047!2sDr.%20Norberto%20Quirno%20Costa%201255%2C%20C1425%20CABA!5e0!3m2!1sen!2sar!4v1709920000000!5m2!1sen!2sar" 
          width="100%" 
          height="100%" 
          style={{border:0, filter: 'grayscale(100%) contrast(1.2)'}} 
          allowFullScreen 
          loading="lazy" 
          referrerPolicy="no-referrer-when-downgrade"
          title="Ubicación Kinac Recoleta"
        ></iframe>
        <div className="absolute inset-0 bg-primary-900/10 pointer-events-none"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid md:grid-cols-4 gap-12">
          
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <div className="bg-white rounded-xl p-3 inline-block mb-4">
              <img 
                src="https://i.postimg.cc/Q9t8kqYr/Gemini-Generated-Image-dxal1ddxal1ddxal.png" 
                alt="Kinac Logo" 
                className="h-32 w-auto"
              />
            </div>
            <p className="text-sm mb-6 text-gray-400">
              Kinesiología y Acupuntura en Recoleta. Especialistas en rehabilitación deportiva y columna.
            </p>
            <div className="flex space-x-4">
              <a href="https://www.instagram.com/kinac.kinesio.acu/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors"><Instagram className="w-5 h-5"/></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-serif font-semibold text-white mb-4">Navegación</h4>
            <ul className="space-y-2">
              {NAV_LINKS.map(link => (
                <li key={link.label}>
                  <a href={link.href} className="text-gray-400 hover:text-primary-400 transition-colors text-sm">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-serif font-semibold text-white mb-4">Contacto</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start">
                <MapPin className="w-5 h-5 mr-3 text-primary-500 flex-shrink-0" />
                <span className="max-w-[200px]">{CONTACT_INFO.address}</span>
              </li>
              <li className="flex items-center">
                <Phone className="w-5 h-5 mr-3 text-primary-500 flex-shrink-0" />
                <span>{CONTACT_INFO.phone}</span>
              </li>
              <li className="flex items-center">
                <Mail className="w-5 h-5 mr-3 text-primary-500 flex-shrink-0" />
                <span>{CONTACT_INFO.email}</span>
              </li>
            </ul>
          </div>

          {/* CTA Column */}
          <div className="md:text-right" id="contact">
            <h4 className="text-lg font-serif font-semibold text-white mb-4">Turnos</h4>
            <p className="text-sm text-gray-400 mb-4">
              Respondé 4 preguntas simples para asesorarte mejor.
            </p>
            <Button 
              variant="secondary" 
              className="w-full md:w-auto"
              onClick={onSchedule}
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Solicitar Turno
            </Button>
          </div>

        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} Kinac - Kinesiología y Acupuntura. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;