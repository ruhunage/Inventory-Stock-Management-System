import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function AdminLogin() {
  const { state, login } = useApp();
  const [email, setEmail] = useState('admin@gmail.com');
  const [password, setPassword] = useState('admin');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const ok = await login(email, password);
    if (ok) {
      navigate('/admin', { replace: true });
    } else {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-md p-8 rounded-lg shadow">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">TecnoBuy Admin Login</h1>
        <p className="text-gray-600 mb-6">Use your admin credentials to access the dashboard.</p>
        {error && <div className="mb-4 text-sm text-red-600">{error}</div>}
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              required
            />
          </div>
          <button
            type="submit"
            disabled={state.isLoading}
            className="w-full bg-emerald-600 text-white py-2 rounded-md hover:bg-emerald-700 transition-colors flex items-center justify-center"
          >
            <LogIn className="h-4 w-4 mr-2" />
            {state.isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}


