"use client";
import Link from 'next/link';
import { Instagram, Twitter, Youtube, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { toggleCart, cart } = useCart();

  return (
    <header className="mb-0  px-6 py-8 max-w-[1400px] mx-auto w-full">
      <div className="flex justify-between items-center">
        {/* LOGO */}
        <Link href="/" className="text-2xl md:text-3xl font-medium tracking-tighter italic">
          ATELIER
        </Link>
        
        <div className="flex items-center space-x-6 md:space-x-12">
          {/* NAVEGACIÓN ESCRITORIO (Visible desde MD) */}
          <nav className="hidden md:flex items-center space-x-8 text-[12px] lg:text-[15px] uppercase tracking-[0.3em] font-light text-white">
            <Link href="/" className="hover:line-through transition">Shop</Link>
            <Link href="/colecciones" className="hover:line-through transition">Collections</Link>
            <Link href="/contacto" className="hover:line-through transition">Contact</Link>
            
            <button 
              onClick={toggleCart} 
              className="flex items-center hover:line-through transition"
            >
              <ShoppingBag size={16} strokeWidth={1.5} className="mr-2" />
              <span>BAG ({cart.reduce((acc, item) => acc + item.quantity, 0)})</span>
            </button>
          </nav>

          {/* ICONO CARRITO MÓVIL (Solo visible en pantallas pequeñas) */}
          <button 
            onClick={toggleCart} 
            className="md:hidden flex items-center text-white"
          >
            <ShoppingBag size={20} strokeWidth={1.5} />
            <span className="ml-1 text-[10px]">({cart.reduce((acc, item) => acc + item.quantity, 0)})</span>
          </button>

          {/* SOCIALS - Ocultos en móviles muy pequeños para no apretar el logo */}
          <div className="hidden sm:flex items-center space-x-5 text-white">
            <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="hover:opacity-50 transition-opacity">
              <Instagram size={15} strokeWidth={1.5} />
            </a>
            <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer" className="hover:opacity-50 transition-opacity">
              <Twitter size={15} strokeWidth={1.5} />
            </a>
            <a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer" className="hover:opacity-50 transition-opacity">
              <Youtube size={15} strokeWidth={1.5} />
            </a>
          </div>
        </div>
      </div>

      {/* NAVEGACIÓN MÓVIL (Solo visible en pantallas pequeñas debajo del logo) */}
      <nav className="flex md:hidden justify-center space-x-6 mt-8 text-[9px] uppercase tracking-[0.3em] font-light text-zinc-400 border-t border-zinc-900 pt-4">
        <Link href="/" className="active:text-white">Shop</Link>
        <Link href="/colecciones" className="active:text-white">Collections</Link>
        <Link href="/contacto" className="active:text-white">Contact</Link>
      </nav>
    </header>
  );
}