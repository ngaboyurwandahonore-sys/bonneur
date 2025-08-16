import React from 'react';
import { MapPin, Star, Award, Calendar, TrendingUp } from 'lucide-react';
import { Farmer } from '../../types';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

interface FarmerCardProps {
  farmer: Farmer;
  distance?: number;
  onViewProducts: (farmerId: string) => void;
}

export function FarmerCard({ farmer, distance, onViewProducts }: FarmerCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <div className="flex items-start space-x-4">
        <img
          src={farmer.avatar}
          alt={farmer.name}
          className="w-16 h-16 rounded-full object-cover"
        />
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-900">{farmer.name}</h3>
            <div className="flex items-center">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="ml-1 text-sm font-medium">{farmer.stats.rating}</span>
            </div>
          </div>
          
          <h4 className="text-md font-medium text-green-600 mb-2">{farmer.farm.name}</h4>
          
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {farmer.farm.description}
          </p>
          
          <div className="flex flex-wrap gap-2 mb-3">
            {farmer.farm.certifications.map((cert, index) => (
              <Badge key={index} variant="info" size="sm">
                <Award className="w-3 h-3 mr-1" />
                {cert}
              </Badge>
            ))}
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              <span>Est. {farmer.farm.establishedYear}</span>
            </div>
            <div className="flex items-center">
              <TrendingUp className="w-4 h-4 mr-2" />
              <span>{farmer.stats.totalOrders} orders</span>
            </div>
            {distance && (
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-2" />
                <span>{distance.toFixed(1)} km away</span>
              </div>
            )}
            <div className="flex items-center">
              <span className="text-green-600 font-medium">
                RWF {farmer.stats.totalRevenue.toLocaleString()} revenue
              </span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">{farmer.location.address}</span>
            <Button size="sm" onClick={() => onViewProducts(farmer.id)}>
              View Products
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}