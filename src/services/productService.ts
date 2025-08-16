import { db } from '../database/database';
import { Product } from '../types';

export class ProductService {
  static async getAllProducts(): Promise<Product[]> {
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM products WHERE is_active = 1 ORDER BY created_at DESC', [], (err, rows: any[]) => {
        if (err) {
          reject(err);
          return;
        }

        const products = rows.map(row => ({
          id: row.id,
          farmerId: row.farmer_id,
          name: row.name,
          category: row.category,
          price: row.price,
          unit: row.unit,
          description: row.description,
          images: row.images ? JSON.parse(row.images) : ['https://images.pexels.com/photos/1059943/pexels-photo-1059943.jpeg?auto=compress&cs=tinysrgb&w=400'],
          stock: row.stock,
          quality: {
            rating: row.quality_rating,
            reviews: row.quality_reviews,
            organic: Boolean(row.quality_organic),
            freshness: row.quality_freshness
          },
          location: {
            lat: row.location_lat,
            lng: row.location_lng,
            address: row.location_address
          },
          createdAt: new Date(row.created_at),
          updatedAt: new Date(row.updated_at),
          isActive: Boolean(row.is_active)
        }));

        resolve(products);
      });
    });
  }

  static async getProductsByFarmer(farmerId: string): Promise<Product[]> {
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM products WHERE farmer_id = ? ORDER BY created_at DESC', [farmerId], (err, rows: any[]) => {
        if (err) {
          reject(err);
          return;
        }

        const products = rows.map(row => ({
          id: row.id,
          farmerId: row.farmer_id,
          name: row.name,
          category: row.category,
          price: row.price,
          unit: row.unit,
          description: row.description,
          images: row.images ? JSON.parse(row.images) : ['https://images.pexels.com/photos/1059943/pexels-photo-1059943.jpeg?auto=compress&cs=tinysrgb&w=400'],
          stock: row.stock,
          quality: {
            rating: row.quality_rating,
            reviews: row.quality_reviews,
            organic: Boolean(row.quality_organic),
            freshness: row.quality_freshness
          },
          location: {
            lat: row.location_lat,
            lng: row.location_lng,
            address: row.location_address
          },
          createdAt: new Date(row.created_at),
          updatedAt: new Date(row.updated_at),
          isActive: Boolean(row.is_active)
        }));

        resolve(products);
      });
    });
  }

  static async createProduct(productData: Partial<Product>): Promise<Product> {
    return new Promise((resolve, reject) => {
      const id = Date.now().toString();
      const insertData = {
        id,
        farmer_id: productData.farmerId,
        name: productData.name,
        category: productData.category,
        price: productData.price,
        unit: productData.unit,
        description: productData.description,
        images: JSON.stringify(productData.images || ['https://images.pexels.com/photos/1059943/pexels-photo-1059943.jpeg?auto=compress&cs=tinysrgb&w=400']),
        stock: productData.stock || 0,
        quality_rating: productData.quality?.rating || 0,
        quality_reviews: productData.quality?.reviews || 0,
        quality_organic: productData.quality?.organic ? 1 : 0,
        quality_freshness: productData.quality?.freshness || 100,
        location_lat: productData.location?.lat || -1.9441,
        location_lng: productData.location?.lng || 30.0619,
        location_address: productData.location?.address || 'Kigali, Rwanda',
        is_active: 1
      };

      const columns = Object.keys(insertData).join(', ');
      const placeholders = Object.keys(insertData).map(() => '?').join(', ');
      const values = Object.values(insertData);

      db.run(
        `INSERT INTO products (${columns}) VALUES (${placeholders})`,
        values,
        function(err) {
          if (err) {
            reject(err);
            return;
          }

          const product: Product = {
            id,
            farmerId: productData.farmerId!,
            name: productData.name!,
            category: productData.category!,
            price: productData.price!,
            unit: productData.unit!,
            description: productData.description!,
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
            createdAt: new Date(),
            updatedAt: new Date(),
            isActive: true
          };

          resolve(product);
        }
      );
    });
  }

  static async updateProduct(id: string, updates: Partial<Product>): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const updateFields: string[] = [];
      const values: any[] = [];

      if (updates.name) {
        updateFields.push('name = ?');
        values.push(updates.name);
      }
      if (updates.price !== undefined) {
        updateFields.push('price = ?');
        values.push(updates.price);
      }
      if (updates.stock !== undefined) {
        updateFields.push('stock = ?');
        values.push(updates.stock);
      }
      if (updates.description) {
        updateFields.push('description = ?');
        values.push(updates.description);
      }
      if (updates.isActive !== undefined) {
        updateFields.push('is_active = ?');
        values.push(updates.isActive ? 1 : 0);
      }

      updateFields.push('updated_at = CURRENT_TIMESTAMP');
      values.push(id);

      if (updateFields.length === 1) {
        resolve(true);
        return;
      }

      const query = `UPDATE products SET ${updateFields.join(', ')} WHERE id = ?`;

      db.run(query, values, function(err) {
        if (err) {
          reject(err);
          return;
        }
        resolve(this.changes > 0);
      });
    });
  }

  static async deleteProduct(id: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      db.run('DELETE FROM products WHERE id = ?', [id], function(err) {
        if (err) {
          reject(err);
          return;
        }
        resolve(this.changes > 0);
      });
    });
  }
}