"use client";

import { useEffect, useRef } from "react";

const PROBLEMS = [
  {
    icon: "📊",
    title: "¿Tu empresa vive en Excel?",
    desc: "Versiones distintas, fórmulas que se rompen, datos perdidos. Excel no es un sistema empresarial.",
    accent: "problem-accent-red",
  },
  {
    icon: "⏰",
    title: "¿Los procesos manuales roban tiempo?",
    desc: "Horas de tu equipo en tareas repetitivas que una máquina haría en segundos.",
    accent: "problem-accent-orange",
  },
  {
    icon: "📉",
    title: "¿No sabes qué pasa en tiempo real?",
    desc: "Reportes con días de retraso, información dispersa, decisiones basadas en suposiciones.",
    accent: "problem-accent-yellow",
  },
  {
    icon: "🔄",
    title: "¿Tu equipo comete errores costosos?",
    desc: "Facturas incorrectas, pedidos duplicados, clientes insatisfechos. Los errores manuales cuestan dinero.",
    accent: "problem-accent-purple",
  },
];

export default function ProblemsSection() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll(".reveal").forEach((el, i) => {
              setTimeout(() => el.classList.add("visible"), i * 110);
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
    <section className="py-32 bg-[#070d1a]" ref={ref}>
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <span className="reveal block text-red-400 text-sm font-semibold uppercase tracking-widest">
            El problema
          </span>
          <h2 className="reveal reveal-delay-1 text-4xl sm:text-5xl lg:text-6xl font-bold text-white mt-5 leading-tight">
            ¿Te identificas con alguno de estos{" "}
            <span className="gradient-text">problemas?</span>
          </h2>
          <p className="reveal reveal-delay-2 text-slate-400 mt-6 max-w-xl mx-auto text-xl leading-[1.7]">
            Son los dolores más comunes en empresas bolivianas que aún no han
            dado el salto digital.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {PROBLEMS.map((p, i) => (
            <div
              key={p.title}
              className={`reveal reveal-delay-${i + 1} glass-card rounded-2xl p-10 ${p.accent}`}
            >
              <div className="text-5xl mb-6">{p.icon}</div>
              <h3 className="text-white font-bold text-2xl mb-4 leading-snug">{p.title}</h3>
              <p className="text-slate-400 text-base leading-[1.7]">{p.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-24 text-center reveal">
          <p className="text-3xl font-bold text-white">
            Nosotros tenemos{" "}
            <span className="gradient-text">la solución.</span>
          </p>
        </div>
      </div>
    </section>
  );
}
