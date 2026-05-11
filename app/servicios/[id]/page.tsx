"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import Footer from "@/components/Footer"

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL

interface Service {
  id: string
  category: string
  name: string
  slogan: string
  photoUrlList: string[]
  urlVideo: string
  keyStatList: string[]
  benefitsList: string[]
  featuresList: string[]
  problemSolveList: string[]
  priceList: string[]
  warrantyList: string[]
  primaryColor: string
  secondaryColor: string
  accentColor: string
  backgroundColor: string
  textColor: string
}

function getYoutubeEmbedUrl(url: string): string | null {
  try {
    const u = new URL(url)
    if (u.hostname.includes("youtube.com")) {
      const v = u.searchParams.get("v")
      return v ? `https://www.youtube.com/embed/${v}` : null
    }
    if (u.hostname === "youtu.be") {
      return `https://www.youtube.com/embed${u.pathname}`
    }
  } catch { /* invalid url */ }
  return null
}

function isDirectVideo(url: string) {
  return /\.(mp4|webm|ogg)(\?|$)/i.test(url)
}

export default function ServicePublicPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [service, setService] = useState<Service | null>(null)
  const [loading, setLoading] = useState(true)
  const [activePhoto, setActivePhoto] = useState(0)
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    let cancelled = false
    async function load() {
      try {
        const res = await fetch(`${API_BASE}/services/${id}`)
        if (!res.ok) { router.replace("/"); return }
        const data: Service = await res.json()
        if (!cancelled) setService(data)
      } catch {
        if (!cancelled) router.replace("/")
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [id, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--background)" }}>
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-full border-2 border-blue-500/30 border-t-blue-500 animate-spin" />
          <p className="text-slate-400 text-sm">Cargando sistema…</p>
        </div>
      </div>
    )
  }

  if (!service) return null

  const embedUrl = service.urlVideo ? getYoutubeEmbedUrl(service.urlVideo) : null
  const directVideo = service.urlVideo ? isDirectVideo(service.urlVideo) : false
  const hasVideo = !!(embedUrl || directVideo || service.urlVideo)

  return (
    <>
      <main className="min-h-screen" style={{ background: "var(--background)" }}>

        {/* ── HERO ─────────────────────────────────────────────── */}
        <div
          className="relative overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${service.primaryColor}18 0%, transparent 60%)`,
            borderBottom: `1px solid ${service.primaryColor}20`,
          }}
        >
          <div
            className="absolute top-0 left-1/3 w-[500px] h-[500px] rounded-full blur-[140px] opacity-10 pointer-events-none"
            style={{ background: service.primaryColor }}
          />

          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 relative py-12">

            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-slate-500 mb-10">
              <Link href="/" className="hover:text-slate-300 transition-colors">Inicio</Link>
              <span>/</span>
              <Link href="/#sistemas" className="hover:text-slate-300 transition-colors">Sistemas</Link>
              <span>/</span>
              <span className="text-slate-300">{service.name}</span>
            </div>

            {/* Fila 1: texto izquierda + video derecha */}
            <div className={`grid gap-10 items-center ${hasVideo ? "grid-cols-1 lg:grid-cols-2" : "grid-cols-1 max-w-3xl"}`}>

              {/* Texto + botones */}
              <div className="flex items-start gap-4">
                <div
                  className="w-1.5 rounded-full shrink-0 self-stretch min-h-[130px]"
                  style={{ background: service.primaryColor }}
                />
                <div className="flex flex-col gap-4">
                  <span
                    className="text-xs font-semibold px-3 py-1.5 rounded-full self-start"
                    style={{ background: `${service.primaryColor}20`, color: service.primaryColor, border: `1px solid ${service.primaryColor}40` }}
                  >
                    {service.category}
                  </span>
                  <h1 className="text-4xl sm:text-5xl font-bold text-white leading-tight">
                    {service.name}
                  </h1>
                  <p className="text-slate-300 text-lg leading-relaxed">
                    {service.slogan}
                  </p>
                  <div className="flex flex-wrap gap-3 pt-1">
                    <a
                      href={`https://wa.me/?text=Hola, me interesa el sistema ${encodeURIComponent(service.name)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-semibold text-white transition-all hover:opacity-90 hover:shadow-lg"
                      style={{ background: service.primaryColor }}
                    >
                      Solicitar demo
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </a>
                    <Link
                      href="/#sistemas"
                      className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-semibold text-slate-300 border border-white/10 hover:border-white/20 hover:text-white transition-all"
                    >
                      ← Ver todos
                    </Link>
                  </div>
                </div>
              </div>

              {/* Video — derecha */}
              {hasVideo && (
                <div className="w-full">
                  {embedUrl ? (
                    <div
                      className="relative w-full rounded-2xl overflow-hidden border border-white/10 shadow-2xl"
                      style={{ paddingBottom: "56.25%" }}
                    >
                      <iframe
                        src={embedUrl}
                        title={service.name}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="absolute inset-0 w-full h-full"
                      />
                    </div>
                  ) : directVideo ? (
                    <video
                      src={service.urlVideo}
                      controls
                      className="w-full rounded-2xl border border-white/10 shadow-2xl"
                    />
                  ) : (
                    <a
                      href={service.urlVideo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center w-full rounded-2xl border border-white/10 shadow-2xl hover:border-white/20 transition-all group"
                      style={{ background: `${service.primaryColor}10`, aspectRatio: "16/9" }}
                    >
                      <div className="flex flex-col items-center gap-4">
                        <div
                          className="w-16 h-16 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform"
                          style={{ background: `${service.primaryColor}30` }}
                        >
                          <svg className="w-8 h-8" style={{ color: service.primaryColor }} fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </div>
                        <span className="text-slate-300 text-sm group-hover:text-white transition-colors">Ver video demostrativo</span>
                      </div>
                    </a>
                  )}
                </div>
              )}
            </div>

            {/* Fila 2: estadísticas clave abajo, ancho completo */}
            {service.keyStatList.length > 0 && (
              <div className={`mt-10 grid gap-4 ${service.keyStatList.length <= 2 ? "grid-cols-2" : service.keyStatList.length === 3 ? "grid-cols-3" : "grid-cols-2 sm:grid-cols-4"}`}>
                {service.keyStatList.map((s, i) => {
                  const [label, value] = s.split("|")
                  return (
                    <div
                      key={i}
                      className="rounded-2xl p-5 flex flex-col gap-1 border text-center"
                      style={{
                        background: `${service.primaryColor}10`,
                        borderColor: `${service.primaryColor}25`,
                      }}
                    >
                      <span className="font-black text-3xl" style={{ color: service.primaryColor }}>
                        {value}
                      </span>
                      <span className="text-slate-400 text-sm leading-tight">{label}</span>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        {/* ── 1. GALERÍA ───────────────────────────────────────── */}
        {service.photoUrlList.length > 0 && (
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-10">
            <SectionLabel color={service.primaryColor}>Vista previa</SectionLabel>
            <SectionTitle color={service.primaryColor}>El sistema en imágenes</SectionTitle>
            <div
              className="w-full rounded-2xl overflow-hidden bg-black/40 flex items-center justify-center cursor-zoom-in mb-4 border border-white/8 shadow-2xl"
              onClick={() => setLightboxSrc(service.photoUrlList[activePhoto])}
              style={{ minHeight: 360 }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={service.photoUrlList[activePhoto]}
                alt={service.name}
                className="w-full h-auto object-contain max-h-[520px]"
              />
            </div>
            {service.photoUrlList.length > 1 && (
              <div className="flex gap-3 flex-wrap">
                {service.photoUrlList.map((url, i) => (
                  <div
                    key={i}
                    onClick={() => setActivePhoto(i)}
                    className={`w-20 h-20 rounded-xl overflow-hidden bg-black/30 flex items-center justify-center cursor-pointer border-2 transition-all shrink-0 ${
                      i === activePhoto ? "opacity-100 scale-105" : "border-transparent opacity-40 hover:opacity-70"
                    }`}
                    style={i === activePhoto ? { borderColor: service.primaryColor } : {}}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={url} alt="" className="w-full h-full object-contain" />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── 2. PROBLEMAS QUE RESUELVE ────────────────────────── */}
        {service.problemSolveList.length > 0 && (
          <div className="py-20" style={{ background: "rgba(0,0,0,0.25)" }}>
            <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
              <SectionLabel color={service.primaryColor}>¿Te suena familiar?</SectionLabel>
              <SectionTitle color={service.primaryColor}>Del problema a la solución</SectionTitle>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                <div className="bg-red-950/30 border border-red-500/20 rounded-2xl p-5">
                  <p className="text-red-400 text-xs font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-red-500/20 inline-flex items-center justify-center text-xs">✕</span>
                    Sin el sistema
                  </p>
                  <ul className="flex flex-col gap-3">
                    {service.problemSolveList.map((p, i) => {
                      const [problem] = p.split("|")
                      return (
                        <li key={i} className="flex items-start gap-3 text-slate-300 text-sm">
                          <span className="text-red-500 shrink-0 mt-0.5">✕</span>
                          {problem}
                        </li>
                      )
                    })}
                  </ul>
                </div>
                <div className="rounded-2xl p-5 border" style={{ background: `${service.primaryColor}08`, borderColor: `${service.primaryColor}25` }}>
                  <p className="text-xs font-bold uppercase tracking-widest mb-4 flex items-center gap-2" style={{ color: service.primaryColor }}>
                    <span className="w-5 h-5 rounded-full inline-flex items-center justify-center text-xs" style={{ background: `${service.primaryColor}25` }}>✓</span>
                    Con {service.name}
                  </p>
                  <ul className="flex flex-col gap-3">
                    {service.problemSolveList.map((p, i) => {
                      const [, solution] = p.split("|")
                      return (
                        <li key={i} className="flex items-start gap-3 text-slate-200 text-sm font-medium">
                          <span className="shrink-0 mt-0.5" style={{ color: service.primaryColor }}>✓</span>
                          {solution}
                        </li>
                      )
                    })}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── 3. BENEFICIOS ────────────────────────────────────── */}
        {service.benefitsList.length > 0 && (
          <div className="py-20">
            <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
              <SectionLabel color={service.primaryColor}>Lo que obtienes</SectionLabel>
              <SectionTitle color={service.primaryColor}>Beneficios reales para tu negocio</SectionTitle>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-2">
                {service.benefitsList.map((b, i) => (
                  <div
                    key={i}
                    className="glass-card rounded-2xl p-6 flex flex-col gap-4 hover:border-white/15 transition-all hover:-translate-y-0.5 duration-200"
                  >
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                      style={{ background: `${service.primaryColor}20` }}
                    >
                      <svg className="w-5 h-5" style={{ color: service.primaryColor }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="text-slate-200 text-sm leading-relaxed">{b}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── 4. CARACTERÍSTICAS ───────────────────────────────── */}
        {service.featuresList.length > 0 && (
          <div className="py-20" style={{ background: "rgba(0,0,0,0.2)" }}>
            <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
              <SectionLabel color={service.primaryColor}>Funcionalidades</SectionLabel>
              <SectionTitle color={service.primaryColor}>Todo lo que incluye</SectionTitle>
              <div className="flex flex-wrap gap-3 mt-2">
                {service.featuresList.map((f, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium"
                    style={{
                      background: `${service.primaryColor}08`,
                      borderColor: `${service.primaryColor}25`,
                      color: "rgb(203 213 225)",
                    }}
                  >
                    <svg className="w-4 h-4 shrink-0" style={{ color: service.primaryColor }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {f}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── 5. PRECIOS ───────────────────────────────────────── */}
        {service.priceList.length > 0 && (
          <div className="py-24">
            <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <SectionLabel color={service.primaryColor}>Inversión</SectionLabel>
              <SectionTitle color={service.primaryColor} center>Elige el plan que se adapta a ti</SectionTitle>
              <p className="text-slate-400 text-base mt-2 mb-12 max-w-xl mx-auto">
                Sin costos ocultos. Sin contratos eternos. Implementación incluida.
              </p>
              <div className={`grid gap-6 mx-auto ${service.priceList.length === 1 ? "max-w-sm grid-cols-1" : service.priceList.length === 2 ? "max-w-2xl grid-cols-1 sm:grid-cols-2" : "max-w-4xl grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"}`}>
                {service.priceList.map((p, i) => {
                  const [plan, price, description] = p.split("|")
                  const isPopular = i === 0
                  return (
                    <div
                      key={i}
                      className={`relative rounded-3xl p-8 border flex flex-col gap-4 ${isPopular ? "scale-105 shadow-2xl" : ""}`}
                      style={{
                        background: isPopular ? `linear-gradient(135deg, ${service.primaryColor}20, ${service.primaryColor}08)` : "rgba(255,255,255,0.03)",
                        borderColor: isPopular ? service.primaryColor : "rgba(255,255,255,0.08)",
                      }}
                    >
                      {isPopular && (
                        <div
                          className="absolute -top-3.5 left-1/2 -translate-x-1/2 text-xs font-bold px-4 py-1.5 rounded-full text-white"
                          style={{ background: service.primaryColor }}
                        >
                          Más popular
                        </div>
                      )}
                      <p className="text-slate-400 text-sm font-semibold uppercase tracking-widest">{plan}</p>
                      <p className="text-white font-black text-4xl">{price}</p>
                      {description && <p className="text-slate-400 text-sm leading-relaxed">{description}</p>}
                      <a
                        href={`https://wa.me/?text=Hola, me interesa el plan ${encodeURIComponent(plan ?? "")} del sistema ${encodeURIComponent(service.name)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 inline-flex items-center justify-center gap-2 w-full py-3 rounded-full font-semibold text-sm transition-all hover:opacity-90"
                        style={isPopular
                          ? { background: service.primaryColor, color: "#fff" }
                          : { background: "rgba(255,255,255,0.07)", color: "rgb(203 213 225)", border: "1px solid rgba(255,255,255,0.1)" }
                        }
                      >
                        Elegir este plan
                      </a>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {/* ── 6. GARANTÍAS ─────────────────────────────────────── */}
        {service.warrantyList.length > 0 && (
          <div className="py-16" style={{ background: "rgba(0,0,0,0.25)" }}>
            <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <SectionLabel color={service.primaryColor}>Sin riesgos</SectionLabel>
              <SectionTitle color={service.primaryColor} center>Respaldado por nuestras garantías</SectionTitle>
              <div className={`grid gap-5 mt-10 ${service.warrantyList.length <= 2 ? "max-w-2xl mx-auto grid-cols-1 sm:grid-cols-2" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"}`}>
                {service.warrantyList.map((w, i) => (
                  <div key={i} className="glass-card rounded-2xl p-6 flex flex-col items-center gap-3 text-center">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center"
                      style={{ background: `${service.primaryColor}20` }}
                    >
                      <svg className="w-6 h-6" style={{ color: service.primaryColor }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <p className="text-slate-200 text-sm leading-relaxed">{w}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── 7. CTA FINAL ─────────────────────────────────────── */}
        <div
          className="py-28 relative overflow-hidden"
          style={{ background: `linear-gradient(135deg, ${service.primaryColor}22 0%, transparent 70%)` }}
        >
          <div
            className="absolute bottom-0 right-0 w-96 h-96 rounded-full blur-[120px] opacity-15 pointer-events-none"
            style={{ background: service.primaryColor }}
          />
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
            <p
              className="text-sm font-bold uppercase tracking-widest mb-4"
              style={{ color: service.primaryColor }}
            >
              ¿Listo para transformar tu negocio?
            </p>
            <h2 className="text-4xl sm:text-5xl font-black text-white leading-tight mb-6">
              Empieza hoy con<br />
              <span style={{ color: service.primaryColor }}>{service.name}</span>
            </h2>
            <p className="text-slate-400 text-lg mb-10 leading-relaxed">
              Agenda una demo gratuita. Te mostramos el sistema funcionando con tus datos reales, sin compromisos.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={`https://wa.me/?text=Hola, quiero agendar una demo del sistema ${encodeURIComponent(service.name)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-10 py-4 rounded-full font-bold text-white text-lg transition-all hover:opacity-90 hover:shadow-2xl hover:scale-105"
                style={{ background: service.primaryColor }}
              >
                Agendar demo gratuita
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
              <Link
                href="/#sistemas"
                className="inline-flex items-center justify-center gap-2 px-10 py-4 rounded-full font-semibold text-slate-300 border border-white/15 hover:border-white/30 hover:text-white transition-all text-base"
              >
                Ver otros sistemas
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* Lightbox */}
      {lightboxSrc && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/95 backdrop-blur-sm p-4 cursor-zoom-out"
          onClick={() => setLightboxSrc(null)}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={lightboxSrc}
            alt=""
            className="max-w-full max-h-full object-contain rounded-xl select-none"
            onClick={e => e.stopPropagation()}
          />
          <button
            onClick={() => setLightboxSrc(null)}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}
    </>
  )
}

function SectionLabel({ children, color }: { children: React.ReactNode; color: string }) {
  return (
    <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color }}>
      {children}
    </p>
  )
}

function SectionTitle({ children, color, center }: { children: React.ReactNode; color: string; center?: boolean }) {
  return (
    <div className={`flex items-center gap-3 mb-8 ${center ? "justify-center" : ""}`}>
      {!center && <div className="w-1 h-7 rounded-full shrink-0" style={{ background: color }} />}
      <h2 className="text-white font-bold text-3xl">{children}</h2>
    </div>
  )
}
