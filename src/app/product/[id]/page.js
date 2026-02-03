"use client";
import { useParams } from 'next/navigation';
import { useState, useMemo, useEffect, useRef } from 'react';
import { useCart } from '../../../context/CartContext';
import { supabase } from '../../../lib/supabase';
import Link from 'next/link';

export default function ProductPage() {
  const { id } = useParams();
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showMockup, setShowMockup] = useState(false);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [priceFlash, setPriceFlash] = useState(false);
  const recommendationsRef = useRef(null);

  const [size, setSize] = useState('A3');
  const [paper, setPaper] = useState('Mate');

  // LÓGICA PARA EL EFECTO 3D
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const handleMouseMove = (e) => {
    const card = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - card.left;
    const y = e.clientY - card.top;
    const centerX = card.width / 2;
    const centerY = card.height / 2;
    const rotateX = (y - centerY) / 15;
    const rotateY = (centerX - x) / 15;
    setRotate({ x: rotateX, y: rotateY });
  };
  const handleMouseLeave = () => setRotate({ x: 0, y: 0 });

  useEffect(() => {
    async function fetchFullData() {
      if (!id) return;
      setLoading(true);
      
      const { data: productData } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

      const { data: recData } = await supabase
        .from('products')
        .select('*')
        .neq('id', id)
        .limit(4);

      if (productData) setProduct(productData);
      if (recData) setRecommendations(recData);
      setLoading(false);
    }
    fetchFullData();
  }, [id]);

  useEffect(() => {
    setPriceFlash(true);
    const timer = setTimeout(() => setPriceFlash(false), 300);
    return () => clearTimeout(timer);
  }, [size, paper]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { 
        if (entry.isIntersecting) {
          setIsIntersecting(true);
        }
      },
      { threshold: 0.05, rootMargin: "50px" }
    );
    
    const currentRef = recommendationsRef.current;
    if (currentRef) observer.observe(currentRef);
    
    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, [loading]);

  const finalPrice = useMemo(() => {
    if (!product) return 0;
    let extra = 0;
    if (size === 'A3') extra += 10; 
    if (size === '50x70') extra += 25;
    if (paper === 'Fine Art') extra += 15;
    return (product.price || 0) + extra;
  }, [size, paper, product]);

  if (loading) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-[10px] tracking-[0.5em] text-zinc-500 uppercase animate-pulse">Loading Archive...</div>
    </div>
  );

  if (!product) return <div className="text-white p-20 bg-black min-h-screen">Product not found in database.</div>;

  return (
    <main className="min-h-screen bg-[#000000] text-white p-6 md:p-10 flex flex-col items-center">
      {/* Grid optimizada: 1 columna hasta XL (iPad Pro Vertical incluido) */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-10 xl:gap-20 flex-1 items-center max-w-[1400px] w-full">
        
        {/* IMAGEN PRINCIPAL */}
        <div className="flex flex-col items-center w-full gap-6 py-6 md:py-12 xl:py-0">
          <div 
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className={`relative bg-black transition-all duration-500 flex justify-center
            ${product.orientation === 'landscape' 
                ? 'w-full aspect-[1050/713]' 
                : 'w-[90%] sm:w-[75%] md:w-[65%] xl:w-full xl:h-[75vh] aspect-[3/4]'
            }`}
            style={{ perspective: '1200px' }}
          >
            <div 
              className="w-full h-full transition-transform duration-200 ease-out"
              style={{ 
                transform: `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`,
                transformStyle: 'preserve-3d'
              }}
            >
              <img 
                src={product.image} 
                className="w-full h-full object-contain shadow-[0_30px_60px_-15px_rgba(0,0,0,0.7)]" 
                alt="print" 
                style={{ transform: 'translateZ(30px)' }}
              />
              <div 
                className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-20 transition-opacity duration-500"
                style={{
                  background: `radial-gradient(circle at ${50 + rotate.y * 2}% ${50 + rotate.x * 2}%, rgba(255,255,255,0.3) 0%, transparent 60%)`,
                  transform: 'translateZ(40px)'
                }}
              />
            </div>
          </div>
        </div>

        {/* INFO PRODUCTO */}
        <section className="flex flex-col justify-center space-y-8 max-w-md mx-auto xl:mx-0 w-full pb-10 xl:pb-0">
          <div>
            <h1 className="text-[11px] uppercase tracking-[0.6em] text-zinc-500 mb-2">{product.name}</h1>
            <p className={`text-2xl font-light italic transition-all duration-300 ${priceFlash ? 'text-zinc-500 scale-95' : 'text-white scale-100'}`}>
              €{finalPrice.toFixed(2)}
            </p>
          </div>

          <div className="space-y-6">
            <div>
              <p className="text-[10px] uppercase tracking-[.3em] text-zinc-600 mb-3 font-bold">Size</p>
              <div className="flex flex-wrap gap-2">
                {['A4', 'A3', '50x70'].map((s) => (
                  <button key={s} onClick={() => setSize(s)} className={`px-5 py-2 border text-[12px] transition-all ${size === s ? 'border-white text-white' : 'border-zinc-800 text-zinc-500 hover:border-zinc-600'}`}>{s}</button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-[10px] uppercase tracking-[.3em] text-zinc-600 mb-3 font-bold">Paper Finish</p>
              <div className="flex flex-wrap gap-2">
                {['Mate', 'Satinado', 'Fine Art'].map((p) => (
                  <button key={p} onClick={() => setPaper(p)} className={`px-5 py-2 border text-[12px] transition-all ${paper === p ? 'border-white text-white' : 'border-zinc-800 text-zinc-500 hover:border-zinc-600'}`}>{p}</button>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-zinc-900">
               <p className="text-[12px] uppercase tracking-[.3em] text-zinc-500 mb-3 font-bold">Print Specifications</p>
               <ul className="text-[12px] font-light leading-relaxed text-zinc-500 space-y-1">
                 <li>• Giclée technique, 12-colour pigment inks</li>
                 <li>• Premium {paper === 'Fine Art' ? 'Hahnemühle 310g' : 'Satin 250g'} paper</li>
                 <li>• Limited edition archive series</li>
                 <li>• Carbon neutral worldwide shipping</li>
               </ul>
            </div>

            <button onClick={() => addToCart({...product, price: finalPrice, size, paper})} className="w-full py-4 bg-white text-black text-[10px] uppercase tracking-[.4em] font-black hover:bg-zinc-200 transition-all">
              Add to Shopping Bag
            </button>
          </div>
        </section>
      </div>

      {/* SECCIÓN RECOMENDACIONES */}
      <section ref={recommendationsRef} className="mt-20 xl:mt-40 border-t border-zinc-900 pt-20 pb-40 w-full max-w-[1400px]">
        <div className={`flex flex-col md:flex-row justify-between items-baseline mb-12 gap-4 transition-all duration-1000 ${isIntersecting ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-[10px] uppercase tracking-[0.5em] text-white font-bold">Complete your archive</h2>
          <p className="text-[10px] uppercase tracking-[0.3em] text-zinc-600 italic">Curated pairings for your collection</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-10">
          {recommendations.map((item, index) => (
            <Link 
              href={`/product/${item.id}`} 
              key={item.id} 
              className="group flex flex-col gap-4 transition-all duration-1000" 
              style={{ 
                transitionDelay: `${index * 100}ms`, 
                opacity: isIntersecting ? 1 : 0, 
                transform: isIntersecting ? 'translateY(0)' : 'translateY(20px)' 
              }}
            >
              <div className="aspect-[3/4] bg-zinc-900 overflow-hidden border border-white/5 transition-all duration-700 group-hover:border-zinc-500">
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-all duration-[1.5s] ease-out" 
                />
              </div>
              <div className="flex justify-between items-start opacity-0 group-hover:opacity-100 transition-opacity duration-500 px-1">
                <span className="text-[9px] uppercase tracking-widest text-zinc-400">{item.name}</span>
                <span className="text-[9px] text-zinc-600 italic">View detail</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}