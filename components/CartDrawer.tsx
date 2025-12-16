import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, Plus, Minus, Send, Truck, Store, CalendarClock, Lock, ShoppingBasket as ShoppingBasketIcon } from 'lucide-react';
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
  // PICKUP OPTIONS (Mantienen costo 0 y sin mínimo)
  { id: 'pickup_benavidez', label: 'Retiro Benavidez (Av. Perón 4187, Local 5)', type: 'pickup', days: 'Lunes a Viernes', hours: '09hs a 18hs', minPurchase: 0, shippingCost: 0, freeShippingAt: 0 },
  { id: 'pickup_pacheco', label: 'Retiro Pacheco (Cabildo 676)', type: 'pickup', days: 'Lunes a Viernes', hours: '09hs a 18hs', minPurchase: 0, shippingCost: 0, freeShippingAt: 0 },
  
  // DELIVERY ZONES
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

  // Calculate Subtotal
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  // Get Selected Zone Data
  const selectedZone = ZONES_DATA.find(z => z.id === formData.zone) || ZONES_DATA[1]; // Fallback to Pickup Pacheco
  const isPickup = selectedZone.type === 'pickup';
  
  // Logic Rules
  // 1. Minimum Purchase
  const minPurchase = selectedZone.minPurchase;
  const isMinPurchaseMet = subtotal >= minPurchase;
  const missingForMin = Math.max(0, minPurchase - subtotal);

  // 2. Free Shipping Logic
  const freeShippingThreshold = selectedZone.freeShippingAt;
  const isFreeShippingMet = !isPickup && freeShippingThreshold > 0 && subtotal >= freeShippingThreshold;
  const missingForFreeShip = Math.max(0, freeShippingThreshold - subtotal);
  
  // 3. Final Cost Calculation
  const finalShippingCost = isPickup ? 0 : (isFreeShippingMet ? 0 : selectedZone.shippingCost);
  
  const total = subtotal + finalShippingCost;

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    // Last check before sending
    if (!isPickup && !isMinPurchaseMet) {
      alert(`El pedido mínimo para esta zona es de $${minPurchase.toLocaleString()}`);
      return;
    }

    const itemsList = cart.map(i => `• ${i.quantity}x ${i.name} ($${i.price * i.quantity})`).join('\n');
    
    let shippingText = '';
    if (isPickup) {
      shippingText = `Retiro en Sucursal: ${selectedZone.label}`;
    } else {
      shippingText = `Envío a ${selectedZone.label} (${isFreeShippingMet ? 'GRATIS' : '$' + finalShippingCost})\n📅 ${selectedZone.days} ${selectedZone.hours}`;
    }

    const message = `
*HOLA! PEDIDO WEB - MÁS ORGÁNICOS* 🎄

*Mi Pedido:*
${itemsList}

*Subtotal:* $${subtotal.toLocaleString()}
*Entrega:* ${shippingText}
*TOTAL FINAL: $${total.toLocaleString()}*

*Mis Datos:*
👤 Nombre: ${formData.name}
${!isPickup ? `📍 Dirección: ${formData.address}` : '📍 Retiro por Sucursal'}

_Espero confirmación para abonar. Gracias!_
    `.trim();

    // META PIXEL: Track InitiateCheckout
    if (window.fbq) {
      window.fbq('track', 'InitiateCheckout', {
        value: total,
        currency: 'ARS',
        num_items: cart.reduce((acc, item) => acc + item.quantity, 0)
      });
    }

    // Actualizado al nuevo número: 1164399974 (Formato internacional: 5491164399974)
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
            className="fixed inset-0 bg-black/60 z-[60] backdrop-blur-sm"
          />

          <MotionDiv 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full md:w-[500px] bg-primary z-[70] shadow-2xl flex flex-col"
          >
            <div className="p-5 border-b border-gray-200 flex justify-between items-center bg-white">
              <h2 className="text-2xl font-serif font-bold text-secondary">Tu Reserva</h2>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-4">
                  <ShoppingBasketIcon className="w-16 h-16 opacity-20" />
                  <p>Tu carrito está vacío.</p>
                  <button onClick={onClose} className="text-accent font-bold underline">
                    Volver al catálogo
                  </button>
                </div>
              ) : (
                cart.map(item => (
                  <div key={item.id} className="flex gap-4 bg-white p-3 rounded-xl shadow-sm border border-gray-100">
                    <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-lg" />
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="font-bold text-secondary text-sm leading-tight">{item.name}</h4>
                        <p className="text-accent font-bold">${item.price.toLocaleString()}</p>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-3 bg-gray-100 rounded-lg p-1">
                          <button onClick={() => onUpdateQty(item.id, -1)} className="p-1 hover:text-alert"><Minus className="w-4 h-4" /></button>
                          <span className="text-sm font-bold w-4 text-center">{item.quantity}</span>
                          <button onClick={() => onUpdateQty(item.id, 1)} className="p-1 hover:text-green-600"><Plus className="w-4 h-4" /></button>
                        </div>
                        <button onClick={() => onRemove(item.id)} className="text-gray-400 hover:text-alert">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}

              {/* PROGRESS BAR LOGIC */}
              {cart.length > 0 && !isPickup && (
                <MotionDiv 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`border rounded-xl p-4 mt-4 transition-colors ${
                    !isMinPurchaseMet ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-full ${!isMinPurchaseMet ? 'bg-red-100' : 'bg-green-100'}`}>
                      {!isMinPurchaseMet ? <Lock className="w-5 h-5 text-red-700" /> : <Truck className="w-5 h-5 text-green-700" />}
                    </div>
                    <div className="flex-1">
                      {!isMinPurchaseMet ? (
                         <>
                            <h4 className="font-bold text-red-800 text-sm">Mínimo de compra no alcanzado</h4>
                            <p className="text-xs text-red-700 mt-1">
                              Esta zona requiere un pedido mínimo de <strong>${minPurchase.toLocaleString()}</strong>.
                            </p>
                         </>
                      ) : !isFreeShippingMet ? (
                         <>
                            <h4 className="font-bold text-green-800 text-sm">Envío disponible</h4>
                            <p className="text-xs text-green-700 mt-1">
                              ¡Estás a <strong>${missingForFreeShip.toLocaleString()}</strong> del envío GRATIS!
                            </p>
                         </>
                      ) : (
                        <>
                            <h4 className="font-bold text-green-800 text-sm">¡Tenés Envío GRATIS! 🎉</h4>
                            <p className="text-xs text-green-700 mt-1">
                              Tu pedido supera los ${freeShippingThreshold.toLocaleString()}.
                            </p>
                        </>
                      )}
                      
                      {/* Bar Logic */}
                      <div className="mt-3">
                         {/* Min Purchase Bar */}
                         {!isMinPurchaseMet ? (
                            <div className="w-full h-2 bg-red-200 rounded-full overflow-hidden">
                              <div className="h-full bg-red-500 transition-all duration-500" style={{ width: `${(subtotal / minPurchase) * 100}%` }}></div>
                            </div>
                         ) : !isFreeShippingMet ? (
                            <div className="w-full h-2 bg-green-200 rounded-full overflow-hidden">
                              <div className="h-full bg-green-500 transition-all duration-500" style={{ width: `${(subtotal / freeShippingThreshold) * 100}%` }}></div>
                            </div>
                         ) : null}
                      </div>
                    </div>
                  </div>
                </MotionDiv>
              )}
            </div>

            {/* CHECKOUT AREA */}
            {cart.length > 0 && (
              <div className="bg-white border-t border-gray-200 p-6 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
                <form onSubmit={handleCheckout} className="space-y-4">
                  {/* Totals */}
                  <div className="space-y-2 mb-4 text-sm">
                    <div className="flex justify-between text-gray-600">
                      <span>Subtotal</span>
                      <span>${subtotal.toLocaleString()}</span>
                    </div>
                    
                    <div className="flex justify-between text-gray-600">
                      <span className="flex items-center gap-1">
                        {isPickup ? <Store className="w-4 h-4"/> : <Truck className="w-4 h-4"/>} 
                        {isPickup ? 'Retiro' : 'Envío'}
                      </span>
                      <span>
                        {finalShippingCost === 0 ? <span className="text-green-600 font-bold">GRATIS</span> : `$${finalShippingCost.toLocaleString()}`}
                      </span>
                    </div>

                    <div className="flex justify-between text-xl font-bold text-secondary pt-2 border-t">
                      <span>Total</span>
                      <span>${total.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Form */}
                  <div className="space-y-3">
                    <input 
                      required
                      type="text" 
                      placeholder="Tu Nombre"
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-secondary/20"
                    />
                    
                    <div className="space-y-1">
                      <label className="text-xs text-gray-500 font-bold uppercase ml-1">Zona / Sucursal</label>
                      <select
                        value={formData.zone}
                        onChange={e => setFormData({...formData, zone: e.target.value})}
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-secondary/20 text-sm"
                      >
                        <optgroup label="Retiro en Sucursal (Gratis)">
                          {ZONES_DATA.filter(z => z.type === 'pickup').map(z => (
                            <option key={z.id} value={z.id}>{z.label}</option>
                          ))}
                        </optgroup>
                        
                        <optgroup label="Envíos a Domicilio">
                          {ZONES_DATA.filter(z => z.type === 'delivery').map(z => (
                            <option key={z.id} value={z.id}>
                              {z.label} (Mín ${z.minPurchase.toLocaleString()})
                            </option>
                          ))}
                        </optgroup>
                      </select>
                      
                      {/* Zone Details Badge */}
                      <div className="bg-secondary/5 rounded-lg p-2 flex items-start gap-2 mt-1">
                        <CalendarClock className="w-4 h-4 text-secondary mt-0.5" />
                        <div className="text-xs text-secondary/80">
                          <span className="font-bold block text-secondary">{selectedZone.days}</span>
                          {selectedZone.hours}
                          {!isPickup && (
                             <span className="block mt-1 text-secondary/60">
                               Envío: ${selectedZone.shippingCost} (Gratis superando ${selectedZone.freeShippingAt.toLocaleString()})
                             </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {!isPickup && (
                      <input 
                        required
                        type="text" 
                        placeholder="Dirección exacta"
                        value={formData.address}
                        onChange={e => setFormData({...formData, address: e.target.value})}
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-secondary/20"
                      />
                    )}
                  </div>

                  <button 
                    type="submit"
                    disabled={!isPickup && !isMinPurchaseMet}
                    className={`w-full font-bold py-4 rounded-xl shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2 text-lg ${
                      !isPickup && !isMinPurchaseMet 
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-[#25D366] hover:bg-[#20bd5a] text-white'
                    }`}
                  >
                    {!isPickup && !isMinPurchaseMet ? (
                      <><Lock className="w-5 h-5" /> Monto mínimo no alcanzado</>
                    ) : (
                      <><Send className="w-5 h-5" /> Enviar Pedido por WhatsApp</>
                    )}
                  </button>
                </form>
              </div>
            )}
          </MotionDiv>
        </>
      )}
    </AnimatePresence>
  );
};