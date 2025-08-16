import { db } from '../database/database';
import { Order } from '../types';

export class OrderService {
  static async getAllOrders(): Promise<Order[]> {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT o.*, 
               GROUP_CONCAT(oi.product_id || ':' || oi.product_name || ':' || oi.quantity || ':' || oi.price) as items
        FROM orders o
        LEFT JOIN order_items oi ON o.id = oi.order_id
        GROUP BY o.id
        ORDER BY o.created_at DESC
      `;

      db.all(query, [], (err, rows: any[]) => {
        if (err) {
          reject(err);
          return;
        }

        const orders = rows.map(row => ({
          id: row.id,
          customerId: row.customer_id,
          customerName: row.customer_name,
          customerPhone: row.customer_phone,
          farmerId: row.farmer_id,
          products: row.items ? row.items.split(',').map((item: string) => {
            const [productId, productName, quantity, price] = item.split(':');
            return {
              productId,
              productName,
              quantity: parseInt(quantity),
              price: parseFloat(price)
            };
          }) : [],
          total: row.total,
          status: row.status,
          deliveryAddress: row.delivery_address,
          estimatedDelivery: new Date(row.estimated_delivery),
          createdAt: new Date(row.created_at),
          notes: row.notes
        }));

        resolve(orders);
      });
    });
  }

  static async getOrdersByFarmer(farmerId: string): Promise<Order[]> {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT o.*, 
               GROUP_CONCAT(oi.product_id || ':' || oi.product_name || ':' || oi.quantity || ':' || oi.price) as items
        FROM orders o
        LEFT JOIN order_items oi ON o.id = oi.order_id
        WHERE o.farmer_id = ?
        GROUP BY o.id
        ORDER BY o.created_at DESC
      `;

      db.all(query, [farmerId], (err, rows: any[]) => {
        if (err) {
          reject(err);
          return;
        }

        const orders = rows.map(row => ({
          id: row.id,
          customerId: row.customer_id,
          customerName: row.customer_name,
          customerPhone: row.customer_phone,
          farmerId: row.farmer_id,
          products: row.items ? row.items.split(',').map((item: string) => {
            const [productId, productName, quantity, price] = item.split(':');
            return {
              productId,
              productName,
              quantity: parseInt(quantity),
              price: parseFloat(price)
            };
          }) : [],
          total: row.total,
          status: row.status,
          deliveryAddress: row.delivery_address,
          estimatedDelivery: new Date(row.estimated_delivery),
          createdAt: new Date(row.created_at),
          notes: row.notes
        }));

        resolve(orders);
      });
    });
  }

  static async createOrder(orderData: Omit<Order, 'id' | 'createdAt'>): Promise<Order> {
    return new Promise((resolve, reject) => {
      const orderId = Date.now().toString();

      db.serialize(() => {
        db.run('BEGIN TRANSACTION');

        // Insert order
        const orderInsert = `
          INSERT INTO orders (id, customer_id, customer_name, customer_phone, farmer_id, total, status, delivery_address, estimated_delivery, notes)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        db.run(orderInsert, [
          orderId,
          orderData.customerId,
          orderData.customerName,
          orderData.customerPhone,
          orderData.farmerId,
          orderData.total,
          orderData.status,
          orderData.deliveryAddress,
          orderData.estimatedDelivery.toISOString(),
          orderData.notes
        ], function(err) {
          if (err) {
            db.run('ROLLBACK');
            reject(err);
            return;
          }

          // Insert order items
          const itemInsert = `
            INSERT INTO order_items (id, order_id, product_id, product_name, quantity, price)
            VALUES (?, ?, ?, ?, ?, ?)
          `;

          let itemsInserted = 0;
          const totalItems = orderData.products.length;

          if (totalItems === 0) {
            db.run('COMMIT');
            resolve({
              ...orderData,
              id: orderId,
              createdAt: new Date()
            });
            return;
          }

          orderData.products.forEach((product, index) => {
            const itemId = `${orderId}-${index}`;
            db.run(itemInsert, [
              itemId,
              orderId,
              product.productId,
              product.productName,
              product.quantity,
              product.price
            ], function(err) {
              if (err) {
                db.run('ROLLBACK');
                reject(err);
                return;
              }

              itemsInserted++;
              if (itemsInserted === totalItems) {
                db.run('COMMIT');
                resolve({
                  ...orderData,
                  id: orderId,
                  createdAt: new Date()
                });
              }
            });
          });
        });
      });
    });
  }

  static async updateOrderStatus(id: string, status: Order['status']): Promise<boolean> {
    return new Promise((resolve, reject) => {
      db.run('UPDATE orders SET status = ? WHERE id = ?', [status, id], function(err) {
        if (err) {
          reject(err);
          return;
        }
        resolve(this.changes > 0);
      });
    });
  }
}