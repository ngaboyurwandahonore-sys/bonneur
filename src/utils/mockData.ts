import { User, Product, Farmer, Order, MarketTrend } from '../types';
import { ProductService } from '../services/productService';
import { UserService } from '../services/userService';

// Initialize sample data in database
export const initializeSampleData = async () => {
  try {
    // Check if sample data already exists
    const existingProducts = await ProductService.getAllProducts();
    if (existingProducts.length > 0) {
      return; // Sample data already exists
    }

    // Get farmers from database
    const users = await UserService.getAllUsers();
    const farmers = users.filter(u => u.role === 'farmer');
    
    if (farmers.length === 0) {
      console.log('No farmers found, skipping sample product creation');
      return;
    }

    // Create sample products
    const sampleProducts = [
      {
        farmerId: farmers[0].id,
        name: 'Free Range Chicken',
        category: 'chicken' as const,
        price: 3200,
        unit: 'per kg',
        description: 'Premium free-range chicken raised on organic feed with no antibiotics',
        images: [
          'https://images.pexels.com/photos/1059943/pexels-photo-1059943.jpeg?auto=compress&cs=tinysrgb&w=400',
          'https://images.pexels.com/photos/1059947/pexels-photo-1059947.jpeg?auto=compress&cs=tinysrgb&w=400'
        ],
        stock: 50,
        quality: {
          rating: 4.8,
          reviews: 45,
          organic: true,
          freshness: 95
        },
        location: {
          lat: -1.9441,
          lng: 30.0619,
          address: 'Kigali, Rwanda'
        }
      },
      {
        farmerId: farmers[0].id,
        name: 'Farm Fresh Eggs',
        category: 'eggs' as const,
        price: 60,
        unit: 'per piece',
        description: 'Fresh eggs from free-range hens, collected daily',
        images: [
          'https://images.pexels.com/photos/162712/egg-white-food-protein-162712.jpeg?auto=compress&cs=tinysrgb&w=400'
        ],
        stock: 200,
        quality: {
          rating: 4.9,
          reviews: 67,
          organic: true,
          freshness: 98
        },
        location: {
          lat: -1.9441,
          lng: 30.0619,
          address: 'Kigali, Rwanda'
        }
      }
    ];

    for (const productData of sampleProducts) {
      await ProductService.createProduct(productData);
    }

    console.log('Sample data initialized successfully');
  } catch (error) {
    console.error('Error initializing sample data:', error);
  }
};

export const mockFarmers: Farmer[] = [
  {
    id: '1',
    name: 'Jean Baptiste Uwimana',
    email: 'john@greenvalley.com',
    role: 'farmer',
    location: {
      lat: -1.9441,
      lng: 30.0619,
      address: 'Kigali, Rwanda'
    },
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150',
    phone: '+250788123456',
    createdAt: new Date('2023-01-15'),
    farm: {
      name: 'Green Valley Farm',
      description: 'Organic poultry farm specializing in free-range chicken and fresh eggs',
      certifications: ['Organic Certified', 'Free Range'],
      establishedYear: 2018
    },
    stats: {
      totalOrders: 245,
      rating: 4.8,
      totalRevenue: 125000
    }
  },
  {
    id: '2',
    name: 'Marie Claire Mukamana',
    email: 'mary@sunrisefarm.com',
    role: 'farmer',
    location: {
      lat: -2.0469,
      lng: 29.7378,
      address: 'Rubavu District, Rwanda'
    },
    avatar: 'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=150',
    phone: '+250789234567',
    createdAt: new Date('2022-08-20'),
    farm: {
      name: 'Sunrise Poultry',
      description: 'Premium quality eggs and chicken with focus on animal welfare',
      certifications: ['Animal Welfare Approved'],
      establishedYear: 2020
    },
    stats: {
      totalOrders: 189,
      rating: 4.6,
      totalRevenue: 98000
    }
  },
  {
    id: '3',
    name: 'Pierre Nkurunziza',
    email: 'peter@goldenfarm.com',
    role: 'farmer',
    location: {
      lat: -2.5906,
      lng: 29.7356,
      address: 'Huye District, Rwanda'
    },
    avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150',
    phone: '+250790345678',
    createdAt: new Date('2023-03-10'),
    farm: {
      name: 'Golden Harvest Farm',
      description: 'Large scale poultry operation with modern facilities',
      certifications: ['ISO 22000'],
      establishedYear: 2015
    },
    stats: {
      totalOrders: 312,
      rating: 4.7,
      totalRevenue: 187000
    }
  }
];

