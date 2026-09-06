'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { IProduct, ProductUnit } from '@/types';

export interface CartItem {
  productId: string;
  name: string;
  pricePerUnit: number;
  unit: ProductUnit;
  quantity: number;
  image: string;
  isOrganic: boolean;
  farmerId: string;
  farmerName: string;
  farmName?: string;
  stockAvailable: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: IProduct, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalAmount: number;
  groupedByFarmer: Record<string, CartItem[]>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('krishi_cart');
      if (saved) {
        setItems(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Failed to load cart from localStorage:', e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('krishi_cart', JSON.stringify(items));
    }
  }, [items, isLoaded]);

  const addToCart = (product: IProduct, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.productId === product._id);
      const farmerUserId = typeof product.farmerId === 'object' ? (product.farmerId as any)._id : product.farmerId;
      const farmerName = typeof product.farmerId === 'object' ? (product.farmerId as any).name : 'Local Farmer';
      const farmName = product.farmerProfile?.farmName || `${farmerName}'s Farm`;

      if (existing) {
        const newQty = Math.min(existing.quantity + quantity, product.stockQuantity);
        return prev.map((item) =>
          item.productId === product._id ? { ...item, quantity: newQty } : item
        );
      } else {
        const newItem: CartItem = {
          productId: product._id,
          name: product.name,
          pricePerUnit: product.pricePerUnit,
          unit: product.unit,
          quantity: Math.min(quantity, product.stockQuantity),
          image: product.images?.[0] || 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800',
          isOrganic: product.isOrganic,
          farmerId: farmerUserId,
          farmerName,
          farmName,
          stockAvailable: product.stockQuantity,
        };
        return [...prev, newItem];
      }
    });
  };

  const removeFromCart = (productId: string) => {
    setItems((prev) => prev.filter((item) => item.productId !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setItems((prev) =>
      prev.map((item) => {
        if (item.productId === productId) {
          const clamped = Math.min(quantity, item.stockAvailable);
          return { ...item, quantity: clamped };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = items.reduce((sum, item) => sum + item.pricePerUnit * item.quantity, 0);

  const groupedByFarmer = items.reduce((acc, item) => {
    const key = item.farmName || item.farmerName || 'Local Farm';
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(item);
    return acc;
  }, {} as Record<string, CartItem[]>);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalAmount,
        groupedByFarmer,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
