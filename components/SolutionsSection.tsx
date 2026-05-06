"use client";

import { useEffect, useRef } from "react";

const SOLUTIONS = [
  {
    tag: "CRM",
    title: "Nunca pierdas un cliente",
    desc: "Controla cada contacto, seguimiento y oportunidad de venta en un solo lugar. Cierra más negocios con menos esfuerzo.",
    points: ["Seguimiento automatizado", "Pipeline de ventas visual", "Reportes en tiempo real"],
    gradient: "from-blue-600/20 to-blue-900/5",
    border: "border-blue-500/25",
    tagColor: "text-blue-400 bg-blue-500/10",
    icon: (
      <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" strokeLinecap="round" strokeLinejoin="round" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    tag: "ERP",
    title: "Control total de tu empresa",
    desc: "Finanzas, inventario, compras, ventas y RRHH en un sistema unificado. Toma decisiones con información real.",
    points: ["Inventario en tiempo real", "Contabilidad integrada", "Módulos a medida"],
    gradient: "from-violet-600/20 to-violet-900/5",
    border: "border-violet-500/25",
    tagColor: "text-violet-400 bg-violet-500/10",
    icon: (
      <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <rect x="2" y="3" width="20" height="14" rx="2" strokeLinecap="round" strokeLinejoin="round" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 21h8M12 17v4M6 8h4M6 12h8" />
      </svg>
    ),
  },
  {
    tag: "Apps",
    title: "Tu negocio en el bolsillo",
    desc: "Aplicaciones móviles y web que tus clientes y equipo usan desde cualquier lugar. Rápidas, modernas y fáciles.",
    points: ["Android e iOS nativo", "Panel de administración web", "Diseño responsive"],
    gradient: "from-cyan-600/20 to-cyan-900/5",
    border: "border-cyan-500/25",
    tagColor: "text-cyan-400 bg-cyan-500/10",
    icon: (
      <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <rect x="5" y="2" width="14" height="20" rx="2" strokeLinecap="round" strokeLinejoin="round" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01" />
      </svg>
    ),
  },
  {
    tag: "Inteligencia Artificial",
    title: "Decisiones más inteligentes",
    desc: "IA entrenada con los datos de tu empresa. Predice demanda, detecta fraudes y automatiza la atención al cliente.",
    points: ["Modelos entrenados a medida", "Automatización de procesos", "Predicciones de negocio"],
    gradient: "from-emerald-600/20 to-emerald-900/5",
    border: "border-emerald-500/25",
    tagColor: "text-emerald-400 bg-emerald-500/10",
    icon: (
      <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
      </svg>
    ),
  },
];

export default function SolutionsSection() {
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
    <section id="soluciones" className="py-32 bg-[#0a1020] relative" ref={ref}>
      <div className="absolute inset-0 hero-grid-bg opacity-30 pointer-events-none" />

      <div className="relative max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <span className="reveal block text-blue-400 text-sm font-semibold uppercase tracking-widest">
            Nuestras soluciones
          </span>
          <h2 className="reveal reveal-delay-1 text-4xl sm:text-5xl lg:text-6xl font-bold text-white mt-5">
            Todo lo que tu empresa{" "}
            <span className="gradient-text">necesita para crecer</span>
          </h2>
          <p className="reveal reveal-delay-2 text-slate-400 mt-6 max-w-xl mx-auto text-xl leading-[1.7]">
            Tecnología diseñada para empresas bolivianas que quieren resultados
            reales, no promesas vacías.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {SOLUTIONS.map((s, i) => (
            <div
              key={s.tag}
              className={`reveal reveal-delay-${i + 1} rounded-2xl p-12 bg-gradient-to-br ${s.gradient} border ${s.border} transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl cursor-default`}
            >
              <div className="flex items-start gap-5 mb-7">
                <div className="text-blue-400 p-4 bg-white/5 rounded-xl flex-shrink-0">
                  {s.icon}
                </div>
                <div>
                  <span className={`text-sm font-bold uppercase tracking-widest px-4 py-1.5 rounded-full ${s.tagColor}`}>
                    {s.tag}
                  </span>
                  <h3 className="text-white font-bold text-3xl mt-3">{s.title}</h3>
                </div>
              </div>
              <p className="text-slate-300 mb-7 text-lg leading-[1.7]">{s.desc}</p>
              <ul className="space-y-3">
                {s.points.map((pt) => (
                  <li key={pt} className="flex items-center gap-3 text-slate-400 text-base">
                    <svg className="w-5 h-5 text-cyan-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                    {pt}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
