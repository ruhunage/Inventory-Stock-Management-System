import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Notification from './components/Notification';
import Shop from './pages/Shop';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Confirmation from './pages/Confirmation';
import AdminLayout from './components/admin/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import ProductManagement from './pages/admin/ProductManagement';
import OrderManagement from './pages/admin/OrderManagement';
import InventoryAlerts from './pages/admin/InventoryAlerts';
import { useApp } from './context/AppContext';
import AdminLogin from './pages/admin/Login';
import Reports from './pages/admin/Reports';
import PrintableReport from './pages/admin/PrintableReport';

function NotificationContainer() {
  const { state } = useApp();

  return (
    <div className="fixed top-20 right-4 z-50 space-y-2 max-w-md">
      {state.notifications.map((notification) => (
        <Notification key={notification.id} notification={notification} />
      ))}
    </div>
  );
}

function AdminGuard({ children }: { children: React.ReactNode }) {
  const { state } = useApp();
  if (!state.currentUser || state.currentUser.role !== 'admin') {
    return <Navigate to="/admin/login" replace />;
  }
  return <>{children}</>;
}

function AppContent() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <NotificationContainer />
      <Routes>
        <Route path="/" element={<Shop />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/confirmation" element={<Confirmation />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminGuard><AdminLayout /></AdminGuard>}>
          <Route index element={<Dashboard />} />
          <Route path="products" element={<ProductManagement />} />
          <Route path="orders" element={<OrderManagement />} />
          <Route path="inventory" element={<InventoryAlerts />} />
          <Route path="reports" element={<Reports />} />
          <Route path="reports/print" element={<PrintableReport />} />
        </Route>
      </Routes>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </Router>
  );
}

export default App;