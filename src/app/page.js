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
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-full object-cover transition-all duration-[1.5s] ease-out group-hover:scale-105" 
        />
      </div>
    </Link>
  );

  return (
    /* He unificado el padding lateral a px-6 para que en móvil nunca pegue al borde */
    <main className="min-h-screen bg-black text-white px-6 py-12 md:p-12 max-w-[1400px] mx-auto overflow-x-hidden">
      
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
          <div className="absolute -bottom-6 left-0 right-0 text-center">
            <span className="text-[8px] text-zinc-700 tracking-widest uppercase">
              {filteredProducts.length} Results Found
            </span>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-4 md:gap-8 text-[9px] tracking-[0.3em] uppercase">
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

      {/* GRID DINÁMICO - He corregido los span para evitar desbordamientos */}
      <div className="w-full mb-40">
        
        {activeFilter === "ALL" && !searchTerm ? (
          <div className="grid grid-cols-4 md:grid-cols-12 gap-y-20 md:gap-y-32 gap-x-4 md:gap-x-8 animate-in fade-in duration-1000">
            {filteredProducts.slice(0, 4).map(p => (
              <ProductItem key={p.id} product={p} className="col-span-4 md:col-span-6 lg:col-span-3" />
            ))}
            {filteredProducts.slice(4, 7).map(p => (
              <ProductItem key={p.id} product={p} className="col-span-4 md:col-span-4 lg:col-span-4" />
            ))}
            {filteredProducts.slice(7, 9).map(p => (
              <ProductItem key={p.id} product={p} className="col-span-4 lg:col-span-6" aspect="aspect-video" />
            ))}
            {filteredProducts.slice(9, 12).map(p => (
              <ProductItem key={p.id} product={p} className="col-span-4 md:col-span-4 lg:col-span-4" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 md:gap-x-8 gap-y-12 md:gap-y-20 animate-in fade-in slide-in-from-bottom-2 duration-1000">
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
    </main>
  );
}