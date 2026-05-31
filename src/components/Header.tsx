import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, LogOut, User, Search, Smartphone, Monitor } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Header() {
  const { state, logout } = useApp();
  const location = useLocation();
  const cartItemCount = state.cart.reduce((total, item) => total + item.quantity, 0);

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    logout();
  };
  return (
    <header className="bg-white/80 backdrop-blur shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-2">
              <span className="inline-flex items-center justify-center bg-emerald-50 text-emerald-600 rounded-lg px-2 py-1">
                <Smartphone className="h-5 w-5" />
                <Monitor className="h-5 w-5 -ml-1" />
              </span>
              <span className="text-2xl font-bold text-gray-900">Welcome to Lanka Traders</span>
            </Link>
            
            <nav className="hidden md:flex space-x-6">
              <Link
                to="/"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/') 
                    ? 'bg-emerald-100 text-emerald-700' 
                    : 'text-gray-700 hover:text-emerald-600 hover:bg-gray-50'
                }`}
              >
                Shop
              </Link>
              <Link
                to="/cart"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/cart') 
                    ? 'bg-emerald-100 text-emerald-700' 
                    : 'text-gray-700 hover:text-emerald-600 hover:bg-gray-50'
                }`}
              >
                Cart
              </Link>
              {state.currentUser?.role === 'admin' && (
                <Link
                  to="/admin"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive('/admin') 
                      ? 'bg-emerald-100 text-emerald-700' 
                      : 'text-gray-700 hover:text-emerald-600 hover:bg-gray-50'
                  }`}
                >
                  Admin
                </Link>
              )}
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center bg-gray-100 rounded-full px-3 py-1.5 w-64">
              <Search className="h-4 w-4 text-gray-400 mr-2" />
              <input
                type="text"
                placeholder="Search electronics..."
                className="bg-transparent outline-none text-sm w-full placeholder:text-gray-400"
                onChange={(e) => {/* reserved for future global search */}}
              />
            </div>
            {state.currentUser && (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <User className="h-5 w-5 text-gray-600" />
                  <span className="text-sm text-gray-700">{state.currentUser.name}</span>
                  <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full">
                    {state.currentUser.role}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 text-gray-600 hover:text-emerald-600 transition-colors"
                  title="Logout"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            )}
            {!state.currentUser && (
              <Link
                to="/admin"
                className="px-3 py-2 rounded-md text-sm font-medium transition-colors text-gray-700 hover:text-emerald-600 hover:bg-gray-50"
              >
                Admin Login
              </Link>
            )}
            <Link
              to="/cart"
              className="relative p-2 text-gray-600 hover:text-emerald-600 transition-colors"
            >
              <ShoppingCart className="h-6 w-6" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-emerald-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                  {cartItemCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}