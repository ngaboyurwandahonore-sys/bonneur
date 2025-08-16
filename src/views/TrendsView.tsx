import React from 'react';
import { TrendingUp, BarChart3, PieChart, Activity } from 'lucide-react';
import { TrendChart } from '../components/trends/TrendChart';
import { mockTrends } from '../utils/mockData';
import { Card } from '../components/ui/Card';

export function TrendsView() {
  const insights = [
    {
      title: 'Peak Demand Season',
      description: 'Egg demand typically increases by 25% during school term periods',
      icon: TrendingUp,
      color: 'text-green-600',
    },
    {
      title: 'Regional Price Variations',
      description: 'Chicken prices in urban areas are 15% higher than rural regions',
      icon: BarChart3,
      color: 'text-blue-600',
    },
    {
      title: 'Organic Premium',
      description: 'Organic products command 30-40% price premium in the market',
      icon: PieChart,
      color: 'text-purple-600',
    },
    {
      title: 'Supply Chain Efficiency',
      description: 'Direct farmer-to-consumer sales reduce costs by 20-25%',
      icon: Activity,
      color: 'text-orange-600',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Market Trends & Analytics</h1>
            <p className="text-gray-600">AI-powered insights to help optimize your farming and purchasing decisions</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Market Trends */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Current Market Trends</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockTrends.map((trend, index) => (
              <TrendChart key={index} trend={trend} />
            ))}
          </div>
        </div>

        {/* Market Insights */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Market Insights</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {insights.map((insight, index) => (
              <Card key={index}>
                <div className="flex items-start space-x-4">
                  <div className={`flex-shrink-0 ${insight.color}`}>
                    <insight.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {insight.title}
                    </h3>
                    <p className="text-gray-600">{insight.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Recommendations for Farmers */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            AI Recommendations for Farmers
          </h3>
          <div className="space-y-4">
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <h4 className="font-medium text-green-900 mb-2">Optimal Production Planning</h4>
              <p className="text-green-800 text-sm">
                Based on current trends, consider increasing egg production by 15% for the next quarter. 
                Market demand is expected to rise due to seasonal factors.
              </p>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-medium text-blue-900 mb-2">Pricing Strategy</h4>
              <p className="text-blue-800 text-sm">
                Current chicken prices are 8% below market average in your region. 
                Consider adjusting prices to match market rates while maintaining competitiveness.
              </p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
              <h4 className="font-medium text-purple-900 mb-2">Market Expansion</h4>
              <p className="text-purple-800 text-sm">
                High demand detected in Butare region with limited supply. 
                Consider expanding delivery options to capture this market opportunity.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}