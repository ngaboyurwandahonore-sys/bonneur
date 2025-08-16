import React, { useState, useMemo } from 'react';
import { Sparkles } from 'lucide-react';
import { SearchFilters } from '../components/marketplace/SearchFilters';
import { ProductCard } from '../components/marketplace/ProductCard';
import { RecommendationCard } from '../components/marketplace/RecommendationCard';
import { ProductService } from '../services/productService';
import { UserService } from '../services/userService';
import { generateRecommendations } from '../utils/recommendations';
import { Product, Farmer } from '../types';

interface MarketplaceViewProps {
  onAddToCart: (productId: string) => void;
}

export function MarketplaceView({ onAddToCart }: MarketplaceViewProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [farmers, setFarmers] = useState<Farmer[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [sortBy, setSortBy] = useState('recommended');

  React.useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const allProducts = await ProductService.getAllProducts();
      const allUsers = await UserService.getAllUsers();
      const allFarmers = allUsers.filter(u => u.role === 'farmer') as Farmer[];
      
      setProducts(allProducts.filter(p => p.isActive));
      setFarmers(allFarmers);
    } catch (error) {
      console.error('Error loading marketplace data:', error);
    }
  };

  // Mock user location (Kigali)
  const userLocation = { lat: -1.9441, lng: 30.0619 };

  // Generate AI recommendations
  const recommendations = useMemo(() => {
    return generateRecommendations(products, userLocation, selectedCategory === 'all' ? undefined : selectedCategory);
  }, [selectedCategory, products]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = products.filter(product => {
      const matchesSearch = searchQuery === '' || 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
      
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
      
      return matchesSearch && matchesCategory && matchesPrice;
    });

    // Sort products
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.quality.rating - a.quality.rating);
        break;
      case 'distance':
        // Sort by distance (mock calculation)
        filtered.sort((a, b) => {
          const distA = Math.abs(a.location.lat - userLocation.lat) + Math.abs(a.location.lng - userLocation.lng);
          const distB = Math.abs(b.location.lat - userLocation.lat) + Math.abs(b.location.lng - userLocation.lng);
          return distA - distB;
        });
        break;
      default:
        // Keep recommended order
        break;
    }

    return filtered;
  }, [searchQuery, selectedCategory, priceRange, sortBy, products]);

  const calculateDistance = (productLat: number, productLng: number) => {
    const R = 6371; // Earth's radius in km
    const dLat = (productLat - userLocation.lat) * Math.PI / 180;
    const dLng = (productLng - userLocation.lng) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(userLocation.lat * Math.PI / 180) * Math.cos(productLat * Math.PI / 180) *
      Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <SearchFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        priceRange={priceRange}
        onPriceRangeChange={setPriceRange}
        sortBy={sortBy}
        onSortChange={setSortBy}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* AI Recommendations */}
        {recommendations.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center mb-4">
              <Sparkles className="w-5 h-5 text-green-600 mr-2" />
              <h2 className="text-xl font-semibold text-gray-900">AI Recommendations</h2>
              <span className="ml-2 text-sm text-gray-500">Personalized for you</span>
            </div>
            <div className="space-y-4">
              {recommendations.slice(0, 3).map((rec) => {
                const product = products.find(p => p.id === rec.productId);
                const farmer = farmers.find(f => f.id === product?.farmerId);
                if (!product || !farmer) return null;
                
                return (
                  <RecommendationCard
                    key={rec.productId}
                    product={product}
                    farmer={farmer}
                    recommendation={rec}
                    onAddToCart={onAddToCart}
                  />
                );
              })}
            </div>
          </div>
        )}

        {/* Products Grid */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            {selectedCategory === 'all' ? 'All Products' : `${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Products`}
            <span className="ml-2 text-sm font-normal text-gray-500">
              ({filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'})
            </span>
          </h2>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-lg mb-2">No products found</div>
            <p className="text-gray-600">Try adjusting your search criteria or filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => {
              const farmer = farmers.find(f => f.id === product.farmerId);
              if (!farmer) return null;
              
              const distance = calculateDistance(product.location.lat, product.location.lng);
              
              return (
                <ProductCard
                  key={product.id}
                  product={product}
                  farmer={farmer}
                  distance={distance}
                  onAddToCart={onAddToCart}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}