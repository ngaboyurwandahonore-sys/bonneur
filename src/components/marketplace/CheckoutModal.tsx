import React, { useState } from 'react';
import { X, MapPin, Phone, User } from 'lucide-react';
import { CartItem } from '../../types';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { ProductService } from '../../services/productService';
import { OrderService } from '../../services/orderService';

interface CheckoutModalProps {
  cartItems: CartItem[];
  total: number;
  onClose: () => void;
  onSuccess: () => void;
  customerId: string;
  customerName: string;
}

export function CheckoutModal({ 
  cartItems, 
  total, 
  onClose, 
  onSuccess, 
  customerId, 
  customerName 
}: CheckoutModalProps) {
  const [formData, setFormData] = useState({
    phone: '',
    address: '',
    notes: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Group items by farmer
      const ordersByFarmer = cartItems.reduce((acc, item) => {
        if (!acc[item.farmerId]) {
          acc[item.farmerId] = [];
        }
        acc[item.farmerId].push(item);
        return acc;
      }, {} as Record<string, CartItem[]>);

      // Create orders for each farmer
      const products = await ProductService.getAllProducts();
      
      for (const [farmerId, items] of Object.entries(ordersByFarmer)) {
        const orderTotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        const orderData = {
          customerId,
          customerName,
          customerPhone: formData.phone,
          farmerId,
          products: items.map(item => {
            const product = products.find(p => p.id === item.productId);
            return {
              productId: item.productId,
              productName: product?.name || 'Unknown Product',
              quantity: item.quantity,
              price: item.price
            };
          }),
          total: orderTotal,
          status: 'pending' as const,
          deliveryAddress: formData.address,
          estimatedDelivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
          notes: formData.notes
        };

        await OrderService.createOrder(orderData);
      }

      onSuccess();
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Error placing order. Please try again.');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">Complete Order</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Phone className="w-4 h-4 inline mr-1" />
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="+250 7XX XXX XXX"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <MapPin className="w-4 h-4 inline mr-1" />
              Delivery Address
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Enter your full address"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes (Optional)
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Any special instructions..."
            />
          </div>

          <div className="border-t pt-4">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-semibold">Total:</span>
              <span className="text-xl font-bold text-green-600">
                RWF {total.toLocaleString()}
              </span>
            </div>
            
            <div className="flex space-x-3">
              <Button type="submit" className="flex-1">
                Place Order
              </Button>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
            </div>
          </div>
        </form>
      </Card>
    </div>
  );
}