"use client"

import { useState, useEffect } from "react"
import { getAuthHeader } from "@/lib/auth"

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL

interface Props {
  roleId?: string
  onClose: () => void
  onSaved: () => void
}

export default function RoleFormModal({ roleId, onClose, onSaved }: Props) {
  const isEdit = !!roleId
  const [name, setName] = useState("")
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(isEdit)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!roleId) return
    let cancelled = false
    async function load() {
      setFetching(true)
      try {
        const res = await fetch(`${API_BASE}/roles/${roleId}`, { headers: getAuthHeader() })
        if (!res.ok) throw new Error("No se pudo cargar el rol")
        const data = await res.json()
        if (!cancelled) setName(data.name)
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Error inesperado")
      } finally {
        if (!cancelled) setFetching(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [roleId])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) { setError("El nombre es requerido"); return }
    setError("")
    setLoading(true)
    try {
      const url = isEdit ? `${API_BASE}/roles/${roleId}` : `${API_BASE}/roles`
      const res = await fetch(url, {
        method: isEdit ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json", ...getAuthHeader() },
        body: JSON.stringify({ name: name.trim() }),
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div
        className="relative w-full max-w-sm rounded-2xl border border-white/10 shadow-2xl flex flex-col"
        style={{ background: "#0b1222" }}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/8">
          <h2 className="text-white font-bold text-lg">{isEdit ? "Editar rol" : "Nuevo rol"}</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/5"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 flex flex-col gap-4">
          {fetching ? (
            <div className="h-10 bg-white/5 rounded-xl animate-pulse" />
          ) : (
            <div className="flex flex-col gap-1.5">
              <label className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Nombre</label>
              <input
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="ej. admin"
                className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-slate-600 focus:outline-none focus:border-blue-500/50 transition-colors"
              />
            </div>
          )}

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2.5 text-red-400 text-sm">
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="btn-outline text-sm font-medium px-5 py-2.5 rounded-full flex-1 disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading || fetching}
              className="btn-primary text-sm font-semibold px-5 py-2.5 rounded-full flex-1 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Guardando…" : isEdit ? "Guardar cambios" : "Crear rol"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
