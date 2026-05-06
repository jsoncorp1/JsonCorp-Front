"use client";

import { useEffect, useRef } from "react";

const TESTIMONIALS = [
  {
    initials: "RM",
    name: "Roberto Mamani",
    role: "Gerente General",
    company: "Distribuidora Oriente",
    text: "Antes pasábamos horas en Excel reconciliando inventario. Ahora todo está automatizado y puedo ver el estado de mi empresa en tiempo real desde el celular. JsonCorp cambió completamente cómo operamos.",
  },
  {
    initials: "LF",
    name: "Lucía Fernández",
    role: "Directora Comercial",
    company: "Constructora Los Andes",
    text: "El CRM nos ayudó a triplicar el seguimiento de clientes sin contratar más vendedores. El equipo de JsonCorp entiende el negocio, no solo la tecnología. Eso marca la diferencia.",
  },
  {
    initials: "CQ",
    name: "Carlos Quispe",
    role: "Propietario",
    company: "Clínica Santa Ana",
    text: "La aplicación que desarrollaron para nuestra clínica redujo los errores en citas casi a cero. Nuestros pacientes están felices y nosotros también. Vale cada centavo invertido.",
  },
];

function Stars() {
  return (
    <div className="flex gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default function TestimonialsSection() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll(".reveal").forEach((el, i) => {
              setTimeout(() => el.classList.add("visible"), i * 140);
            });
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="py-32 bg-[#0a1020] relative overflow-hidden" ref={ref}>
      <div className="absolute left-0 top-1/2 w-72 h-72 bg-blue-600/6 rounded-full blur-[80px] pointer-events-none" />

      <div className="relative max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <span className="reveal block text-blue-400 text-sm font-semibold uppercase tracking-widest">
            Testimonios
          </span>
          <h2 className="reveal reveal-delay-1 text-4xl sm:text-5xl lg:text-6xl font-bold text-white mt-5">
            Lo que dicen nuestros{" "}
            <span className="gradient-text">clientes</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((t, i) => (
            <div
              key={t.name}
              className={`reveal reveal-delay-${i + 1} glass-card rounded-2xl p-12 flex flex-col`}
            >
              <Stars />
              <blockquote className="text-slate-300 text-lg leading-[1.7] italic flex-1 mt-6 mb-8">
                &ldquo;{t.text}&rdquo;
              </blockquote>
              <div className="flex items-center gap-4 pt-6 border-t border-white/5">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white text-base font-bold flex-shrink-0">
                  {t.initials}
                </div>
                <div>
                  <div className="text-white font-semibold text-base">{t.name}</div>
                  <div className="text-slate-500 text-sm">
                    {t.role} &middot; {t.company}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
