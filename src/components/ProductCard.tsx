import React from 'react';
import { Plus, Package, Zap, Monitor, Headphones, Gamepad2, Tv, Smartphone } from 'lucide-react';
import { Product } from '../types';
import { useApp } from '../context/AppContext';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useApp();

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'phones':
        return 'bg-blue-100 text-blue-800';
      case 'laptops':
        return 'bg-indigo-100 text-indigo-800';
      case 'audio':
        return 'bg-purple-100 text-purple-800';
      case 'gaming':
        return 'bg-pink-100 text-pink-800';
      case 'tv':
        return 'bg-cyan-100 text-cyan-800';
      case 'accessories':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'phones':
        return <Smartphone className="h-3.5 w-3.5" />;
      case 'laptops':
        return <Monitor className="h-3.5 w-3.5" />;
      case 'audio':
        return <Headphones className="h-3.5 w-3.5" />;
      case 'gaming':
        return <Gamepad2 className="h-3.5 w-3.5" />;
      case 'tv':
        return <Tv className="h-3.5 w-3.5" />;
      default:
        return <Zap className="h-3.5 w-3.5" />;
    }
  };

  const handleAddToCart = () => {
    if (product.stock > 0) {
      addToCart(product, 1);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
      <div className="bg-gradient-to-b from-gray-100 to-white">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-52 object-cover"
        />
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium capitalize ${getCategoryColor(product.category)}`}>
            {getCategoryIcon(product.category)}
            {product.category}
          </span>
        </div>
        
        <h3 className="text-base font-semibold text-gray-900 mb-1.5 line-clamp-2">
          {product.name}
        </h3>
        
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {product.description}
        </p>
        
        <div className="flex justify-between items-center mb-3">
          <span className="text-xl font-bold text-gray-900">
            ${product.price.toFixed(2)}
          </span>
          <div className="flex items-center text-sm">
            <Package className="h-4 w-4 text-gray-400 mr-1" />
            <span className={product.stock > 0 ? 'text-green-600' : 'text-red-600'}>
              {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
            </span>
          </div>
        </div>
        
        <button
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          className={`w-full flex items-center justify-center px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
            product.stock > 0
              ? 'bg-emerald-600 hover:bg-emerald-700 text-white focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2'
              : 'bg-gray-200 text-gray-500 cursor-not-allowed'
          }`}
        >
          <Plus className="h-4 w-4 mr-2" />
          {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
        </button>
      </div>
    </div>
  );
}