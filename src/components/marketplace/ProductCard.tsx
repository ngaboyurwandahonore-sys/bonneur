import React from 'react';
import { MapPin, Star, Truck, Leaf } from 'lucide-react';
import { Product, Farmer } from '../../types';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

interface ProductCardProps {
  product: Product;
  farmer: Farmer;
  distance?: number;
  onAddToCart: (productId: string) => void;
}

export function ProductCard({ product, farmer, distance, onAddToCart }: ProductCardProps) {
  return (
    <Card padding="none" className="overflow-hidden hover:shadow-md transition-shadow">
      <div className="aspect-w-16 aspect-h-9 bg-gray-200">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-48 object-cover"
        />
      </div>
      
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
          {product.quality.organic && (
            <Badge variant="success" size="sm">
              <Leaf className="w-3 h-3 mr-1" />
              Organic
            </Badge>
          )}
        </div>

        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>

        <div className="flex items-center mb-2">
          <Star className="w-4 h-4 text-yellow-400 fill-current" />
          <span className="ml-1 text-sm font-medium">{product.quality.rating}</span>
          <span className="ml-1 text-sm text-gray-500">({product.quality.reviews})</span>
          <span className="ml-2 text-sm text-gray-500">•</span>
          <span className="ml-2 text-sm text-green-600 font-medium">
            {product.quality.freshness}% Fresh
          </span>
        </div>

        <div className="flex items-center text-sm text-gray-600 mb-3">
          <img
            src={farmer.avatar}
            alt={farmer.name}
            className="w-5 h-5 rounded-full mr-2"
          />
          <span>{farmer.name}</span>
          {distance && (
            <>
              <span className="mx-2">•</span>
              <MapPin className="w-4 h-4 mr-1" />
              <span>{distance.toFixed(1)} km away</span>
            </>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div>
            <span className="text-2xl font-bold text-gray-900">
              RWF {product.price.toLocaleString()}
            </span>
            <span className="text-sm text-gray-500 ml-1">{product.unit}</span>
          </div>
          
          <div className="flex items-center space-x-2">
            {product.stock < 10 && (
              <Badge variant="warning" size="sm">
                Low Stock
              </Badge>
            )}
            <Button
              size="sm"
              onClick={() => onAddToCart(product.id)}
              disabled={product.stock === 0}
            >
              Add to Cart
            </Button>
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="flex items-center text-sm text-gray-600">
            <Truck className="w-4 h-4 mr-1" />
            <span>Free delivery on orders over RWF 8,000</span>
          </div>
        </div>
      </div>
    </Card>
  );
}