"use client";
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="mt-auto pt-10 border-t border-zinc-900 pb-8">
      {/* Añadimos este contenedor para mover el texto hacia el centro */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-10">
        
        <div className="space-y-4">
          <h2 className="text-xl font-medium italic tracking-tighter">ATELIER</h2>
          <p className="max-w-xs text-[9px] uppercase tracking-widest leading-relaxed text-zinc-500">
            Independent print shop focused on curated visual arts and limited editions.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-16">
          <div className="flex flex-col space-y-2">
            <span className="text-[10px] uppercase tracking-[0.3em] text-white mb-2 font-bold">Menu</span>
            <Link href="/" className="text-[10px] uppercase tracking-widest text-zinc-500 hover:text-white">Shop</Link>
            <Link href="/colecciones" className="text-[10px] uppercase tracking-widest text-zinc-500 hover:text-white">Collections</Link>
            <Link href="/contacto" className="text-[10px] uppercase tracking-widest text-zinc-500 hover:text-white">Contact</Link>
          </div>
          <div className="flex flex-col space-y-2">
            <span className="text-[10px] uppercase tracking-[0.3em] text-white mb-2 font-bold">Legal</span>
            <span className="text-[10px] uppercase tracking-widest text-zinc-500">Privacy</span>
            <span className="text-[10px] uppercase tracking-widest text-zinc-500">Terms</span>
          </div>
        </div>

        {/* Sección de créditos: Copyright + Portfolio */}
        <div className="flex flex-col space-y-2 text-[10px] uppercase tracking-[0.4em] text-zinc-500 md:self-end md:text-right">
          <a 
            href="https://sm-sebas.github.io/" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="hover:text-white transition-colors"
          >
            Built by Sebastián Sánchez
          </a>
          <div>
            © 2026 Atelier Studio. All rights reserved.
          </div>
        </div>

      </div>
    </footer>
  );
}