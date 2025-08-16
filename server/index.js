const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Middleware
app.use(cors());
app.use(express.json());

// Database setup
const dbPath = path.join(__dirname, 'agriconnect.db');
const db = new sqlite3.Database(dbPath);

// Initialize database tables
const initializeDatabase = () => {
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
    db.run(table, (err) => {
      if (err) {
        console.error('Error creating table:', err);
      }
    });
  });

  // Insert default users
  insertDefaultUsers();
};

const insertDefaultUsers = async () => {
  const defaultPassword = await bcrypt.hash('password', 10);

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

  for (const user of defaultUsers) {
    db.get('SELECT id FROM users WHERE email = ?', [user.email], (err, row) => {
      if (err) {
        console.error('Error checking user:', err);
      } else if (!row) {
        const columns = Object.keys(user).join(', ');
        const placeholders = Object.keys(user).map(() => '?').join(', ');
        const values = Object.values(user);

        db.run(
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
  }
};

// Auth middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.sendStatus(401);
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Auth routes
app.post('/api/auth/signin', async (req, res) => {
  const { email, password } = req.body;

  db.get('SELECT * FROM users WHERE email = ? AND is_active = 1', [email], async (err, user) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, {
      expiresIn: '24h'
    });

    // Format user data
    const userData = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      avatar: user.avatar,
      location: {
        lat: user.location_lat,
        lng: user.location_lng,
        address: user.location_address
      },
      createdAt: user.created_at,
      isActive: user.is_active
    };

    // Add farm data for farmers
    if (user.role === 'farmer') {
      userData.farm = {
        name: user.farm_name,
        description: user.farm_description,
        certifications: user.farm_certifications ? JSON.parse(user.farm_certifications) : [],
        establishedYear: user.farm_established_year
      };
      userData.stats = {
        totalOrders: user.stats_total_orders,
        rating: user.stats_rating,
        totalRevenue: user.stats_total_revenue
      };
    }

    res.json({ user: userData, token });
  });
});

app.post('/api/auth/signup', async (req, res) => {
  const { name, email, password, phone, role, location } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = Date.now().toString();

    const userData = {
      id: userId,
      name,
      email,
      password: hashedPassword,
      role,
      phone,
      location_lat: -1.9441, // Default to Kigali
      location_lng: 30.0619,
      location_address: location,
      created_at: new Date().toISOString(),
      is_active: 1
    };

    const columns = Object.keys(userData).join(', ');
    const placeholders = Object.keys(userData).map(() => '?').join(', ');
    const values = Object.values(userData);

    db.run(
      `INSERT INTO users (${columns}) VALUES (${placeholders})`,
      values,
      function(err) {
        if (err) {
          if (err.code === 'SQLITE_CONSTRAINT') {
            return res.status(400).json({ error: 'Email already exists' });
          }
          return res.status(500).json({ error: 'Database error' });
        }

        const token = jwt.sign({ userId, role }, JWT_SECRET, {
          expiresIn: '24h'
        });

        const user = {
          id: userId,
          name,
          email,
          role,
          phone,
          location: {
            lat: -1.9441,
            lng: 30.0619,
            address: location
          },
          createdAt: new Date(),
          isActive: true
        };

        res.json({ user, token });
      }
    );
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// User routes
app.get('/api/users', authenticateToken, (req, res) => {
  db.all('SELECT * FROM users', (err, users) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    const formattedUsers = users.map(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      avatar: user.avatar,
      location: {
        lat: user.location_lat,
        lng: user.location_lng,
        address: user.location_address
      },
      createdAt: user.created_at,
      isActive: user.is_active,
      ...(user.role === 'farmer' && {
        farm: {
          name: user.farm_name,
          description: user.farm_description,
          certifications: user.farm_certifications ? JSON.parse(user.farm_certifications) : [],
          establishedYear: user.farm_established_year
        },
        stats: {
          totalOrders: user.stats_total_orders,
          rating: user.stats_rating,
          totalRevenue: user.stats_total_revenue
        }
      })
    }));

    res.json(formattedUsers);
  });
});

