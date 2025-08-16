import ApiService from './api';
import { User, Farmer } from '../types';

export class UserService {
  static async getAllUsers(): Promise<User[]> {
    try {
      const users = await ApiService.getUsers();
      return users;
    } catch (error) {
      console.error('Error getting users:', error);
      throw error;
    }
  }

  static async getUserById(id: string): Promise<User | null> {
    try {
      const user = await ApiService.getUserById(id);
      return user;
    } catch (error) {
      console.error('Error getting user:', error);
      return null;
    }
  }

  static async updateUser(id: string, updates: Partial<User>): Promise<boolean> {
    try {
      await ApiService.updateUser(id, updates);
      return true;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  static async deleteUser(id: string): Promise<boolean> {
    try {
      await ApiService.deleteUser(id);
      return true;
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }

  static async getFarmers(): Promise<Farmer[]> {
    try {
      const users = await ApiService.getUsers();
      const farmers = users.filter((user: User) => user.role === 'farmer' && user.isActive) as Farmer[];
      
      return farmers.map(farmer => ({
        ...farmer,
        avatar: farmer.avatar || 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150',
        farm: farmer.farm || {
          name: 'Farm',
          description: 'A local farm',
          certifications: [],
          establishedYear: 2020
        },
        stats: farmer.stats || {
          totalOrders: 0,
          rating: 4.0,
          totalRevenue: 0
        }
      }));
    } catch (error) {
      console.error('Error getting farmers:', error);
      throw error;
    }
  }
}