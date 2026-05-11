"use client"

import { useEffect, useState } from "react"
import { getAuthHeader } from "@/lib/auth"

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
  createdAt: string
  createdBy: string
  updatedBy: string | null
  deletedAt: string | null
}

interface Props {
  id: string
  onClose: () => void
}

const SECTION = "text-slate-400 text-xs font-semibold uppercase tracking-wider mb-3 mt-6 first:mt-0"
const CHIP = "bg-white/5 border border-white/8 rounded-lg px-3 py-2 text-slate-300 text-sm"

export default function ServiceDetailModal({ id, onClose }: Props) {
  const [service, setService] = useState<Service | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [activePhoto, setActivePhoto] = useState(0)
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      setError("")
      try {
        const res = await fetch(`${API_BASE}/services/${id}`, {
          headers: getAuthHeader(),
        })
        if (!res.ok) throw new Error("No se pudo cargar el servicio")
        const data: Service = await res.json()
        if (!cancelled) setService(data)
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Error inesperado")
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => { cancelled = true }
  }, [id])

  return (
    <>
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      <div
        className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-2xl border border-white/10 shadow-2xl"
        style={{ background: "#0b1222" }}
      >
        {/* Header */}
        <div className="flex items-start justify-between px-6 py-4 border-b border-white/8 shrink-0">
          {loading || !service ? (
            <div className="h-6 w-48 bg-white/5 rounded animate-pulse" />
          ) : (
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-1 h-10 rounded-full shrink-0" style={{ background: service.primaryColor }} />
              <div className="min-w-0">
                <h2 className="text-white font-bold text-lg leading-tight truncate">{service.name}</h2>
                <span className="text-slate-400 text-xs">{service.category}</span>
              </div>
            </div>
          )}
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/5 shrink-0 ml-3"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 px-6 py-4">
          {loading && (
            <div className="flex items-center justify-center py-20 text-slate-400 text-sm">
              Cargando servicio…
            </div>
          )}

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-red-400 text-sm">
              {error}
            </div>
          )}

          {service && !loading && (
            <>
              {/* Slogan */}
              <p className="text-slate-300 text-sm leading-relaxed mb-4">{service.slogan}</p>

              {/* Fotos */}
              {service.photoUrlList.length > 0 && (
                <>
                  <p className={SECTION}>Fotos</p>
                  {/* Imagen principal */}
                  <div
                    className="w-full rounded-xl overflow-hidden bg-black/30 flex items-center justify-center cursor-zoom-in mb-2"
                    onClick={() => setLightboxSrc(service.photoUrlList[activePhoto])}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={service.photoUrlList[activePhoto]}
                      alt={service.name}
                      className="w-full h-auto object-contain"
                    />
                  </div>
                  {/* Miniaturas */}
                  {service.photoUrlList.length > 1 && (
                    <div className="flex gap-2 flex-wrap">
                      {service.photoUrlList.map((url, i) => (
                        <div
                          key={i}
                          onClick={() => setActivePhoto(i)}
                          className={`w-14 h-14 rounded-lg overflow-hidden bg-black/30 flex items-center justify-center cursor-pointer border-2 transition-all shrink-0 ${
                            i === activePhoto ? "border-blue-500" : "border-transparent opacity-50 hover:opacity-80"
                          }`}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={url} alt="" className="w-full h-full object-contain" />
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}

              {/* Video */}
              {service.urlVideo && (
                <>
                  <p className={SECTION}>Video</p>
                  <a
                    href={service.urlVideo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 text-sm underline underline-offset-2 transition-colors break-all"
                  >
                    {service.urlVideo}
                  </a>
                </>
              )}

              {/* Estadísticas clave */}
              {service.keyStatList.length > 0 && (
                <>
                  <p className={SECTION}>Estadísticas clave</p>
                  <div className="grid grid-cols-3 gap-3">
                    {service.keyStatList.map((s, i) => {
                      const [label, value] = s.split("|")
                      return (
                        <div key={i} className="stat-card rounded-xl p-3 text-center">
                          <p className="text-white font-bold text-lg">{value}</p>
                          <p className="text-slate-400 text-xs mt-0.5">{label}</p>
                        </div>
                      )
                    })}
                  </div>
                </>
              )}

              {/* Beneficios */}
              {service.benefitsList.length > 0 && (
                <>
                  <p className={SECTION}>Beneficios</p>
                  <ul className="flex flex-col gap-2">
                    {service.benefitsList.map((b, i) => (
                      <li key={i} className="flex items-start gap-2 text-slate-300 text-sm">
                        <span className="text-green-400 mt-0.5 shrink-0">✓</span>
                        {b}
                      </li>
                    ))}
                  </ul>
                </>
              )}

              {/* Características */}
              {service.featuresList.length > 0 && (
                <>
                  <p className={SECTION}>Características</p>
                  <div className="flex flex-col gap-2">
                    {service.featuresList.map((f, i) => (
                      <div key={i} className={CHIP}>{f}</div>
                    ))}
                  </div>
                </>
              )}

              {/* Problemas que resuelve */}
              {service.problemSolveList.length > 0 && (
                <>
                  <p className={SECTION}>Problemas que resuelve</p>
                  <div className="flex flex-col gap-2">
                    {service.problemSolveList.map((p, i) => {
                      const [problem, solution] = p.split("|")
                      return (
                        <div key={i} className="grid grid-cols-2 gap-2">
                          <div className="bg-red-500/8 border border-red-500/15 rounded-lg px-3 py-2 text-slate-300 text-sm">
                            {problem}
                          </div>
                          <div className="bg-green-500/8 border border-green-500/15 rounded-lg px-3 py-2 text-slate-300 text-sm">
                            {solution}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </>
              )}

              {/* Precios */}
              {service.priceList.length > 0 && (
                <>
                  <p className={SECTION}>Precios</p>
                  <div className="grid grid-cols-2 gap-3">
                    {service.priceList.map((p, i) => {
                      const [plan, price, description] = p.split("|")
                      return (
                        <div key={i} className="glass-card rounded-xl p-4">
                          <p className="text-slate-400 text-xs mb-1">{plan}</p>
                          <p className="text-white font-bold text-xl">{price}</p>
                          {description && <p className="text-slate-500 text-xs mt-1">{description}</p>}
                        </div>
                      )
                    })}
                  </div>
                </>
              )}

              {/* Garantías */}
              {service.warrantyList.length > 0 && (
                <>
                  <p className={SECTION}>Garantías</p>
                  <ul className="flex flex-col gap-2">
                    {service.warrantyList.map((w, i) => (
                      <li key={i} className="flex items-start gap-2 text-slate-300 text-sm">
                        <span className="text-blue-400 mt-0.5 shrink-0">★</span>
                        {w}
                      </li>
                    ))}
                  </ul>
                </>
              )}

              {/* Colores */}
              <p className={SECTION}>Colores</p>
              <div className="flex gap-3 flex-wrap">
                {[
                  { label: "Principal", value: service.primaryColor },
                  { label: "Secundario", value: service.secondaryColor },
                  { label: "Acento", value: service.accentColor },
                  { label: "Fondo", value: service.backgroundColor },
                  { label: "Texto", value: service.textColor },
                ].map(({ label, value }) => (
                  <div key={label} className="flex flex-col items-center gap-1">
                    <div className="w-8 h-8 rounded-lg border border-white/10" style={{ background: value }} />
                    <span className="text-slate-500 text-xs">{label}</span>
                    <span className="text-slate-600 text-xs font-mono">{value}</span>
                  </div>
                ))}
              </div>

              {/* Metadata */}
              <p className={SECTION}>Información</p>
              <div className="grid grid-cols-2 gap-2 text-xs text-slate-500">
                <span>ID: <span className="text-slate-400 font-mono">{service.id}</span></span>
                <span>Creado por: <span className="text-slate-400">{service.createdBy}</span></span>
                <span>Creado: <span className="text-slate-400">{new Date(service.createdAt).toLocaleString("es-BO")}</span></span>
                {service.updatedBy && <span>Actualizado por: <span className="text-slate-400">{service.updatedBy}</span></span>}
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-white/8 shrink-0 flex justify-end">
          <button
            onClick={onClose}
            className="btn-outline text-sm font-medium px-5 py-2.5 rounded-full"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>

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
