"use client";
import { useState } from 'react'; // <--- Añadido para el estado de carga
import { useCart } from '../context/CartContext';
import { loadStripe } from '@stripe/stripe-js'; // <--- Paso 1: Importar Stripe

// Inicializamos Stripe con tu llave pública
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

export default function CartDrawer() {
  const { cart, isOpen, toggleCart, removeFromCart } = useCart();
  const [loading, setLoading] = useState(false); // <--- Estado para el botón

  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  // FUNCIÓN MÁGICA DE PAGO
const handleCheckout = async () => {
    setLoading(true);

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: cart }),
      });

      const data = await response.json();

      if (data.url) {
        // Redirección directa a la URL de Stripe
        window.location.href = data.url;
      } else {
        throw new Error(data.error || "No se pudo generar la sesión de pago");
      }
    } catch (error) {
      console.error("Error en checkout:", error);
      alert("Error al conectar con Stripe: " + error.message);
      setLoading(false);
    }
  };

  return (
    <>
      {/* CAPA OSCURA DE FONDO */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/80 z-[60] backdrop-blur-sm transition-opacity" 
          onClick={toggleCart} 
        />
      )}

      {/* PANEL LATERAL */}
      <div className={`fixed top-0 right-0 h-full w-full md:w-[450px] bg-[#ffffff] z-[70] transition-transform duration-500 ease-in-out border-l border-white/5 p-8 md:p-12 flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        
        {/* CABECERA */}
        <div className="flex justify-between items-center mb-16">
          <div>
            <h2 className="text-[11px] uppercase tracking-[0.5em] font-bold text-black">Your Selection</h2>
            <p className="text-[9px] text-zinc-500 uppercase tracking-widest mt-2">
              {cart.length} {cart.length === 1 ? 'Style' : 'Styles'} added
            </p>
          </div>
          <button 
            onClick={toggleCart} 
            className="text-[10px] uppercase tracking-widest hover:line-through transition-all text-zinc-400 hover:text-black"
          >
            Close
          </button>
        </div>

        {/* LISTA DE PRODUCTOS */}
        <div className="flex-1 overflow-y-auto space-y-10 pr-2 custom-scrollbar">
          {cart.length === 0 ? (
            <div className="h-full flex items-center justify-center">
              <p className="text-zinc-600 text-[10px] uppercase tracking-[0.3em] italic">The bag is empty</p>
            </div>
          ) : (
            cart.map((item, index) => (
              <div key={`${item.id}-${item.size}-${item.paper}`} className="flex gap-6 border-b border-zinc-100 pb-10 text-black">
                <div className="w-24 h-32 bg-zinc-900 overflow-hidden border border-black/5">
                  <img src={item.image} className="w-full h-full object-cover grayscale" alt={item.name} />
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-[11px] uppercase tracking-widest font-medium">{item.name}</h3>
                      {item.quantity > 1 && (
                        <span className="text-[9px] bg-black text-white px-2 py-1 rounded-sm">QTY: {item.quantity}</span>
                      )}
                    </div>
                    <p className="text-[9px] uppercase tracking-tighter mb-1">Size: {item.size}</p>
                    <p className="text-[9px] uppercase tracking-tighter">Paper: {item.paper}</p>
                  </div>
                  <div className="flex justify-between items-end mt-4">
                    <button 
                      onClick={() => removeFromCart(index)} 
                      className="text-[8px] uppercase tracking-[0.2em] text-zinc-400 hover:text-red-800 transition-colors underline underline-offset-4"
                    >
                      Remove
                    </button>
                    <span className="text-[11px] font-dark italic">€{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* RESUMEN FINAL Y BOTÓN DE PAGO */}
        {cart.length > 0 && (
          <div className="pt-10 border-t border-zinc-100 mt-10">
            <div className="flex justify-between items-center mb-10">
              <span className="text-[10px] uppercase tracking-[0.4em] text-zinc-500">Total Amount</span>
              <span className="text-2xl font-light italic text-black">€{subtotal.toFixed(2)}</span>
            </div>
            
            {/* BOTÓN CON LÓGICA DE STRIPE */}
            <button 
              onClick={handleCheckout}
              disabled={loading}
              className={`w-full py-6 bg-black text-white text-[11px] uppercase tracking-[0.5em] font-black transition-all active:scale-[0.99] ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-zinc-800'}`}
            >
              {loading ? 'Processing...' : 'Proceed to Checkout'}
            </button>
            
            <p className="text-[8px] text-center text-black uppercase tracking-widest mt-6">
              Complimentary shipping on orders over €100
            </p>
          </div>
        )}
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 2px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #eee; }
      `}</style>
    </>
  );
}