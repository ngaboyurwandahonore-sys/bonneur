import React, { useState, useMemo } from 'react';
import { Search, MapPin, Filter } from 'lucide-react';
import { FarmerCard } from '../components/farmers/FarmerCard';
import { mockFarmers } from '../utils/mockData';
import { Button } from '../components/ui/Button';

interface FarmersViewProps {
  onViewProducts: (farmerId: string) => void;
}

export function FarmersView({ onViewProducts }: FarmersViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('rating');

  // Mock user location (Kigali)
  const userLocation = { lat: -1.9441, lng: 30.0619 };

  const calculateDistance = (farmerLat: number, farmerLng: number) => {
    const R = 6371; // Earth's radius in km
    const dLat = (farmerLat - userLocation.lat) * Math.PI / 180;
    const dLng = (farmerLng - userLocation.lng) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(userLocation.lat * Math.PI / 180) * Math.cos(farmerLat * Math.PI / 180) *
      Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const filteredFarmers = useMemo(() => {
    let filtered = mockFarmers.filter(farmer => {
      const matchesSearch = searchQuery === '' || 
        farmer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        farmer.farm.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        farmer.location.address.toLowerCase().includes(searchQuery.toLowerCase());
      
      return matchesSearch;
    });

    // Sort farmers
    switch (sortBy) {
      case 'distance':
        filtered.sort((a, b) => {
          const distA = calculateDistance(a.location.lat, a.location.lng);
          const distB = calculateDistance(b.location.lat, b.location.lng);
          return distA - distB;
        });
        break;
      case 'rating':
        filtered.sort((a, b) => b.stats.rating - a.stats.rating);
        break;
      case 'orders':
        filtered.sort((a, b) => b.stats.totalOrders - a.stats.totalOrders);
        break;
      case 'revenue':
        filtered.sort((a, b) => b.stats.totalRevenue - a.stats.totalRevenue);
        break;
      default:
        break;
    }

    return filtered;
  }, [searchQuery, sortBy]);

  const sortOptions = [
    { id: 'rating', name: 'Highest Rated' },
    { id: 'distance', name: 'Nearest First' },
    { id: 'orders', name: 'Most Orders' },
    { id: 'revenue', name: 'Top Revenue' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Discover Farmers</h1>
              <p className="text-gray-600">Connect directly with local farmers in your area</p>
            </div>
            <div className="mt-4 sm:mt-0 flex items-center space-x-2 text-sm text-gray-600">
              <MapPin className="w-4 h-4" />
              <span>Showing farmers near Kigali, Rwanda</span>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search farmers by name, farm, or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            {/* Sort */}
            <div className="flex items-center space-x-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                {sortOptions.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.name}
                  </option>
                ))}
              </select>

              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Farmers List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <p className="text-gray-600">
            Found {filteredFarmers.length} {filteredFarmers.length === 1 ? 'farmer' : 'farmers'}
          </p>
        </div>

        {filteredFarmers.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-lg mb-2">No farmers found</div>
            <p className="text-gray-600">Try adjusting your search criteria</p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredFarmers.map((farmer) => {
              const distance = calculateDistance(farmer.location.lat, farmer.location.lng);
              
              return (
                <FarmerCard
                  key={farmer.id}
                  farmer={farmer}
                  distance={distance}
                  onViewProducts={onViewProducts}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}