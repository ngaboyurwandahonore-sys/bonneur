import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../database/database';
import { User } from '../types';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export class AuthService {
  static async signIn(email: string, password: string): Promise<{ user: User; token: string } | null> {
    return new Promise((resolve, reject) => {
      db.get(
        `SELECT * FROM users WHERE email = ? AND is_active = 1`,
        [email],
        async (err, row: any) => {
          if (err) {
            reject(err);
            return;
          }

          if (!row) {
            resolve(null);
            return;
          }

          const isValidPassword = await bcrypt.compare(password, row.password);
          if (!isValidPassword) {
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

          const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, {
            expiresIn: '24h'
          });

          resolve({ user, token });
        }
      );
    });
  }

  static async signUp(userData: {
    name: string;
    email: string;
    password: string;
    phone: string;
    role: string;
    location: string;
  }): Promise<{ user: User; token: string }> {
    return new Promise(async (resolve, reject) => {
      try {
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        const userId = Date.now().toString();

        const insertData = {
          id: userId,
          name: userData.name,
          email: userData.email,
          password: hashedPassword,
          role: userData.role,
          phone: userData.phone,
          location_lat: -1.9441, // Default to Kigali
          location_lng: 30.0619,
          location_address: userData.location
        };

        const columns = Object.keys(insertData).join(', ');
        const placeholders = Object.keys(insertData).map(() => '?').join(', ');
        const values = Object.values(insertData);

        db.run(
          `INSERT INTO users (${columns}) VALUES (${placeholders})`,
          values,
          function(err) {
            if (err) {
              reject(err);
              return;
            }

            const user: User = {
              id: userId,
              name: userData.name,
              email: userData.email,
              role: userData.role as any,
              phone: userData.phone,
              location: {
                lat: -1.9441,
                lng: 30.0619,
                address: userData.location
              },
              createdAt: new Date(),
              isActive: true
            };

            const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, {
              expiresIn: '24h'
            });

            resolve({ user, token });
          }
        );
      } catch (error) {
        reject(error);
      }
    });
  }

  static verifyToken(token: string): Promise<{ userId: string; role: string } | null> {
    return new Promise((resolve) => {
      try {
        const decoded = jwt.verify(token, JWT_SECRET) as any;
        resolve({ userId: decoded.userId, role: decoded.role });
      } catch (error) {
        resolve(null);
      }
    });
  }
}