app.get('/api/users/:id', authenticateToken, (req, res) => {
  const { id } = req.params;

  db.get('SELECT * FROM users WHERE id = ?', [id], (err, user) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userData = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      avatar: user.avatar,
      location: {
        lat: user.location_lat,
        lng: user.location_lng,
        address: user.location_address
      },
      createdAt: user.created_at,
      isActive: user.is_active
    };

    // Add farm data for farmers
    if (user.role === 'farmer') {
      userData.farm = {
        name: user.farm_name,
        description: user.farm_description,
        certifications: user.farm_certifications ? JSON.parse(user.farm_certifications) : [],
        establishedYear: user.farm_established_year
      };
      userData.stats = {
        totalOrders: user.stats_total_orders,
        rating: user.stats_rating,
        totalRevenue: user.stats_total_revenue
      };
    }

    res.json(userData);
  });
});

app.put('/api/users/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  // Build update query dynamically
  const updateFields = [];
  const values = [];

  Object.keys(updates).forEach(key => {
    if (key === 'location' && updates[key]) {
      updateFields.push('location_lat = ?', 'location_lng = ?', 'location_address = ?');
      values.push(updates[key].lat, updates[key].lng, updates[key].address);
    } else if (key === 'farm' && updates[key]) {
      updateFields.push('farm_name = ?', 'farm_description = ?', 'farm_certifications = ?', 'farm_established_year = ?');
      values.push(
        updates[key].name,
        updates[key].description,
        JSON.stringify(updates[key].certifications),
        updates[key].establishedYear
      );
    } else if (key !== 'location' && key !== 'farm') {
      updateFields.push(`${key} = ?`);
      values.push(updates[key]);
    }
  });

  if (updateFields.length === 0) {
    return res.status(400).json({ error: 'No valid fields to update' });
  }

  updateFields.push('updated_at = ?');
  values.push(new Date().toISOString());
  values.push(id);

  const query = `UPDATE users SET ${updateFields.join(', ')} WHERE id = ?`;

  db.run(query, values, function(err) {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ success: true });
  });
});

app.delete('/api/users/:id', authenticateToken, (req, res) => {
  const { id } = req.params;

  db.run('DELETE FROM users WHERE id = ?', [id], function(err) {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ success: true });
  });
});

// Product routes
app.get('/api/products', (req, res) => {
  const { farmerId } = req.query;
  
  let query = 'SELECT * FROM products WHERE is_active = 1';
  let params = [];

  if (farmerId) {
    query += ' AND farmer_id = ?';
    params.push(farmerId);
  }

  db.all(query, params, (err, products) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    const formattedProducts = products.map(product => ({
      id: product.id,
      farmerId: product.farmer_id,
      name: product.name,
      category: product.category,
      price: product.price,
      unit: product.unit,
      description: product.description,
      images: product.images ? JSON.parse(product.images) : [],
      stock: product.stock,
      quality: {
        rating: product.quality_rating,
        reviews: product.quality_reviews,
        organic: product.quality_organic,
        freshness: product.quality_freshness
      },
      location: {
        lat: product.location_lat,
        lng: product.location_lng,
        address: product.location_address
      },
      createdAt: product.created_at,
      updatedAt: product.updated_at,
      isActive: product.is_active
    }));

    res.json(formattedProducts);
  });
});

app.post('/api/products', authenticateToken, (req, res) => {
  const productData = req.body;
  const id = Date.now().toString();
  const now = new Date().toISOString();

  const product = {
    id,
    farmer_id: productData.farmerId,
    name: productData.name,
    category: productData.category,
    price: productData.price,
    unit: productData.unit,
    description: productData.description,
    images: JSON.stringify(productData.images || []),
    stock: productData.stock || 0,
    quality_rating: productData.quality?.rating || 0,
    quality_reviews: productData.quality?.reviews || 0,
    quality_organic: productData.quality?.organic || false,
    quality_freshness: productData.quality?.freshness || 100,
    location_lat: productData.location?.lat || -1.9441,
    location_lng: productData.location?.lng || 30.0619,
    location_address: productData.location?.address || 'Kigali, Rwanda',
    created_at: now,
    updated_at: now,
    is_active: true
  };

  const columns = Object.keys(product).join(', ');
  const placeholders = Object.keys(product).map(() => '?').join(', ');
  const values = Object.values(product);

  db.run(
    `INSERT INTO products (${columns}) VALUES (${placeholders})`,
    values,
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      res.json({ id, ...productData });
    }
  );
});

