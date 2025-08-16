import sqlite3 from 'sqlite3';
import { Database } from 'sqlite3';
import path from 'path';

export class DatabaseManager {
  private db: Database;
  private static instance: DatabaseManager;

  private constructor() {
    const dbPath = path.join(process.cwd(), 'agriconnect.db');
    this.db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        console.error('Error opening database:', err);
      } else {
        console.log('Connected to SQLite database');
        this.initializeTables();
      }
    });
  }

  public static getInstance(): DatabaseManager {
    if (!DatabaseManager.instance) {
      DatabaseManager.instance = new DatabaseManager();
    }
    return DatabaseManager.instance;
  }

  private initializeTables(): void {
    const tables = [
      `CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT NOT NULL CHECK (role IN ('farmer', 'customer', 'admin', 'superadmin')),
        phone TEXT,
        avatar TEXT,
        location_lat REAL,
        location_lng REAL,
        location_address TEXT,
        farm_name TEXT,
        farm_description TEXT,
        farm_certifications TEXT,
        farm_established_year INTEGER,
        stats_total_orders INTEGER DEFAULT 0,
        stats_rating REAL DEFAULT 0,
        stats_total_revenue REAL DEFAULT 0,
        is_active BOOLEAN DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,
      
      `CREATE TABLE IF NOT EXISTS products (
        id TEXT PRIMARY KEY,
        farmer_id TEXT NOT NULL,
        name TEXT NOT NULL,
        category TEXT NOT NULL CHECK (category IN ('chicken', 'eggs', 'manure')),
        price REAL NOT NULL,
        unit TEXT NOT NULL,
        description TEXT NOT NULL,
        images TEXT,
        stock INTEGER NOT NULL DEFAULT 0,
        quality_rating REAL DEFAULT 0,
        quality_reviews INTEGER DEFAULT 0,
        quality_organic BOOLEAN DEFAULT 0,
        quality_freshness INTEGER DEFAULT 100,
        location_lat REAL,
        location_lng REAL,
        location_address TEXT,
        is_active BOOLEAN DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (farmer_id) REFERENCES users (id)
      )`,
      
      `CREATE TABLE IF NOT EXISTS orders (
        id TEXT PRIMARY KEY,
        customer_id TEXT NOT NULL,
        customer_name TEXT NOT NULL,
        customer_phone TEXT NOT NULL,
        farmer_id TEXT NOT NULL,
        total REAL NOT NULL,
        status TEXT NOT NULL CHECK (status IN ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled')),
        delivery_address TEXT NOT NULL,
        estimated_delivery DATETIME,
        notes TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (customer_id) REFERENCES users (id),
        FOREIGN KEY (farmer_id) REFERENCES users (id)
      )`,
      
      `CREATE TABLE IF NOT EXISTS order_items (
        id TEXT PRIMARY KEY,
        order_id TEXT NOT NULL,
        product_id TEXT NOT NULL,
        product_name TEXT NOT NULL,
        quantity INTEGER NOT NULL,
        price REAL NOT NULL,
        FOREIGN KEY (order_id) REFERENCES orders (id),
        FOREIGN KEY (product_id) REFERENCES products (id)
      )`
    ];

    tables.forEach((table) => {
      this.db.run(table, (err) => {
        if (err) {
          console.error('Error creating table:', err);
        }
      });
    });

    // Insert default admin users
    this.insertDefaultUsers();
  }

  private insertDefaultUsers(): void {
    const bcrypt = require('bcryptjs');
    const defaultPassword = bcrypt.hashSync('password', 10);

    const defaultUsers = [
      {
        id: 'admin-1',
        name: 'Admin User',
        email: 'admin@demo.com',
        password: defaultPassword,
        role: 'admin',
        phone: '+250788000001',
        location_lat: -1.9441,
        location_lng: 30.0619,
        location_address: 'Kigali, Rwanda'
      },
      {
        id: 'superadmin-1',
        name: 'Super Admin',
        email: 'superadmin@demo.com',
        password: defaultPassword,
        role: 'superadmin',
        phone: '+250788000000',
        location_lat: -1.9441,
        location_lng: 30.0619,
        location_address: 'Kigali, Rwanda'
      },
      {
        id: 'customer-1',
        name: 'Demo Customer',
        email: 'customer@demo.com',
        password: defaultPassword,
        role: 'customer',
        phone: '+250788000002',
        location_lat: -1.9441,
        location_lng: 30.0619,
        location_address: 'Kigali, Rwanda'
      },
      {
        id: 'farmer-1',
        name: 'Demo Farmer',
        email: 'farmer@demo.com',
        password: defaultPassword,
        role: 'farmer',
        phone: '+250788000003',
        location_lat: -1.9441,
        location_lng: 30.0619,
        location_address: 'Kigali, Rwanda',
        farm_name: 'Demo Farm',
        farm_description: 'A demo farm for testing purposes',
        farm_certifications: JSON.stringify(['Organic Certified']),
        farm_established_year: 2020,
        stats_rating: 4.5
      }
    ];

    defaultUsers.forEach((user) => {
      this.db.get('SELECT id FROM users WHERE email = ?', [user.email], (err, row) => {
        if (err) {
          console.error('Error checking user:', err);
        } else if (!row) {
          const columns = Object.keys(user).join(', ');
          const placeholders = Object.keys(user).map(() => '?').join(', ');
          const values = Object.values(user);

          this.db.run(
            `INSERT INTO users (${columns}) VALUES (${placeholders})`,
            values,
            (err) => {
              if (err) {
                console.error('Error inserting default user:', err);
              }
            }
          );
        }
      });
    });
  }

  public getDatabase(): Database {
    return this.db;
  }

  public close(): void {
    this.db.close((err) => {
      if (err) {
        console.error('Error closing database:', err);
      } else {
        console.log('Database connection closed');
      }
    });
  }
}

export const dbManager = DatabaseManager.getInstance();
export const db = dbManager.getDatabase();