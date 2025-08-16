import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Package, Eye, EyeOff } from 'lucide-react';
import { Product } from '../../types';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { ProductService } from '../../services/productService';
import { ProductForm } from './ProductForm';

interface ProductManagementProps {
  farmerId: string;
}

export function ProductManagement({ farmerId }: ProductManagementProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  useEffect(() => {
    loadProducts();
  }, [farmerId]);

  const loadProducts = async () => {
    try {
      const farmerProducts = await ProductService.getProductsByFarmer(farmerId);
      setProducts(farmerProducts);
    } catch (error) {
      console.error('Error loading products:', error);
    }
  };

  const handleSaveProduct = async (productData: Partial<Product>) => {
    try {
      if (editingProduct) {
        // Update existing product
        await ProductService.updateProduct(editingProduct.id, productData);
      } else {
        // Create new product
        await ProductService.createProduct({
          ...productData,
          farmerId,
          quality: {
            rating: 0,
            reviews: 0,
            organic: productData.quality?.organic || false,
            freshness: 100
          }
        });
      }
      
      loadProducts();
      setShowForm(false);
      setEditingProduct(null);
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Error saving product');
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (confirm('Delete this product?')) {
      try {
        await ProductService.deleteProduct(productId);
        loadProducts();
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  const handleToggleActive = async (productId: string) => {
    try {
      const product = products.find(p => p.id === productId);
      if (product) {
        await ProductService.updateProduct(productId, { isActive: !product.isActive });
        loadProducts();
      }
    } catch (error) {
      console.error('Error toggling product status:', error);
    }
  };

  if (showForm) {
    return (
      <ProductForm
        product={editingProduct}
        onSave={handleSaveProduct}
        onCancel={() => {
          setShowForm(false);
          setEditingProduct(null);
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-gray-900">My Products</h2>
          <p className="text-gray-600">{products.length} products</p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Product
        </Button>
      </div>

      {products.length === 0 ? (
        <Card className="text-center py-12">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No products yet</h3>
          <p className="text-gray-600 mb-4">Start by adding your first product</p>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <Card key={product.id} className="overflow-hidden">
              <div className="aspect-w-16 aspect-h-9 bg-gray-200 mb-4">
                <img
                  src={product.images[0] || 'https://images.pexels.com/photos/1059943/pexels-photo-1059943.jpeg?auto=compress&cs=tinysrgb&w=400'}
                  alt={product.name}
                  className="w-full h-32 object-cover rounded-lg"
                />
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold text-gray-900">{product.name}</h3>
                  <Badge variant={product.isActive ? 'success' : 'warning'}>
                    {product.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
                
                <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>
                
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-green-600">
                    RWF {product.price.toLocaleString()}
                  </span>
                  <span className="text-sm text-gray-500">
                    Stock: {product.stock}
                  </span>
                </div>
                
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleToggleActive(product.id)}
                  >
                    {product.isActive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setEditingProduct(product);
                      setShowForm(true);
                    }}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDeleteProduct(product.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}