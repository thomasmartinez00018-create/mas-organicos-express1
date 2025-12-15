import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Check, Loader2, Sparkles } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { Product } from '../types';

interface NutriBotProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
  isBenavidez: boolean;
}

type Step = 'intro' | 'guests' | 'preference' | 'result';

export const NutriBot: React.FC<NutriBotProps> = ({ products, onAddToCart, isBenavidez }) => {
  const [step, setStep] = useState<Step>('intro');
  const [guests, setGuests] = useState<string>('');
  const [preference, setPreference] = useState<string>('');
  const [recommendedId, setRecommendedId] = useState<string>('');
  const [aiReason, setAiReason] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  // Fallback logic in case AI fails
  const getFallbackRecommendation = (pref: string): string => {
    if (pref === 'Vegano') {
      const veggie = products.find(p => 
        p.name.toLowerCase().includes('veggie') || 
        p.name.toLowerCase().includes('huerta')
      );
      return veggie ? veggie.id : (products[0]?.id || '1');
    } else {
      const family = products.find(p => 
        p.name.toLowerCase().includes('familiar') || 
        p.name.toLowerCase().includes('gran pack')
      );
      return family ? family.id : (products[0]?.id || '1');
    }
  };

  const handleRecommend = async (pref: string) => {
    setPreference(pref);
    setIsLoading(true); // Start loading UI
    
    try {
      // 1. Initialize AI
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      // 2. Prepare Context for the AI
      // We send a simplified list of products to save tokens and context
      const productContext = products.map(p => ({
        id: p.id,
        name: p.name,
        desc: p.description,
        price: p.price,
        cat: p.category
      }));

      // 3. Generate Content
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `
          Actúa como un vendedor experto de "Más Orgánicos Express".
          Tienes el siguiente catálogo de productos en JSON: ${JSON.stringify(productContext)}.
          
          El cliente necesita una cena navideña para: ${guests}.
          Su preferencia dietética es: ${pref}.
          
          Tu tarea:
          1. Analiza qué producto del catálogo se ajusta mejor.
          2. Devuelve un JSON con el ID del producto y una frase vendedora corta y persuasiva (max 20 palabras) explicando por qué es la mejor opción.
          
          Formato de respuesta JSON esperado:
          {
            "recommendedId": "ID_DEL_PRODUCTO",
            "reason": "Texto persuasivo aquí"
          }
        `,
        config: {
          responseMimeType: "application/json",
          temperature: 0.4 // Low temperature for consistent logic
        }
      });

      // 4. Parse Response
      const resultText = response.text;
      if (!resultText) throw new Error("Empty AI response");
      
      const resultJson = JSON.parse(resultText);
      
      // Validate that the ID actually exists in our current products
      const exists = products.find(p => p.id === resultJson.recommendedId);
      
      if (exists) {
        setRecommendedId(resultJson.recommendedId);
        setAiReason(resultJson.reason);
      } else {
        throw new Error("AI recommended a non-existent ID");
      }

    } catch (error) {
      console.warn("AI recommendation failed, using fallback logic:", error);
      // Fail-safe mechanism
      const fallbackId = getFallbackRecommendation(pref);
      setRecommendedId(fallbackId);
      setAiReason("Basado en tu selección, esta es nuestra mejor opción para asegurar una mesa completa.");
    } finally {
      setIsLoading(false);
      setStep('result');
    }
  };

  const recommendedProduct = products.find(p => p.id === recommendedId);

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, x: -20, transition: { duration: 0.3 } }
  };

  const MotionDiv = motion.div as any;

  return (
    <section className="py-12 px-4 max-w-4xl mx-auto">
      <div className="bg-secondary text-primary rounded-3xl shadow-2xl overflow-hidden relative border border-white/10">
        {/* Decorative background */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-accent/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
        
        <div className="p-8 md:p-12 relative z-10">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-10">
            <div className="bg-white/10 p-4 rounded-2xl shadow-inner border border-white/5">
               <img 
                 src="https://i.postimg.cc/v4HsprR2/LOGOMG-(1).png" 
                 alt="Icono" 
                 className="w-20 h-20 md:w-24 md:h-24 object-contain" 
               />
            </div>
            <div>
              <h2 className="text-3xl md:text-4xl font-serif font-bold mb-2 flex items-center gap-3">
                Nutri-Bot AI <Sparkles className="w-6 h-6 text-accent animate-pulse"/>
              </h2>
              <p className="opacity-80 text-lg">Tu asistente inteligente para las fiestas.</p>
            </div>
          </div>

          <div className="min-h-[220px]">
            <AnimatePresence mode="wait">
              {step === 'intro' && (
                <MotionDiv
                  key="intro"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="space-y-8"
                >
                  <p className="text-xl md:text-3xl font-medium leading-relaxed max-w-2xl">
                    ¿No sabés qué pedir? Nuestra IA analiza el stock en tiempo real para recomendarte lo mejor.
                  </p>
                  <button 
                    onClick={() => setStep('guests')}
                    className="bg-primary text-secondary px-10 py-5 rounded-2xl font-bold text-xl hover:bg-primary/90 transition-all flex items-center gap-3 shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
                  >
                    Comenzar <ArrowRight className="w-6 h-6" />
                  </button>
                </MotionDiv>
              )}

              {step === 'guests' && (
                <MotionDiv
                  key="guests"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="space-y-8"
                >
                  <h3 className="text-2xl md:text-3xl font-medium">¿Cuántos son en la cena navideña?</h3>
                  <div className="flex flex-wrap gap-4">
                    {['2-4 personas', '5-10 personas', '+10 personas'].map((opt) => (
                      <button
                        key={opt}
                        onClick={() => { setGuests(opt); setStep('preference'); }}
                        className="border-2 border-primary/30 hover:bg-accent hover:border-accent hover:text-white px-8 py-5 rounded-xl transition-all text-xl font-medium"
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </MotionDiv>
              )}

              {step === 'preference' && !isLoading && (
                <MotionDiv
                  key="preference"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="space-y-8"
                >
                  <h3 className="text-2xl md:text-3xl font-medium">¿Qué preferencia tienen?</h3>
                  <div className="flex flex-wrap gap-4">
                    {['Tradicional', 'Vegano', 'Mix Saludable'].map((opt) => (
                      <button
                        key={opt}
                        onClick={() => handleRecommend(opt)}
                        className="border-2 border-primary/30 hover:bg-accent hover:border-accent hover:text-white px-8 py-5 rounded-xl transition-all text-xl font-medium"
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </MotionDiv>
              )}

              {isLoading && (
                 <MotionDiv
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center h-full py-12 space-y-4"
                 >
                    <Loader2 className="w-12 h-12 animate-spin text-accent" />
                    <p className="text-xl font-medium animate-pulse">Analizando las mejores opciones...</p>
                 </MotionDiv>
              )}

              {step === 'result' && recommendedProduct && !isLoading ? (
                <MotionDiv
                  key="result"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="bg-secondary-light/40 rounded-3xl p-6 md:p-8 border border-primary/10 backdrop-blur-md"
                >
                  <div className="mb-4 flex items-center gap-2 text-accent">
                    <Sparkles className="w-4 h-4" />
                    <p className="font-bold text-sm uppercase tracking-widest">Recomendación Personalizada</p>
                  </div>
                  
                  <div className="flex flex-col md:flex-row gap-8 items-center">
                    <img 
                      src={recommendedProduct.image} 
                      alt={recommendedProduct.name}
                      className="w-40 h-40 object-cover rounded-2xl shadow-xl ring-4 ring-primary/10" 
                    />
                    <div className="flex-1 text-center md:text-left space-y-3">
                      <h3 className="text-2xl md:text-4xl font-serif font-bold leading-tight">{recommendedProduct.name}</h3>
                      
                      {/* AI Reason Display */}
                      <div className="bg-primary/10 p-3 rounded-lg border-l-4 border-accent">
                        <p className="text-primary italic font-medium">"{aiReason}"</p>
                      </div>

                      <p className="text-primary/80 text-sm leading-relaxed">{recommendedProduct.description}</p>
                      
                      <div className="flex flex-col md:flex-row items-center md:items-baseline gap-3 mt-2">
                        {isBenavidez && (
                          <span className="text-xl text-primary/60 line-through">
                            ${recommendedProduct.price.toLocaleString()}
                          </span>
                        )}
                        <span className="text-4xl font-bold text-accent">
                          ${(isBenavidez ? recommendedProduct.price * 0.8 : recommendedProduct.price).toLocaleString()}
                        </span>
                        {isBenavidez && (
                          <span className="text-sm bg-accent text-white px-2 py-1 rounded font-bold">20% OFF</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="mt-8 flex flex-col md:flex-row gap-4 justify-end">
                    <button 
                      onClick={() => setStep('intro')}
                      className="px-6 py-4 text-primary/60 hover:text-primary underline text-sm"
                    >
                      Volver a empezar
                    </button>
                    <button 
                      onClick={() => {
                        onAddToCart(recommendedProduct);
                      }}
                      className="bg-accent text-white px-10 py-4 rounded-xl font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-3 text-xl w-full md:w-auto"
                    >
                      <Check className="w-7 h-7" /> Agregar al Pedido
                    </button>
                  </div>
                </MotionDiv>
              ) : step === 'result' && !isLoading && (
                 <div className="text-center py-8">
                   <p>No encontramos un pack exacto en este momento.</p>
                   <button onClick={() => setStep('intro')} className="text-accent underline mt-4">Intentar de nuevo</button>
                 </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};