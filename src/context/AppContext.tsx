import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { Product, CartItem, Order, Notification, CustomerInfo, PaymentMethod, User, SalesReport, InventoryAlert } from '../types';
import { getProducts as apiGetProducts, createProduct as apiCreateProduct, updateProduct as apiUpdateProduct, deleteProduct as apiDeleteProduct, updateProductStock as apiUpdateProductStock, createOrder as apiCreateOrder, listAlerts } from '../api';

interface AppState {
  products: Product[];
  cart: CartItem[];
  orders: Order[];
  notifications: Notification[];
  currentUser: User | null;
  inventoryAlerts: InventoryAlert[];
  isLoading: boolean;
  searchTerm: string;
  selectedCategory: string;
  // removed petType filtering for electronics store
}

type AppAction =
  | { type: 'SET_PRODUCTS'; payload: Product[] }
  | { type: 'ADD_PRODUCT'; payload: Product }
  | { type: 'UPDATE_PRODUCT'; payload: Product }
  | { type: 'DELETE_PRODUCT'; payload: string }
  | { type: 'ADD_TO_CART'; payload: { product: Product; quantity: number } }
  | { type: 'REMOVE_FROM_CART'; payload: string }
  | { type: 'UPDATE_CART_QUANTITY'; payload: { productId: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'CREATE_ORDER'; payload: Order }
  | { type: 'ADD_NOTIFICATION'; payload: Notification }
  | { type: 'REMOVE_NOTIFICATION'; payload: string }
  | { type: 'UPDATE_STOCK'; payload: { productId: string; quantity: number } }
  | { type: 'SET_CURRENT_USER'; payload: User | null }
  | { type: 'ADD_INVENTORY_ALERT'; payload: InventoryAlert }
  | { type: 'REMOVE_INVENTORY_ALERT'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_SEARCH_TERM'; payload: string }
  | { type: 'SET_CATEGORY'; payload: string };

const initialState: AppState = {
  products: [],
  cart: [],
  orders: [],
  notifications: [],
  currentUser: null,
  inventoryAlerts: [],
  isLoading: false,
  searchTerm: '',
  selectedCategory: '',
};

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  addToCart: (product: Product, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  processPayment: (paymentMethod: PaymentMethod, customerInfo: CustomerInfo) => Promise<boolean>;
  addNotification: (type: Notification['type'], message: string) => void;
  getFilteredProducts: () => Product[];
  getTotalCartValue: () => number;
  checkStockAvailability: (productId: string, quantity: number) => boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (productId: string) => void;
  getSalesReport: (startDate: Date, endDate: Date) => SalesReport;
  getInventoryAlerts: () => InventoryAlert[];
  updateProductStock: (productId: string, newStock: number) => void;
} | undefined>(undefined);

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_PRODUCTS':
      return { ...state, products: action.payload };
    case 'ADD_PRODUCT':
      return { ...state, products: [...state.products, action.payload] };
    case 'UPDATE_PRODUCT':
      return {
        ...state,
        products: state.products.map(product =>
          product.id === action.payload.id ? action.payload : product
        ),
      };
    case 'DELETE_PRODUCT':
      return {
        ...state,
        products: state.products.filter(product => product.id !== action.payload),
      };
    case 'ADD_TO_CART':
      const existingItem = state.cart.find(item => item.product.id === action.payload.product.id);
      if (existingItem) {
        return {
          ...state,
          cart: state.cart.map(item =>
            item.product.id === action.payload.product.id
              ? { ...item, quantity: item.quantity + action.payload.quantity }
              : item
          ),
        };
      }
      return {
        ...state,
        cart: [...state.cart, { product: action.payload.product, quantity: action.payload.quantity }],
      };
    case 'REMOVE_FROM_CART':
      return {
        ...state,
        cart: state.cart.filter(item => item.product.id !== action.payload),
      };
    case 'UPDATE_CART_QUANTITY':
      return {
        ...state,
        cart: state.cart.map(item =>
          item.product.id === action.payload.productId
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
      };
    case 'CLEAR_CART':
      return { ...state, cart: [] };
    case 'CREATE_ORDER':
      return { ...state, orders: [...state.orders, action.payload] };
    case 'ADD_NOTIFICATION':
      return { ...state, notifications: [...state.notifications, action.payload] };
    case 'REMOVE_NOTIFICATION':
      return {
        ...state,
        notifications: state.notifications.filter(notif => notif.id !== action.payload),
      };
    case 'UPDATE_STOCK':
      return {
        ...state,
        products: state.products.map(product =>
          product.id === action.payload.productId
            ? { ...product, stock: Math.max(0, product.stock - action.payload.quantity) }
            : product
        ),
      };
    case 'SET_CURRENT_USER':
      return { ...state, currentUser: action.payload };
    case 'ADD_INVENTORY_ALERT':
      return { ...state, inventoryAlerts: [...state.inventoryAlerts, action.payload] };
    case 'REMOVE_INVENTORY_ALERT':
      return {
        ...state,
        inventoryAlerts: state.inventoryAlerts.filter(alert => alert.id !== action.payload),
      };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_SEARCH_TERM':
      return { ...state, searchTerm: action.payload };
    case 'SET_CATEGORY':
      return { ...state, selectedCategory: action.payload };
    default:
      return state;
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    (async () => {
      dispatch({ type: 'SET_LOADING', payload: true });
      try {
        const products = await apiGetProducts();
        dispatch({ type: 'SET_PRODUCTS', payload: products as Product[] });
        // fetch alerts from backend
        try {
          const alerts = await listAlerts();
          const mapped: InventoryAlert[] = alerts.map(a => ({
            id: String(a.id),
            product: { ...(a.product as any), id: String((a.product as any).id) },
            currentStock: a.currentStock,
            threshold: a.threshold,
            severity: a.severity,
            timestamp: a.createdAt ? new Date(a.createdAt) : new Date(),
          }));
          mapped.forEach(alert => dispatch({ type: 'ADD_INVENTORY_ALERT', payload: alert }));
        } catch {}
      } catch (e) {
        // fallback: keep empty state; optionally could load local JSON
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    })();
    const saved = localStorage.getItem('tecnobuy_user');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const user: User = { ...parsed, lastLogin: parsed.lastLogin ? new Date(parsed.lastLogin) : undefined };
        dispatch({ type: 'SET_CURRENT_USER', payload: user });
      } catch {}
    }
  }, []);

  const addToCart = (product: Product, quantity: number) => {
    if (!checkStockAvailability(product.id, quantity)) {
      addNotification('error', `Insufficient stock for ${product.name}. Only ${product.stock} items available.`);
      return;
    }
    dispatch({ type: 'ADD_TO_CART', payload: { product, quantity } });
    addNotification('success', `${product.name} added to cart`);
  };

  const removeFromCart = (productId: string) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: productId });
    addNotification('info', 'Item removed from cart');
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity === 0) {
      removeFromCart(productId);
      return;
    }
    if (!checkStockAvailability(productId, quantity)) {
      const product = state.products.find(p => p.id === productId);
      addNotification('error', `Insufficient stock. Only ${product?.stock} items available.`);
      return;
    }
    dispatch({ type: 'UPDATE_CART_QUANTITY', payload: { productId, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const processPayment = async (paymentMethod: PaymentMethod, customerInfo: CustomerInfo): Promise<boolean> => {
    dispatch({ type: 'SET_LOADING', payload: true });

    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Simulate payment success/failure (90% success rate)
    const paymentSuccess = Math.random() > 0.1;

    if (paymentSuccess) {
      // Persist order to backend
      try {
        await apiCreateOrder({
          customerName: customerInfo.name,
          customerPhone: customerInfo.phone,
          customerEmail: customerInfo.email,
          paymentMethod,
          total: getTotalCartValue(),
          items: state.cart.map(ci => ({ product: { id: Number(ci.product.id) }, quantity: ci.quantity })),
        } as any);
      } catch (e) {
        // Continue UI flow even if persistence fails
      }

      // Create local order for UI continuity
      const order: Order = {
        id: Date.now().toString(),
        items: state.cart,
        total: getTotalCartValue(),
        paymentMethod,
        customerInfo,
        timestamp: new Date(),
        status: 'completed',
      };

      dispatch({ type: 'CREATE_ORDER', payload: order });
      dispatch({ type: 'CLEAR_CART' });
      addNotification('success', 'Payment successful! Order completed.');
    } else {
      addNotification('error', 'Payment failed. Please try again or use a different payment method.');
    }

    dispatch({ type: 'SET_LOADING', payload: false });
    return paymentSuccess;
  };

  const addNotification = (type: Notification['type'], message: string) => {
    const notification: Notification = {
      id: Date.now().toString(),
      type,
      message,
      timestamp: new Date(),
    };

    dispatch({ type: 'ADD_NOTIFICATION', payload: notification });

    // Auto-remove notification after 5 seconds
    setTimeout(() => {
      dispatch({ type: 'REMOVE_NOTIFICATION', payload: notification.id });
    }, 5000);

    // Check for low stock and notify manager
    if (type === 'success' && message.includes('Order completed')) {
      state.products.forEach(product => {
        if (product.stock <= 5) {
          setTimeout(() => {
            const lowStockNotification: Notification = {
              id: Date.now().toString() + '_stock',
              type: 'warning',
              message: `Low stock alert: ${product.name} has only ${product.stock} items remaining. Manager notified.`,
              timestamp: new Date(),
            };
            dispatch({ type: 'ADD_NOTIFICATION', payload: lowStockNotification });
            
            // Add inventory alert
            const inventoryAlert: InventoryAlert = {
              id: Date.now().toString() + '_alert',
              product,
              currentStock: product.stock,
              threshold: 5,
              severity: product.stock === 0 ? 'out' : product.stock <= 2 ? 'critical' : 'low',
              timestamp: new Date(),
            };
            dispatch({ type: 'ADD_INVENTORY_ALERT', payload: inventoryAlert });
            
            setTimeout(() => {
              dispatch({ type: 'REMOVE_NOTIFICATION', payload: lowStockNotification.id });
            }, 8000);
          }, 1000);
        }
      });
    }
  };

  const getFilteredProducts = (): Product[] => {
    return state.products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
                          product.description.toLowerCase().includes(state.searchTerm.toLowerCase());
      const matchesCategory = !state.selectedCategory || product.category === state.selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  };

  const getTotalCartValue = (): number => {
    return state.cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  const checkStockAvailability = (productId: string, quantity: number): boolean => {
    const product = state.products.find(p => p.id === productId);
    if (!product) return false;
    
    const currentCartQuantity = state.cart.find(item => item.product.id === productId)?.quantity || 0;
    return (currentCartQuantity + quantity) <= product.stock;
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // TecnoBuy credentials
    if (email === 'admin@gmail.com' && password === 'admin') {
      const user: User = {
        id: '1',
        name: 'Admin User',
        email: 'admin@gmail.com',
        role: 'admin',
        lastLogin: new Date(),
      };
      dispatch({ type: 'SET_CURRENT_USER', payload: user });
      localStorage.setItem('tecnobuy_user', JSON.stringify(user));
      dispatch({ type: 'SET_LOADING', payload: false });
      return true;
    } else if (email === 'sales@tecnobuy.com' && password === 'sales123') {
      const user: User = {
        id: '2',
        name: 'Sales Assistant',
        email: 'sales@tecnobuy.com',
        role: 'sales',
        lastLogin: new Date(),
      };
      dispatch({ type: 'SET_CURRENT_USER', payload: user });
      localStorage.setItem('tecnobuy_user', JSON.stringify(user));
      dispatch({ type: 'SET_LOADING', payload: false });
      return true;
    }
    
    dispatch({ type: 'SET_LOADING', payload: false });
    return false;
  };

  const logout = () => {
    dispatch({ type: 'SET_CURRENT_USER', payload: null });
    dispatch({ type: 'CLEAR_CART' });
    localStorage.removeItem('tecnobuy_user');
  };

  const addProduct = async (productData: Omit<Product, 'id'>) => {
    try {
      const created = await apiCreateProduct(productData as any);
      dispatch({ type: 'ADD_PRODUCT', payload: created as Product });
      addNotification('success', `Product "${created.name}" added successfully`);
    } catch (e) {
      addNotification('error', 'Failed to add product');
    }
  };

  const updateProduct = async (product: Product) => {
    try {
      const updated = await apiUpdateProduct(product.id, {
        name: product.name,
        category: product.category,
        price: product.price,
        stock: product.stock,
        description: product.description,
        image: product.image,
        lowStockThreshold: product.lowStockThreshold ?? 5,
      } as any);
      dispatch({ type: 'UPDATE_PRODUCT', payload: updated as Product });
      addNotification('success', `Product "${updated.name}" updated successfully`);
    } catch (e) {
      addNotification('error', 'Failed to update product');
    }
  };

  const deleteProduct = async (productId: string) => {
    const product = state.products.find(p => p.id === productId);
    try {
      await apiDeleteProduct(productId);
      dispatch({ type: 'DELETE_PRODUCT', payload: productId });
      if (product) {
        addNotification('info', `Product "${product.name}" deleted`);
      }
    } catch (e) {
      addNotification('error', 'Failed to delete product');
    }
  };

  const getSalesReport = (startDate: Date, endDate: Date): SalesReport => {
    const filteredOrders = state.orders.filter(order => 
      order.timestamp >= startDate && order.timestamp <= endDate
    );

    const totalSales = filteredOrders.reduce((sum, order) => sum + order.total, 0);
    const totalOrders = filteredOrders.length;

    // Calculate top products
    const productSales: { [key: string]: { product: Product; quantitySold: number; revenue: number } } = {};
    
    filteredOrders.forEach(order => {
      order.items.forEach(item => {
        if (productSales[item.product.id]) {
          productSales[item.product.id].quantitySold += item.quantity;
          productSales[item.product.id].revenue += item.product.price * item.quantity;
        } else {
          productSales[item.product.id] = {
            product: item.product,
            quantitySold: item.quantity,
            revenue: item.product.price * item.quantity,
          };
        }
      });
    });

    const topProducts = Object.values(productSales)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    // Calculate payment methods
    const paymentMethods = filteredOrders.reduce(
      (acc, order) => {
        acc[order.paymentMethod] += order.total;
        return acc;
      },
      { cash: 0, card: 0, online: 0 }
    );

    return {
      date: new Date().toISOString().split('T')[0],
      totalSales,
      totalOrders,
      topProducts,
      paymentMethods,
    };
  };

  const getInventoryAlerts = (): InventoryAlert[] => {
    return state.inventoryAlerts;
  };

  const updateProductStock = async (productId: string, newStock: number) => {
    const product = state.products.find(p => p.id === productId);
    if (!product) return;
    try {
      const updated = await apiUpdateProductStock(productId, newStock);
      dispatch({ type: 'UPDATE_PRODUCT', payload: updated as Product });
      addNotification('success', `Stock updated for ${product.name}`);
    } catch (e) {
      addNotification('error', 'Failed to update stock');
    }
  };
  return (
    <AppContext.Provider value={{
      state,
      dispatch,
      addToCart,
      removeFromCart,
      updateCartQuantity,
      clearCart,
      processPayment,
      addNotification,
      getFilteredProducts,
      getTotalCartValue,
      checkStockAvailability,
      login,
      logout,
      addProduct,
      updateProduct,
      deleteProduct,
      getSalesReport,
      getInventoryAlerts,
      updateProductStock,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}