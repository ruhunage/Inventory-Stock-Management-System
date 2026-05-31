import React, { useMemo, useState, useEffect } from 'react';
import { Download } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { downloadOrdersReportPdf, listReports, createReport, deleteReport, downloadReportPdfById } from '../../api';

export default function Reports() {
  const { state, getSalesReport } = useApp();
  const [dateRange, setDateRange] = useState('month');
  const [reports, setReports] = useState<any[]>([]);
  const [newReportName, setNewReportName] = useState('Monthly Summary');

  const { startDate, endDate } = useMemo(() => {
    const today = new Date();
    let start: Date;
    switch (dateRange) {
      case 'today':
        start = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        break;
      case 'week':
        start = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        start = new Date(today.getFullYear(), today.getMonth(), 1);
        break;
      case 'year':
        start = new Date(today.getFullYear(), 0, 1);
        break;
      default:
        start = new Date(today.getFullYear(), today.getMonth(), 1);
    }
    return { startDate: start, endDate: today };
  }, [dateRange]);

  const report = getSalesReport(startDate, endDate);

  const exportPaymentsCSV = () => {
    const rows = [
      ['Date', 'Total Orders', 'Total Sales', 'Cash', 'Card', 'Online'],
      [
        report.date,
        String(report.totalOrders),
        report.totalSales.toFixed(2),
        report.paymentMethods.cash.toFixed(2),
        report.paymentMethods.card.toFixed(2),
        report.paymentMethods.online.toFixed(2),
      ],
    ];
    const csv = rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `payments_${report.date}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportStockCSV = () => {
    const rows = [
      ['Product', 'Category', 'Price', 'Stock'],
      ...state.products.map(p => [p.name, p.category, p.price.toFixed(2), String(p.stock)]),
    ];
    const csv = rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `stock_${report.date}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportPdf = async () => {
    await downloadOrdersReportPdf();
  };

  const refreshReports = async () => {
    try {
      const data = await listReports();
      setReports(data);
    } catch {}
  };

  useEffect(() => {
    refreshReports();
  }, []);

  const handleCreateReport = async () => {
    try {
      await createReport({ name: newReportName, createdBy: state.currentUser?.name || 'Admin', totalOrders: report.totalOrders, totalSales: report.totalSales });
      setNewReportName('Monthly Summary');
      refreshReports();
    } catch {}
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reports</h1>
          <p className="text-gray-600">Generate payments and stock reports</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          >
            <option value="today">Today</option>
            <option value="week">Last 7 Days</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>
          <button
            onClick={exportPdf}
            className="bg-emerald-700 text-white px-4 py-2 rounded-md hover:bg-emerald-800 transition-colors inline-flex items-center"
          >
            <Download className="h-5 w-5 mr-2" />
            Download PDF
          </button>
          <a
            href="/admin/reports/print"
            className="px-4 py-2 rounded-md border text-gray-700 hover:text-emerald-700 hover:border-emerald-300 transition-colors text-sm"
            target="_blank"
            rel="noopener noreferrer"
          >
            Print-friendly
          </a>
          <a
            href={(import.meta as any).env?.VITE_API_BASE_URL ? `${(import.meta as any).env.VITE_API_BASE_URL}/orders/report/pdf` : 'http://localhost:8080/api/orders/report/pdf'}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-md border text-gray-700 hover:text-emerald-700 hover:border-emerald-300 transition-colors text-sm"
          >
            Open PDF in new tab
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">PDF Report</h3>
          <p className="text-sm text-gray-600 mb-4">Generate a TecnoBuy branded PDF with orders including date and buyer name.</p>
          <button onClick={exportPdf} className="bg-emerald-700 text-white px-4 py-2 rounded-lg hover:bg-emerald-800 transition-colors">
            Download PDF Report
          </button>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Saved Reports</h3>
          <div className="flex gap-2 mb-4">
            <input
              value={newReportName}
              onChange={(e) => setNewReportName(e.target.value)}
              className="flex-1 px-3 py-2 border rounded-md"
              placeholder="Report name (e.g., March 2025 Summary)"
            />
            <button onClick={handleCreateReport} className="px-3 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700">Save Current</button>
          </div>
          <div className="max-h-64 overflow-auto border rounded">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2 text-left">Name</th>
                  <th className="px-3 py-2 text-left">Created</th>
                  <th className="px-3 py-2 text-right">Orders</th>
                  <th className="px-3 py-2 text-right">Sales</th>
                  <th className="px-3 py-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((r) => (
                  <tr key={r.id} className="border-t">
                    <td className="px-3 py-2">{r.name}</td>
                    <td className="px-3 py-2">{r.createdAt ? new Date(r.createdAt).toLocaleString() : '-'}</td>
                    <td className="px-3 py-2 text-right">{r.totalOrders ?? '-'}</td>
                    <td className="px-3 py-2 text-right">{r.totalSales != null ? `$${Number(r.totalSales).toFixed(2)}` : '-'}</td>
                    <td className="px-3 py-2 text-right space-x-2">
                      <button onClick={() => downloadReportPdfById(r.id)} className="text-gray-700 hover:text-emerald-700">PDF</button>
                      <button onClick={async () => { await deleteReport(r.id); refreshReports(); }} className="text-red-600 hover:text-red-800">Delete</button>
                    </td>
                  </tr>
                ))}
                {reports.length === 0 && (
                  <tr>
                    <td className="px-3 py-4 text-center text-gray-500" colSpan={5}>No saved reports</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Payments Summary</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span>Total Orders</span><span>{report.totalOrders}</span></div>
            <div className="flex justify-between"><span>Total Sales</span><span>${report.totalSales.toFixed(2)}</span></div>
            <div className="flex justify-between"><span>Cash</span><span>${report.paymentMethods.cash.toFixed(2)}</span></div>
            <div className="flex justify-between"><span>Card</span><span>${report.paymentMethods.card.toFixed(2)}</span></div>
            <div className="flex justify-between"><span>Online</span><span>${report.paymentMethods.online.toFixed(2)}</span></div>
          </div>
          <button onClick={exportPaymentsCSV} className="mt-6 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors flex items-center">
            <Download className="h-5 w-5 mr-2" />
            Export Payments CSV
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Stock Levels</h3>
          <div className="max-h-64 overflow-auto border rounded">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="px-4 py-2 text-left">Product</th>
                  <th className="px-4 py-2 text-left">Category</th>
                  <th className="px-4 py-2 text-right">Price</th>
                  <th className="px-4 py-2 text-right">Stock</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {state.products.map(p => (
                  <tr key={p.id}>
                    <td className="px-4 py-2">{p.name}</td>
                    <td className="px-4 py-2 capitalize">{p.category}</td>
                    <td className="px-4 py-2 text-right">${p.price.toFixed(2)}</td>
                    <td className="px-4 py-2 text-right">{p.stock}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button onClick={exportStockCSV} className="mt-6 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors flex items-center">
            <Download className="h-5 w-5 mr-2" />
            Export Stock CSV
          </button>
        </div>
      </div>
    </div>
  );
}


