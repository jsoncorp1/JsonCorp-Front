"use client"

import { useEffect, useRef, useState } from "react"
import { getAuthHeader } from "@/lib/auth"

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL

interface Props {
  onClose: () => void
  onSaved: () => void
  serviceId?: string
}

interface ServiceData {
  category: string
  name: string
  slogan: string
  urlVideo: string
  primaryColor: string
  secondaryColor: string
  accentColor: string
  backgroundColor: string
  textColor: string
  photoUrlList: string[]
  keyStatList: string[]
  benefitsList: string[]
  featuresList: string[]
  problemSolveList: string[]
  priceList: string[]
  warrantyList: string[]
}

const INPUT = "w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500/60 transition-all"
const LABEL = "text-slate-300 text-xs font-medium block mb-1.5"
const SECTION = "text-slate-400 text-xs font-semibold uppercase tracking-wider mb-3 mt-6 first:mt-0"

const emptyForm = {
  category: "",
  name: "",
  slogan: "",
  urlVideo: "",
  primaryColor: "#0061E0",
  secondaryColor: "#E3F2FD",
  accentColor: "#00C853",
  backgroundColor: "#FFFFFF",
  textColor: "#1A202C",
  photoUrlList: [] as string[],
  keyStatList: [{ label: "", value: "" }],
  benefitsList: [""],
  featuresList: [""],
  problemSolveList: [{ problem: "", solution: "" }],
  priceList: [{ plan: "", price: "", description: "" }],
  warrantyList: [""],
}

type FormState = typeof emptyForm
type StrArrayField = "benefitsList" | "featuresList" | "warrantyList"

function parseService(s: ServiceData): FormState {
  return {
    category: s.category,
    name: s.name,
    slogan: s.slogan,
    urlVideo: s.urlVideo ?? "",
    primaryColor: s.primaryColor,
    secondaryColor: s.secondaryColor,
    accentColor: s.accentColor,
    backgroundColor: s.backgroundColor,
    textColor: s.textColor,
    photoUrlList: s.photoUrlList ?? [],
    keyStatList: s.keyStatList?.length
      ? s.keyStatList.map(k => { const [label = "", value = ""] = k.split("|"); return { label, value } })
      : [{ label: "", value: "" }],
    benefitsList: s.benefitsList?.length ? s.benefitsList : [""],
    featuresList: s.featuresList?.length ? s.featuresList : [""],
    problemSolveList: s.problemSolveList?.length
      ? s.problemSolveList.map(p => { const [problem = "", solution = ""] = p.split("|"); return { problem, solution } })
      : [{ problem: "", solution: "" }],
    priceList: s.priceList?.length
      ? s.priceList.map(p => { const [plan = "", price = "", description = ""] = p.split("|"); return { plan, price, description } })
      : [{ plan: "", price: "", description: "" }],
    warrantyList: s.warrantyList?.length ? s.warrantyList : [""],
  }
}

