"use client";

import { useEffect, useRef, useState } from "react";

const GLOBAL_STATS = [
  { value: "120", suffix: "+", label: "Empresas transformadas" },
  { value: "45",  suffix: "%", label: "Reducción promedio de costos" },
  { value: "98",  suffix: "%", label: "Clientes satisfechos" },
  { value: "3",   suffix: "x", label: "Aumento de productividad" },
];

const CASES = [
  {
    industry: "Comercio",
    metric: "45%",
    metricLabel: "menos tiempo en facturación",
    result: "Facturación integrada con inventario",
    desc: "Implementamos un sistema que eliminó 4 horas diarias de trabajo manual en una distribuidora mayorista.",
    company: "Distribuidora mayorista — La Paz",
  },
  {
    industry: "Construcción",
    metric: "3x",
    metricLabel: "más proyectos simultáneos",
    result: "ERP para gestión de obras y recursos",
    desc: "Pasaron de 3 a 9 proyectos activos sin contratar más personal administrativo.",
    company: "Constructora regional — Cochabamba",
  },
  {
    industry: "Salud",
    metric: "80%",
    metricLabel: "menos errores en citas",
    result: "App móvil con agendamiento online",
    desc: "Recordatorios automáticos y cero llamadas perdidas. Los pacientes agendan solos desde su celular.",
    company: "Clínica privada — Santa Cruz",
  },
];

export default function ResultsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [counted, setCounted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (!counted) setCounted(true);
            entry.target.querySelectorAll(".reveal").forEach((el, i) => {
              setTimeout(() => el.classList.add("visible"), i * 100);
            });
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [counted]);

  return (
    <section id="resultados" className="py-32 bg-[#070d1a]" ref={ref}>
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">

        {/* Global numbers */}
        <div className="text-center mb-24">
          <span className="reveal block text-cyan-400 text-sm font-semibold uppercase tracking-widest">
            Resultados reales
          </span>
          <h2 className="reveal reveal-delay-1 text-4xl sm:text-5xl lg:text-6xl font-bold text-white mt-5 mb-16">
            Números que hablan{" "}
            <span className="gradient-text">por sí solos</span>
          </h2>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {GLOBAL_STATS.map((s, i) => (
              <div
                key={s.label}
                className={`reveal reveal-delay-${i + 1} stat-card rounded-2xl p-10`}
              >
                <div
                  className={`text-6xl font-black number-display ${
                    counted ? "animate-count" : "opacity-0"
                  }`}
                >
                  <span className="gradient-text">{s.value}</span>
                  <span className="text-cyan-400">{s.suffix}</span>
                </div>
                <div className="text-slate-400 text-base mt-3">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Case studies */}
        <div className="section-divider mb-20" />
        <div className="text-center mb-16">
          <h3 className="reveal text-3xl sm:text-4xl font-bold text-white">
            Casos de éxito
          </h3>
          <p className="reveal reveal-delay-1 text-slate-400 mt-4 text-lg">
            Empresas que ya transformaron su operación con JsonCorp
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {CASES.map((c, i) => (
            <div
              key={c.company}
              className={`reveal reveal-delay-${i + 1} glass-card rounded-2xl p-10`}
            >
              <div className="flex items-center justify-between mb-6">
                <span className="text-sm font-semibold uppercase tracking-wider text-blue-400 bg-blue-500/10 px-4 py-1.5 rounded-full">
                  {c.industry}
                </span>
                <svg className="w-6 h-6 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="text-5xl font-black gradient-text number-display mb-2">{c.metric}</div>
              <div className="text-base text-slate-400 mb-6">{c.metricLabel}</div>
              <h4 className="text-white font-bold text-xl mb-3">{c.result}</h4>
              <p className="text-slate-400 text-base leading-[1.7]">{c.desc}</p>
              <div className="mt-6 pt-6 border-t border-white/5">
                <span className="text-slate-500 text-sm">{c.company}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
