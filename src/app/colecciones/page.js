"use client";
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase'; // Conexión real
import Link from 'next/link';

// Estos nombres deben coincidir con la columna "collection" de tu tabla products
const collections = [
  { id: "01.", name: "Archive 01", image: "/p2.jpg", align: "start" },
  { id: "02.", name: "Archive 02", image: "/p25.jpg", align: "end" },
  { id: "03.", name: "Special Ed.", image: "/p8.jpg", align: "center" },
  { id: "04.", name: "Collector", image: "/p13.jpg", align: "start" },
];

export default function Destacados() {
  const [activeCollection, setActiveCollection] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  // Cada vez que el usuario elige una colección, pedimos esos productos a Supabase
  useEffect(() => {
    if (activeCollection) {
      // SOLUCIÓN AL SCROLL: Sube al inicio cuando se activa una colección
      window.scrollTo({ top: 0, behavior: 'smooth' });

      async function fetchCollectionProducts() {
        setLoading(true);
        const { data } = await supabase
          .from('products')
          .select('*')
          .eq('collection', activeCollection); // Filtra por el nombre de la colección
        
        if (data) setProducts(data);
        setLoading(false);
      }
      fetchCollectionProducts();
    }
  }, [activeCollection]);

  return (
    <main className="min-h-screen bg-[#000000] text-white p-6 md:p-24">
      
      {/* HEADER DINÁMICO */}
      <header className="mb-32 flex justify-between items-end">
        <div className="max-w-4xl">
          <p className="text-[10px] tracking-[0.5em] text-zinc-600 uppercase mb-4">
            {activeCollection ? "Exploring Series" : "Curated"}
          </p>
          <h1 className="text-5xl md:text-7xl font-extralight tracking-tighter uppercase transition-all duration-700">
            {activeCollection || "Collections"}
          </h1>
        </div>
        
        {activeCollection && (
          <button 
            onClick={() => setActiveCollection(null)}
            className="text-[10px] uppercase tracking-widest border border-white/20 px-6 py-2 hover:bg-white hover:text-black transition-all"
          >
            ← Back 
          </button>
        )}
      </header>

      {/* VISTA 1: LISTA DE COLECCIONES */}
      {!activeCollection ? (
        <section className="space-y-64">
          {collections.map((col) => (
            <div key={col.id} className={`flex flex-col ${col.align === 'end' ? 'items-end' : col.align === 'center' ? 'items-center' : 'items-start'} group relative w-full`}>
              
              {/* Títulos exteriores */}
              <div className="mb-8 flex items-end gap-6">
                <span className="text-4xl md:text-7xl font-serif italic text-zinc-800 group-hover:text-white transition-colors duration-1000">
                  {col.id}
                </span>
                <h2 className="text-2xl md:text-5xl font-light tracking-widest uppercase">{col.name}</h2>
              </div>

              {/* Contenedor de la Imagen con el efecto 01, 02... */}
              <div 
                onClick={() => setActiveCollection(col.name)}
                className={`relative overflow-hidden bg-zinc-900 border border-white/5 cursor-pointer
                ${col.align === 'center' ? 'w-full md:w-[80%]' : 'w-full md:w-[65%]'} 
                aspect-[16/7]  transition-all duration-1000`}
              >
                {/* Capa del número central (Hover) */}
                <div className="absolute inset-0 z-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
                  <span className="text-white text-7xl md:text-9xl font-serif italic tracking-tighter">
                    {col.id}
                  </span>
                </div>

                <img 
                  src={col.image} 
                  alt={col.name} 
                  className="w-full h-full object-cover scale-110 group-hover:scale-100 transition-all duration-[2000ms]" 
                />
                
                {/* Overlay sutil para legibilidad */}
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              </div>

              {/* Botón Explore */}
              <div className="mt-8 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <button 
                  onClick={() => setActiveCollection(col.name)}
                  className="text-[9px] uppercase tracking-[.5em] border-b border-white pb-1"
                >
                  Explore Collection
                </button>
              </div>
            </div>
          ))}
        </section>
      ) : (
       /* VISTA 2: GRID DE PRODUCTOS DE LA DB */
<section>
  {loading ? (
    <div className="text-[10px] tracking-widest text-zinc-600 uppercase animate-pulse">Loading Archive...</div>
  ) : (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {products.map((product) => (
        <Link href={`/product/${product.id}`} key={product.id} className="group">
          {/* AQUÍ LA MAGIA: Cambia el aspect ratio según la orientación guardada en Supabase */}
          <div className={`bg-zinc-900 border border-white/5 overflow-hidden mb-4 
            ${product.orientation === 'landscape' ? 'aspect-video' : 'aspect-[3/4]'}`}>
            <img 
              src={product.image} 
              className="w-full h-full object-cover  transition-all duration-1000" 
              alt={product.name} 
            />
          </div>
          <div className="flex justify-between items-baseline">
            <span className="text-[9px] uppercase tracking-widest text-zinc-500">{product.name}</span>
            <span className="text-[10px] text-zinc-700 italic">€{product.price?.toFixed(2)}</span>
          </div>
        </Link>
      ))}
    </div>
  )}
  {/* ... resto del código */}
</section>
      )}
    </main>
  );
}