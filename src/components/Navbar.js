"use client";
import Link from 'next/link';
import { Instagram, Twitter, Youtube, ShoppingBag } from 'lucide-react'; // Añadimos el icono ShoppingBag
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { toggleCart, cart } = useCart();

  return (
    <header className="flex justify-between items-center mb-12 md:mb-2">
      <Link href="/" className="text-3xl font-medium tracking-tighter italic">ATELIER</Link>
      
      <div className="flex items-center space-x-12">
        {/* Metemos el botón dentro del nav para que herede el mismo espaciado (space-x-8) */}
        <nav className="hidden md:flex items-center space-x-8 text-[15px] uppercase tracking-[0.3em] font-light text-white">
          <Link href="/" className="hover:line-through transition">Shop</Link>
          <Link href="/colecciones" className="hover:line-through transition">Collections</Link>
          <Link href="/contacto" className="hover:line-through transition">Contact</Link>
          
          {/* BOTÓN CARRITO: Ahora con icono y alineado perfectamente */}
          <button 
            onClick={toggleCart} 
            className="flex items-center hover:line-through transition"
          >
            <ShoppingBag size={16} strokeWidth={1.5} className="mr-2" />
            <span>BAG ({cart.reduce((acc, item) => acc + item.quantity, 0)})</span>
          </button>
        </nav>

        <div className="flex items-center space-x-5 text-white">
          {/* ENLACES ACTUALIZADOS */}
          <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
            <Instagram size={15} strokeWidth={1.5} />
          </a>
          <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
            <Twitter size={15} strokeWidth={1.5} />
          </a>
          <a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
            <Youtube size={15} strokeWidth={1.5} />
          </a>
        </div>
      </div>
    </header>
  );
}