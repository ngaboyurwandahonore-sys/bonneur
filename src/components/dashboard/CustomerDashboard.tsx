import React from 'react';
import { ShoppingBag, Heart, MapPin, Clock, Star, Package } from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

export function CustomerDashboard() {
  const recentOrders = [
    {
      id: '1',
      date: '2024-01-20',
      farmer: 'Jean Baptiste Uwimana',
      items: 'Free Range Chicken, Farm Fresh Eggs',
      total: 7120,
      status: 'delivered'
    },
    {
      id: '2',
      date: '2024-01-18',
      farmer: 'Marie Claire Mukamana',
      items: 'Premium Chicken',
      total: 9000,
      status: 'shipped'
    }
  ];

  const favoriteProducts = [
    {
      id: '1',
      name: 'Free Range Chicken',
      farmer: 'Green Valley Farm',
      price: 3200,
      image: 'https://images.pexels.com/photos/1059943/pexels-photo-1059943.jpeg?auto=compress&cs=tinysrgb&w=200'
    },
    {
      id: '2',
      name: 'Farm Fresh Eggs',
      farmer: 'Green Valley Farm',
      price: 60,
      image: 'https://images.pexels.com/photos/162712/egg-white-food-protein-162712.jpeg?auto=compress&cs=tinysrgb&w=200'
    }
  ];

  const stats = [
    {
      name: 'Total Orders',
      value: '12',
      icon: ShoppingBag,
      color: 'text-blue-600'
    },
    {
      name: 'Favorite Products',
      value: '8',
      icon: Heart,
      color: 'text-red-600'
    },
    {
      name: 'Total Spent',
      value: 'RWF 45,600',
      icon: Package,
      color: 'text-green-600'
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's your shopping overview</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <Card key={stat.name}>
            <div className="flex items-center">
              <div className={`flex-shrink-0 ${stat.color}`}>
                <stat.icon className="h-8 w-8" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
            <Button variant="outline" size="sm">View All</Button>
          </div>
          <div className="space-y-4">
            {recentOrders.map((order) => (
              <div key={order.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-900">Order #{order.id}</span>
                  <Badge 
                    variant={order.status === 'delivered' ? 'success' : 'info'}
                    size="sm"
                  >
                    {order.status}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 mb-1">{order.items}</p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">from {order.farmer}</span>
                  <span className="font-medium text-green-600">
                    RWF {order.total.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center text-xs text-gray-500 mt-2">
                  <Clock className="w-3 h-3 mr-1" />
                  {order.date}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Favorite Products */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Favorite Products</h3>
            <Button variant="outline" size="sm">View All</Button>
          </div>
          <div className="space-y-4">
            {favoriteProducts.map((product) => (
              <div key={product.id} className="flex items-center space-x-4">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-12 h-12 rounded-lg object-cover"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-gray-900">{product.name}</h4>
                  <p className="text-xs text-gray-500">{product.farmer}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-green-600">
                    RWF {product.price.toLocaleString()}
                  </p>
                  <Button size="sm" variant="outline">Add to Cart</Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
            <ShoppingBag className="w-6 h-6 text-green-600 mb-2" />
            <h4 className="font-medium text-gray-900">Browse Products</h4>
            <p className="text-sm text-gray-600">Discover fresh products from local farmers</p>
          </button>
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
            <MapPin className="w-6 h-6 text-blue-600 mb-2" />
            <h4 className="font-medium text-gray-900">Find Farmers</h4>
            <p className="text-sm text-gray-600">Connect with farmers in your area</p>
          </button>
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
            <Star className="w-6 h-6 text-yellow-600 mb-2" />
            <h4 className="font-medium text-gray-900">Leave Reviews</h4>
            <p className="text-sm text-gray-600">Share your experience with products</p>
          </button>
        </div>
      </Card>
    </div>
  );
}