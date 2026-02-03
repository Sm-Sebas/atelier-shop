"use client";
import Link from 'next/link';
import { useEffect } from 'react';
import { useCart } from '@/context/CartContext';

export default function SuccessPage() {
  const { clearCart } = useCart();

  useEffect(() => {
    // ¡Magia! El carrito se vacía en cuanto el cliente llega aquí
    clearCart();
  }, []);

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 text-center">
      <div className="mb-8 animate-pulse">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 6L9 17l-5-5"/>
        </svg>
      </div>
      
      <h1 className="text-[10px] uppercase tracking-[0.8em] mb-4 text-zinc-500">Order Completed</h1>
      <h2 className="text-4xl md:text-6xl font-light italic tracking-tighter mb-8">Thank you for your purchase.</h2>
      
      <p className="text-[11px] uppercase tracking-widest text-zinc-400 max-w-md leading-relaxed mb-12">
        A confirmation email has been sent to your inbox. Your art prints will be shipped shortly.
      </p>
      
      <Link href="/" className="text-[10px] uppercase tracking-[0.4em] border border-white/20 px-12 py-5 hover:bg-white hover:text-black transition-all">
        Continue Browsing
      </Link>
    </main>
  );
}