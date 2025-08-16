import { mockDb } from './mockDatabase';
import { User } from '../types';

// Simple browser-compatible mock implementations
const mockBcrypt = {
  async compare(password: string, hash: string): Promise<boolean> {
    // For demo purposes, we'll do a simple comparison
    // In a real app, this would be handled server-side
    return password === hash;
  },
  
  async hash(password: string, saltRounds: number): Promise<string> {
    // For demo purposes, return the password as-is
    // In a real app, this would be handled server-side
    return password;
  }
};

const mockJwt = {
  sign(payload: any, secret: string, options?: any): string {
    // Create a simple mock token
    const tokenData = {
      ...payload,
      exp: Date.now() + (24 * 60 * 60 * 1000), // 24 hours
      iat: Date.now()
    };
    return btoa(JSON.stringify(tokenData));
  },
  
  verify(token: string, secret: string): any {
    try {
      const decoded = JSON.parse(atob(token));
      if (decoded.exp < Date.now()) {
        throw new Error('Token expired');
      }
      return decoded;
    } catch (error) {
      throw new Error('Invalid token');
    }
  }
};

const JWT_SECRET = 'mock-secret-key';

export class AuthService {
  static async signIn(email: string, password: string): Promise<{ user: User; token: string } | null> {
    try {
      const row = mockDb.getUserByEmail(email);
      
      if (!row || !row.isActive) {
        return null;
      }

      const isValidPassword = await mockBcrypt.compare(password, row.password);
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

      const token = mockJwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, {
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
      const hashedPassword = await mockBcrypt.hash(userData.password, 10);
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

      const token = mockJwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, {
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
        const decoded = mockJwt.verify(token, JWT_SECRET) as any;
        resolve({ userId: decoded.userId, role: decoded.role });
      } catch (error) {
        resolve(null);
      }
    });
  }
}