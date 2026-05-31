import React from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  AlertTriangle,
  Users,
  Settings
} from 'lucide-react';

export default function AdminLayout() {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const menuItems = [
    { path: '/admin', icon: LayoutDashboard, label: 'Dashboard', exact: true },
    { path: '/admin/products', icon: Package, label: 'Products' },
    { path: '/admin/orders', icon: ShoppingBag, label: 'Orders' },
    { path: '/admin/inventory', icon: AlertTriangle, label: 'Inventory Alerts' },
    { path: '/admin/reports', icon: Users, label: 'Reports' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-black shadow-lg border-r border-green-800">
        <div className="p-6 border-b border-green-800">
          <h2 className="text-xl font-bold text-green-400">TecnoBuy Admin</h2>
          <p className="text-sm text-green-600">Electronics Management</p>
        </div>
        
        <nav className="mt-6">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = item.exact ? location.pathname === item.path : location.pathname.startsWith(item.path);
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-6 py-3 text-sm font-medium transition-colors ${
                  active
                    ? 'bg-green-900 text-green-300 border-r-2 border-green-500'
                    : 'text-green-400 hover:bg-green-900 hover:text-green-300'
                }`}
              >
                <Icon className="h-5 w-5 mr-3" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
}