"use client"

import { useState, useEffect } from "react"
import { getAuthHeader } from "@/lib/auth"

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL

interface RoleOption {
  id: string
  name: string
}

interface Props {
  userId?: string
  onClose: () => void
  onSaved: () => void
}

const LABEL = "text-slate-400 text-xs font-semibold uppercase tracking-wider"
const INPUT = "bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-slate-600 focus:outline-none focus:border-blue-500/50 transition-colors w-full"

export default function UserFormModal({ userId, onClose, onSaved }: Props) {
  const isEdit = !!userId

  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [dni, setDni] = useState("")
  const [email, setEmail] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [roleId, setRoleId] = useState("")

  const [roles, setRoles] = useState<RoleOption[]>([])
  const [loadingRoles, setLoadingRoles] = useState(true)
  const [fetching, setFetching] = useState(isEdit)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  // Cargar lista de roles para el select
  useEffect(() => {
    async function loadRoles() {
      try {
        const res = await fetch(`${API_BASE}/roles?page=1&size=100`, { headers: getAuthHeader() })
        if (!res.ok) throw new Error()
        const data = await res.json()
        setRoles(data.data ?? [])
      } catch {
        setRoles([])
      } finally {
        setLoadingRoles(false)
      }
    }
    loadRoles()
  }, [])

  // Si es edición, cargar datos del usuario
  useEffect(() => {
    if (!userId) return
    let cancelled = false
    async function load() {
      setFetching(true)
      try {
        const res = await fetch(`${API_BASE}/users/${userId}`, { headers: getAuthHeader() })
        if (!res.ok) throw new Error("No se pudo cargar el usuario")
        const u = await res.json()
        if (!cancelled) {
          setFirstName(u.firstName)
          setLastName(u.lastName)
          setDni(u.dni)
          setEmail(u.email)
          setUsername(u.username)
          setRoleId(u.role?.id ?? "")
        }
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Error inesperado")
      } finally {
        if (!cancelled) setFetching(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [userId])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!firstName.trim() || !lastName.trim() || !dni.trim() || !email.trim() || !username.trim() || !roleId) {
      setError("Todos los campos son requeridos")
      return
    }
    if (!isEdit && !password.trim()) {
      setError("La contraseña es requerida")
      return
    }
    setError("")
    setLoading(true)
    try {
      const url = isEdit ? `${API_BASE}/users/${userId}` : `${API_BASE}/users`
      const body: Record<string, string> = { firstName: firstName.trim(), lastName: lastName.trim(), dni: dni.trim(), email: email.trim(), username: username.trim(), roleId }
      if (!isEdit || password.trim()) body.password = password.trim()

      const res = await fetch(url, {
        method: isEdit ? "PATCH" : "POST",
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

  const isBusy = fetching || loadingRoles

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div
        className="relative w-full max-w-lg max-h-[90vh] flex flex-col rounded-2xl border border-white/10 shadow-2xl"
        style={{ background: "#0b1222" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/8 shrink-0">
          <h2 className="text-white font-bold text-lg">{isEdit ? "Editar usuario" : "Nuevo usuario"}</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/5"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto flex-1 px-6 py-5 flex flex-col gap-4">
          {isBusy ? (
            <div className="flex flex-col gap-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-10 bg-white/5 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : (
            <>
              {/* Nombre y apellido */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className={LABEL}>Nombre</label>
                  <input value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="John" className={INPUT} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className={LABEL}>Apellido</label>
                  <input value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Doe" className={INPUT} />
                </div>
              </div>

              {/* DNI y username */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className={LABEL}>DNI</label>
                  <input value={dni} onChange={e => setDni(e.target.value)} placeholder="12345678" className={INPUT} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className={LABEL}>Username</label>
                  <input value={username} onChange={e => setUsername(e.target.value)} placeholder="johndoe" className={INPUT} />
                </div>
              </div>

              {/* Email */}
              <div className="flex flex-col gap-1.5">
                <label className={LABEL}>Email</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="john@example.com" className={INPUT} />
              </div>

              {/* Contraseña */}
              <div className="flex flex-col gap-1.5">
                <label className={LABEL}>
                  Contraseña{isEdit && <span className="text-slate-600 normal-case font-normal ml-1">(dejar vacío para no cambiar)</span>}
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder={isEdit ? "••••••••" : "Contraseña segura"}
                  className={INPUT}
                />
              </div>

              {/* Rol */}
              <div className="flex flex-col gap-1.5">
                <label className={LABEL}>Rol</label>
                <select
                  value={roleId}
                  onChange={e => setRoleId(e.target.value)}
                  className={`${INPUT} appearance-none cursor-pointer`}
                >
                  <option value="" disabled className="bg-[#0b1222]">Seleccionar rol…</option>
                  {roles.map(r => (
                    <option key={r.id} value={r.id} className="bg-[#0b1222]">{r.name}</option>
                  ))}
                </select>
              </div>
            </>
          )}

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2.5 text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Botones */}
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
              disabled={loading || isBusy}
              className="btn-primary text-sm font-semibold px-5 py-2.5 rounded-full flex-1 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Guardando…" : isEdit ? "Guardar cambios" : "Crear usuario"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
