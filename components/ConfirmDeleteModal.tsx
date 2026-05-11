"use client"

import { useState } from "react"
import { getAuthHeader } from "@/lib/auth"

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL

interface Props {
  serviceId: string
  serviceName: string
  onClose: () => void
  onDeleted: () => void
}

export default function ConfirmDeleteModal({ serviceId, serviceName, onClose, onDeleted }: Props) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function handleDelete() {
    setError("")
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/services/${serviceId}`, {
        method: "DELETE",
        headers: getAuthHeader(),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error((data as { message?: string }).message ?? "Error al eliminar")
      }
      onDeleted()
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
        className="relative w-full max-w-sm rounded-2xl border border-white/10 shadow-2xl p-6 flex flex-col gap-4"
        style={{ background: "#0b1222" }}
      >
        {/* Icono */}
        <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto">
          <svg className="w-6 h-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </div>

        {/* Texto */}
        <div className="text-center">
          <h2 className="text-white font-bold text-lg">Eliminar servicio</h2>
          <p className="text-slate-400 text-sm mt-1">
            ¿Estás seguro de que quieres eliminar{" "}
            <span className="text-white font-semibold">{serviceName}</span>?
            Esta acción no se puede deshacer.
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2.5 text-red-400 text-sm text-center">
            {error}
          </div>
        )}

        {/* Botones */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="btn-outline text-sm font-medium px-5 py-2.5 rounded-full flex-1 disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            onClick={handleDelete}
            disabled={loading}
            className="flex-1 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold px-5 py-2.5 rounded-full transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Eliminando…" : "Sí, eliminar"}
          </button>
        </div>
      </div>
    </div>
  )
}
