"use client";

import { useEffect, useRef } from "react";

const REASONS = [
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    title: "Especialistas en Bolivia",
    desc: "Conocemos el mercado boliviano, la normativa tributaria local y los retos reales de las empresas del país.",
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    title: "IA integrada de verdad",
    desc: "No es marketing. Integramos inteligencia artificial real entrenada con los datos de tu empresa.",
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
      </svg>
    ),
    title: "100% a medida",
    desc: "Sin plantillas genéricas. Cada solución está diseñada para los procesos específicos de tu empresa.",
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: "Entrega rápida, sin burocracia",
    desc: "Primeros resultados en semanas, no meses. Metodología ágil que se adapta a tu negocio.",
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
    title: "Soporte local y dedicado",
    desc: "Equipo disponible para ayudarte. No somos una empresa extranjera inalcanzable, somos tus vecinos.",
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    title: "Resultados medibles",
    desc: "KPIs claros desde el inicio. Sabrás exactamente cuánto ahorras y cuánto ganas con nuestra solución.",
  },
];

export default function WhyUsSection() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll(".reveal").forEach((el, i) => {
              setTimeout(() => el.classList.add("visible"), i * 100);
            });
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.05 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="py-32 bg-[#0a1020] relative overflow-hidden" ref={ref}>
      <div className="absolute right-0 top-0 w-96 h-96 bg-blue-600/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <span className="reveal block text-blue-400 text-sm font-semibold uppercase tracking-widest">
            ¿Por qué elegirnos?
          </span>
          <h2 className="reveal reveal-delay-1 text-4xl sm:text-5xl lg:text-6xl font-bold text-white mt-5">
            La diferencia que{" "}
            <span className="gradient-text">marca JsonCorp</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {REASONS.map((r, i) => (
            <div
              key={r.title}
              className={`reveal reveal-delay-${Math.min(i + 1, 5)} glass-card rounded-2xl p-8 flex gap-5`}
            >
              <div className="text-blue-400 bg-blue-500/10 rounded-xl p-4 h-fit flex-shrink-0">
                {r.icon}
              </div>
              <div>
                <h3 className="text-white font-bold text-xl mb-3">{r.title}</h3>
                <p className="text-slate-400 text-base leading-[1.7]">{r.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
