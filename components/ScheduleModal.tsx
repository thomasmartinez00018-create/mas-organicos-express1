import React, { useState } from 'react';
import { X, MessageCircle, ArrowRight } from 'lucide-react';
import Button from './ui/Button';
import { CONTACT_INFO } from '../constants';

// Add definition for fbq to avoid TS errors
declare global {
  interface Window {
    fbq: any;
  }
}

interface ScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FormData {
  name: string;
  motive: string;
  activityLevel: string;
  availability: string;
}

const ScheduleModal: React.FC<ScheduleModalProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    motive: '',
    activityLevel: '',
    availability: ''
  });

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // --- META PIXEL EVENT TRACKING ---
    // Track Lead event
    if (window.fbq) {
      window.fbq('track', 'Lead');
    }
    
    // Construct the message
    const message = `Hola Kinac! Soy *${formData.name}*.
Busco turno por: *${formData.motive}*.
Mi nivel de actividad es: *${formData.activityLevel}*.
Preferiría ir por la: *${formData.availability}*.

Solicito una evaluación.`;

    // Encode and redirect
    const url = `https://wa.me/${CONTACT_INFO.whatsapp}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="bg-primary-600 px-6 py-4 flex justify-between items-center text-white">
          <div className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5" />
            <h3 className="font-serif font-bold text-lg">Solicitar Evaluación</h3>
          </div>
          <button onClick={onClose} className="hover:bg-primary-700 p-1 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 md:p-8">
          <p className="text-gray-600 mb-6 text-sm md:text-base">
            Para asesorarte mejor, por favor respondé estas 4 preguntas breves antes de conectarte con nuestro equipo por WhatsApp.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Pregunta 1: Nombre */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                1. ¿Cuál es tu nombre completo?
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                placeholder="Ej: Juan Pérez"
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            {/* Pregunta 2: Motivo */}
            <div>
              <label htmlFor="motive" className="block text-sm font-medium text-gray-700 mb-1">
                2. ¿Cuál es el motivo de tu consulta?
              </label>
              <select
                id="motive"
                name="motive"
                required
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all bg-white"
                value={formData.motive}
                onChange={handleChange}
              >
                <option value="" disabled>Seleccioná una opción</option>
                <option value="Dolor o Lesión">Dolor o Lesión Deportiva</option>
                <option value="Post-quirúrgico">Rehabilitación Post-quirúrgica</option>
                <option value="Columna">Dolor de Columna / Postura</option>
                <option value="Clases Grupales">Interés en Clases Grupales</option>
                <option value="Acupuntura">Acupuntura / Bienestar</option>
              </select>
            </div>

            {/* Pregunta 3: Actividad */}
            <div>
              <label htmlFor="activityLevel" className="block text-sm font-medium text-gray-700 mb-1">
                3. ¿Realizás actividad física actualmente?
              </label>
              <select
                id="activityLevel"
                name="activityLevel"
                required
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all bg-white"
                value={formData.activityLevel}
                onChange={handleChange}
              >
                <option value="" disabled>Seleccioná una opción</option>
                <option value="Sedentario">No, soy sedentario/a</option>
                <option value="Recreativo">Sí, de forma recreativa</option>
                <option value="Alto Rendimiento">Sí, entreno alto rendimiento</option>
                <option value="Suspendida por dolor">Suspendida por dolor/lesión</option>
              </select>
            </div>

            {/* Pregunta 4: Disponibilidad */}
            <div>
              <label htmlFor="availability" className="block text-sm font-medium text-gray-700 mb-1">
                4. ¿Qué horario preferís para tu turno?
              </label>
              <select
                id="availability"
                name="availability"
                required
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all bg-white"
                value={formData.availability}
                onChange={handleChange}
              >
                <option value="" disabled>Seleccioná una opción</option>
                <option value="Mañana (8 a 12hs)">Mañana (8:00 a 12:00hs)</option>
                <option value="Tarde (A coordinar)">Tarde (A coordinar)</option>
                <option value="Flexible">Tengo horarios flexibles</option>
              </select>
            </div>

            <div className="pt-2">
              <Button type="submit" className="w-full justify-center">
                Continuar a WhatsApp <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ScheduleModal;