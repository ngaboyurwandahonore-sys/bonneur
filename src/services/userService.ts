import { mockDb } from './mockDatabase';
import { User, Farmer } from '../types';

export class UserService {
  static async getAllUsers(): Promise<User[]> {
    try {
      const rows = mockDb.getUsers();
      const users = rows.map(row => ({
        id: row.id,
        name: row.name,
        email: row.email,
        role: row.role,
        phone: row.phone,
        avatar: row.avatar,
        location: row.location,
        createdAt: new Date(row.createdAt),
        isActive: row.isActive
      }));
      return users;
    } catch (error) {
      throw error;
    }
  }

  static async getUserById(id: string): Promise<User | null> {
    try {
      const row = mockDb.getUserById(id);
      
      if (!row) {
        return null;
      }

      const user: User = {
        id: row.id,
        name: row.name,
        email: row.email,
        role: row.role,
        phone: row.phone,
        avatar: row.avatar,
        location: row.location,
        createdAt: new Date(row.createdAt),
        isActive: row.isActive
      };

      // Add farm data for farmers
      if (row.role === 'farmer') {
        (user as any).farm = row.farm;
        (user as any).stats = row.stats;
      }

      return user;
    } catch (error) {
      throw error;
    }
  }

  static async updateUser(id: string, updates: Partial<User>): Promise<boolean> {
    try {
      return mockDb.updateUser(id, updates);
    } catch (error) {
      throw error;
    }
  }

  static async deleteUser(id: string): Promise<boolean> {
    try {
      return mockDb.deleteUser(id);
    } catch (error) {
      throw error;
    }
  }

  static async getFarmers(): Promise<Farmer[]> {
    try {
      const rows = mockDb.getUsers().filter(user => user.role === 'farmer' && user.isActive);
      
      const farmers = rows.map(row => ({
        id: row.id,
        name: row.name,
        email: row.email,
        role: 'farmer' as const,
        phone: row.phone,
        avatar: row.avatar || 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150',
        location: row.location,
        farm: row.farm || {
          name: 'Farm',
          description: 'A local farm',
          certifications: [],
          establishedYear: 2020
        },
        stats: row.stats || {
          totalOrders: 0,
          rating: 4.0,
          totalRevenue: 0
        },
        createdAt: new Date(row.createdAt),
        isActive: row.isActive
      }));

      return farmers;
    } catch (error) {
      throw error;
    }
  }
}