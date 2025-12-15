import React, { useState } from 'react';
import { Product, Category } from '../types';
import { motion } from 'framer-motion';
import { Plus, Info, Ban } from 'lucide-react';

interface ProductGridProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
  isBenavidez: boolean;
}

export const ProductGrid: React.FC<ProductGridProps> = ({ products, onAddToCart, isBenavidez }) => {
  const [filter, setFilter] = useState<Category | 'all'>('all');

  const filteredProducts = filter === 'all' 
    ? products 
    : products.filter(p => p.category === filter);

  const categories = [
    { id: 'all', label: 'Todos' },
    { id: 'packs', label: 'Packs Navidad' },
    { id: 'fresh', label: 'Verdura Fresca' },
    { id: 'pantry', label: 'Despensa' }
  ];

  const MotionDiv = motion.div as any;

  return (
    <section id="catalog" className="py-16 px-4 max-w-7xl mx-auto bg-primary">
      {/* Header & Tabs */}
      <div className="mb-12 text-center">
        <h2 className="font-serif text-4xl font-bold text-secondary mb-8">Elegí lo natural</h2>
        
        <div className="flex flex-wrap justify-center gap-2 md:gap-4">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilter(cat.id as any)}
              className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                filter === cat.id 
                  ? 'bg-secondary text-primary shadow-lg scale-105' 
                  : 'bg-white border border-secondary/10 text-secondary/70 hover:bg-secondary/5'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProducts.map((product) => {
          // Calculate discount if applicable
          const displayPrice = isBenavidez ? product.price * 0.8 : product.price;
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
              <div className="relative h-64 overflow-hidden">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                />
                
                {/* Promo Badge */}
                {product.isPromo && !isOutOfStock && (
                  <div className="absolute top-4 left-4 bg-accent text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                    DESTACADO
                  </div>
                )}
                
                {/* Stock Badges */}
                {isOutOfStock ? (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <span className="bg-white/90 text-gray-800 font-bold px-4 py-2 rounded-lg transform -rotate-12 border-2 border-gray-800">
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
                  <h3 className="font-serif text-xl font-bold text-secondary leading-tight">
                    {product.name}
                  </h3>
                </div>
                
                <p className="text-gray-600 text-sm mb-6 flex-grow">
                  {product.description}
                </p>

                <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-400 font-medium uppercase">
                      {isBenavidez ? 'Precio Vecino (20% OFF)' : 'Precio'}
                    </span>
                    <div className="flex items-baseline gap-2">
                      {isBenavidez && (
                        <span className="text-sm text-gray-400 line-through decoration-alert/50">
                          ${product.price.toLocaleString()}
                        </span>
                      )}
                      <span className={`text-2xl font-bold ${isBenavidez ? 'text-accent' : 'text-secondary'}`}>
                        ${displayPrice.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => !isOutOfStock && onAddToCart(product)}
                    disabled={isOutOfStock}
                    className={`px-5 py-3 rounded-xl font-bold transition-all shadow-md flex items-center gap-2 ${
                      isOutOfStock 
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
                        : 'bg-secondary hover:bg-secondary-light text-white hover:shadow-lg active:scale-95'
                    }`}
                  >
                    {isOutOfStock ? (
                      <>
                        <Ban className="w-5 h-5" /> Sin Stock
                      </>
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