import React from 'react';
import { AlertTriangle, Package, Trash2, RefreshCw } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function InventoryAlerts() {
  const { state, getInventoryAlerts, updateProductStock, dispatch } = useApp();
  const inventoryAlerts = getInventoryAlerts();
  
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'out':
        return 'border-red-500 bg-red-50';
      case 'critical':
        return 'border-emerald-500 bg-emerald-50';
      case 'low':
        return 'border-yellow-500 bg-yellow-50';
      default:
        return 'border-gray-500 bg-gray-50';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'out':
        return 'text-red-500';
      case 'critical':
        return 'text-emerald-600';
      case 'low':
        return 'text-yellow-500';
      default:
        return 'text-gray-500';
    }
  };

  const handleQuickRestock = (productId: string, currentStock: number) => {
    const newStock = currentStock + 20; // Add 20 units
    updateProductStock(productId, newStock);
  };

  const handleDismissAlert = (alertId: string) => {
    dispatch({ type: 'REMOVE_INVENTORY_ALERT', payload: alertId });
  };

  const lowStockProducts = state.products.filter(p => p.stock > 0 && p.stock <= (p.lowStockThreshold ?? 5));
  const outOfStockProducts = state.products.filter(p => p.stock === 0);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Inventory Alerts</h1>
        <p className="text-gray-600">Monitor and manage stock levels across all products</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Out of Stock</p>
              <p className="text-2xl font-bold text-red-600">{outOfStockProducts.length}</p>
            </div>
            <div className="bg-red-500 p-3 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Low Stock</p>
              <p className="text-2xl font-bold text-emerald-600">{lowStockProducts.length}</p>
            </div>
            <div className="bg-emerald-600 p-3 rounded-lg">
              <Package className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Alerts</p>
              <p className="text-2xl font-bold text-gray-900">{inventoryAlerts.length}</p>
            </div>
            <div className="bg-gray-500 p-3 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Active Alerts */}
      {inventoryAlerts.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Alerts</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {inventoryAlerts.map((alert) => (
              <div key={alert.id} className={`p-4 rounded-lg border-l-4 ${getSeverityColor(alert.severity)}`}>
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center">
                    <AlertTriangle className={`h-5 w-5 mr-2 ${getSeverityIcon(alert.severity)}`} />
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      alert.severity === 'out' ? 'bg-red-100 text-red-800' :
                      alert.severity === 'critical' ? 'bg-emerald-100 text-emerald-800' :
                      'bg-emerald-50 text-emerald-700'
                    }`}>
                      {alert.severity.toUpperCase()}
                    </span>
                  </div>
                  <button
                    onClick={() => handleDismissAlert(alert.id)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <p className="font-medium text-gray-900 mb-1">{alert.product.name}</p>
                <p className="text-sm text-gray-600 mb-3">
                  Current Stock: {alert.currentStock} / Threshold: {alert.threshold}
                </p>
                <button
                  onClick={() => handleQuickRestock(alert.product.id, alert.currentStock)}
                  className="w-full bg-emerald-600 text-white py-2 px-3 rounded-md hover:bg-emerald-700 transition-colors text-sm flex items-center justify-center"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Quick Restock (+20)
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Out of Stock Products */}
      {outOfStockProducts.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 text-red-600">
            Out of Stock Products
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {outOfStockProducts.map((product) => (
              <div key={product.id} className="border border-red-200 rounded-lg p-4 bg-red-50">
                <div className="flex items-center space-x-3 mb-3">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-12 h-12 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{product.name}</p>
                    <p className="text-sm text-gray-600">${product.price.toFixed(2)}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleQuickRestock(product.id, 0)}
                  className="w-full bg-emerald-600 text-white py-2 px-3 rounded-md hover:bg-emerald-700 transition-colors text-sm flex items-center justify-center"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Restock Now
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Low Stock Products */}
      {lowStockProducts.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 text-emerald-600">
            Low Stock Products
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {lowStockProducts.map((product) => (
              <div key={product.id} className="border border-emerald-200 rounded-lg p-4 bg-emerald-50">
                <div className="flex items-center space-x-3 mb-3">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-12 h-12 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{product.name}</p>
                    <p className="text-sm text-gray-600">${product.price.toFixed(2)}</p>
                    <p className="text-sm text-emerald-700">Stock: {product.stock} / Threshold: {product.lowStockThreshold ?? 5}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleQuickRestock(product.id, product.stock)}
                  className="w-full bg-emerald-600 text-white py-2 px-3 rounded-md hover:bg-emerald-700 transition-colors text-sm flex items-center justify-center"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Restock (+20)
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {inventoryAlerts.length === 0 && outOfStockProducts.length === 0 && lowStockProducts.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <Package className="mx-auto h-16 w-16 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">All Good!</h3>
          <p className="text-gray-500">No inventory alerts at the moment. All products are well-stocked.</p>
        </div>
      )}
    </div>
  );
}