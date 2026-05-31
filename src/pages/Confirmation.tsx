import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Download, Home } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Confirmation() {
  const { state } = useApp();
  const lastOrder = state.orders[state.orders.length - 1];

  if (!lastOrder) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No order found</h2>
          <Link to="/" className="text-emerald-600 hover:text-emerald-700">
            Return to shop
          </Link>
        </div>
      </div>
    );
  }

  const printReceipt = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm p-8">
          {/* Success Header */}
          <div className="text-center mb-8">
            <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
            <p className="text-gray-600">Thank you for your purchase. Your order has been successfully processed.</p>
          </div>

          {/* Order Details */}
          <div className="border-t border-b py-6 mb-6">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Order ID</h3>
                <p className="text-lg font-semibold">#{lastOrder.id}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Date</h3>
                <p className="text-lg">{lastOrder.timestamp.toLocaleDateString()}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Customer</h3>
                <p className="text-lg">{lastOrder.customerInfo.name}</p>
                <p className="text-sm text-gray-600">{lastOrder.customerInfo.phone}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Payment Method</h3>
                <p className="text-lg capitalize">{lastOrder.paymentMethod}</p>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Items</h3>
            <div className="space-y-3">
              {lastOrder.items.map((item) => (
                <div key={item.product.id} className="flex justify-between items-center py-2 border-b border-gray-100">
                  <div>
                    <p className="font-medium">{item.product.name}</p>
                    <p className="text-sm text-gray-600">${item.product.price.toFixed(2)} × {item.quantity}</p>
                  </div>
                  <p className="font-semibold">${(item.product.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Order Total */}
          <div className="border-t pt-4 mb-8">
            <div className="flex justify-between items-center mb-2">
              <span>Subtotal</span>
              <span>${lastOrder.total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span>Tax</span>
              <span>${(lastOrder.total * 0.08).toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center font-semibold text-lg border-t pt-2">
              <span>Total</span>
              <span>${(lastOrder.total * 1.08).toFixed(2)}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={printReceipt}
              className="flex-1 bg-gray-600 text-white py-3 rounded-lg font-medium hover:bg-gray-700 transition-colors flex items-center justify-center"
            >
              <Download className="h-5 w-5 mr-2" />
              Print Receipt
            </button>
            <Link
              to="/"
              className="flex-1 bg-emerald-600 text-white py-3 rounded-lg font-medium hover:bg-emerald-700 transition-colors text-center flex items-center justify-center"
            >
              <Home className="h-5 w-5 mr-2" />
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}