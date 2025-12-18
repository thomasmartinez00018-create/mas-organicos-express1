import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, Plus, Minus, Send, Truck, Store, CalendarClock, Lock, ShoppingBasket as ShoppingBasketIcon, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { CartItem, UserData } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onRemove: (id: string) => void;
  onUpdateQty: (id: string, delta: number) => void;
}

interface ZoneDefinition {
  id: string;
  label: string;
  type: 'pickup' | 'delivery';
  days: string;
  hours: string;
  minPurchase: number;
  shippingCost: number;
  freeShippingAt: number;
}

// DATA FROM SPREADSHEET
const ZONES_DATA: ZoneDefinition[] = [
  { id: 'pickup_benavidez', label: 'Retiro Benavidez (Av. Perón 4187, Local 5)', type: 'pickup', days: 'Lunes a Viernes', hours: '09hs a 18hs', minPurchase: 0, shippingCost: 0, freeShippingAt: 0 },
  { id: 'pickup_pacheco', label: 'Retiro Pacheco (Cabildo 676)', type: 'pickup', days: 'Lunes a Viernes', hours: '09hs a 18hs', minPurchase: 0, shippingCost: 0, freeShippingAt: 0 },
  
  { id: '1', label: 'Pacheco', type: 'delivery', days: 'Lunes a Viernes', hours: '15hs a 19hs aprox', minPurchase: 30000, shippingCost: 2200, freeShippingAt: 100000 },
  { id: '2', label: 'Pacheco (Barrios Privados)', type: 'delivery', days: 'Lunes', hours: '15hs a 19hs aprox', minPurchase: 30000, shippingCost: 3800, freeShippingAt: 100000 },
  { id: '3', label: 'Talar (cercano al local)', type: 'delivery', days: 'Lunes a Viernes', hours: '15hs a 19hs aprox', minPurchase: 30000, shippingCost: 2200, freeShippingAt: 100000 },
  { id: '4', label: 'Tigre - Troncos - San Fernando', type: 'delivery', days: 'Martes', hours: '15hs a 19hs aprox', minPurchase: 30000, shippingCost: 3800, freeShippingAt: 100000 },
  { id: '5', label: 'Nordelta y alrededores', type: 'delivery', days: 'Martes', hours: '15hs a 19hs aprox', minPurchase: 30000, shippingCost: 3800, freeShippingAt: 100000 },
  { id: '6', label: 'Don Torcuato, Sordeaux, Villa de Mayo', type: 'delivery', days: 'Miércoles', hours: '15hs a 19hs aprox', minPurchase: 30000, shippingCost: 3800, freeShippingAt: 100000 },
  { id: '7', label: 'Benavidez, Maschwitz', type: 'delivery', days: 'Jueves', hours: '15hs a 19hs aprox', minPurchase: 50000, shippingCost: 4800, freeShippingAt: 150000 },
  { id: '8', label: 'Garin, Tortuguitas, Ricardo Rojas', type: 'delivery', days: 'Jueves', hours: '15hs a 19hs aprox', minPurchase: 50000, shippingCost: 4800, freeShippingAt: 150000 },
  { id: '9', label: 'Dique Lujan', type: 'delivery', days: 'Jueves', hours: '15hs a 19hs aprox', minPurchase: 50000, shippingCost: 4800, freeShippingAt: 150000 },
  { id: '10', label: 'San Miguel, Bella Vista', type: 'delivery', days: 'Miércoles', hours: '15hs a 19hs aprox', minPurchase: 50000, shippingCost: 5800, freeShippingAt: 150000 },
  { id: '11', label: 'Los Polvorines, Grand Bourg', type: 'delivery', days: 'Miércoles', hours: '15hs a 19hs aprox', minPurchase: 30000, shippingCost: 3800, freeShippingAt: 100000 },
  { id: '12', label: 'Virreyes, Beccar, San Isidro', type: 'delivery', days: 'Miércoles', hours: '15hs a 19hs aprox', minPurchase: 50000, shippingCost: 4800, freeShippingAt: 150000 },
  { id: '13', label: 'Martinez, Olivos, Vicente Lopez', type: 'delivery', days: 'Miércoles', hours: '15hs a 19hs aprox', minPurchase: 50000, shippingCost: 4800, freeShippingAt: 150000 },
  { id: '14', label: 'CABA Norte (Devoto, Villa del Parque)', type: 'delivery', days: 'Jueves', hours: '11:30hs a 17hs aprox', minPurchase: 50000, shippingCost: 5800, freeShippingAt: 150000 },
  { id: '15', label: 'Escobar, Matheu, Pilar, Del Viso', type: 'delivery', days: 'Jueves', hours: '15hs a 19hs aprox', minPurchase: 50000, shippingCost: 5800, freeShippingAt: 150000 },
  { id: '16', label: 'CABA Centro y Sur', type: 'delivery', days: 'Jueves', hours: '11:30hs a 17hs aprox', minPurchase: 50000, shippingCost: 11600, freeShippingAt: 150000 },
  { id: '17', label: 'Talar (General)', type: 'delivery', days: 'Lunes a Viernes', hours: '15hs a 19hs aprox', minPurchase: 30000, shippingCost: 3800, freeShippingAt: 100000 },
];

