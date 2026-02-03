"use client";
import { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const addToCart = (newProduct) => {
    setCart((prev) => {
      // Buscamos si ya existe el producto con el MISMO tamaño y papel
      const existingIndex = prev.findIndex(item => 
        item.id === newProduct.id && item.size === newProduct.size && item.paper === newProduct.paper
      );

      if (existingIndex > -1) {
        // Si existe, aumentamos la cantidad
        const newCart = [...prev];
        newCart[existingIndex].quantity += 1;
        return newCart;
      }
      // Si es nuevo, lo añadimos con cantidad 1
      return [...prev, { ...newProduct, quantity: 1 }];
    });
    setIsOpen(true);
  };

  const removeFromCart = (index) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  };

  const toggleCart = () => setIsOpen(!isOpen);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, isOpen, toggleCart }}>
      {children}
    </CartContext.Provider>
  );


  // Dentro de tu CartProvider
const clearCart = () => {
  setCart([]);
  localStorage.removeItem('cart'); // Si usas localStorage, lo borramos también
};

// No olvides añadirlo al value del Provider para que otros lo vean
return (
  <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, isOpen, toggleCart }}>
    {children}
  </CartContext.Provider>
);

}

export const useCart = () => useContext(CartContext);