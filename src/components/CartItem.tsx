import React from 'react';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { CartItem as CartItemType } from '../types';
import { useApp } from '../context/AppContext';

interface CartItemProps {
  item: CartItemType;
}

export default function CartItem({ item }: CartItemProps) {
  const { updateCartQuantity, removeFromCart } = useApp();

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(item.product.id);
    } else {
      updateCartQuantity(item.product.id, newQuantity);
    }
  };

  return (
    <div className="flex items-center space-x-4 p-4 bg-white rounded-lg shadow-sm border">
      <img
        src={item.product.image}
        alt={item.product.name}
        className="w-16 h-16 object-cover rounded-md"
      />
      
      <div className="flex-1">
        <h4 className="font-semibold text-gray-900">{item.product.name}</h4>
        <p className="text-sm text-gray-600">${item.product.price.toFixed(2)} each</p>
        {item.product.stock < item.quantity && (
          <p className="text-xs text-red-600">Only {item.product.stock} available</p>
        )}
      </div>
      
      <div className="flex items-center space-x-2">
        <button
          onClick={() => handleQuantityChange(item.quantity - 1)}
          className="p-1 rounded-md hover:bg-gray-100 transition-colors"
        >
          <Minus className="h-4 w-4" />
        </button>
        
        <span className="w-12 text-center font-medium">{item.quantity}</span>
        
        <button
          onClick={() => handleQuantityChange(item.quantity + 1)}
          disabled={item.quantity >= item.product.stock}
          className={`p-1 rounded-md transition-colors ${
            item.quantity >= item.product.stock
              ? 'text-gray-400 cursor-not-allowed'
              : 'hover:bg-gray-100'
          }`}
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
      
      <div className="text-right">
        <p className="font-semibold">${(item.product.price * item.quantity).toFixed(2)}</p>
        <button
          onClick={() => removeFromCart(item.product.id)}
          className="text-red-500 hover:text-red-700 transition-colors mt-1"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}