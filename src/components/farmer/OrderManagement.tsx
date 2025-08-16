import React, { useState, useEffect } from 'react';
import { Package, Clock, CheckCircle, XCircle, Phone, MapPin } from 'lucide-react';
import { Order } from '../../types';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { OrderService } from '../../services/orderService';

interface OrderManagementProps {
  farmerId: string;
}

export function OrderManagement({ farmerId }: OrderManagementProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    loadOrders();
  }, [farmerId]);

  const loadOrders = async () => {
    try {
      const farmerOrders = await OrderService.getOrdersByFarmer(farmerId);
      setOrders(farmerOrders);
    } catch (error) {
      console.error('Error loading orders:', error);
    }
  };

  const updateOrderStatus = async (orderId: string, status: Order['status']) => {
    try {
      await OrderService.updateOrderStatus(orderId, status);
      loadOrders();
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const filteredOrders = orders.filter(order => 
    filter === 'all' || order.status === filter
  );

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'confirmed': return <CheckCircle className="w-4 h-4" />;
      case 'shipped': return <Package className="w-4 h-4" />;
      case 'delivered': return <CheckCircle className="w-4 h-4" />;
      case 'cancelled': return <XCircle className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'confirmed': return 'info';
      case 'shipped': return 'info';
      case 'delivered': return 'success';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Orders</h2>
          <p className="text-gray-600">{filteredOrders.length} orders</p>
        </div>
        
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
        >
          <option value="all">All Orders</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {filteredOrders.length === 0 ? (
        <Card className="text-center py-12">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
          <p className="text-gray-600">Orders will appear here when customers place them</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <Card key={order.id}>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Order #{order.id}
                    </h3>
                    <Badge variant={getStatusColor(order.status) as any}>
                      {getStatusIcon(order.status)}
                      <span className="ml-1 capitalize">{order.status}</span>
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">
                    {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-green-600">
                    RWF {order.total.toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Customer</h4>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p>{order.customerName}</p>
                    <div className="flex items-center">
                      <Phone className="w-4 h-4 mr-1" />
                      {order.customerPhone}
                    </div>
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      {order.deliveryAddress}
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Products</h4>
                  <div className="space-y-1">
                    {order.products.map((item, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span>{item.productName} x{item.quantity}</span>
                        <span>RWF {(item.price * item.quantity).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {order.notes && (
                <div className="mb-4">
                  <h4 className="font-medium text-gray-900 mb-1">Notes</h4>
                  <p className="text-sm text-gray-600">{order.notes}</p>
                </div>
              )}

              {order.status === 'pending' && (
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    onClick={() => updateOrderStatus(order.id, 'confirmed')}
                  >
                    Confirm Order
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => updateOrderStatus(order.id, 'cancelled')}
                  >
                    Cancel
                  </Button>
                </div>
              )}

              {order.status === 'confirmed' && (
                <Button
                  size="sm"
                  onClick={() => updateOrderStatus(order.id, 'shipped')}
                >
                  Mark as Shipped
                </Button>
              )}

              {order.status === 'shipped' && (
                <Button
                  size="sm"
                  onClick={() => updateOrderStatus(order.id, 'delivered')}
                >
                  Mark as Delivered
                </Button>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}