export default function ServiceFormModal({ onClose, onSaved, serviceId }: Props) {
  const isEdit = Boolean(serviceId)
  const [form, setForm] = useState<FormState>(emptyForm)
  const [fetching, setFetching] = useState(isEdit)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [photoUploading, setPhotoUploading] = useState<boolean[]>([])
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Cargar datos en modo edición
  useEffect(() => {
    if (!serviceId) return
    let cancelled = false

    async function load() {
      setFetching(true)
      try {
        const res = await fetch(`${API_BASE}/services/${serviceId}`, {
          headers: getAuthHeader(),
        })
        if (!res.ok) throw new Error("No se pudo cargar el servicio")
        const data: ServiceData = await res.json()
        if (!cancelled) setForm(parseService(data))
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Error al cargar")
      } finally {
        if (!cancelled) setFetching(false)
      }
    }

    load()
    return () => { cancelled = true }
  }, [serviceId])

  // ── upload foto ────────────────────────────────────────────────
  async function uploadPhoto(file: File) {
    const idx = form.photoUrlList.length
    setPhotoUploading(p => { const a = [...p]; a[idx] = true; return a })
    setForm(p => ({ ...p, photoUrlList: [...p.photoUrlList, ""] }))

    try {
      const fd = new FormData()
      fd.append("file", file)
      const res = await fetch("/api/upload", { method: "POST", body: fd })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? "Error al subir imagen")
      setForm(p => {
        const a = [...p.photoUrlList]; a[idx] = data.url; return { ...p, photoUrlList: a }
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al subir imagen")
      setForm(p => ({ ...p, photoUrlList: p.photoUrlList.filter((_, i) => i !== idx) }))
    } finally {
      setPhotoUploading(p => { const a = [...p]; a[idx] = false; return a })
    }
  }

  function removePhoto(idx: number) {
    setForm(p => ({ ...p, photoUrlList: p.photoUrlList.filter((_, i) => i !== idx) }))
    setPhotoUploading(p => p.filter((_, i) => i !== idx))
  }

  // ── helpers strings ────────────────────────────────────────────
  function setStr(field: StrArrayField, idx: number, val: string) {
    setForm(p => { const a = [...p[field]]; a[idx] = val; return { ...p, [field]: a } })
  }
  function addStr(field: StrArrayField) { setForm(p => ({ ...p, [field]: [...p[field], ""] })) }
  function removeStr(field: StrArrayField, idx: number) {
    setForm(p => ({ ...p, [field]: p[field].filter((_, i) => i !== idx) }))
  }

  // ── helpers keyStatList ────────────────────────────────────────
  function setKeyStat(idx: number, key: "label" | "value", val: string) {
    setForm(p => { const a = [...p.keyStatList]; a[idx] = { ...a[idx], [key]: val }; return { ...p, keyStatList: a } })
  }
  function addKeyStat() { setForm(p => ({ ...p, keyStatList: [...p.keyStatList, { label: "", value: "" }] })) }
  function removeKeyStat(idx: number) { setForm(p => ({ ...p, keyStatList: p.keyStatList.filter((_, i) => i !== idx) })) }

  // ── helpers problemSolveList ───────────────────────────────────
  function setProblem(idx: number, key: "problem" | "solution", val: string) {
    setForm(p => { const a = [...p.problemSolveList]; a[idx] = { ...a[idx], [key]: val }; return { ...p, problemSolveList: a } })
  }
  function addProblem() { setForm(p => ({ ...p, problemSolveList: [...p.problemSolveList, { problem: "", solution: "" }] })) }
  function removeProblem(idx: number) { setForm(p => ({ ...p, problemSolveList: p.problemSolveList.filter((_, i) => i !== idx) })) }

  // ── helpers priceList ──────────────────────────────────────────
  function setPrice(idx: number, key: "plan" | "price" | "description", val: string) {
    setForm(p => { const a = [...p.priceList]; a[idx] = { ...a[idx], [key]: val }; return { ...p, priceList: a } })
  }
  function addPrice() { setForm(p => ({ ...p, priceList: [...p.priceList, { plan: "", price: "", description: "" }] })) }
  function removePrice(idx: number) { setForm(p => ({ ...p, priceList: p.priceList.filter((_, i) => i !== idx) })) }

  // ── submit ─────────────────────────────────────────────────────
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (photoUploading.some(Boolean)) { setError("Espera a que terminen de subir las imágenes"); return }
    setError("")
    setLoading(true)

    const body = {
      category: form.category,
      name: form.name,
      slogan: form.slogan,
      urlVideo: form.urlVideo,
      primaryColor: form.primaryColor,
      secondaryColor: form.secondaryColor,
      accentColor: form.accentColor,
      backgroundColor: form.backgroundColor,
      textColor: form.textColor,
      photoUrlList: form.photoUrlList.filter(u => u),
      keyStatList: form.keyStatList.filter(k => k.label.trim()).map(k => `${k.label}|${k.value}`),
      benefitsList: form.benefitsList.filter(b => b.trim()),
      featuresList: form.featuresList.filter(f => f.trim()),
      problemSolveList: form.problemSolveList.filter(p => p.problem.trim()).map(p => `${p.problem}|${p.solution}`),
      priceList: form.priceList.filter(p => p.plan.trim()).map(p => `${p.plan}|${p.price}|${p.description}`),
      warrantyList: form.warrantyList.filter(w => w.trim()),
    }

    try {
      const url = isEdit ? `${API_BASE}/services/${serviceId}` : `${API_BASE}/services`
      const method = isEdit ? "PATCH" : "POST"

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", ...getAuthHeader() },
        body: JSON.stringify(body),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error((data as { message?: string }).message ?? "Error al guardar")
      }
      onSaved()
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error inesperado")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-2xl border border-white/10 shadow-2xl" style={{ background: "#0b1222" }}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/8 shrink-0">
          <h2 className="text-white font-bold text-lg">
            {isEdit ? "Editar servicio" : "Nuevo servicio"}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/5">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {fetching ? (
          <div className="flex items-center justify-center py-24 text-slate-400 text-sm">
            Cargando servicio…
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
            <div className="overflow-y-auto flex-1 px-6 py-4">

              {/* Información básica */}
              <p className={SECTION}>Información básica</p>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <label className={LABEL}>Categoría *</label>
                  <input required className={INPUT} placeholder="Ej: Software para Farmacias"
                    value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))} />
                </div>
                <div>
                  <label className={LABEL}>Nombre *</label>
                  <input required className={INPUT} placeholder="Ej: FarmaFlow Pro"
                    value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
                </div>
              </div>
              <div className="mb-3">
                <label className={LABEL}>Slogan *</label>
                <input required className={INPUT} placeholder="Propuesta de valor principal"
                  value={form.slogan} onChange={e => setForm(p => ({ ...p, slogan: e.target.value }))} />
              </div>
              <div>
                <label className={LABEL}>URL Video</label>
                <input className={INPUT} placeholder="https://youtube.com/..."
                  value={form.urlVideo} onChange={e => setForm(p => ({ ...p, urlVideo: e.target.value }))} />
              </div>

              {/* Fotos */}
              <p className={SECTION}>Fotos</p>
              <div className="flex flex-wrap gap-3 mb-3">
                {form.photoUrlList.map((url, i) => (
                  <div key={i} className="relative w-24 h-24 rounded-xl overflow-hidden border border-white/10 bg-white/5 shrink-0">
                    {photoUploading[i] ? (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                      </div>
                    ) : url ? (
                      <>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={url}
                          alt=""
                          className="w-full h-full object-contain cursor-zoom-in"
                          onClick={() => setLightboxSrc(url)}
                        />
                        <button type="button" onClick={() => removePhoto(i)}
                          className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/70 text-white text-xs flex items-center justify-center hover:bg-red-500/80 transition-colors">
                          ✕
                        </button>
                      </>
                    ) : null}
                  </div>
                ))}
                <button type="button" onClick={() => fileInputRef.current?.click()}
                  className="w-24 h-24 rounded-xl border border-dashed border-white/20 hover:border-blue-500/50 bg-white/3 hover:bg-white/6 flex flex-col items-center justify-center gap-1 text-slate-400 hover:text-blue-400 transition-all shrink-0">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                  </svg>
                  <span className="text-xs">Foto</span>
                </button>
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden"
                  onChange={e => { const f = e.target.files?.[0]; if (f) uploadPhoto(f); e.target.value = "" }} />
              </div>

              {/* Estadísticas clave */}
              <p className={SECTION}>Estadísticas clave</p>
              <div className="flex flex-col gap-2 mb-2">
                {form.keyStatList.map((k, i) => (
                  <div key={i} className="bg-white/3 border border-white/8 rounded-xl p-3">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className={LABEL}>Etiqueta</label>
                        <input className={INPUT} placeholder="ej: Clientes activos" value={k.label} onChange={e => setKeyStat(i, "label", e.target.value)} />
                      </div>
                      <div>
                        <label className={LABEL}>Valor</label>
                        <div className="flex gap-1.5">
                          <input className={INPUT} placeholder="ej: +500" value={k.value} onChange={e => setKeyStat(i, "value", e.target.value)} />
                          {form.keyStatList.length > 1 && (
                            <button type="button" onClick={() => removeKeyStat(i)} className="text-red-400 hover:text-red-300 px-2 shrink-0 text-sm">✕</button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <button type="button" onClick={addKeyStat} className="text-blue-400 hover:text-blue-300 text-xs font-medium transition-colors">+ Agregar estadística</button>

              {/* Beneficios */}
              <p className={SECTION}>Beneficios</p>
              {form.benefitsList.map((b, i) => (
                <div key={i} className="flex gap-2 mb-2">
                  <input className={INPUT} placeholder="Beneficio" value={b} onChange={e => setStr("benefitsList", i, e.target.value)} />
                  {form.benefitsList.length > 1 && (
                    <button type="button" onClick={() => removeStr("benefitsList", i)} className="text-red-400 hover:text-red-300 px-2 shrink-0">✕</button>
                  )}
                </div>
              ))}
              <button type="button" onClick={() => addStr("benefitsList")} className="text-blue-400 hover:text-blue-300 text-xs font-medium transition-colors">+ Agregar beneficio</button>

              {/* Características */}
              <p className={SECTION}>Características</p>
              {form.featuresList.map((f, i) => (
                <div key={i} className="flex gap-2 mb-2">
                  <input className={INPUT} placeholder="Característica" value={f} onChange={e => setStr("featuresList", i, e.target.value)} />
                  {form.featuresList.length > 1 && (
                    <button type="button" onClick={() => removeStr("featuresList", i)} className="text-red-400 hover:text-red-300 px-2 shrink-0">✕</button>
                  )}
                </div>
              ))}
              <button type="button" onClick={() => addStr("featuresList")} className="text-blue-400 hover:text-blue-300 text-xs font-medium transition-colors">+ Agregar característica</button>

              {/* Problemas que resuelve */}
              <p className={SECTION}>Problemas que resuelve</p>
              {form.problemSolveList.map((p, i) => (
                <div key={i} className="flex gap-2 mb-2">
                  <input className={INPUT} placeholder="Problema" value={p.problem} onChange={e => setProblem(i, "problem", e.target.value)} />
                  <input className={INPUT} placeholder="Solución" value={p.solution} onChange={e => setProblem(i, "solution", e.target.value)} />
                  {form.problemSolveList.length > 1 && (
                    <button type="button" onClick={() => removeProblem(i)} className="text-red-400 hover:text-red-300 px-2 shrink-0">✕</button>
                  )}
                </div>
              ))}
              <button type="button" onClick={addProblem} className="text-blue-400 hover:text-blue-300 text-xs font-medium transition-colors">+ Agregar problema</button>

              {/* Precios */}
              <p className={SECTION}>Precios</p>
              <div className="flex flex-col gap-2 mb-2">
                {form.priceList.map((p, i) => (
                  <div key={i} className="bg-white/3 border border-white/8 rounded-xl p-3">
                    <div className="grid grid-cols-2 gap-2 mb-2">
                      <div>
                        <label className={LABEL}>Plan</label>
                        <input className={INPUT} placeholder="ej: Básico" value={p.plan} onChange={e => setPrice(i, "plan", e.target.value)} />
                      </div>
                      <div>
                        <label className={LABEL}>Precio</label>
                        <input className={INPUT} placeholder="ej: $299/mes" value={p.price} onChange={e => setPrice(i, "price", e.target.value)} />
                      </div>
                    </div>
                    <div>
                      <label className={LABEL}>Descripción <span className="text-slate-600 normal-case font-normal">(opcional)</span></label>
                      <div className="flex gap-1.5">
                        <input className={INPUT} placeholder="ej: Hasta 3 usuarios, soporte por email" value={p.description} onChange={e => setPrice(i, "description", e.target.value)} />
                        {form.priceList.length > 1 && (
                          <button type="button" onClick={() => removePrice(i)} className="text-red-400 hover:text-red-300 px-2 shrink-0 text-sm">✕</button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <button type="button" onClick={addPrice} className="text-blue-400 hover:text-blue-300 text-xs font-medium transition-colors">+ Agregar precio</button>

              {/* Garantías */}
              <p className={SECTION}>Garantías</p>
              {form.warrantyList.map((w, i) => (
                <div key={i} className="flex gap-2 mb-2">
                  <input className={INPUT} placeholder="Garantía" value={w} onChange={e => setStr("warrantyList", i, e.target.value)} />
                  {form.warrantyList.length > 1 && (
                    <button type="button" onClick={() => removeStr("warrantyList", i)} className="text-red-400 hover:text-red-300 px-2 shrink-0">✕</button>
                  )}
                </div>
              ))}
              <button type="button" onClick={() => addStr("warrantyList")} className="text-blue-400 hover:text-blue-300 text-xs font-medium transition-colors">+ Agregar garantía</button>

              {/* Colores */}
              <p className={SECTION}>Colores</p>
              <div className="grid grid-cols-5 gap-3">
                {([
                  { key: "primaryColor", label: "Principal" },
                  { key: "secondaryColor", label: "Secundario" },
                  { key: "accentColor", label: "Acento" },
                  { key: "backgroundColor", label: "Fondo" },
                  { key: "textColor", label: "Texto" },
                ] as const).map(({ key, label }) => (
                  <div key={key} className="flex flex-col items-center gap-1.5">
                    <label className="text-slate-400 text-xs">{label}</label>
                    <input type="color" value={form[key]}
                      onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
                      className="w-10 h-10 rounded-lg cursor-pointer border-0 bg-transparent" />
                    <span className="text-slate-500 text-xs font-mono">{form[key]}</span>
                  </div>
                ))}
              </div>

            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-white/8 shrink-0 flex flex-col gap-3">
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2.5 text-red-400 text-sm">{error}</div>
              )}
              <div className="flex gap-3 justify-end">
                <button type="button" onClick={onClose} className="btn-outline text-sm font-medium px-5 py-2.5 rounded-full">
                  Cancelar
                </button>
                <button type="submit" disabled={loading || photoUploading.some(Boolean)}
                  className="btn-primary text-sm font-semibold px-6 py-2.5 rounded-full disabled:opacity-60 disabled:cursor-not-allowed">
                  {loading ? "Guardando…" : isEdit ? "Guardar cambios" : "Crear servicio"}
                </button>
              </div>
            </div>
          </form>
        )}
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
