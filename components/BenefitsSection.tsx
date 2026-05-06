"use client";

import { useEffect, useRef, useState } from "react";

const BENEFITS = [
  {
    icon: "⚡",
    stat: "60%",
    statLabel: "tiempo ahorrado",
    title: "Ahorra hasta el 60% del tiempo",
    desc: "Automatiza las tareas repetitivas que hoy hace tu equipo a mano. Enfócate en lo que genera dinero.",
  },
  {
    icon: "🎯",
    stat: "95%",
    statLabel: "menos errores",
    title: "Elimina el 95% de los errores",
    desc: "Los sistemas no se equivocan. Adiós a errores de digitación, facturas mal emitidas y pedidos duplicados.",
  },
  {
    icon: "📈",
    stat: "3x",
    statLabel: "más capacidad",
    title: "Crece sin contratar más",
    desc: "Duplica tu volumen de operaciones sin aumentar planilla. La tecnología escala; los procesos manuales, no.",
  },
  {
    icon: "🧠",
    stat: "100%",
    statLabel: "visibilidad",
    title: "Decisiones basadas en datos",
    desc: "Dashboards en tiempo real. No más decisiones por intuición cuando puedes decidir con números reales.",
  },
];

export default function BenefitsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !revealed) {
            setRevealed(true);
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
  }, [revealed]);

  return (
    <section id="beneficios" className="py-32 bg-[#070d1a]" ref={ref}>
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <span className="reveal block text-cyan-400 text-sm font-semibold uppercase tracking-widest">
            Beneficios reales
          </span>
          <h2 className="reveal reveal-delay-1 text-4xl sm:text-5xl lg:text-6xl font-bold text-white mt-5">
            ¿Qué gana tu empresa con{" "}
            <span className="gradient-text">JsonCorp?</span>
          </h2>
          <p className="reveal reveal-delay-2 text-slate-400 mt-6 max-w-xl mx-auto text-xl leading-[1.7]">
            No te vendemos software. Te entregamos resultados medibles desde el
            primer mes.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {BENEFITS.map((b, i) => (
            <div
              key={b.title}
              className={`reveal reveal-delay-${i + 1} glass-card rounded-2xl p-10 text-center`}
            >
              <div className="text-6xl mb-6">{b.icon}</div>
              <div
                className={`text-6xl font-black gradient-text number-display mb-2 ${
                  revealed ? "animate-count" : "opacity-0"
                }`}
              >
                {b.stat}
              </div>
              <div className="text-sm text-slate-500 uppercase tracking-wider mb-5">
                {b.statLabel}
              </div>
              <h3 className="text-white font-bold text-xl mb-4">{b.title}</h3>
              <p className="text-slate-400 text-base leading-[1.7]">{b.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
