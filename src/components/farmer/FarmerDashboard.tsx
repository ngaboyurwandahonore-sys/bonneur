import React, { useState, useEffect } from 'react';
import { Package, ShoppingBag, TrendingUp, DollarSign } from 'lucide-react';
import { Card } from '../ui/Card';
import { ProductService } from '../../services/productService';
import { OrderService } from '../../services/orderService';

interface FarmerDashboardProps {
  farmerId: string;
}

export function FarmerDashboard({ farmerId }: FarmerDashboardProps) {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0
  });

  useEffect(() => {
    loadStats();
  }, [farmerId]);

  const loadStats = async () => {
    try {
      const products = await ProductService.getProductsByFarmer(farmerId);
      const orders = await OrderService.getOrdersByFarmer(farmerId);
      
      const totalRevenue = orders
        .filter(o => o.status === 'delivered')
        .reduce((sum, order) => sum + order.total, 0);
      
      const pendingOrders = orders.filter(o => o.status === 'pending').length;

      setStats({
        totalProducts: products.length,
        totalOrders: orders.length,
        totalRevenue,
        pendingOrders
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const statCards = [
    {
      name: 'Products',
      value: stats.totalProducts,
      icon: Package,
      color: 'text-blue-600'
    },
    {
      name: 'Orders',
      value: stats.totalOrders,
      icon: ShoppingBag,
      color: 'text-green-600'
    },
    {
      name: 'Revenue',
      value: `RWF ${stats.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: 'text-purple-600'
    },
    {
      name: 'Pending',
      value: stats.pendingOrders,
      icon: TrendingUp,
      color: 'text-orange-600'
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Dashboard</h2>
        <p className="text-gray-600">Overview of your farm business</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
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
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center">
                <Package className="w-5 h-5 text-green-600 mr-3" />
                <span className="font-medium">Add New Product</span>
              </div>
            </button>
            <button className="w-full p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center">
                <ShoppingBag className="w-5 h-5 text-blue-600 mr-3" />
                <span className="font-medium">View Orders</span>
              </div>
            </button>
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-3 text-sm text-gray-600">
            <p>• New order received</p>
            <p>• Product stock updated</p>
            <p>• Order delivered successfully</p>
          </div>
        </Card>
      </div>
    </div>
  );
}