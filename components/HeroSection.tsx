"use client";

import { useEffect, useState } from "react";

const HERO_STATS = [
  { value: "120+", label: "Empresas atendidas" },
  { value: "45%",  label: "Reducción de costos" },
  { value: "3x",   label: "Más productividad" },
];

export default function HeroSection() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  const cls = (delay: string) =>
    `transition-all duration-700 ${delay} ${
      visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
    }`;

  return (
    <section className="relative min-h-screen flex items-center justify-center hero-grid-bg overflow-hidden">
      {/* Ambient glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-blue-700/15 rounded-full blur-[120px]" />
        <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-cyan-700/10 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-blue-900/10 rounded-full blur-[140px]" />
      </div>

      <div className="relative z-10 max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 pt-36 pb-24">
        <div className="max-w-4xl mx-auto text-center">

          {/* Badge */}
          <div className={`inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-5 py-2 mb-10 ${cls("delay-0")}`}>
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-cyan-400 text-sm font-medium tracking-wide">
              Soluciones tecnológicas para Bolivia
            </span>
          </div>

          {/* Headline */}
          <h1 className={`text-5xl sm:text-6xl lg:text-8xl font-bold text-white leading-tight tracking-tight mb-8 ${cls("delay-100")}`}>
            Automatiza tu empresa.
            <br />
            <span className="gradient-text">Crece sin límites.</span>
          </h1>

          {/* Sub */}
          <p className={`text-xl sm:text-2xl text-slate-400 max-w-2xl mx-auto mb-12 leading-[1.7] ${cls("delay-200")}`}>
            Desarrollamos sistemas a medida que{" "}
            <span className="text-white font-medium">reducen costos</span>,
            eliminan procesos manuales y hacen que tu empresa funcione sola.{" "}
            <span className="text-white font-medium">Sin tecnicismos.</span>
          </p>

          {/* CTAs */}
          <div className={`flex flex-col sm:flex-row gap-5 justify-center mb-20 ${cls("delay-300")}`}>
            <a
              href="#contacto"
              className="btn-primary text-lg font-semibold px-10 py-5 rounded-full inline-flex items-center justify-center gap-2"
            >
              Solicitar Demo Gratis
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
            <a
              href="#soluciones"
              className="btn-outline text-lg font-semibold px-10 py-5 rounded-full inline-flex items-center justify-center"
            >
              Ver Soluciones
            </a>
          </div>

          {/* Quick stats */}
          <div className={`grid grid-cols-3 gap-6 sm:gap-10 max-w-2xl mx-auto pt-12 border-t border-white/10 ${cls("delay-[400ms]")}`}>
            {HERO_STATS.map((s) => (
              <div key={s.value} className="text-center">
                <div className="text-4xl sm:text-5xl font-black gradient-text number-display">
                  {s.value}
                </div>
                <div className="text-sm sm:text-base text-slate-400 mt-2">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll cue */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 animate-float opacity-40">
        <span className="text-slate-400 text-xs tracking-widest uppercase">Scroll</span>
        <svg className="w-5 h-8 text-slate-400" viewBox="0 0 20 32" fill="none" stroke="currentColor">
          <rect x="1" y="1" width="18" height="30" rx="9" strokeWidth="1.5" />
          <circle cx="10" cy="9" r="2.5" fill="currentColor" className="animate-bounce" />
        </svg>
      </div>
    </section>
  );
}
