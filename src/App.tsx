import React, { useState } from 'react';
import { Header } from './components/layout/Header';
import { MarketplaceView } from './views/MarketplaceView';
import { FarmerView } from './views/FarmerView';
import { TrendsView } from './views/TrendsView';
import { AdminView } from './views/AdminView';
import { SuperAdminView } from './views/SuperAdminView';
import { CustomerDashboardView } from './views/CustomerDashboardView';
import { AuthView } from './views/AuthView';
import { CartView } from './views/CartView';
import { CheckoutModal } from './components/marketplace/CheckoutModal';
import { CartItem } from './types';
import { initializeSampleData } from './utils/mockData';

function App() {
  const [currentView, setCurrentView] = useState('marketplace');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [user, setUser] = useState<any>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);

  React.useEffect(() => {
    // Initialize sample data on app start
    initializeSampleData();
  }, []);

  const handleAddToCart = (productId: string) => {
    // This will be handled by the marketplace component
    // For now, we'll create a simple cart item
    const newItem: CartItem = {
      id: Date.now().toString(),
      productId: productId,
      quantity: 1,
      price: 3000, // Default price, should be fetched from product
      farmerId: 'farmer-1' // Default farmer, should be fetched from product
    };

    const existingItem = cartItems.find(item => item.productId === productId);
    
    if (existingItem) {
      setCartItems(prev => 
        prev.map(item => 
          item.productId === productId 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCartItems(prev => [...prev, newItem]);
    }
  };

  const handleUpdateCartQuantity = (itemId: string, quantity: number) => {
    setCartItems(prev => 
      prev.map(item => 
        item.id === itemId ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveFromCart = (itemId: string) => {
    setCartItems(prev => prev.filter(item => item.id !== itemId));
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      setCurrentView('signin');
      return;
    }
    setShowCheckout(true);
  };

  const handleCheckoutSuccess = () => {
    setCartItems([]);
    setShowCheckout(false);
    alert('Order placed successfully! Farmers will contact you soon.');
    setCurrentView('customer-dashboard');
  };

  const handleAuthenticate = (userData: any) => {
    setUser(userData);
    setIsAuthenticated(true);
    
    // Redirect based on role
    if (userData.role === 'admin') {
      setCurrentView('admin');
    } else if (userData.role === 'superadmin') {
      setCurrentView('superadmin');
    } else if (userData.role === 'farmer') {
      setCurrentView('farmer');
    } else if (userData.role === 'customer') {
      setCurrentView('customer-dashboard');
    } else {
      setCurrentView('marketplace');
    }
  };

  const handleSignOut = () => {
    setUser(null);
    setIsAuthenticated(false);
    setCurrentView('marketplace');
  };

  const handleCartClick = () => {
    setCurrentView('cart');
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'signin':
        return <AuthView mode="signin" onAuthenticate={handleAuthenticate} />;
      case 'signup':
        return <AuthView mode="signup" onAuthenticate={handleAuthenticate} />;
      case 'cart':
        return (
          <CartView
            cartItems={cartItems}
            onUpdateQuantity={handleUpdateCartQuantity}
            onRemoveItem={handleRemoveFromCart}
            onCheckout={handleCheckout}
            onBackToShopping={() => setCurrentView('marketplace')}
          />
        );
      case 'marketplace':
        return <MarketplaceView onAddToCart={handleAddToCart} />;
      case 'farmer':
        return <FarmerView farmerId={user?.id} />;
      case 'trends':
        return <TrendsView />;
      case 'admin':
        return <AdminView />;
      case 'superadmin':
        return <SuperAdminView />;
      case 'customer-dashboard':
        return <CustomerDashboardView />;
      default:
        return <MarketplaceView onAddToCart={handleAddToCart} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {currentView !== 'signin' && currentView !== 'signup' && (
        <Header 
          currentView={currentView}
          onViewChange={setCurrentView}
          cartItems={cartItems.length}
          isAuthenticated={isAuthenticated}
          userRole={user?.role}
          onSignOut={handleSignOut}
          onCartClick={handleCartClick}
        />
      )}
      {renderCurrentView()}
      
      {showCheckout && (
        <CheckoutModal
          cartItems={cartItems}
          total={cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)}
          onClose={() => setShowCheckout(false)}
          onSuccess={handleCheckoutSuccess}
          customerId={user?.id || ''}
          customerName={user?.name || ''}
        />
      )}
    </div>
  );
}

export default App;
