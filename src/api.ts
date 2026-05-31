const API_BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:8080/api';

export interface BackendProduct {
  id?: number;
  name: string;
  category: 'phones' | 'laptops' | 'audio' | 'gaming' | 'tv' | 'accessories' | string;
  price: number;
  stock: number;
  description: string;
  image: string;
  lowStockThreshold?: number;
}

function toFrontendProduct(p: BackendProduct) {
  return { ...p, id: String(p.id) } as any;
}

export async function getProducts() {
  const res = await fetch(`${API_BASE_URL}/products`);
  if (!res.ok) throw new Error('Failed to fetch products');
  const data = await res.json();
  return (data as BackendProduct[]).map(toFrontendProduct);
}

export async function createProduct(product: Omit<BackendProduct, 'id'>) {
  const res = await fetch(`${API_BASE_URL}/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(product),
  });
  if (!res.ok) throw new Error('Failed to create product');
  return toFrontendProduct(await res.json());
}

export async function updateProduct(id: string | number, product: Omit<BackendProduct, 'id'>) {
  const res = await fetch(`${API_BASE_URL}/products/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(product),
  });
  if (!res.ok) throw new Error('Failed to update product');
  return toFrontendProduct(await res.json());
}

export async function deleteProduct(id: string | number) {
  const res = await fetch(`${API_BASE_URL}/products/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete product');
}

export async function updateProductStock(id: string | number, stock: number) {
  const url = new URL(`${API_BASE_URL}/products/${id}/stock`);
  url.searchParams.set('stock', String(stock));
  const res = await fetch(url.toString(), { method: 'PATCH' });
  if (!res.ok) throw new Error('Failed to update stock');
  return toFrontendProduct(await res.json());
}

export interface BackendAlert {
  id?: number;
  product: BackendProduct;
  currentStock: number;
  threshold: number;
  severity: 'low' | 'critical' | 'out';
  createdAt?: string;
}

export async function listAlerts() {
  const res = await fetch(`${API_BASE_URL}/alerts`);
  if (!res.ok) throw new Error('Failed to fetch alerts');
  const data = await res.json();
  return data as BackendAlert[];
}

export interface BackendOrderItem {
  product: { id: number };
  quantity: number;
  unitPrice?: number;
}

export interface BackendOrder {
  id?: number;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  paymentMethod: 'cash' | 'card' | 'online';
  total: number;
  items: BackendOrderItem[];
}

export async function createOrder(order: BackendOrder) {
  const res = await fetch(`${API_BASE_URL}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(order),
  });
  if (!res.ok) throw new Error('Failed to create order');
  return await res.json();
}

export async function downloadOrdersReportPdf() {
  const res = await fetch(`${API_BASE_URL}/orders/report/pdf`);
  if (!res.ok) throw new Error('Failed to download report');
  const blob = await res.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `tecnobuy_report.pdf`;
  a.click();
  window.URL.revokeObjectURL(url);
}

export interface BackendReport {
  id?: number;
  name: string;
  createdAt?: string;
  fromDate?: string;
  toDate?: string;
  createdBy?: string;
  notes?: string;
  totalOrders?: number;
  totalSales?: number;
}

export async function listReports(): Promise<BackendReport[]> {
  const res = await fetch(`${API_BASE_URL}/reports`);
  if (!res.ok) throw new Error('Failed to load reports');
  return await res.json();
}

export async function createReport(report: BackendReport): Promise<BackendReport> {
  const res = await fetch(`${API_BASE_URL}/reports`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(report),
  });
  if (!res.ok) throw new Error('Failed to create report');
  return await res.json();
}

export async function deleteReport(id: number): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/reports/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete report');
}

export async function downloadReportPdfById(id: number) {
  const res = await fetch(`${API_BASE_URL}/reports/${id}/pdf`);
  if (!res.ok) throw new Error('Failed to download report');
  const blob = await res.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `report_${id}.pdf`;
  a.click();
  window.URL.revokeObjectURL(url);
}

