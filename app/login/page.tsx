"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { saveAuth } from "@/lib/auth"

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL

export default function LoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      })

      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        setError((body as { message?: string }).message ?? "Credenciales inválidas")
        return
      }

      const data = await res.json()
      saveAuth(data)

      if (data.user.role === "superadmin") {
        router.push("/superadmin")
      } else if (data.user.role === "admin") {
        router.push("/admin")
      } else {
        router.push("/")
      }
    } catch {
      setError("No se pudo conectar con el servidor")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "var(--background)" }}
    >
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-base select-none">
              JC
            </div>
            <span className="text-white font-bold text-2xl tracking-tight">
              Json<span className="gradient-text">Corp</span>
            </span>
          </Link>
          <p className="text-slate-400 mt-4 text-base">Accede a tu panel de administración</p>
        </div>

        {/* Card */}
        <div className="glass-card rounded-2xl p-8">
          <h1 className="text-white text-2xl font-bold mb-6">Iniciar sesión</h1>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <label
                htmlFor="username"
                className="text-slate-300 text-sm font-medium block mb-2"
              >
                Usuario
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoComplete="username"
                placeholder="Tu nombre de usuario"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 text-base focus:outline-none focus:border-blue-500/60 transition-all"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="text-slate-300 text-sm font-medium block mb-2"
              >
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                placeholder="Tu contraseña"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 text-base focus:outline-none focus:border-blue-500/60 transition-all"
              />
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-red-400 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary text-base font-semibold px-7 py-3.5 rounded-full mt-1 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Iniciando sesión…" : "Iniciar sesión"}
            </button>
          </form>
        </div>

        <p className="text-center mt-6">
          <Link
            href="/"
            className="text-blue-400 hover:text-blue-300 text-sm transition-colors"
          >
            ← Volver al inicio
          </Link>
        </p>
      </div>
    </div>
  )
}