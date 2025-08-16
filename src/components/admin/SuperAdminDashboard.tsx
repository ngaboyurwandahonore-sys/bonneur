import React from 'react';
import { 
  Users, 
  ShoppingBag, 
  TrendingUp, 
  DollarSign, 
  Activity, 
  AlertCircle,
  Shield,
  Database,
  Settings,
  BarChart3
} from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { UserManagement } from './UserManagement';

export function SuperAdminDashboard() {
  const [activeTab, setActiveTab] = React.useState('overview');

  const systemStats = [
    {
      name: 'Total Users',
      value: '3,247',
      change: '+18%',
      changeType: 'positive' as const,
      icon: Users,
    },
    {
      name: 'Platform Revenue',
      value: 'RWF 12.4M',
      change: '+15%',
      changeType: 'positive' as const,
      icon: DollarSign,
    },
    {
      name: 'System Uptime',
      value: '99.9%',
      change: '+0.1%',
      changeType: 'positive' as const,
      icon: Activity,
    },
    {
      name: 'Data Storage',
      value: '2.1TB',
      change: '+12%',
      changeType: 'neutral' as const,
      icon: Database,
    },
  ];

  const adminUsers = [
    {
      id: 1,
      name: 'Alice Uwimana',
      email: 'alice@agriconnect.rw',
      role: 'Admin',
      lastActive: '2 hours ago',
      status: 'active'
    },
    {
      id: 2,
      name: 'Bob Nkurunziza',
      email: 'bob@agriconnect.rw',
      role: 'Admin',
      lastActive: '1 day ago',
      status: 'active'
    },
    {
      id: 3,
      name: 'Carol Mukamana',
      email: 'carol@agriconnect.rw',
      role: 'Admin',
      lastActive: '3 days ago',
      status: 'inactive'
    }
  ];

  const systemAlerts = [
    {
      id: 1,
      type: 'security',
      message: 'Multiple failed login attempts detected from IP 192.168.1.100',
      time: '30 minutes ago',
      severity: 'high'
    },
    {
      id: 2,
      type: 'performance',
      message: 'Database query response time increased by 15%',
      time: '2 hours ago',
      severity: 'medium'
    },
    {
      id: 3,
      type: 'system',
      message: 'Scheduled backup completed successfully',
      time: '4 hours ago',
      severity: 'low'
    }
  ];

  if (activeTab === 'users') {
    return <UserManagement />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Super Admin Dashboard</h1>
        <p className="text-gray-600">System-wide monitoring and administration</p>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'overview'
                ? 'border-purple-500 text-purple-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'users'
                ? 'border-purple-500 text-purple-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            User Management
          </button>
        </nav>
      </div>

      {/* System Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {systemStats.map((stat) => (
          <Card key={stat.name}>
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <stat.icon className="h-8 w-8 text-purple-600" />
              </div>
              <div className="ml-4 flex-1">
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <div className="flex items-baseline">
                  <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                  <p className={`ml-2 text-sm font-medium ${
                    stat.changeType === 'positive' ? 'text-green-600' : 
                    stat.changeType === 'negative' ? 'text-red-600' : 'text-gray-600'
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
        {/* System Alerts */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">System Alerts</h3>
            <AlertCircle className="w-5 h-5 text-red-500" />
          </div>
          <div className="space-y-4">
            {systemAlerts.map((alert) => (
              <div key={alert.id} className="flex items-start space-x-3">
                <div className={`flex-shrink-0 w-2 h-2 rounded-full mt-2 ${
                  alert.severity === 'high' ? 'bg-red-400' :
                  alert.severity === 'medium' ? 'bg-yellow-400' :
                  'bg-green-400'
                }`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900">{alert.message}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <p className="text-xs text-gray-500">{alert.time}</p>
                    <Badge 
                      variant={
                        alert.severity === 'high' ? 'error' :
                        alert.severity === 'medium' ? 'warning' : 'success'
                      }
                      size="sm"
                    >
                      {alert.severity}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Admin Users */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Admin Users</h3>
            <Button variant="outline" size="sm">
              <Users className="w-4 h-4 mr-2" />
              Manage
            </Button>
          </div>
          <div className="space-y-4">
            {adminUsers.map((user) => (
              <div key={user.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-purple-600">
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge 
                    variant={user.status === 'active' ? 'success' : 'warning'}
                    size="sm"
                  >
                    {user.status}
                  </Badge>
                  <p className="text-xs text-gray-500 mt-1">{user.lastActive}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* System Management */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">System Management</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button 
            onClick={() => setActiveTab('users')}
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
          >
            <Users className="w-6 h-6 text-green-600 mb-2" />
            <h4 className="font-medium text-gray-900">Users</h4>
            <p className="text-sm text-gray-600">Manage all system users</p>
          </button>
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
            <Shield className="w-6 h-6 text-red-600 mb-2" />
            <h4 className="font-medium text-gray-900">Security</h4>
            <p className="text-sm text-gray-600">Manage security settings and permissions</p>
          </button>
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
            <Database className="w-6 h-6 text-blue-600 mb-2" />
            <h4 className="font-medium text-gray-900">Database</h4>
            <p className="text-sm text-gray-600">Monitor and manage database operations</p>
          </button>
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
            <BarChart3 className="w-6 h-6 text-green-600 mb-2" />
            <h4 className="font-medium text-gray-900">Analytics</h4>
            <p className="text-sm text-gray-600">View detailed system analytics</p>
          </button>
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
            <Settings className="w-6 h-6 text-gray-600 mb-2" />
            <h4 className="font-medium text-gray-900">Settings</h4>
            <p className="text-sm text-gray-600">Configure system-wide settings</p>
          </button>
        </div>
      </Card>

      {/* Platform Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <h4 className="font-medium text-gray-900 mb-3">User Distribution</h4>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Customers</span>
              <span className="font-medium">2,847 (87.7%)</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Farmers</span>
              <span className="font-medium">387 (11.9%)</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Admins</span>
              <span className="font-medium">13 (0.4%)</span>
            </div>
          </div>
        </Card>

        <Card>
          <h4 className="font-medium text-gray-900 mb-3">Regional Activity</h4>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Kigali</span>
              <span className="font-medium">45%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Eastern Province</span>
              <span className="font-medium">23%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Southern Province</span>
              <span className="font-medium">18%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Other</span>
              <span className="font-medium">14%</span>
            </div>
          </div>
        </Card>

        <Card>
          <h4 className="font-medium text-gray-900 mb-3">System Health</h4>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">API Response</span>
              <span className="font-medium text-green-600">98ms</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Database</span>
              <span className="font-medium text-green-600">Optimal</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Storage</span>
              <span className="font-medium text-yellow-600">78% Used</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Uptime</span>
              <span className="font-medium text-green-600">99.9%</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}