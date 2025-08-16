import React from 'react';
import { Sparkles, TrendingUp, MapPin, Star } from 'lucide-react';
import { Product, Farmer, Recommendation } from '../../types';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

interface RecommendationCardProps {
  product: Product;
  farmer: Farmer;
  recommendation: Recommendation;
  onAddToCart: (productId: string) => void;
}

export function RecommendationCard({ 
  product, 
  farmer, 
  recommendation, 
  onAddToCart 
}: RecommendationCardProps) {
  return (
    <Card className="border-green-200 bg-gradient-to-r from-green-50 to-white">
      <div className="flex items-start space-x-4">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-20 h-20 rounded-lg object-cover"
        />
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-1">
            <Sparkles className="w-4 h-4 text-green-600" />
            <Badge variant="success" size="sm">
              AI Recommended
            </Badge>
            <span className="text-sm text-gray-500">
              {Math.round(recommendation.score)}% match
            </span>
          </div>
          
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {product.name}
          </h3>
          
          <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
            <div className="flex items-center">
              <img
                src={farmer.avatar}
                alt={farmer.name}
                className="w-4 h-4 rounded-full mr-1"
              />
              <span>{farmer.name}</span>
            </div>
            
            <div className="flex items-center">
              <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
              <span>{product.quality.rating}</span>
            </div>
          </div>
          
          <p className="text-sm text-green-700 mb-3 font-medium">
            {recommendation.reason}
          </p>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-xl font-bold text-gray-900">
                RWF {product.price.toLocaleString()}
              </span>
              
              {recommendation.savings && (
                <div className="flex items-center text-green-600">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  <span className="text-sm font-medium">
                    Save RWF {recommendation.savings.toLocaleString()}
                  </span>
                </div>
              )}
            </div>
            
            <Button size="sm" onClick={() => onAddToCart(product.id)}>
              Add to Cart
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}