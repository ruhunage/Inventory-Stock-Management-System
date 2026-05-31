import React from 'react';
import { 
  Package, 
  ShoppingBag, 
  DollarSign, 
  TrendingUp,
  AlertTriangle,
  Users,
  Calendar
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function Dashboard() {
  const { state, getSalesReport, getInventoryAlerts } = useApp();
  
  const today = new Date();
  const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
  const salesReport = getSalesReport(lastWeek, today);
  const inventoryAlerts = getInventoryAlerts();
  
  const totalProducts = state.products.length;
  const lowStockProducts = state.products.filter(p => p.stock <= 5).length;
  const outOfStockProducts = state.products.filter(p => p.stock === 0).length;

  const stats = [
    {
      title: 'Total Products',
      value: totalProducts,
      icon: Package,
      color: 'bg-blue-500',
      change: '+2.5%',
    },
    {
      title: 'Weekly Sales',
      value: `$${salesReport.totalSales.toFixed(2)}`,
      icon: DollarSign,
      color: 'bg-green-500',
      change: '+12.3%',
    },
    {
      title: 'Total Orders',
      value: salesReport.totalOrders,
      icon: ShoppingBag,
      color: 'bg-purple-500',
      change: '+8.1%',
    },
    {
      title: 'Low Stock Items',
      value: lowStockProducts,
      icon: AlertTriangle,
      color: 'bg-emerald-600',
      change: lowStockProducts > 0 ? 'Action needed' : 'All good',
    },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's what's happening with your store.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className={`text-xs ${
                    stat.change.includes('+') ? 'text-green-600' : 
                    stat.change.includes('Action') ? 'text-emerald-600' : 'text-gray-600'
                  }`}>
                    {stat.change}
                  </p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Orders</h3>
          <div className="space-y-4">
            {state.orders.slice(-5).reverse().map((order) => (
              <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">Order #{order.id}</p>
                  <p className="text-sm text-gray-600">{order.customerInfo.name}</p>
                  <p className="text-xs text-gray-500">
                    {order.timestamp.toLocaleDateString()} at {order.timestamp.toLocaleTimeString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">${order.total.toFixed(2)}</p>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    order.status === 'completed' ? 'bg-green-100 text-green-800' :
                    order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
            {state.orders.length === 0 && (
              <p className="text-gray-500 text-center py-4">No orders yet</p>
            )}
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Selling Products</h3>
          <div className="space-y-4">
            {salesReport.topProducts.slice(0, 5).map((item, index) => (
              <div key={item.product.id} className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-12 h-12 object-cover rounded-lg"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">{item.product.name}</p>
                  <p className="text-sm text-gray-600">{item.quantitySold} sold</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">${item.revenue.toFixed(2)}</p>
                </div>
              </div>
            ))}
            {salesReport.topProducts.length === 0 && (
              <p className="text-gray-500 text-center py-4">No sales data available</p>
            )}
          </div>
        </div>
      </div>

      {/* Inventory Alerts */}
      {inventoryAlerts.length > 0 && (
        <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <AlertTriangle className="h-5 w-5 text-emerald-600 mr-2" />
            Inventory Alerts
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {inventoryAlerts.slice(0, 6).map((alert) => (
              <div key={alert.id} className={`p-4 rounded-lg border-l-4 ${
                alert.severity === 'out' ? 'border-red-500 bg-red-50' :
                alert.severity === 'critical' ? 'border-emerald-500 bg-emerald-50' :
                'border-emerald-200 bg-emerald-50'
              }`}>
                <p className="font-medium text-gray-900">{alert.product.name}</p>
                <p className="text-sm text-gray-600">
                  Stock: {alert.currentStock} / Threshold: {alert.threshold}
                </p>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  alert.severity === 'out' ? 'bg-red-100 text-red-800' :
                  alert.severity === 'critical' ? 'bg-emerald-100 text-emerald-800' :
                  'bg-emerald-50 text-emerald-700'
                }`}>
                  {alert.severity.toUpperCase()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}