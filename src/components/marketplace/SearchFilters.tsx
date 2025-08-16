import React from 'react';
import { Search, Filter, MapPin, SlidersHorizontal } from 'lucide-react';
import { Button } from '../ui/Button';

interface SearchFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  priceRange: [number, number];
  onPriceRangeChange: (range: [number, number]) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
}

export function SearchFilters({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  priceRange,
  onPriceRangeChange,
  sortBy,
  onSortChange,
}: SearchFiltersProps) {
  const categories = [
    { id: 'all', name: 'All Products' },
    { id: 'chicken', name: 'Chicken' },
    { id: 'eggs', name: 'Eggs' },
    { id: 'manure', name: 'Manure' },
  ];

  const sortOptions = [
    { id: 'recommended', name: 'Recommended' },
    { id: 'price-low', name: 'Price: Low to High' },
    { id: 'price-high', name: 'Price: High to Low' },
    { id: 'rating', name: 'Highest Rated' },
    { id: 'distance', name: 'Nearest First' },
  ];

  return (
    <div className="bg-white border-b border-gray-200 sticky top-16 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {/* Search Bar */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search for products, farmers, or locations..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>

        {/* Filters Row */}
        <div className="flex flex-wrap items-center gap-4">
          {/* Categories */}
          <div className="flex items-center space-x-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => onCategoryChange(category.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>

          {/* Sort */}
          <div className="flex items-center space-x-2 ml-auto">
            <SlidersHorizontal className="w-4 h-4 text-gray-500" />
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              {sortOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.name}
                </option>
              ))}
            </select>
          </div>

          {/* Location Filter */}
          <Button variant="outline" size="sm">
            <MapPin className="w-4 h-4 mr-2" />
            Near Me
          </Button>

          {/* Advanced Filters */}
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            More Filters
          </Button>
        </div>

        {/* Active Filters */}
        {(selectedCategory !== 'all' || searchQuery) && (
          <div className="flex items-center space-x-2 mt-3 pt-3 border-t border-gray-100">
            <span className="text-sm text-gray-600">Active filters:</span>
            {selectedCategory !== 'all' && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                {categories.find(c => c.id === selectedCategory)?.name}
                <button
                  onClick={() => onCategoryChange('all')}
                  className="ml-1 text-green-600 hover:text-green-800"
                >
                  ×
                </button>
              </span>
            )}
            {searchQuery && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                "{searchQuery}"
                <button
                  onClick={() => onSearchChange('')}
                  className="ml-1 text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}