"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { getAuth, clearAuth, type AuthData, getAuthHeader } from "@/lib/auth"
import UserFormModal from "@/components/UserFormModal"

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL
const PAGE_SIZE = 10

interface Role {
  id: string
  name: string
}

interface User {
  id: string
  firstName: string
  lastName: string
  dni: string
  email: string
  username: string
  createdBy: string
  createdAt: string
  deletedAt: string | null
  role: Role
}

interface UsersResponse {
  data: User[]
  total: number
  page: string
  size: string
}

export default function UsersPage() {
  const router = useRouter()
  const [auth, setAuth] = useState<AuthData | null>(null)
  const [users, setUsers] = useState<User[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [showCreate, setShowCreate] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    const a = getAuth()
    if (!a || a.user.role !== "superadmin") {
      router.replace("/login")
      return
    }
    setAuth(a)
  }, [router])

  useEffect(() => {
    if (!auth) return
    let cancelled = false
    async function load() {
      setLoading(true)
      setError("")
      try {
        const res = await fetch(
          `${API_BASE}/users?page=${page}&size=${PAGE_SIZE}`,
          { headers: getAuthHeader() }
        )
        if (!res.ok) throw new Error()
        const data: UsersResponse = await res.json()
        if (!cancelled) {
          setUsers(data.data)
          setTotal(data.total)
        }
      } catch {
        if (!cancelled) setError("No se pudieron cargar los usuarios")
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [auth, page, refreshKey])

  function logout() {
    clearAuth()
    router.push("/login")
  }

  const totalPages = Math.ceil(total / PAGE_SIZE)

  if (!auth) return null

  return (
    <>
    <div className="min-h-screen flex flex-col" style={{ background: "var(--background)" }}>
      {/* Top bar */}
      <header className="bg-[#070d1a]/95 backdrop-blur-md border-b border-white/5 px-6 py-4 flex items-center justify-between sticky top-0 z-40">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-sm select-none">
            JC
          </div>
          <span className="text-white font-bold text-xl tracking-tight hidden sm:block">
            Json<span className="gradient-text">Corp</span>
          </span>
        </Link>
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-white text-sm font-semibold">{auth.user.username}</p>
            <p className="text-blue-400 text-xs capitalize">{auth.user.role}</p>
          </div>
          <button
            onClick={logout}
            className="btn-outline text-sm font-medium px-4 py-2 rounded-full"
          >
            Cerrar sesión
          </button>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-56 border-r border-white/5 bg-[#070d1a]/50 pt-6 hidden md:flex flex-col gap-1 shrink-0">
          <nav className="px-3">
            <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider px-3 mb-3">
              Gestión
            </p>
            <Link
              href="/superadmin"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 text-sm font-medium transition-colors mb-1"
            >
              <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Servicios
            </Link>
            <Link
              href="/superadmin/roles"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 text-sm font-medium transition-colors mb-1"
            >
              <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Roles
            </Link>
            <span className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-white bg-blue-600/20 border border-blue-500/20 text-sm font-medium cursor-default select-none">
              <svg className="w-4 h-4 text-blue-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Usuarios
            </span>
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-white text-2xl font-bold">Usuarios</h1>
                {!loading && (
                  <p className="text-slate-400 text-sm mt-0.5">{total} registro{total !== 1 ? "s" : ""}</p>
                )}
              </div>
              <button
                onClick={() => setShowCreate(true)}
                className="btn-primary text-sm font-semibold px-5 py-2.5 rounded-full"
              >
                + Nuevo usuario
              </button>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-red-400 text-sm mb-5">
                {error}
              </div>
            )}

            {loading ? (
              <div className="flex items-center justify-center py-32 text-slate-400 text-base">
                Cargando usuarios…
              </div>
            ) : (
              <>
                <div className="glass-card rounded-2xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-white/8">
                          <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-6 py-4">Usuario</th>
                          <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-6 py-4 hidden lg:table-cell">Email</th>
                          <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-6 py-4 hidden xl:table-cell">DNI</th>
                          <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-6 py-4 hidden lg:table-cell">Rol</th>
                          <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-6 py-4 hidden lg:table-cell">Creado por</th>
                          <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-6 py-4">Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="text-center text-slate-500 py-20 text-sm">
                              No hay usuarios registrados
                            </td>
                          </tr>
                        ) : (
                          users.map((u) => (
                            <tr
                              key={u.id}
                              className="border-b border-white/5 hover:bg-white/3 transition-colors"
                            >
                              {/* Usuario */}
                              <td className="px-6 py-4">
                                <div>
                                  <p className="text-white font-semibold text-sm">
                                    {u.firstName} {u.lastName}
                                  </p>
                                  <p className="text-slate-400 text-xs mt-0.5">@{u.username}</p>
                                </div>
                              </td>

                              {/* Email */}
                              <td className="px-6 py-4 hidden lg:table-cell">
                                <span className="text-slate-300 text-sm">{u.email}</span>
                              </td>

                              {/* DNI */}
                              <td className="px-6 py-4 hidden xl:table-cell">
                                <span className="text-slate-400 text-sm font-mono">{u.dni}</span>
                              </td>

                              {/* Rol */}
                              <td className="px-6 py-4 hidden lg:table-cell">
                                <span className="bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-medium px-2.5 py-1 rounded-full">
                                  {u.role?.name ?? "—"}
                                </span>
                              </td>

                              {/* Creado por */}
                              <td className="px-6 py-4 hidden lg:table-cell">
                                <span className="text-slate-400 text-sm">{u.createdBy}</span>
                              </td>

                              {/* Acciones */}
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-1">
                                  <button className="text-blue-400 hover:text-blue-300 text-xs font-medium px-2 py-1 rounded hover:bg-blue-500/10 transition-colors">
                                    Ver
                                  </button>
                                  <button className="text-slate-400 hover:text-white text-xs font-medium px-2 py-1 rounded hover:bg-white/5 transition-colors">
                                    Editar
                                  </button>
                                  <button className="text-red-400 hover:text-red-300 text-xs font-medium px-2 py-1 rounded hover:bg-red-500/10 transition-colors">
                                    Eliminar
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {totalPages > 1 && (
                  <div className="flex items-center justify-between mt-4">
                    <p className="text-slate-400 text-sm">
                      Página {page} de {totalPages}
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page <= 1}
                        className="btn-outline text-sm px-4 py-2 rounded-full disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        Anterior
                      </button>
                      <button
                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                        disabled={page >= totalPages}
                        className="btn-outline text-sm px-4 py-2 rounded-full disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        Siguiente
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </main>
      </div>
    </div>

    {showCreate && (
      <UserFormModal
        onClose={() => setShowCreate(false)}
        onSaved={() => setRefreshKey(k => k + 1)}
      />
    )}
    </>
  )
}
