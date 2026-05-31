export interface Product {
  id: string;
  name: string;
  category: 'phones' | 'laptops' | 'audio' | 'gaming' | 'tv' | 'accessories';
  price: number;
  stock: number;
  description: string;
  image: string;
  lowStockThreshold?: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  paymentMethod: 'cash' | 'card' | 'online';
  customerInfo: CustomerInfo;
  timestamp: Date;
  status: 'pending' | 'completed' | 'failed';
}

export interface CustomerInfo {
  name: string;
  phone: string;
  email?: string;
}

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  timestamp: Date;
}

export type PaymentMethod = 'cash' | 'card' | 'online';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'sales';
  avatar?: string;
  lastLogin?: Date;
}

export interface SalesReport {
  date: string;
  totalSales: number;
  totalOrders: number;
  topProducts: Array<{
    product: Product;
    quantitySold: number;
    revenue: number;
  }>;
  paymentMethods: {
    cash: number;
    card: number;
    online: number;
  };
}

export interface InventoryAlert {
  id: string;
  product: Product;
  currentStock: number;
  threshold: number;
  severity: 'low' | 'critical' | 'out';
  timestamp: Date;
}