import React from 'react';
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from 'lucide-react';
import { CartItem, Product, Farmer } from '../../types';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { ProductService } from '../../services/productService';
import { UserService } from '../../services/userService';

interface CartViewProps {
  cartItems: CartItem[];
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onRemoveItem: (itemId: string) => void;
  onCheckout: () => void;
  onBackToShopping: () => void;
  products?: Product[];
  farmers?: Farmer[];
}

export function CartView({
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
  onBackToShopping,
  products = [],
  farmers = []
}: CartViewProps) {
  const [allProducts, setAllProducts] = React.useState<Product[]>([]);
  const [allFarmers, setAllFarmers] = React.useState<Farmer[]>([]);

  React.useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const products = await ProductService.getAllProducts();
      const users = await UserService.getAllUsers();
      const farmers = users.filter(u => u.role === 'farmer') as Farmer[];
      
      setAllProducts(products);
      setAllFarmers(farmers);
    } catch (error) {
      console.error('Error loading cart data:', error);
    }
  };

  const getCartItemDetails = (item: CartItem) => {
    const product = allProducts.find(p => p.id === item.productId);
    const farmer = allFarmers.find(f => f.id === item.farmerId);
    return { product, farmer };
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = subtotal > 8000 ? 0 : 1000; // Free delivery over RWF 8,000
  const total = subtotal + deliveryFee;

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <ShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
            <p className="text-gray-600 mb-6">Start shopping to add items to your cart</p>
            <Button onClick={onBackToShopping}>
              Continue Shopping
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button
            onClick={onBackToShopping}
            className="flex items-center text-green-600 hover:text-green-700 mr-4"
          >
            <ArrowLeft className="w-5 h-5 mr-1" />
            Continue Shopping
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Shopping Cart</h1>
          <span className="ml-2 text-gray-500">({cartItems.length} items)</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => {
              const { product, farmer } = getCartItemDetails(item);
              if (!product || !farmer) return null;

              return (
                <Card key={item.id}>
                  <div className="flex items-center space-x-4">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-20 h-20 rounded-lg object-cover"
                    />
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {product.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        by {farmer.name}
                      </p>
                      <p className="text-sm text-green-600 font-medium">
                        RWF {item.price.toLocaleString()} {product.unit}
                      </p>
                    </div>

                    <div className="flex items-center space-x-3">
                      <div className="flex items-center border border-gray-300 rounded-lg">
                        <button
                          onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                          className="p-2 hover:bg-gray-100 transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="px-4 py-2 font-medium">{item.quantity}</span>
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                          className="p-2 hover:bg-gray-100 transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="text-right">
                        <p className="font-semibold text-gray-900">
                          RWF {(item.price * item.quantity).toLocaleString()}
                        </p>
                      </div>

                      <button
                        onClick={() => onRemoveItem(item.id)}
                        className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Order Summary
              </h3>
              
              <div className="space-y-3 mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">RWF {subtotal.toLocaleString()}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery Fee</span>
                  <span className="font-medium">
                    {deliveryFee === 0 ? (
                      <span className="text-green-600">Free</span>
                    ) : (
                      `RWF ${deliveryFee.toLocaleString()}`
                    )}
                  </span>
                </div>
                
                {deliveryFee === 0 && (
                  <p className="text-sm text-green-600">
                    🎉 You qualify for free delivery!
                  </p>
                )}
                
                {deliveryFee > 0 && (
                  <p className="text-sm text-gray-500">
                    Add RWF {(8000 - subtotal).toLocaleString()} more for free delivery
                  </p>
                )}
              </div>
              
              <div className="border-t border-gray-200 pt-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-lg font-semibold text-gray-900">Total</span>
                  <span className="text-lg font-bold text-green-600">
                    RWF {total.toLocaleString()}
                  </span>
                </div>
              </div>
              
              <Button
                size="lg"
                className="w-full"
                onClick={onCheckout}
              >
                Proceed to Checkout
              </Button>
              
              <p className="text-xs text-gray-500 text-center mt-3">
                Secure checkout with SSL encryption
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}