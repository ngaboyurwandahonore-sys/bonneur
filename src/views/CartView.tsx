import React from 'react';
import { CartView as CartComponent } from '../components/cart/CartView';
import { CartItem, Product, Farmer } from '../types';

interface CartViewProps {
  cartItems: CartItem[];
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onRemoveItem: (itemId: string) => void;
  onCheckout: () => void;
  onBackToShopping: () => void;
}

export function CartView(props: CartViewProps) {
  return <CartComponent {...props} products={[]} farmers={[]} />;
}