export const mockProducts: Product[] = [
  {
    id: '1',
    farmerId: '1',
    name: 'Free Range Chicken',
    category: 'chicken',
    price: 3200,
    unit: 'per kg',
    description: 'Premium free-range chicken raised on organic feed with no antibiotics',
    images: [
      'https://images.pexels.com/photos/1059943/pexels-photo-1059943.jpeg?auto=compress&cs=tinysrgb&w=400',
      'https://images.pexels.com/photos/1059947/pexels-photo-1059947.jpeg?auto=compress&cs=tinysrgb&w=400'
    ],
    stock: 50,
    quality: {
      rating: 4.8,
      reviews: 45,
      organic: true,
      freshness: 95
    },
    location: {
      lat: -1.9441,
      lng: 30.0619,
      address: 'Kigali, Rwanda'
    },
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: '2',
    farmerId: '1',
    name: 'Farm Fresh Eggs',
    category: 'eggs',
    price: 60,
    unit: 'per piece',
    description: 'Fresh eggs from free-range hens, collected daily',
    images: [
      'https://images.pexels.com/photos/162712/egg-white-food-protein-162712.jpeg?auto=compress&cs=tinysrgb&w=400'
    ],
    stock: 200,
    quality: {
      rating: 4.9,
      reviews: 67,
      organic: true,
      freshness: 98
    },
    location: {
      lat: -1.9441,
      lng: 30.0619,
      address: 'Kigali, Rwanda'
    },
    createdAt: new Date('2024-01-12'),
    updatedAt: new Date('2024-01-16')
  },
  {
    id: '3',
    farmerId: '2',
    name: 'Premium Chicken',
    category: 'chicken',
    price: 3000,
    unit: 'per kg',
    description: 'High-quality chicken with excellent taste and nutrition',
    images: [
      'https://images.pexels.com/photos/1059943/pexels-photo-1059943.jpeg?auto=compress&cs=tinysrgb&w=400'
    ],
    stock: 30,
    quality: {
      rating: 4.6,
      reviews: 32,
      organic: false,
      freshness: 92
    },
    location: {
      lat: -2.0469,
      lng: 29.7378,
      address: 'Rubavu District, Rwanda'
    },
    createdAt: new Date('2024-01-08'),
    updatedAt: new Date('2024-01-14')
  },
  {
    id: '4',
    farmerId: '3',
    name: 'Organic Chicken Manure',
    category: 'manure',
    price: 200,
    unit: 'per kg',
    description: 'Rich organic fertilizer perfect for vegetable gardens',
    images: [
      'https://images.pexels.com/photos/1072824/pexels-photo-1072824.jpeg?auto=compress&cs=tinysrgb&w=400'
    ],
    stock: 500,
    quality: {
      rating: 4.7,
      reviews: 23,
      organic: true,
      freshness: 90
    },
    location: {
      lat: -2.5906,
      lng: 29.7356,
      address: 'Huye District, Rwanda'
    },
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-13')
  }
];

export const mockOrders: Order[] = [
  {
    id: '1',
    customerId: 'customer1',
    farmerId: '1',
    products: [
      { productId: '1', quantity: 2, price: 3200 },
      { productId: '2', quantity: 12, price: 60 }
    ],
    total: 7120,
    status: 'delivered',
    deliveryAddress: 'Kigali City Center, Rwanda',
    estimatedDelivery: new Date('2024-01-20'),
    createdAt: new Date('2024-01-18')
  },
  {
    id: '2',
    customerId: 'customer2',
    farmerId: '2',
    products: [
      { productId: '3', quantity: 3, price: 3000 }
    ],
    total: 9000,
    status: 'shipped',
    deliveryAddress: 'Butare, Rwanda',
    estimatedDelivery: new Date('2024-01-22'),
    createdAt: new Date('2024-01-19')
  }
];

export const mockTrends: MarketTrend[] = [
  {
    category: 'chicken',
    period: 'January 2024',
    demand: 85,
    averagePrice: 3100,
    prediction: {
      nextMonth: 3280,
      confidence: 0.87
    }
  },
  {
    category: 'eggs',
    period: 'January 2024',
    demand: 92,
    averagePrice: 58,
    prediction: {
      nextMonth: 61,
      confidence: 0.91
    }
  },
  {
    category: 'manure',
    period: 'January 2024',
    demand: 68,
    averagePrice: 192,
    prediction: {
      nextMonth: 208,
      confidence: 0.79
    }
  }
];