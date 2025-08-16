import ApiService from './api';
import { Product } from '../types';

export class ProductService {
  static async getAllProducts(): Promise<Product[]> {
    try {
      const products = await ApiService.getProducts();
      return products.filter((product: Product) => product.isActive);
    } catch (error) {
      console.error('Error getting products:', error);
      throw error;
    }
  }

  static async getProductsByFarmer(farmerId: string): Promise<Product[]> {
    try {
      const products = await ApiService.getProducts(farmerId);
      return products;
    } catch (error) {
      console.error('Error getting farmer products:', error);
      throw error;
    }
  }

  static async createProduct(productData: Partial<Product>): Promise<Product> {
    try {
      const product = await ApiService.createProduct(productData);
      return product;
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  }

  static async updateProduct(id: string, updates: Partial<Product>): Promise<boolean> {
    try {
      await ApiService.updateProduct(id, updates);
      return true;
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  }

  static async deleteProduct(id: string): Promise<boolean> {
    try {
      await ApiService.deleteProduct(id);
      return true;
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  }
}