import ApiService from './api';
import { Order } from '../types';

export class OrderService {
  static async getAllOrders(): Promise<Order[]> {
    try {
      const orders = await ApiService.getOrders();
      return orders.map((order: any) => ({
        ...order,
        estimatedDelivery: new Date(order.estimatedDelivery),
        createdAt: new Date(order.createdAt)
      }));
    } catch (error) {
      console.error('Error getting orders:', error);
      throw error;
    }
  }

  static async getOrdersByFarmer(farmerId: string): Promise<Order[]> {
    try {
      const orders = await ApiService.getOrders(farmerId);
      return orders.map((order: any) => ({
        ...order,
        estimatedDelivery: new Date(order.estimatedDelivery),
        createdAt: new Date(order.createdAt)
      }));
    } catch (error) {
      console.error('Error getting farmer orders:', error);
      throw error;
    }
  }

  static async createOrder(orderData: Omit<Order, 'id' | 'createdAt'>): Promise<Order> {
    try {
      const order = await ApiService.createOrder({
        ...orderData,
        estimatedDelivery: orderData.estimatedDelivery.toISOString()
      });
      
      return {
        ...order,
        estimatedDelivery: new Date(order.estimatedDelivery),
        createdAt: new Date(order.createdAt)
      };
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  }

  static async updateOrderStatus(id: string, status: Order['status']): Promise<boolean> {
    try {
      await ApiService.updateOrderStatus(id, status);
      return true;
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  }
}