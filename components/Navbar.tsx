"use client";

import { useState, useEffect } from "react";

const NAV_LINKS = [
  { href: "#soluciones", label: "Soluciones" },
  { href: "#beneficios", label: "Beneficios" },
  { href: "#resultados", label: "Resultados" },
  { href: "#contacto", label: "Contacto" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#070d1a]/95 backdrop-blur-md border-b border-white/5 py-4"
          : "bg-transparent py-6"
      }`}
    >
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between min-h-[80px]">
          {/* Logo */}
          <a href="#" className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-base select-none">
              JC
            </div>
            <span className="text-white font-bold text-2xl tracking-tight">
              Json<span className="gradient-text">Corp</span>
            </span>
          </a>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="text-slate-400 hover:text-white text-base font-medium transition-colors duration-200"
              >
                {l.label}
              </a>
            ))}
          </nav>

          <a
            href="#contacto"
            className="hidden md:inline-flex btn-primary text-base font-semibold px-7 py-3.5 rounded-full items-center gap-2"
          >
            Solicitar Demo
          </a>

          {/* Hamburger */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden text-white p-2 rounded-lg hover:bg-white/10 transition-colors"
            aria-label="Abrir menú"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {open ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="md:hidden mobile-menu mt-4 pb-4 border-t border-white/10">
            <nav className="flex flex-col gap-1 pt-4">
              {NAV_LINKS.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="text-slate-300 hover:text-white hover:bg-white/5 px-4 py-3.5 rounded-lg text-base font-medium transition-all"
                >
                  {l.label}
                </a>
              ))}
              <a
                href="#contacto"
                onClick={() => setOpen(false)}
                className="btn-primary text-base font-semibold px-5 py-3.5 rounded-lg mt-2 text-center"
              >
                Solicitar Demo Gratis
              </a>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
