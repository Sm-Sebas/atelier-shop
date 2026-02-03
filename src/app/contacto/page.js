"use client";
import { useRef, useState } from 'react';
import emailjs from '@emailjs/browser';

export default function Contacto() {
  const form = useRef();
  const [status, setStatus] = useState("Send Message");

  const sendEmail = (e) => {
    e.preventDefault();
    setStatus("Sending...");

    emailjs.sendForm(
      'service_qflfdxo',
      'template_i97bc8b',
      form.current,
      '2i30nxYYL5BmaJGax'
    )
    .then(() => {
        setStatus("Message Sent ✓");
        form.current.reset();
        setTimeout(() => setStatus("Send Message"), 3000);
    }, (error) => {
        console.log(error.text);
        setStatus("Error, try again");
    });
  };

  return (
    <main className="min-h-screen bg-[#000000] text-white p-6 md:p-12 font-sans">
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-20 lg:gap-32 mt-20 lg:mt-32">
        
        {/* LADO IZQUIERDO: Formulario */}
        <section>
          <h2 className="text-[10px] uppercase tracking-[0.3em] mb-12 text-white font-black">Inquiries</h2>
          <form ref={form} onSubmit={sendEmail} className="space-y-10">
            <div className="border-b border-zinc-800 py-2 focus-within:border-white transition-colors duration-500">
              <label className="block text-[10px] uppercase tracking-widest text-zinc-500 mb-2">Name</label>
              <input name="user_name" type="text" required className="w-full bg-transparent focus:outline-none text-sm font-light placeholder:text-zinc-800" placeholder="Your name" />
            </div>
            <div className="border-b border-zinc-800 py-2 focus-within:border-white transition-colors duration-500">
              <label className="block text-[10px] uppercase tracking-widest text-zinc-500 mb-2">Email</label>
              <input name="user_email" type="email" required className="w-full bg-transparent focus:outline-none text-sm font-light placeholder:text-zinc-800" placeholder="Your email" />
            </div>
            <div className="border-b border-zinc-800 py-2 focus-within:border-white transition-colors duration-500">
              <label className="block text-[10px] uppercase tracking-widest text-zinc-500 mb-2">Message</label>
              <textarea name="message" rows="4" required className="w-full bg-transparent focus:outline-none text-sm font-light resize-none placeholder:text-zinc-800" placeholder="Tell us about your project"></textarea>
            </div>
            <button type="submit" className="text-[10px] uppercase tracking-[0.3em] border border-white px-10 py-4 hover:bg-white hover:text-black transition-all duration-500 active:scale-95">
              {status}
            </button>
          </form>
        </section>

        {/* LADO DERECHO: Redes Sociales */}
      {/* LADO DERECHO: Redes Sociales escritas con Links */}
<section className="flex flex-col justify-between md:items-end">
  <div className="w-full">
    <h2 className="text-[10px] uppercase tracking-[0.3em] mb-12 text-white font-black md:text-right w-full">Social</h2>
    <div className="space-y-4 text-left md:text-right">
      {[
        { name: 'INSTAGRAM', url: 'https://www.instagram.com' },
        { name: 'TWITTER (X)', url: 'https://www.twitter.com' },
        { name: 'BEHANCE', url: 'https://www.behance.net' },
        { name: 'LINKEDIN', 
  url: 'https://www.linkedin.com/in/sebasti%C3%A1n-s%C3%A1nchez-mart%C3%ADnez-178b31349' }
      ].map((social) => (
        <a 
          key={social.name} 
          href={social.url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="block text-3xl md:text-5xl font-light tracking-tighter opacity-40 hover:opacity-100 hover:italic cursor-pointer transition-all duration-500 select-none"
        >
          {social.name}
        </a>
      ))}
    </div>
  </div>
  
  <div className="mt-20 md:mt-0 text-[10px] text-zinc-500 tracking-[0.2em] leading-relaxed md:text-right uppercase">
    Based in Spain<br/>
    Worldwide Shipping<br/>
    <span className="text-zinc-800">© 2026 ATELIER STUDIO</span>
  </div>
</section>
      </div>

      {/* --- EL BLOQUE QUE TE GUSTABA --- */}
      <footer className="mt-10 pt-16 text-center">
        <div className="max-w-2xl mx-auto space-y-8">
          <div className="space-y-2">
            <p className="text-[10px] uppercase tracking-[0.3em] text-zinc-500">Project Disclaimer</p>
            <p className="text-sm font-light leading-relaxed text-zinc-400">
              This is a strictly academic, non-profit project developed for the purpose of learning web design and development. None of the pieces shown are for sale; the prints and photographs belong to their respective authors.
            </p>
          </div>

          <ul className="flex flex-col gap-2">
            <li>
              <a href="https://stephanvasement.com/" target="_blank" rel="noopener noreferrer" className="text-xs hover:text-white transition-colors border-b border-transparent hover:border-white pb-1">
                Stephan Vasement
              </a>
            </li>
            <li>
              <a href="https://massimocolonna.com/" target="_blank" rel="noopener noreferrer" className="text-xs hover:text-white transition-colors border-b border-transparent hover:border-white pb-1">
                Massimo Colonna
              </a>
            </li>
            <li>
              <a href="https://chipirosky-bot.github.io/danielperez.github.io/" target="_blank" rel="noopener noreferrer" className="text-xs hover:text-white transition-colors border-b border-transparent hover:border-white pb-1">
                Daniel Pérez
              </a>
            </li>
          </ul>
        </div>
      </footer>
      
    </main>
  );
}