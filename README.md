# AgriConnect - AI-Powered Farmer-to-Consumer Platform

A modern web application connecting farmers directly with consumers, featuring AI-powered recommendations and real-time market insights.

## Features

- **Direct Farmer-Consumer Connection**: Browse products from local farmers
- **AI-Powered Recommendations**: Personalized product suggestions based on location, preferences, and market data
- **Real-time Market Trends**: AI-driven market analysis and price predictions
- **Multi-role Support**: Customers, Farmers, Admins, and Super Admins
- **Order Management**: Complete order lifecycle from placement to delivery
- **User Authentication**: Secure login and registration system

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **Recharts** for data visualization
- **Vite** for build tooling

### Backend
- **Node.js** with Express
- **SQLite** database
- **JWT** authentication
- **bcryptjs** for password hashing
- **CORS** enabled

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd agriconnect
```

2. Install frontend dependencies
```bash
npm install
```

3. Install backend dependencies
```bash
cd server
npm install
cd ..
```

### Running the Application

#### Option 1: Run both frontend and backend together
```bash
npm run start:full
```

#### Option 2: Run separately

**Backend (Terminal 1):**
```bash
npm run server
```

**Frontend (Terminal 2):**
```bash
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:3001

## Demo Accounts

The application comes with pre-configured demo accounts:

- **Customer**: customer@demo.com / password
- **Farmer**: farmer@demo.com / password  
- **Admin**: admin@demo.com / password
- **Super Admin**: superadmin@demo.com / password

## API Endpoints

### Authentication
- `POST /api/auth/signin` - User login
- `POST /api/auth/signup` - User registration

### Users
- `GET /api/users` - Get all users (authenticated)
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Products
- `GET /api/products` - Get all products
- `GET /api/products?farmerId=:id` - Get products by farmer
- `POST /api/products` - Create product (authenticated)
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Orders
- `GET /api/orders` - Get all orders (authenticated)
- `GET /api/orders?farmerId=:id` - Get orders by farmer
- `POST /api/orders` - Create order
- `PUT /api/orders/:id/status` - Update order status

## Project Structure

```
agriconnect/
├── src/                    # Frontend source code
│   ├── components/         # React components
│   ├── services/          # API services
│   ├── types/             # TypeScript types
│   ├── utils/             # Utility functions
│   └── views/             # Page components
├── server/                # Backend source code
│   ├── index.js           # Express server
│   └── package.json       # Backend dependencies
├── dist/                  # Built frontend files
└── package.json           # Frontend dependencies
```

## Features by Role

### Customer
- Browse products from local farmers
- AI-powered product recommendations
- Shopping cart and checkout
- Order tracking
- Farmer discovery

### Farmer
- Product management (CRUD)
- Order management
- Dashboard with analytics
- Profile management

### Admin
- User management
- System monitoring
- Platform analytics

### Super Admin
- Full system administration
- User role management
- System health monitoring

## Development

### Adding New Features
1. Create components in `src/components/`
2. Add API endpoints in `server/index.js`
3. Update services in `src/services/`
4. Add types in `src/types/`

### Database Schema
The SQLite database includes tables for:
- `users` - User accounts and profiles
- `products` - Product listings
- `orders` - Order information
- `order_items` - Order line items

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.