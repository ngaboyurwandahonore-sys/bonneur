import { mockDb } from './mockDatabase';
import { Product } from '../types';

export class ProductService {
  static async getAllProducts(): Promise<Product[]> {
    try {
      const rows = mockDb.getProducts().filter(product => product.isActive);
      
      const products = rows.map(row => ({
        id: row.id,
        farmerId: row.farmerId,
        name: row.name,
        category: row.category,
        price: row.price,
        unit: row.unit,
        description: row.description,
        images: row.images || ['https://images.pexels.com/photos/1059943/pexels-photo-1059943.jpeg?auto=compress&cs=tinysrgb&w=400'],
        stock: row.stock,
        quality: row.quality || {
          rating: 0,
          reviews: 0,
          organic: false,
          freshness: 100
        },
        location: row.location || {
          lat: -1.9441,
          lng: 30.0619,
          address: 'Kigali, Rwanda'
        },
        createdAt: new Date(row.createdAt),
        updatedAt: new Date(row.updatedAt),
        isActive: row.isActive
      }));

      return products;
    } catch (error) {
      throw error;
    }
  }

  static async getProductsByFarmer(farmerId: string): Promise<Product[]> {
    try {
      const rows = mockDb.getProductsByFarmer(farmerId);
      
      const products = rows.map(row => ({
        id: row.id,
        farmerId: row.farmerId,
        name: row.name,
        category: row.category,
        price: row.price,
        unit: row.unit,
        description: row.description,
        images: row.images || ['https://images.pexels.com/photos/1059943/pexels-photo-1059943.jpeg?auto=compress&cs=tinysrgb&w=400'],
        stock: row.stock,
        quality: row.quality || {
          rating: 0,
          reviews: 0,
          organic: false,
          freshness: 100
        },
        location: row.location || {
          lat: -1.9441,
          lng: 30.0619,
          address: 'Kigali, Rwanda'
        },
        createdAt: new Date(row.createdAt),
        updatedAt: new Date(row.updatedAt),
        isActive: row.isActive
      }));

      return products;
    } catch (error) {
      throw error;
    }
  }

  static async createProduct(productData: Partial<Product>): Promise<Product> {
    try {
      const id = Date.now().toString();
      const now = new Date().toISOString();
      
      const newProduct = {
        id,
        farmerId: productData.farmerId,
        name: productData.name,
        category: productData.category,
        price: productData.price,
        unit: productData.unit,
        description: productData.description,
        images: productData.images || ['https://images.pexels.com/photos/1059943/pexels-photo-1059943.jpeg?auto=compress&cs=tinysrgb&w=400'],
        stock: productData.stock || 0,
        quality: {
          rating: productData.quality?.rating || 0,
          reviews: productData.quality?.reviews || 0,
          organic: productData.quality?.organic || false,
          freshness: productData.quality?.freshness || 100
        },
        location: {
          lat: productData.location?.lat || -1.9441,
          lng: productData.location?.lng || 30.0619,
          address: productData.location?.address || 'Kigali, Rwanda'
        },
        createdAt: now,
        updatedAt: now,
        isActive: true
      };

      mockDb.createProduct(newProduct);

      const product: Product = {
        ...newProduct,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      return product;
    } catch (error) {
      throw error;
    }
  }

  static async updateProduct(id: string, updates: Partial<Product>): Promise<boolean> {
    try {
      const updateData = {
        ...updates,
        updatedAt: new Date().toISOString()
      };
      return mockDb.updateProduct(id, updateData);
    } catch (error) {
      throw error;
    }
  }

  static async deleteProduct(id: string): Promise<boolean> {
    try {
      return mockDb.deleteProduct(id);
    } catch (error) {
      throw error;
    }
  }
}