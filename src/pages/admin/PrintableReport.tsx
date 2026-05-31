import React, { useEffect } from 'react';
import { useApp } from '../../context/AppContext';

export default function PrintableReport() {
  const { state } = useApp();

  useEffect(() => {
    const timer = setTimeout(() => {
      window.print();
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  const today = new Date();
  const fmt = (d: Date) => `${d.toLocaleDateString()} ${d.toLocaleTimeString()}`;

  return (
    <div className="p-8">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold">TecnoBuy - Sales Report</h1>
        <p className="text-sm text-gray-600">Generated on {fmt(today)}</p>
      </div>

      <div className="mb-4">
        <h2 className="font-semibold mb-2">Orders</h2>
        <table className="w-full text-sm" style={{ borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left', borderBottom: '1px solid #e5e7eb', padding: '8px' }}>Order ID</th>
              <th style={{ textAlign: 'left', borderBottom: '1px solid #e5e7eb', padding: '8px' }}>Order Date</th>
              <th style={{ textAlign: 'left', borderBottom: '1px solid #e5e7eb', padding: '8px' }}>Buyer</th>
              <th style={{ textAlign: 'left', borderBottom: '1px solid #e5e7eb', padding: '8px' }}>Items</th>
              <th style={{ textAlign: 'right', borderBottom: '1px solid #e5e7eb', padding: '8px' }}>Total</th>
            </tr>
          </thead>
          <tbody>
            {state.orders.length === 0 && (
              <tr>
                <td colSpan={5} style={{ padding: '12px' }}>No orders available</td>
              </tr>
            )}
            {state.orders.map(o => (
              <tr key={o.id}>
                <td style={{ padding: '8px' }}>#{o.id}</td>
                <td style={{ padding: '8px' }}>{fmt(o.timestamp)}</td>
                <td style={{ padding: '8px' }}>{o.customerInfo.name}</td>
                <td style={{ padding: '8px' }}>
                  {o.items.map(i => `${i.product.name} x ${i.quantity}`).join(', ')}
                </td>
                <td style={{ padding: '8px', textAlign: 'right' }}>${o.total.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div>
        <h2 className="font-semibold mb-2">Current Stock</h2>
        <table className="w-full text-sm" style={{ borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left', borderBottom: '1px solid #e5e7eb', padding: '8px' }}>Product</th>
              <th style={{ textAlign: 'left', borderBottom: '1px solid #e5e7eb', padding: '8px' }}>Category</th>
              <th style={{ textAlign: 'right', borderBottom: '1px solid #e5e7eb', padding: '8px' }}>Price</th>
              <th style={{ textAlign: 'right', borderBottom: '1px solid #e5e7eb', padding: '8px' }}>Stock</th>
            </tr>
          </thead>
          <tbody>
            {state.products.map(p => (
              <tr key={p.id}>
                <td style={{ padding: '8px' }}>{p.name}</td>
                <td style={{ padding: '8px', textTransform: 'capitalize' }}>{p.category}</td>
                <td style={{ padding: '8px', textAlign: 'right' }}>${p.price.toFixed(2)}</td>
                <td style={{ padding: '8px', textAlign: 'right' }}>{p.stock}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}