export const CartDrawer: React.FC<CartDrawerProps> = ({ 
  isOpen, 
  onClose, 
  cart, 
  onRemove, 
  onUpdateQty
}) => {
  const [formData, setFormData] = useState<UserData>({
    name: '',
    address: '',
    zone: 'pickup_pacheco'
  });

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const selectedZone = ZONES_DATA.find(z => z.id === formData.zone) || ZONES_DATA[1];
  const isPickup = selectedZone.type === 'pickup';
  const minPurchase = selectedZone.minPurchase;
  
  // NEW LOGIC: We don't block the button, but we change the behavior if below min.
  const isMinPurchaseMet = subtotal >= minPurchase;
  const isFreeShippingMet = !isPickup && selectedZone.freeShippingAt > 0 && subtotal >= selectedZone.freeShippingAt;
  const finalShippingCost = isPickup ? 0 : (isFreeShippingMet ? 0 : selectedZone.shippingCost);
  const total = subtotal + finalShippingCost;

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    const itemsList = cart.map(i => `• ${i.quantity}x ${i.name} ($${(i.price * i.quantity).toLocaleString()})`).join('\n');
    
    let shippingText = '';
    let introMessage = '*HOLA! PEDIDO WEB - MÁS ORGÁNICOS* 🎄';

    if (isPickup) {
      shippingText = `Retiro en Sucursal: ${selectedZone.label}`;
    } else if (!isMinPurchaseMet) {
      // FORCE PICKUP IF BELOW MINIMUM
      introMessage = '*HOLA! QUIERO ESTE PEDIDO PARA RETIRAR EN SUCURSAL (No llego al mínimo de envío)* 🏪';
      shippingText = `Retiro en Sucursal (Zona seleccionada: ${selectedZone.label} - No alcanzó el mínimo)`;
    } else {
      shippingText = `Envío a ${selectedZone.label} (${isFreeShippingMet ? 'GRATIS' : '$' + finalShippingCost.toLocaleString()})\n📅 ${selectedZone.days} ${selectedZone.hours}`;
    }

    const message = `
${introMessage}

*Mi Pedido:*
${itemsList}

*Subtotal:* $${subtotal.toLocaleString()}
*Entrega:* ${shippingText}
*TOTAL FINAL: $${(isMinPurchaseMet || isPickup ? total : subtotal).toLocaleString()}*

*Mis Datos:*
👤 Nombre: ${formData.name}
${(!isPickup && isMinPurchaseMet) ? `📍 Dirección: ${formData.address}` : '📍 Retiro por Sucursal (Pacheco/Benavidez - A coordinar)'}

_Espero confirmación para abonar. Gracias!_
    `.trim();

    if (window.fbq) {
      window.fbq('track', 'InitiateCheckout', {
        value: total,
        currency: 'ARS',
        num_items: cart.reduce((acc, item) => acc + item.quantity, 0)
      });
    }

    const whatsappUrl = `https://wa.me/5491164399974?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const MotionDiv = motion.div as any;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <MotionDiv 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 z-[60] backdrop-blur-md"
          />

          <MotionDiv 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full md:w-[500px] bg-primary z-[70] shadow-2xl flex flex-col"
          >
            <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-white shadow-sm">
              <div className="flex items-center gap-3">
                <ShoppingBasketIcon className="w-6 h-6 text-secondary" />
                <h2 className="text-2xl font-serif font-bold text-secondary">Tu Pedido</h2>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-4">
                  <div className="bg-gray-50 p-8 rounded-full">
                    <ShoppingBasketIcon className="w-20 h-20 opacity-20" />
                  </div>
                  <p className="font-medium">Tu carrito está vacío.</p>
                  <button onClick={onClose} className="bg-secondary text-white px-8 py-3 rounded-xl font-bold shadow-md">
                    Ver el catálogo
                  </button>
                </div>
              ) : (
                cart.map(item => (
                  <div key={item.id} className="flex gap-4 bg-white p-4 rounded-2xl shadow-sm border border-gray-100 group">
                    <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded-xl" />
                    <div className="flex-1 flex flex-col justify-between py-1">
                      <div>
                        <h4 className="font-bold text-secondary text-base leading-tight group-hover:text-accent transition-colors">{item.name}</h4>
                        <p className="text-accent font-bold mt-1">${item.price.toLocaleString()}</p>
                      </div>
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-4 bg-gray-50 rounded-xl px-3 py-1.5 border border-gray-100">
                          <button onClick={() => onUpdateQty(item.id, -1)} className="p-1 hover:text-alert transition-colors"><Minus className="w-4 h-4" /></button>
                          <span className="text-sm font-bold w-6 text-center text-secondary">{item.quantity}</span>
                          <button onClick={() => onUpdateQty(item.id, 1)} className="p-1 hover:text-green-600 transition-colors"><Plus className="w-4 h-4" /></button>
                        </div>
                        <button onClick={() => onRemove(item.id)} className="text-gray-300 hover:text-alert transition-colors p-2">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}

              {/* DYNAMIC ALERT LOGIC */}
              {cart.length > 0 && !isPickup && (
                <MotionDiv 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={`border rounded-2xl p-5 mt-4 transition-all ${
                    !isMinPurchaseMet 
                      ? 'bg-amber-50 border-amber-200 text-amber-900 shadow-sm' 
                      : 'bg-green-50 border-green-200 text-green-900 shadow-sm'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-2.5 rounded-full shrink-0 ${!isMinPurchaseMet ? 'bg-amber-100' : 'bg-green-100'}`}>
                      {!isMinPurchaseMet ? <AlertTriangle className="w-6 h-6 text-amber-700" /> : <CheckCircle2 className="w-6 h-6 text-green-700" />}
                    </div>
                    <div className="flex-1">
                      {!isMinPurchaseMet ? (
                         <>
                            <h4 className="font-bold text-base mb-1">¡Podés comprar igual!</h4>
                            <p className="text-sm leading-relaxed opacity-90">
                              Estás debajo del mínimo para envío ($30.000). <strong>¡Pero podés finalizar ahora y RETIRAR GRATIS en nuestra sucursal!</strong>
                            </p>
                            <div className="mt-3 w-full h-2 bg-amber-200/50 rounded-full overflow-hidden">
                              <div className="h-full bg-amber-500 transition-all duration-700 ease-out" style={{ width: `${(subtotal / minPurchase) * 100}%` }}></div>
                            </div>
                         </>
                      ) : !isFreeShippingMet ? (
                         <>
                            <h4 className="font-bold text-base mb-1">Envío habilitado</h4>
                            <p className="text-sm opacity-90">
                              ¡Genial! Ya superaste el mínimo. Te faltan <strong>${(selectedZone.freeShippingAt - subtotal).toLocaleString()}</strong> para el <strong>ENVÍO GRATIS</strong>.
                            </p>
                            <div className="mt-3 w-full h-2 bg-green-200/50 rounded-full overflow-hidden">
                              <div className="h-full bg-green-500 transition-all duration-700 ease-out" style={{ width: `${(subtotal / selectedZone.freeShippingAt) * 100}%` }}></div>
                            </div>
                         </>
                      ) : (
                        <>
                            <h4 className="font-bold text-base mb-1">¡Tenés Envío GRATIS! 🎉</h4>
                            <p className="text-sm opacity-90 leading-relaxed">
                              ¡Excelente! Tu pedido de ${subtotal.toLocaleString()} califica para entrega sin cargo en tu zona.
                            </p>
                        </>
                      )}
                    </div>
                  </div>
                </MotionDiv>
              )}
            </div>

            {cart.length > 0 && (
              <div className="bg-white border-t border-gray-100 p-8 shadow-[0_-10px_40px_rgba(0,0,0,0.08)]">
                <form onSubmit={handleCheckout} className="space-y-6">
                  <div className="space-y-3 pb-4">
                    <div className="flex justify-between text-gray-500 text-sm font-medium">
                      <span>Subtotal de productos</span>
                      <span>${subtotal.toLocaleString()}</span>
                    </div>
                    
                    <div className="flex justify-between text-gray-500 text-sm font-medium">
                      <span className="flex items-center gap-2">
                        {isPickup ? <Store className="w-4 h-4"/> : <Truck className="w-4 h-4"/>} 
                        {isPickup || !isMinPurchaseMet ? 'Retiro en Sucursal' : `Envío a ${selectedZone.label}`}
                      </span>
                      <span>
                        {(finalShippingCost === 0 || !isMinPurchaseMet) ? <span className="text-green-600 font-bold uppercase text-xs">Gratis</span> : `$${finalShippingCost.toLocaleString()}`}
                      </span>
                    </div>

                    <div className="flex justify-between text-2xl font-serif font-black text-secondary pt-4 border-t-2 border-dashed border-gray-100">
                      <span>Total Final</span>
                      <span>${(isMinPurchaseMet || isPickup ? total : subtotal).toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="relative">
                      <input 
                        required
                        type="text" 
                        placeholder="Tu Nombre completo"
                        value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-4 focus:outline-none focus:ring-4 focus:ring-secondary/5 font-medium transition-all"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-[10px] text-gray-400 font-black uppercase ml-1 tracking-widest">Zona / Punto de Retiro</label>
                      <select
                        value={formData.zone}
                        onChange={e => setFormData({...formData, zone: e.target.value})}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-4 focus:outline-none focus:ring-4 focus:ring-secondary/5 text-sm font-bold text-secondary appearance-none cursor-pointer"
                      >
                        <optgroup label="🏪 Retiro en Tienda (¡Sin mínimo!)">
                          {ZONES_DATA.filter(z => z.type === 'pickup').map(z => (
                            <option key={z.id} value={z.id}>{z.label}</option>
                          ))}
                        </optgroup>
                        
                        <optgroup label="🚚 Envíos (Mínimo $30.000)">
                          {ZONES_DATA.filter(z => z.type === 'delivery').map(z => (
                            <option key={z.id} value={z.id}>
                              {z.label}
                            </option>
                          ))}
                        </optgroup>
                      </select>
                      
                      <div className="bg-secondary/5 rounded-xl p-3 flex items-start gap-3 mt-2 border border-secondary/5">
                        <CalendarClock className="w-5 h-5 text-secondary mt-0.5" />
                        <div className="text-xs text-secondary/80">
                          <p className="font-bold text-secondary mb-0.5">Día de entrega: {selectedZone.days}</p>
                          <p>{selectedZone.hours}</p>
                          {!isPickup && isMinPurchaseMet && (
                             <p className="mt-1 font-medium text-accent">
                               Envío: ${selectedZone.shippingCost} (Gratis desde ${selectedZone.freeShippingAt.toLocaleString()})
                             </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {!isPickup && isMinPurchaseMet && (
                      <input 
                        required
                        type="text" 
                        placeholder="Dirección para el envío"
                        value={formData.address}
                        onChange={e => setFormData({...formData, address: e.target.value})}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-4 focus:outline-none focus:ring-4 focus:ring-secondary/5 font-medium transition-all"
                      />
                    )}
                  </div>

                  <button 
                    type="submit"
                    className={`w-full font-black py-5 rounded-2xl shadow-xl transition-all active:scale-[0.97] flex items-center justify-center gap-3 text-lg bg-[#25D366] hover:bg-[#20bd5a] text-white hover:shadow-[#25D366]/30`}
                  >
                    {!isPickup && !isMinPurchaseMet ? (
                      <><Store className="w-6 h-6" /> Finalizar para RETIRO EN SUCURSAL</>
                    ) : (
                      <><Send className="w-6 h-6" /> Enviar Pedido por WhatsApp</>
                    )}
                  </button>
                  <p className="text-[10px] text-center text-gray-400 font-bold uppercase tracking-widest">
                    Asegurá tu stock hoy • Pagás al coordinar
                  </p>
                </form>
              </div>
            )}
          </MotionDiv>
        </>
      )}
    </AnimatePresence>
  );
};