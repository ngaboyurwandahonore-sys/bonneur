import { mockDb } from './mockDatabase';
import { Order } from '../types';

export class OrderService {
  static async getAllOrders(): Promise<Order[]> {
    try {
      const rows = mockDb.getOrders();
      
      const orders = rows.map(row => ({
        id: row.id,
        customerId: row.customerId,
        customerName: row.customerName,
        customerPhone: row.customerPhone,
        farmerId: row.farmerId,
        products: row.products || [],
        total: row.total,
        status: row.status,
        deliveryAddress: row.deliveryAddress,
        estimatedDelivery: new Date(row.estimatedDelivery),
        createdAt: new Date(row.createdAt),
        notes: row.notes
      }));

      return orders;
    } catch (error) {
      throw error;
    }
  }

  static async getOrdersByFarmer(farmerId: string): Promise<Order[]> {
    try {
      const rows = mockDb.getOrdersByFarmer(farmerId);
      
      const orders = rows.map(row => ({
        id: row.id,
        customerId: row.customerId,
        customerName: row.customerName,
        customerPhone: row.customerPhone,
        farmerId: row.farmerId,
        products: row.products || [],
        total: row.total,
        status: row.status,
        deliveryAddress: row.deliveryAddress,
        estimatedDelivery: new Date(row.estimatedDelivery),
        createdAt: new Date(row.createdAt),
        notes: row.notes
      }));

      return orders;
    } catch (error) {
      throw error;
    }
  }

  static async createOrder(orderData: Omit<Order, 'id' | 'createdAt'>): Promise<Order> {
    try {
      const orderId = Date.now().toString();
      const now = new Date().toISOString();
      
      const newOrder = {
        ...orderData,
        id: orderId,
        createdAt: now,
        estimatedDelivery: orderData.estimatedDelivery.toISOString()
      };

      mockDb.createOrder(newOrder);

      return {
        ...orderData,
        id: orderId,
        createdAt: new Date()
      };
    } catch (error) {
      throw error;
    }
  }

  static async updateOrderStatus(id: string, status: Order['status']): Promise<boolean> {
    try {
      return mockDb.updateOrder(id, { status });
    } catch (error) {
      throw error;
    }
  }
}