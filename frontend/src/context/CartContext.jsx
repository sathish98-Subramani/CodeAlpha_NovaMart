import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const CartContext = createContext(null);

function readCart() {
  try { return JSON.parse(localStorage.getItem('novamart_cart') || '[]'); } catch { return []; }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(readCart);

  useEffect(() => {
    localStorage.setItem('novamart_cart', JSON.stringify(items));
  }, [items]);

  const addItem = (product, quantity = 1) => {
    setItems((current) => {
      const existing = current.find((item) => item.id === product.id);
      if (existing) return current.map((item) => item.id === product.id
        ? { ...item, quantity: Math.min(item.quantity + quantity, product.stock) }
        : item);
      return [...current, { ...product, quantity: Math.min(quantity, product.stock) }];
    });
  };

  const updateQuantity = (id, quantity) => {
    setItems((current) => current.map((item) => item.id === id
      ? { ...item, quantity: Math.max(1, Math.min(quantity, item.stock)) }
      : item));
  };

  const removeItem = (id) => setItems((current) => current.filter((item) => item.id !== id));
  const clearCart = () => setItems([]);
  const count = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal === 0 || subtotal >= 50 ? 0 : 5.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const value = useMemo(() => ({ items, addItem, updateQuantity, removeItem, clearCart, count, subtotal, shipping, tax, total }), [items, count, subtotal, shipping, tax, total]);
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = () => useContext(CartContext);