app.put('/api/products/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  // Build update query dynamically
  const updateFields = [];
  const values = [];

  Object.keys(updates).forEach(key => {
    if (key === 'quality' && updates[key]) {
      Object.keys(updates[key]).forEach(qualityKey => {
        updateFields.push(`quality_${qualityKey} = ?`);
        values.push(updates[key][qualityKey]);
      });
    } else if (key === 'location' && updates[key]) {
      updateFields.push('location_lat = ?', 'location_lng = ?', 'location_address = ?');
      values.push(updates[key].lat, updates[key].lng, updates[key].address);
    } else if (key === 'images') {
      updateFields.push('images = ?');
      values.push(JSON.stringify(updates[key]));
    } else if (key !== 'quality' && key !== 'location') {
      updateFields.push(`${key} = ?`);
      values.push(updates[key]);
    }
  });

  if (updateFields.length === 0) {
    return res.status(400).json({ error: 'No valid fields to update' });
  }

  updateFields.push('updated_at = ?');
  values.push(new Date().toISOString());
  values.push(id);

  const query = `UPDATE products SET ${updateFields.join(', ')} WHERE id = ?`;

  db.run(query, values, function(err) {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({ success: true });
  });
});

app.delete('/api/products/:id', authenticateToken, (req, res) => {
  const { id } = req.params;

  db.run('DELETE FROM products WHERE id = ?', [id], function(err) {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({ success: true });
  });
});

// Order routes
app.get('/api/orders', authenticateToken, (req, res) => {
  const { farmerId } = req.query;
  
  let query = `
    SELECT o.*, GROUP_CONCAT(
      json_object(
        'productId', oi.product_id,
        'productName', oi.product_name,
        'quantity', oi.quantity,
        'price', oi.price
      )
    ) as products
    FROM orders o
    LEFT JOIN order_items oi ON o.id = oi.order_id
  `;
  let params = [];

  if (farmerId) {
    query += ' WHERE o.farmer_id = ?';
    params.push(farmerId);
  }

  query += ' GROUP BY o.id ORDER BY o.created_at DESC';

  db.all(query, params, (err, orders) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    const formattedOrders = orders.map(order => ({
      id: order.id,
      customerId: order.customer_id,
      customerName: order.customer_name,
      customerPhone: order.customer_phone,
      farmerId: order.farmer_id,
      products: order.products ? order.products.split(',').map(p => JSON.parse(p)) : [],
      total: order.total,
      status: order.status,
      deliveryAddress: order.delivery_address,
      estimatedDelivery: order.estimated_delivery,
      createdAt: order.created_at,
      notes: order.notes
    }));

    res.json(formattedOrders);
  });
});

app.post('/api/orders', authenticateToken, (req, res) => {
  const orderData = req.body;
  const orderId = Date.now().toString();
  const now = new Date().toISOString();

  const order = {
    id: orderId,
    customer_id: orderData.customerId,
    customer_name: orderData.customerName,
    customer_phone: orderData.customerPhone,
    farmer_id: orderData.farmerId,
    total: orderData.total,
    status: orderData.status,
    delivery_address: orderData.deliveryAddress,
    estimated_delivery: orderData.estimatedDelivery,
    notes: orderData.notes,
    created_at: now
  };

  db.run(
    `INSERT INTO orders (id, customer_id, customer_name, customer_phone, farmer_id, total, status, delivery_address, estimated_delivery, notes, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    Object.values(order),
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      // Insert order items
      const insertItems = orderData.products.map(item => {
        return new Promise((resolve, reject) => {
          db.run(
            'INSERT INTO order_items (id, order_id, product_id, product_name, quantity, price) VALUES (?, ?, ?, ?, ?, ?)',
            [Date.now() + Math.random(), orderId, item.productId, item.productName, item.quantity, item.price],
            (err) => {
              if (err) reject(err);
              else resolve();
            }
          );
        });
      });

      Promise.all(insertItems)
        .then(() => {
          res.json({ id: orderId, ...orderData });
        })
        .catch(() => {
          res.status(500).json({ error: 'Error inserting order items' });
        });
    }
  );
});

app.put('/api/orders/:id/status', authenticateToken, (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  db.run('UPDATE orders SET status = ? WHERE id = ?', [status, id], function(err) {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json({ success: true });
  });
});

// Initialize database and start server
initializeDatabase();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});