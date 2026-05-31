import React, { useState } from 'react';
import { Calendar, TrendingUp, DollarSign, ShoppingBag, Package } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function Analytics() {
  const { state, getSalesReport } = useApp();
  const [dateRange, setDateRange] = useState('week');
  
  const getDateRange = () => {
    const today = new Date();
    let startDate: Date;
    
    switch (dateRange) {
      case 'today':
        startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        break;
      case 'week':
        startDate = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        startDate = new Date(today.getFullYear(), today.getMonth(), 1);
        break;
      case 'year':
        startDate = new Date(today.getFullYear(), 0, 1);
        break;
      default:
        startDate = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    }
    
    return { startDate, endDate: today };
  };

  const { startDate, endDate } = getDateRange();
  const salesReport = getSalesReport(startDate, endDate);

  const totalProducts = state.products.length;
  const lowStockProducts = state.products.filter(p => p.stock <= 5).length;
  const averageOrderValue = salesReport.totalOrders > 0 ? salesReport.totalSales / salesReport.totalOrders : 0;

  const categoryStats = state.products.reduce((acc, product) => {
    acc[product.category] = (acc[product.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Removed petType stats for electronics

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600">Track your business performance and insights</p>
        </div>
        <select
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        >
          <option value="today">Today</option>
          <option value="week">Last 7 Days</option>
          <option value="month">This Month</option>
          <option value="year">This Year</option>
        </select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">${salesReport.totalSales.toFixed(2)}</p>
              <p className="text-xs text-green-600">+12.5% from last period</p>
            </div>
            <div className="bg-green-500 p-3 rounded-lg">
              <DollarSign className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">{salesReport.totalOrders}</p>
              <p className="text-xs text-green-600">+8.2% from last period</p>
            </div>
            <div className="bg-blue-500 p-3 rounded-lg">
              <ShoppingBag className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Average Order Value</p>
              <p className="text-2xl font-bold text-gray-900">${averageOrderValue.toFixed(2)}</p>
              <p className="text-xs text-green-600">+3.8% from last period</p>
            </div>
            <div className="bg-purple-500 p-3 rounded-lg">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Low Stock Items</p>
              <p className="text-2xl font-bold text-gray-900">{lowStockProducts}</p>
              <p className="text-xs text-orange-600">Needs attention</p>
            </div>
            <div className="bg-orange-500 p-3 rounded-lg">
              <Package className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Top Products */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Selling Products</h3>
          <div className="space-y-4">
            {salesReport.topProducts.slice(0, 5).map((item, index) => (
              <div key={item.product.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-medium text-gray-500">#{index + 1}</span>
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-10 h-10 object-cover rounded-lg"
                  />
                  <div>
                    <p className="font-medium text-gray-900 truncate max-w-xs">{item.product.name}</p>
                    <p className="text-sm text-gray-600">{item.quantitySold} sold</p>
                  </div>
                </div>
                <p className="font-semibold text-gray-900">${item.revenue.toFixed(2)}</p>
              </div>
            ))}
            {salesReport.topProducts.length === 0 && (
              <p className="text-gray-500 text-center py-4">No sales data available</p>
            )}
          </div>
        </div>

        {/* Payment Methods */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Methods</h3>
          <div className="space-y-4">
            {Object.entries(salesReport.paymentMethods).map(([method, amount]) => {
              const percentage = salesReport.totalSales > 0 ? (amount / salesReport.totalSales) * 100 : 0;
              return (
                <div key={method} className="space-y-2">
                  <div className="flex justify-between">
                    <span className="capitalize font-medium">{method}</span>
                    <span>${amount.toFixed(2)} ({percentage.toFixed(1)}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        method === 'cash' ? 'bg-green-500' :
                        method === 'card' ? 'bg-blue-500' : 'bg-purple-500'
                      }`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Categories */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Products by Category</h3>
          <div className="space-y-4">
            {Object.entries(categoryStats).map(([category, count]) => {
              const percentage = totalProducts > 0 ? (count / totalProducts) * 100 : 0;
              return (
                <div key={category} className="space-y-2">
                  <div className="flex justify-between">
                    <span className="capitalize font-medium">{category}</span>
                    <span>{count} products ({percentage.toFixed(1)}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        category === 'food' ? 'bg-green-500' :
                        category === 'toys' ? 'bg-blue-500' :
                        category === 'medicine' ? 'bg-red-500' : 'bg-purple-500'
                      }`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        
      </div>
    </div>
  );
}