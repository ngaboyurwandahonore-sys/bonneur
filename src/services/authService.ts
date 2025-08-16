import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { mockDb } from './mockDatabase';
import { User } from '../types';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export class AuthService {
  static async signIn(email: string, password: string): Promise<{ user: User; token: string } | null> {
    try {
      const row = mockDb.getUserByEmail(email);
      
      if (!row || !row.isActive) {
        return null;
      }

      const isValidPassword = await bcrypt.compare(password, row.password);
      if (!isValidPassword) {
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

      const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, {
        expiresIn: '24h'
      });

      return { user, token };
    } catch (error) {
      throw error;
    }
  }

  static async signUp(userData: {
    name: string;
    email: string;
    password: string;
    phone: string;
    role: string;
    location: string;
  }): Promise<{ user: User; token: string }> {
    try {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const userId = Date.now().toString();

      const newUser = {
        id: userId,
        name: userData.name,
        email: userData.email,
        password: hashedPassword,
        role: userData.role,
        phone: userData.phone,
        location: {
          lat: -1.9441, // Default to Kigali
          lng: 30.0619,
          address: userData.location
        },
        createdAt: new Date().toISOString(),
        isActive: true
      };

      mockDb.createUser(newUser);

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

      return { user, token };
    } catch (error) {
      throw error;
    }
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