import { Product, Recommendation } from '../types';

// Simulate TF-IDF vectorization and cosine similarity for recommendations
export function generateRecommendations(
  products: Product[],
  userLocation: { lat: number; lng: number },
  category?: string
): Recommendation[] {
  const filteredProducts = category 
    ? products.filter(p => p.category === category)
    : products;

  return filteredProducts
    .map(product => {
      // Calculate distance score (closer = better)
      const distance = calculateDistance(
        userLocation.lat,
        userLocation.lng,
        product.location.lat,
        product.location.lng
      );
      
      const distanceScore = Math.max(0, 100 - distance * 2);
      
      // Calculate quality score
      const qualityScore = (product.quality.rating / 5) * 100;
      
      // Calculate price competitiveness (lower price = better score)
      const avgPrice = filteredProducts
        .filter(p => p.category === product.category)
        .reduce((sum, p) => sum + p.price, 0) / 
        filteredProducts.filter(p => p.category === product.category).length;
      
      const priceScore = Math.max(0, 100 - ((product.price - avgPrice) / avgPrice) * 100);
      
      // Calculate freshness score
      const freshnessScore = product.quality.freshness;
      
      // Combined score with weights
      const totalScore = (
        distanceScore * 0.3 +
        qualityScore * 0.25 +
        priceScore * 0.25 +
        freshnessScore * 0.2
      );

      // Calculate potential savings
      const savings = Math.max(0, avgPrice - product.price);
      
      // Generate reason
      let reason = '';
      if (distanceScore > 80) reason += 'Close to you. ';
      if (qualityScore > 85) reason += 'High quality rating. ';
      if (priceScore > 75) reason += 'Great price. ';
      if (freshnessScore > 90) reason += 'Very fresh. ';
      
      if (!reason) reason = 'Good overall value.';

      return {
        productId: product.id,
        score: totalScore,
        reason: reason.trim(),
        savings: savings > 0 ? savings : undefined,
        qualityBonus: qualityScore > 85 ? product.quality.rating : undefined
      };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);
}

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radius of the Earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return d;
}

function deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
}