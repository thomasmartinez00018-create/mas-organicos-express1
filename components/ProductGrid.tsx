import React, { useState, useMemo } from 'react';
import { Product } from '../types';
import { motion } from 'framer-motion';
import { Plus, Ban } from 'lucide-react';

interface ProductGridProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({ products, onAddToCart }) => {
  const [filter, setFilter] = useState<string>('Todos');

  // Dynamically extract categories from the product list
  const categories = useMemo(() => {
    const uniqueCats = Array.from(new Set(products.map(p => p.category).filter(Boolean)));
    uniqueCats.sort();
    return ['Todos', ...uniqueCats];
  }, [products]);

  // STRATEGY: Sort products to show high-value items first
  const sortedAndFilteredProducts = useMemo(() => {
    let filtered = filter === 'Todos' 
      ? [...products]
      : products.filter(p => p.category === filter);

    // Sorting Logic:
    // 1. Packs first (if not already filtering by category)
    // 2. Featured items
    // 3. Price descending (High to Low)
    return filtered.sort((a, b) => {
      // Priority 1: Packs (if category includes "pack" or "navidad")
      const aIsPack = a.category.toLowerCase().includes('pack') || a.category.toLowerCase().includes('navidad');
      const bIsPack = b.category.toLowerCase().includes('pack') || b.category.toLowerCase().includes('navidad');
      
      if (aIsPack && !bIsPack) return -1;
      if (!aIsPack && bIsPack) return 1;

      // Priority 2: Featured items
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;

      // Priority 3: Price High to Low
      return b.price - a.price;
    });
  }, [products, filter]);

  const MotionDiv = motion.div as any;

  return (
    <section id="catalog" className="py-16 px-4 max-w-7xl mx-auto bg-primary">
      {/* Header & Tabs */}
      <div className="mb-12 text-center">
        <div className="inline-block bg-accent/10 text-accent text-xs font-bold px-3 py-1 rounded-full mb-4 uppercase tracking-tighter">
          Nuestros Alimentos Reales
        </div>
        <h2 className="font-serif text-4xl md:text-5xl font-bold text-secondary mb-4">Elegí lo natural</h2>
        <p className="text-secondary/60 max-w-lg mx-auto mb-8">
          Asegurá tu stock para las fiestas con productos directos de huerta y elaboraciones artesanales.
        </p>
        
        <div className="flex flex-wrap justify-center gap-2 md:gap-4">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-6 py-2.5 rounded-full font-bold transition-all duration-300 capitalize text-sm shadow-sm ${
                filter === cat 
                  ? 'bg-secondary text-primary shadow-lg scale-105' 
                  : 'bg-white border border-secondary/10 text-secondary/70 hover:bg-secondary/5'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {sortedAndFilteredProducts.map((product) => {
          const isOutOfStock = product.stock <= 0;

          return (
            <MotionDiv
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              key={product.id}
              className={`group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-secondary/5 flex flex-col ${
                isOutOfStock ? 'opacity-70 grayscale' : ''
              }`}
            >
              {/* Image Area */}
              <div className="relative h-72 overflow-hidden">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                />
                
                {/* Promo Badge */}
                {product.isPromo && !isOutOfStock && (
                  <div className="absolute top-4 left-4 bg-accent text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-md flex items-center gap-1">
                    <span>★</span> RECOMENDADO
                  </div>
                )}
                
                {/* Stock Badges */}
                {isOutOfStock ? (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-[2px]">
                    <span className="bg-white/95 text-gray-800 font-black px-6 py-3 rounded-lg transform -rotate-12 border-2 border-gray-800 text-xl tracking-tighter">
                      AGOTADO
                    </span>
                  </div>
                ) : product.stock < 10 && (
                  <div className="absolute top-4 right-4 bg-alert/90 text-white text-xs font-bold px-3 py-1 rounded-full backdrop-blur-sm animate-pulse">
                    ¡Últimos {product.stock}!
                  </div>
                )}
              </div>

              {/* Content Area */}
              <div className="p-6 flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-serif text-xl md:text-2xl font-bold text-secondary leading-tight">
                    {product.name}
                  </h3>
                </div>
                
                <p className="text-gray-600 text-sm mb-6 flex-grow leading-relaxed">
                  {product.description}
                </p>

                <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                      Precio Final
                    </span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold text-secondary">
                        ${product.price.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => !isOutOfStock && onAddToCart(product)}
                    disabled={isOutOfStock}
                    className={`px-6 py-3 rounded-xl font-bold transition-all shadow-md flex items-center gap-2 ${
                      isOutOfStock 
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
                        : 'bg-secondary hover:bg-secondary-light text-white hover:shadow-lg active:scale-95'
                    }`}
                  >
                    {isOutOfStock ? (
                      <Ban className="w-5 h-5" />
                    ) : (
                      <>
                        <Plus className="w-5 h-5" /> Agregar
                      </>
                    )}
                  </button>
                </div>
              </div>
            </MotionDiv>
          );
        })}
      </div>
    </section>
  );
};