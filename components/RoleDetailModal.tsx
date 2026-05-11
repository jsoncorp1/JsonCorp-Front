"use client"

import { useEffect, useState } from "react"
import { getAuthHeader } from "@/lib/auth"

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL

interface Role {
  id: string
  name: string
  createdAt: string
  updateAt: string
  deletedAt: string | null
  createdBy: string
  updatedBy: string | null
  deletedBy: string | null
}

interface Props {
  id: string
  onClose: () => void
}

const SECTION = "text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2 mt-4 first:mt-0"

export default function RoleDetailModal({ id, onClose }: Props) {
  const [role, setRole] = useState<Role | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      setError("")
      try {
        const res = await fetch(`${API_BASE}/roles/${id}`, { headers: getAuthHeader() })
        if (!res.ok) throw new Error("No se pudo cargar el rol")
        const data: Role = await res.json()
        if (!cancelled) setRole(data)
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div
        className="relative w-full max-w-sm rounded-2xl border border-white/10 shadow-2xl flex flex-col"
        style={{ background: "#0b1222" }}
      >
        <div className="flex items-start justify-between px-6 py-4 border-b border-white/8">
          {loading || !role ? (
            <div className="h-6 w-32 bg-white/5 rounded animate-pulse" />
          ) : (
            <h2 className="text-white font-bold text-lg">{role.name}</h2>
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

        <div className="px-6 py-5 flex-1">
          {loading && (
            <div className="flex items-center justify-center py-10 text-slate-400 text-sm">Cargando…</div>
          )}
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-red-400 text-sm">{error}</div>
          )}
          {role && !loading && (
            <>
              <p className={SECTION}>Información</p>
              <div className="flex flex-col gap-2 text-xs text-slate-500">
                <span>ID: <span className="text-slate-400 font-mono break-all">{role.id}</span></span>
                <span>Creado por: <span className="text-slate-400">{role.createdBy}</span></span>
                <span>Creado: <span className="text-slate-400">{new Date(role.createdAt).toLocaleString("es-BO")}</span></span>
                {role.updatedBy && <span>Actualizado por: <span className="text-slate-400">{role.updatedBy}</span></span>}
                {role.updateAt && <span>Actualizado: <span className="text-slate-400">{new Date(role.updateAt).toLocaleString("es-BO")}</span></span>}
              </div>
            </>
          )}
        </div>

        <div className="px-6 py-4 border-t border-white/8 flex justify-end">
          <button onClick={onClose} className="btn-outline text-sm font-medium px-5 py-2.5 rounded-full">
            Cerrar
          </button>
        </div>
      </div>
    </div>
  )
}
