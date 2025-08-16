import ApiService from './api';
import { User } from '../types';

export class AuthService {
  static async signIn(email: string, password: string): Promise<{ user: User; token: string } | null> {
    try {
      const result = await ApiService.signIn(email, password);
      return result;
    } catch (error) {
      console.error('Sign in error:', error);
      return null;
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
      const result = await ApiService.signUp(userData);
      return result;
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  }

  static signOut(): void {
    localStorage.removeItem('authToken');
  }

  static getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  static isAuthenticated(): boolean {
    return !!this.getToken();
  }
}