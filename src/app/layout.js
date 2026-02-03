"use client"; // Añadimos esto para que el estado funcione
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation'; // Importamos para detectar cambios de página
import './globals.css';
import Navbar from '../components/Navbar'; 
import CartDrawer from '../components/CartDrawer';
import { CartProvider } from '../context/CartContext';
import Footer from '../components/Footer';

export default function RootLayout({ children }) {
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname(); // Detecta la ruta actual

  // 1. Manejo del montado para evitar errores de hidratación
  useEffect(() => {
    setMounted(true);
  }, []);

  // 2. LÓGICA SCROLL TO TOP: Se ejecuta cada vez que cambias de página
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  
  return (
    <html lang="es">
      <body className="bg-[#121212]" suppressHydrationWarning={true}>
        <CartProvider>
          {/* El carrito solo se renderiza cuando mounted es true (en el navegador) */}
          {mounted && <CartDrawer />}
          
          <div className="p-8 md:p-16">
            <Navbar />
            {children} 
            <Footer />
          </div>
        </CartProvider>
      </body>
    </html>
  );
}