"use client";
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import Link from 'next/link';

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getProducts() {
      setLoading(true);
      const { data } = await supabase
        .from('products')
        .select('*')
        .order('id', { ascending: true });

      if (data) {
        setProducts(data);
        setFilteredProducts(data.filter(p => p.show_in_home === true));
      }
      setLoading(false);
    }
    getProducts();
  }, []);

  useEffect(() => {
    let results = products;

    if (activeFilter === "ALL") {
      results = results.filter(p => p.show_in_home === true);
    } else {
      results = results.filter(p => 
        p.collection?.toLowerCase() === activeFilter.toLowerCase()
      );
    }

    if (searchTerm) {
      results = results.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredProducts(results);
  }, [searchTerm, activeFilter, products]);

  if (loading) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-[10px] tracking-[0.5em] text-zinc-500 uppercase animate-pulse">Opening Archive...</div>
    </div>
  );

  const ProductItem = ({ product, className, aspect = "aspect-[3/4]" }) => (
    <Link href={`/product/${product.id}`} className={`group block ${className}`}>
      <div className={`relative ${aspect} bg-zinc-900 overflow-hidden border border-white/5 transition-all duration-700 group-hover:border-zinc-700`}>
        {/* PEQUEÑO BADGE DE DISPONIBILIDAD (Opcional, queda muy pro) */}
        {/* <div className="absolute top-4 right-4 z-10 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
           <span className="w-1 h-1 bg-green-500 rounded-full animate-pulse"></span>
           <span className="text-[7px] tracking-widest uppercase text-white">In Stock</span>
        </div> */}

        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-full object-cover  transition-all duration-[1.5s] ease-out group-hover:scale-105" 
        />
      </div>
      <div className="mt-4 flex justify-between items-baseline px-1">
        {/* He dejado tus títulos comentados pero ahora el hover de la imagen ya es potente */}
      </div>
    </Link>
  );

  return (
    <main className="min-h-screen bg-black text-white p-6 md:p-12">
      
      {/* CABECERA */}
      <div className="mb-24 space-y-12 flex flex-col items-center">
        <div className="w-full max-w-sm relative">
           <input 
            type="text"
            placeholder="SEARCH ARCHIVE"
            className="bg-transparent border-b border-zinc-800 w-full py-2 text-[10px] tracking-[0.4em] uppercase text-center focus:outline-none focus:border-white transition-colors placeholder:text-zinc-800"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {/* Contador de resultados minimalista */}
          <div className="absolute -bottom-6 left-0 right-0 text-center">
            <span className="text-[8px] text-zinc-700 tracking-widest uppercase">
              {filteredProducts.length} Results Found
            </span>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-8 text-[9px] tracking-[0.3em] uppercase">
          {['ALL', 'Archive 01', 'Archive 02', 'Special Ed.', 'Collector'].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`pb-1 border-b transition-all duration-500 ${activeFilter === cat ? 'border-white text-white' : 'border-transparent text-zinc-600 hover:text-zinc-400'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* GRID DINÁMICO */}
      <div className="max-w-[1600px] mx-auto mb-40">
        
        {activeFilter === "ALL" && !searchTerm ? (
          /* VISTA EDITORIAL ORIGINAL */
          <div className="grid grid-cols-12 gap-y-32 gap-x-8 animate-in fade-in duration-1000">
            {filteredProducts.slice(0, 4).map(p => (
              <ProductItem key={p.id} product={p} className="col-span-12 sm:col-span-6 lg:col-span-3" />
            ))}
            {filteredProducts.slice(4, 7).map(p => (
              <ProductItem key={p.id} product={p} className="col-span-12 sm:col-span-4 lg:col-span-4" />
            ))}
            {filteredProducts.slice(7, 9).map(p => (
              <ProductItem key={p.id} product={p} className="col-span-12 lg:col-span-6" aspect="aspect-video" />
            ))}
            {filteredProducts.slice(9, 12).map(p => (
              <ProductItem key={p.id} product={p} className="col-span-12 sm:col-span-4 lg:col-span-4" />
            ))}
            {/* {filteredProducts.slice(12, 13).map(p => (
              <ProductItem key={p.id} product={p} className="col-span-12" aspect="aspect-[21/9] md:aspect-[3/1]" />
            ))} */}
          </div>
        ) : (
          /* VISTA FILTRADA (Grid Uniforme) */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-20 animate-in fade-in slide-in-from-bottom-2 duration-1000">
            {filteredProducts.map(p => (
              <ProductItem 
                key={p.id} 
                product={p} 
                className="col-span-1" 
                aspect={p.orientation === 'landscape' ? "aspect-video" : "aspect-[3/4]"} 
              />
            ))}
          </div>
        )}

        {filteredProducts.length === 0 && (
          <div className="text-center py-20 text-[10px] tracking-[0.5em] text-zinc-800 uppercase italic">
            No items found in the archive
          </div>
        )}
      </div>

      {/* FOOTER DISCRETO (Sugerencia para cerrar el diseño) */}
      {/* <footer className="mt-40 border-t border-zinc-900 pt-10 flex justify-between items-center text-[8px] tracking-[0.4em] text-zinc-600 uppercase">
        <p>© 2026 Archive Atelier</p>
        <div className="flex gap-8">
           <span>Stockholm</span>
           <span>Berlin</span>
        </div>
      </footer> */}
    </main>
  );
}