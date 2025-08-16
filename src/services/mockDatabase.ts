import { User, Product, Order, Farmer } from '../types';

// Mock database using localStorage
class MockDatabase {
  private getFromStorage<T>(key: string): T[] {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  }

  private saveToStorage<T>(key: string, data: T[]): void {
    localStorage.setItem(key, JSON.stringify(data));
  }

  // Initialize with default data
  init(): void {
    if (!localStorage.getItem('users')) {
      const defaultUsers = [
        {
          id: 'admin-1',
          name: 'Admin User',
          email: 'admin@demo.com',
          password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
          role: 'admin',
          phone: '+250788000001',
          location: {
            lat: -1.9441,
            lng: 30.0619,
            address: 'Kigali, Rwanda'
          },
          createdAt: new Date().toISOString(),
          isActive: true
        },
        {
          id: 'superadmin-1',
          name: 'Super Admin',
          email: 'superadmin@demo.com',
          password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
          role: 'superadmin',
          phone: '+250788000000',
          location: {
            lat: -1.9441,
            lng: 30.0619,
            address: 'Kigali, Rwanda'
          },
          createdAt: new Date().toISOString(),
          isActive: true
        },
        {
          id: 'customer-1',
          name: 'Demo Customer',
          email: 'customer@demo.com',
          password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
          role: 'customer',
          phone: '+250788000002',
          location: {
            lat: -1.9441,
            lng: 30.0619,
            address: 'Kigali, Rwanda'
          },
          createdAt: new Date().toISOString(),
          isActive: true
        },
        {
          id: 'farmer-1',
          name: 'Demo Farmer',
          email: 'farmer@demo.com',
          password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
          role: 'farmer',
          phone: '+250788000003',
          location: {
            lat: -1.9441,
            lng: 30.0619,
            address: 'Kigali, Rwanda'
          },
          farm: {
            name: 'Demo Farm',
            description: 'A demo farm for testing purposes',
            certifications: ['Organic Certified'],
            establishedYear: 2020
          },
          stats: {
            totalOrders: 0,
            rating: 4.5,
            totalRevenue: 0
          },
          createdAt: new Date().toISOString(),
          isActive: true
        }
      ];
      this.saveToStorage('users', defaultUsers);
    }

    if (!localStorage.getItem('products')) {
      this.saveToStorage('products', []);
    }

    if (!localStorage.getItem('orders')) {
      this.saveToStorage('orders', []);
    }
  }

  // Users
  getUsers(): any[] {
    return this.getFromStorage('users');
  }

  getUserById(id: string): any | null {
    const users = this.getUsers();
    return users.find(user => user.id === id) || null;
  }

  getUserByEmail(email: string): any | null {
    const users = this.getUsers();
    return users.find(user => user.email === email) || null;
  }

  createUser(user: any): void {
    const users = this.getUsers();
    users.push(user);
    this.saveToStorage('users', users);
  }

  updateUser(id: string, updates: any): boolean {
    const users = this.getUsers();
    const index = users.findIndex(user => user.id === id);
    if (index !== -1) {
      users[index] = { ...users[index], ...updates };
      this.saveToStorage('users', users);
      return true;
    }
    return false;
  }

  deleteUser(id: string): boolean {
    const users = this.getUsers();
    const filteredUsers = users.filter(user => user.id !== id);
    if (filteredUsers.length !== users.length) {
      this.saveToStorage('users', filteredUsers);
      return true;
    }
    return false;
  }

  // Products
  getProducts(): any[] {
    return this.getFromStorage('products');
  }

  getProductsByFarmer(farmerId: string): any[] {
    const products = this.getProducts();
    return products.filter(product => product.farmerId === farmerId);
  }

  createProduct(product: any): void {
    const products = this.getProducts();
    products.push(product);
    this.saveToStorage('products', products);
  }

  updateProduct(id: string, updates: any): boolean {
    const products = this.getProducts();
    const index = products.findIndex(product => product.id === id);
    if (index !== -1) {
      products[index] = { ...products[index], ...updates };
      this.saveToStorage('products', products);
      return true;
    }
    return false;
  }

  deleteProduct(id: string): boolean {
    const products = this.getProducts();
    const filteredProducts = products.filter(product => product.id !== id);
    if (filteredProducts.length !== products.length) {
      this.saveToStorage('products', filteredProducts);
      return true;
    }
    return false;
  }

  // Orders
  getOrders(): any[] {
    return this.getFromStorage('orders');
  }

  getOrdersByFarmer(farmerId: string): any[] {
    const orders = this.getOrders();
    return orders.filter(order => order.farmerId === farmerId);
  }

  createOrder(order: any): void {
    const orders = this.getOrders();
    orders.push(order);
    this.saveToStorage('orders', orders);
  }

  updateOrder(id: string, updates: any): boolean {
    const orders = this.getOrders();
    const index = orders.findIndex(order => order.id === id);
    if (index !== -1) {
      orders[index] = { ...orders[index], ...updates };
      this.saveToStorage('orders', orders);
      return true;
    }
    return false;
  }
}

export const mockDb = new MockDatabase();
mockDb.init();