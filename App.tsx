import React, { useState, useEffect } from 'react';
import { Instagram, Loader2 } from 'lucide-react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { NutriBot } from './components/NutriBot';
import { ProductGrid } from './components/ProductGrid';
import { GeoBanner } from './components/GeoBanner';
import { CartDrawer } from './components/CartDrawer';
import { Toast } from './components/Toast';
import { PromoBar } from './components/PromoBar';
import { Product, CartItem } from './types';
import { fetchProducts } from './data';

function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isBenavidez, setIsBenavidez] = useState(false);
  
  // Toast State
  const [toastMessage, setToastMessage] = useState('');
  const [isToastVisible, setIsToastVisible] = useState(false);

  // Initial Data Fetch
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const data = await fetchProducts();
      setProducts(data);
      setLoading(false);
    };
    loadData();
  }, []);

  // Load Cart and Location Preference from LocalStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('mo_cart');
    const savedLocation = localStorage.getItem('mo_isBenavidez');
    
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error("Error parsing cart", e);
      }
    }
    
    if (savedLocation) {
      setIsBenavidez(JSON.parse(savedLocation));
    }
  }, []);

  // Save Cart to LocalStorage
  useEffect(() => {
    localStorage.setItem('mo_cart', JSON.stringify(cart));
  }, [cart]);

  // Save Location Preference
  useEffect(() => {
    localStorage.setItem('mo_isBenavidez', JSON.stringify(isBenavidez));
  }, [isBenavidez]);

  const showToast = (productName: string) => {
    setToastMessage(`¡${productName} agregado al pack!`);
    setIsToastVisible(true);
  };

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    
    // UX IMPROVEMENT: Do not open cart automatically, show toast instead
    showToast(product.name);

    // META PIXEL: Track AddToCart
    if (window.fbq) {
      window.fbq('track', 'AddToCart', {
        content_name: product.name,
        content_ids: [product.id],
        content_type: 'product',
        value: product.price,
        currency: 'ARS'
      });
    }
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : item;
      }
      return item;
    }));
  };

  const cartItemCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 text-secondary animate-spin mx-auto mb-4" />
          <p className="font-serif text-secondary text-lg">Cargando productos frescos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary font-sans text-secondary">
      <PromoBar />
      {/* 
        Sticky Container for Header and Banner.
      */}
      <div className="sticky top-0 z-50 shadow-xl">
        <Header 
          cartItemCount={cartItemCount} 
          onOpenCart={() => setIsCartOpen(true)} 
        />
        <GeoBanner 
          isBenavidez={isBenavidez} 
          onToggle={() => setIsBenavidez(!isBenavidez)} 
        />
      </div>
      
      <main> 
        <Hero />
        
        <ProductGrid 
          products={products}
          onAddToCart={addToCart} 
          isBenavidez={isBenavidez}
        />

        <NutriBot 
          products={products}
          onAddToCart={addToCart} 
          isBenavidez={isBenavidez}
        />
      </main>

      <footer className="bg-secondary text-primary py-16 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
          
          {/* Brand */}
          <div>
            <img 
              src="https://i.postimg.cc/LnVSCyWW/BLANCO.png" 
              alt="Más Orgánicos" 
              className="h-24 md:h-32 mx-auto md:mx-0 mb-8 object-contain" 
            />
            <p className="opacity-80 text-sm leading-relaxed mb-4">
              Alimentos reales directos del productor.<br/>
              Sin intermediarios, sin químicos.<br/>
              Comiendo sano desde 2018.
            </p>
            <div className="flex flex-col gap-3 items-center md:items-start">
              <a href="mailto:masorganicos@gmail.com" className="text-accent hover:underline text-sm font-bold">
                masorganicos@gmail.com
              </a>
              <a 
                href="https://www.instagram.com/masorganicos/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-white hover:text-accent transition-colors text-sm font-bold"
              >
                <Instagram className="w-5 h-5" /> @masorganicos
              </a>
            </div>
          </div>

          {/* Locations */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg text-white">Nuestras Sucursales</h3>
            <div className="space-y-2 text-sm opacity-80">
              <p>
                <strong className="text-white block">Gral. Pacheco (Central)</strong>
                <a 
                  href="https://www.google.com/maps/search/?api=1&query=Cabildo+676+General+Pacheco" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-accent hover:underline transition-colors"
                >
                  Cabildo 676
                </a>
              </p>
              <p>
                <strong className="text-white block">Benavidez</strong>
                <a 
                  href="https://www.google.com/maps/search/?api=1&query=Av.+Gral.+Juan+Domingo+Perón+4187+local+5+Benavidez" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-accent hover:underline transition-colors"
                >
                  Av. Gral. Juan Domingo Perón 4187, Local 5
                </a>
              </p>
            </div>
          </div>

          {/* Hours & Info */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg text-white">Horarios de Atención</h3>
            <div className="space-y-2 text-sm opacity-80">
              <p>
                <strong className="text-white block">Ventanilla Locales</strong>
                Lunes a Viernes: 09:00 a 18:00 hs<br/>
                <span className="text-xs opacity-60">(A confirmar)</span>
              </p>
              <p>
                <strong className="text-white block">WhatsApp Pedidos</strong>
                <a 
                  href="https://wa.me/5491164399974" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-accent hover:underline transition-colors font-bold"
                >
                  +54 9 11 6439 9974
                </a>
              </p>
            </div>
          </div>

        </div>
        
        <div className="border-t border-white/10 mt-12 pt-8 text-center text-xs opacity-40">
          © 2025 Más Orgánicos Express | Navidad Real
        </div>
      </footer>

      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onRemove={removeFromCart}
        onUpdateQty={updateQuantity}
        isBenavidez={isBenavidez}
      />
      
      <Toast 
        message={toastMessage}
        isVisible={isToastVisible}
        onClose={() => setIsToastVisible(false)}
        onOpenCart={() => setIsCartOpen(true)}
      />
    </div>
  );
}

export default App;