import { UserService } from '../services/userService';
import { ProductService } from '../services/productService';
import { OrderService } from '../services/orderService';
import { User, Product, Order } from '../types';

export const storage = {
  // Users
  getUsers: async (): Promise<User[]> => {
    try {
      return await UserService.getAllUsers();
    } catch (error) {
      console.error('Error getting users:', error);
      return [];
    }
  },
  
  saveUsers: async (users: User[]): Promise<void> => {
    // This method is deprecated - use UserService methods instead
    console.warn('saveUsers is deprecated - use UserService methods instead');
  },

  // Products
  getProducts: async (): Promise<Product[]> => {
    try {
      return await ProductService.getAllProducts();
    } catch (error) {
      console.error('Error getting products:', error);
      return [];
    }
  },
  
  saveProducts: async (products: Product[]): Promise<void> => {
    // This method is deprecated - use ProductService methods instead
    console.warn('saveProducts is deprecated - use ProductService methods instead');
  },

  // Orders
  getOrders: async (): Promise<Order[]> => {
    try {
      return await OrderService.getAllOrders();
    } catch (error) {
      console.error('Error getting orders:', error);
      return [];
    }
  },
  
  saveOrders: async (orders: Order[]): Promise<void> => {
    // This method is deprecated - use OrderService methods instead
    console.warn('saveOrders is deprecated - use OrderService methods instead');
  },

  // Sync methods for backward compatibility (will be removed)
  getUsersSync: (): User[] => {
    // Fallback for components that still use sync methods
    return [];
  },
  
  getProductsSync: (): Product[] => {
    // Fallback for components that still use sync methods
    return [];
  },
  
  getOrdersSync: (): Order[] => {
    // Fallback for components that still use sync methods
    return [];
  }
};