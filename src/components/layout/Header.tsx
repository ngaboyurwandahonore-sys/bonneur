import React, { useState } from 'react';
import { Search, MapPin, ShoppingCart, User, Menu, X, LogOut } from 'lucide-react';
import { Button } from '../ui/Button';

interface HeaderProps {
  currentView: string;
  onViewChange: (view: string) => void;
  cartItems: number;
  isAuthenticated?: boolean;
  userRole?: string;
  onSignOut?: () => void;
  onCartClick?: () => void;
}

export function Header({ 
  currentView, 
  onViewChange, 
  cartItems, 
  isAuthenticated = false,
  userRole,
  onSignOut,
  onCartClick
}: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const getNavigation = () => {
    const baseNav = [
      { name: 'Marketplace', id: 'marketplace' },
      { name: 'Trends', id: 'trends' },
    ];

    if (userRole === 'admin') {
      return [...baseNav, { name: 'Admin Dashboard', id: 'admin' }];
    } else if (userRole === 'superadmin') {
      return [...baseNav, { name: 'Super Admin', id: 'superadmin' }];
    } else if (userRole === 'farmer') {
      return [{ name: 'My Farm', id: 'farmer' }, ...baseNav];
    } else if (userRole === 'customer') {
      return [...baseNav, { name: 'My Dashboard', id: 'customer-dashboard' }];
    }

    return baseNav;
  };

  const navigation = getNavigation();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">AC</span>
              </div>
              <span className="ml-2 text-xl font-bold text-gray-900">AgriConnect</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navigation.map((item) => (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentView === item.id
                    ? 'text-green-600 bg-green-50'
                    : 'text-gray-700 hover:text-green-600 hover:bg-gray-50'
                }`}
              >
                {item.name}
              </button>
            ))}
          </nav>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-600">
              <MapPin className="w-4 h-4" />
              <span>Kigali, Rwanda</span>
            </div>
            
            <button 
              onClick={onCartClick}
              className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-green-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItems}
                </span>
              )}
            </button>

            {isAuthenticated ? (
              <div className="hidden sm:flex items-center space-x-2">
                <Button variant="outline" size="sm" onClick={onSignOut}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            ) : (
              <Button 
                variant="outline" 
                size="sm" 
                className="hidden sm:flex"
                onClick={() => onViewChange('signin')}
              >
                <User className="w-4 h-4 mr-2" />
                Sign In
              </Button>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-600 hover:text-gray-900"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-2">
              {navigation.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    onViewChange(item.id);
                    setIsMenuOpen(false);
                  }}
                  className={`px-3 py-2 rounded-md text-sm font-medium text-left transition-colors ${
                    currentView === item.id
                      ? 'text-green-600 bg-green-50'
                      : 'text-gray-700 hover:text-green-600 hover:bg-gray-50'
                  }`}
                >
                  {item.name}
                </button>
              ))}
              {isAuthenticated ? (
                <Button variant="outline" size="sm" className="mt-4 self-start" onClick={onSignOut}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              ) : (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-4 self-start"
                  onClick={() => {
                    onViewChange('signin');
                    setIsMenuOpen(false);
                  }}
                >
                  <User className="w-4 h-4 mr-2" />
                  Sign In
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}