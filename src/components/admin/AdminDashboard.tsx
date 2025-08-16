import React from 'react';
import { Users, ShoppingBag, TrendingUp, DollarSign, Activity, AlertCircle, Package } from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { UserManagement } from './UserManagement';
import { Button } from '../ui/Button';

export function AdminDashboard() {
  const [activeTab, setActiveTab] = React.useState('overview');

  const stats = [
    {
      name: 'Total Farmers',
      value: '1,247',
      change: '+12%',
      changeType: 'positive' as const,
      icon: Users,
    },
    {
      name: 'Active Orders',
      value: '89',
      change: '+23%',
      changeType: 'positive' as const,
      icon: ShoppingBag,
    },
    {
      name: 'Monthly Revenue',
      value: 'RWF 9.6M',
      change: '+8%',
      changeType: 'positive' as const,
      icon: DollarSign,
    },
    {
      name: 'Platform Growth',
      value: '34%',
      change: '+5%',
      changeType: 'positive' as const,
      icon: TrendingUp,
    },
  ];

  const recentActivity = [
    {
      id: 1,
      type: 'new_farmer',
      message: 'New farmer "Green Valley Farm" registered',
      time: '2 hours ago',
      status: 'success',
    },
    {
      id: 2,
      type: 'large_order',
      message: 'Large order (RWF 60,000) placed by customer in Kigali',
      time: '4 hours ago',
      status: 'info',
    },
    {
      id: 3,
      type: 'price_alert',
      message: 'Chicken prices increased by 8% in Huye region',
      time: '6 hours ago',
      status: 'warning',
    },
    {
      id: 4,
      type: 'system',
      message: 'AI recommendation engine updated with new data',
      time: '8 hours ago',
      status: 'info',
    },
  ];

  if (activeTab === 'users') {
    return <UserManagement />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600">Monitor platform performance and manage operations</p>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'overview'
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'users'
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            User Management
          </button>
        </nav>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.name}>
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <stat.icon className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-4 flex-1">
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <div className="flex items-baseline">
                  <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                  <p className={`ml-2 text-sm font-medium ${
                    stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.change}
                  </p>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
            <Activity className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3">
                <div className={`flex-shrink-0 w-2 h-2 rounded-full mt-2 ${
                  activity.status === 'success' ? 'bg-green-400' :
                  activity.status === 'warning' ? 'bg-yellow-400' :
                  'bg-blue-400'
                }`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900">{activity.message}</p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* System Health */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">System Health</h3>
            <Badge variant="success">All Systems Operational</Badge>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">API Response Time</span>
              <span className="text-sm font-medium text-green-600">142ms</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Database Performance</span>
              <span className="text-sm font-medium text-green-600">Optimal</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">AI Model Accuracy</span>
              <span className="text-sm font-medium text-green-600">94.2%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Active Users</span>
              <span className="text-sm font-medium text-blue-600">2,847</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button 
            onClick={() => setActiveTab('users')}
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
          >
            <Users className="w-6 h-6 text-green-600 mb-2" />
            <h4 className="font-medium text-gray-900">Manage Users</h4>
            <p className="text-sm text-gray-600">Manage all user accounts</p>
          </button>
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
            <AlertCircle className="w-6 h-6 text-yellow-600 mb-2" />
            <h4 className="font-medium text-gray-900">Review Reports</h4>
            <p className="text-sm text-gray-600">Check flagged content and disputes</p>
          </button>
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
            <Package className="w-6 h-6 text-blue-600 mb-2" />
            <h4 className="font-medium text-gray-900">Products</h4>
            <p className="text-sm text-gray-600">Monitor product listings</p>
          </button>
        </div>
      </Card>
    </div>
  );
}