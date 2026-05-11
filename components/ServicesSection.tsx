"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL

interface Service {
  id: string
  category: string
  name: string
  slogan: string
  photoUrlList: string[]
  keyStatList: string[]
  priceList: string[]
  primaryColor: string
  secondaryColor: string
}

export default function ServicesSection() {
  const ref = useRef<HTMLElement>(null)
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`${API_BASE}/services?page=1&size=20`)
        if (!res.ok) return
        const data = await res.json()
        setServices(data.data ?? [])
      } catch {
        // no mostrar errores en la landing
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll(".reveal").forEach((el, i) => {
              setTimeout(() => el.classList.add("visible"), i * 80)
            })
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.05 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [services])

  if (!loading && services.length === 0) return null

  return (
    <section id="sistemas" className="py-32" style={{ background: "#070d1a" }} ref={ref}>
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-20">
          <span className="reveal block text-cyan-400 text-sm font-semibold uppercase tracking-widest">
            Catálogo de sistemas
          </span>
          <h2 className="reveal reveal-delay-1 text-4xl sm:text-5xl lg:text-6xl font-bold text-white mt-5">
            Nuestros{" "}
            <span className="gradient-text">sistemas</span>
          </h2>
          <p className="reveal reveal-delay-2 text-slate-400 text-lg mt-6 max-w-2xl mx-auto leading-relaxed">
            Soluciones desarrolladas a medida para distintos rubros. Cada sistema es personalizable y listo para implementar.
          </p>
        </div>

        {/* Skeleton mientras carga */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="glass-card rounded-2xl overflow-hidden animate-pulse">
                <div className="h-48 bg-white/5" />
                <div className="p-6 flex flex-col gap-3">
                  <div className="h-4 w-20 bg-white/5 rounded-full" />
                  <div className="h-6 w-3/4 bg-white/5 rounded-lg" />
                  <div className="h-4 w-full bg-white/5 rounded-lg" />
                  <div className="h-4 w-5/6 bg-white/5 rounded-lg" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Grid de tarjetas */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((s, i) => {
              const firstStat = s.keyStatList?.[0]
              const [statLabel, statValue] = firstStat ? firstStat.split("|") : []
              const firstPrice = s.priceList?.[0]
              const [pricePlan, priceValue] = firstPrice ? firstPrice.split("|") : []

              return (
                <Link
                  key={s.id}
                  href={`/servicios/${s.id}`}
                  className={`reveal reveal-delay-${(i % 3) + 1} glass-card rounded-2xl overflow-hidden flex flex-col group cursor-pointer hover:border-white/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl`}
                >
                  {/* Imagen o header de color */}
                  <div className="relative h-48 overflow-hidden shrink-0">
                    {s.photoUrlList?.length > 0 ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={s.photoUrlList[0]}
                        alt={s.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div
                        className="w-full h-full flex items-center justify-center"
                        style={{
                          background: `linear-gradient(135deg, ${s.primaryColor}22 0%, ${s.secondaryColor ?? s.primaryColor}11 100%)`,
                          borderBottom: `1px solid ${s.primaryColor}22`,
                        }}
                      >
                        <svg className="w-16 h-16 opacity-20" style={{ color: s.primaryColor }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18" />
                        </svg>
                      </div>
                    )}
                    {/* Barra de color en la parte superior */}
                    <div
                      className="absolute top-0 left-0 right-0 h-1"
                      style={{ background: s.primaryColor }}
                    />
                    {/* Badge categoría */}
                    <div className="absolute bottom-3 left-3">
                      <span
                        className="text-xs font-semibold px-3 py-1 rounded-full"
                        style={{
                          background: `${s.primaryColor}22`,
                          color: s.primaryColor,
                          border: `1px solid ${s.primaryColor}44`,
                        }}
                      >
                        {s.category}
                      </span>
                    </div>
                  </div>

                  {/* Contenido */}
                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="text-white font-bold text-xl mb-2 group-hover:text-blue-300 transition-colors">
                      {s.name}
                    </h3>
                    <p className="text-slate-400 text-sm leading-relaxed line-clamp-2 flex-1">
                      {s.slogan}
                    </p>

                    {/* Stat destacado */}
                    {statValue && (
                      <div className="mt-4 pt-4 border-t border-white/5 flex items-center gap-3">
                        <div
                          className="text-2xl font-black"
                          style={{ color: s.primaryColor }}
                        >
                          {statValue}
                        </div>
                        <div className="text-slate-500 text-xs leading-tight">{statLabel}</div>
                      </div>
                    )}

                    {/* Precio + CTA */}
                    <div className="mt-4 flex items-center justify-between">
                      {priceValue ? (
                        <div>
                          <span className="text-white font-bold text-base">{priceValue}</span>
                          {pricePlan && <span className="text-slate-500 text-xs ml-1">· {pricePlan}</span>}
                        </div>
                      ) : (
                        <span className="text-slate-600 text-sm">Precio a consultar</span>
                      )}
                      <span
                        className="text-sm font-semibold flex items-center gap-1 group-hover:gap-2 transition-all"
                        style={{ color: s.primaryColor }}
                      >
                        Ver más
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
