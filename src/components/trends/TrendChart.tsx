import React from 'react';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';
import { MarketTrend } from '../../types';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';

interface TrendChartProps {
  trend: MarketTrend;
}

export function TrendChart({ trend }: TrendChartProps) {
  const priceChange = trend.prediction.nextMonth - trend.averagePrice;
  const priceChangePercent = (priceChange / trend.averagePrice) * 100;
  
  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 capitalize">
          {trend.category} Market
        </h3>
        <Badge 
          variant={priceChange > 0 ? 'warning' : 'success'}
          size="md"
        >
          {priceChange > 0 ? (
            <TrendingUp className="w-4 h-4 mr-1" />
          ) : (
            <TrendingDown className="w-4 h-4 mr-1" />
          )}
          {priceChangePercent > 0 ? '+' : ''}{priceChangePercent.toFixed(1)}%
        </Badge>
      </div>
      
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">Current Avg Price</p>
            <p className="text-2xl font-bold text-gray-900">
              RWF {trend.averagePrice.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Predicted Next Month</p>
            <p className="text-2xl font-bold text-green-600">
              RWF {trend.prediction.nextMonth.toLocaleString()}
            </p>
          </div>
        </div>
        
        <div className="space-y-3">
          <div>
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="text-gray-600">Market Demand</span>
              <span className="font-medium">{trend.demand}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${trend.demand}%` }}
              />
            </div>
          </div>
          
          <div>
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="text-gray-600">Prediction Confidence</span>
              <span className="font-medium">{Math.round(trend.prediction.confidence * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${trend.prediction.confidence * 100}%` }}
              />
            </div>
          </div>
        </div>
        
        <div className="pt-3 border-t border-gray-100">
          <div className="flex items-center text-sm text-gray-600">
            <Activity className="w-4 h-4 mr-2" />
            <span>Analysis period: {trend.period}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}