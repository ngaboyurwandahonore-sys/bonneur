import React, { useState } from 'react';
import { Package, ShoppingBag, User, BarChart3 } from 'lucide-react';
import { FarmerDashboard } from '../components/farmer/FarmerDashboard';
import { ProductManagement } from '../components/farmer/ProductManagement';
import { OrderManagement } from '../components/farmer/OrderManagement';
import { FarmerProfile } from '../components/farmer/FarmerProfile';

interface FarmerViewProps {
  farmerId: string;
}

export function FarmerView({ farmerId }: FarmerViewProps) {
  const [activeTab, setActiveTab] = useState('dashboard');

  const tabs = [
    { id: 'dashboard', name: 'Dashboard', icon: BarChart3 },
    { id: 'products', name: 'Products', icon: Package },
    { id: 'orders', name: 'Orders', icon: ShoppingBag },
    { id: 'profile', name: 'Profile', icon: User },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <FarmerDashboard farmerId={farmerId} />;
      case 'products':
        return <ProductManagement farmerId={farmerId} />;
      case 'orders':
        return <OrderManagement farmerId={farmerId} />;
      case 'profile':
        return <FarmerProfile farmerId={farmerId} />;
      default:
        return <FarmerDashboard farmerId={farmerId} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-green-500 text-green-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="w-5 h-5 mr-2" />
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Content */}
        {renderContent()}
      </div>
    </div>
  );
}