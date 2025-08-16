import { db } from '../database/database';
import { User, Farmer } from '../types';

export class UserService {
  static async getAllUsers(): Promise<User[]> {
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM users ORDER BY created_at DESC', [], (err, rows: any[]) => {
        if (err) {
          reject(err);
          return;
        }

        const users = rows.map(row => ({
          id: row.id,
          name: row.name,
          email: row.email,
          role: row.role,
          phone: row.phone,
          avatar: row.avatar,
          location: {
            lat: row.location_lat,
            lng: row.location_lng,
            address: row.location_address
          },
          createdAt: new Date(row.created_at),
          isActive: Boolean(row.is_active)
        }));

        resolve(users);
      });
    });
  }

  static async getUserById(id: string): Promise<User | null> {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM users WHERE id = ?', [id], (err, row: any) => {
        if (err) {
          reject(err);
          return;
        }

        if (!row) {
          resolve(null);
          return;
        }

        const user: User = {
          id: row.id,
          name: row.name,
          email: row.email,
          role: row.role,
          phone: row.phone,
          avatar: row.avatar,
          location: {
            lat: row.location_lat,
            lng: row.location_lng,
            address: row.location_address
          },
          createdAt: new Date(row.created_at),
          isActive: Boolean(row.is_active)
        };

        // Add farm data for farmers
        if (row.role === 'farmer') {
          (user as any).farm = {
            name: row.farm_name,
            description: row.farm_description,
            certifications: row.farm_certifications ? JSON.parse(row.farm_certifications) : [],
            establishedYear: row.farm_established_year
          };
          (user as any).stats = {
            totalOrders: row.stats_total_orders,
            rating: row.stats_rating,
            totalRevenue: row.stats_total_revenue
          };
        }

        resolve(user);
      });
    });
  }

  static async updateUser(id: string, updates: Partial<User>): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const updateFields: string[] = [];
      const values: any[] = [];

      if (updates.name) {
        updateFields.push('name = ?');
        values.push(updates.name);
      }
      if (updates.email) {
        updateFields.push('email = ?');
        values.push(updates.email);
      }
      if (updates.phone) {
        updateFields.push('phone = ?');
        values.push(updates.phone);
      }
      if (updates.location) {
        updateFields.push('location_lat = ?', 'location_lng = ?', 'location_address = ?');
        values.push(updates.location.lat, updates.location.lng, updates.location.address);
      }
      if (updates.isActive !== undefined) {
        updateFields.push('is_active = ?');
        values.push(updates.isActive ? 1 : 0);
      }

      updateFields.push('updated_at = CURRENT_TIMESTAMP');
      values.push(id);

      if (updateFields.length === 1) { // Only timestamp update
        resolve(true);
        return;
      }

      const query = `UPDATE users SET ${updateFields.join(', ')} WHERE id = ?`;

      db.run(query, values, function(err) {
        if (err) {
          reject(err);
          return;
        }
        resolve(this.changes > 0);
      });
    });
  }

  static async deleteUser(id: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      db.run('DELETE FROM users WHERE id = ?', [id], function(err) {
        if (err) {
          reject(err);
          return;
        }
        resolve(this.changes > 0);
      });
    });
  }

  static async getFarmers(): Promise<Farmer[]> {
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM users WHERE role = "farmer" AND is_active = 1', [], (err, rows: any[]) => {
        if (err) {
          reject(err);
          return;
        }

        const farmers = rows.map(row => ({
          id: row.id,
          name: row.name,
          email: row.email,
          role: 'farmer' as const,
          phone: row.phone,
          avatar: row.avatar || 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150',
          location: {
            lat: row.location_lat,
            lng: row.location_lng,
            address: row.location_address
          },
          farm: {
            name: row.farm_name || 'Farm',
            description: row.farm_description || 'A local farm',
            certifications: row.farm_certifications ? JSON.parse(row.farm_certifications) : [],
            establishedYear: row.farm_established_year || 2020
          },
          stats: {
            totalOrders: row.stats_total_orders || 0,
            rating: row.stats_rating || 4.0,
            totalRevenue: row.stats_total_revenue || 0
          },
          createdAt: new Date(row.created_at),
          isActive: Boolean(row.is_active)
        }));

        resolve(farmers);
      });
    });
  }
}