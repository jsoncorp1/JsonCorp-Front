"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { getAuth, clearAuth, type AuthData, getAuthHeader } from "@/lib/auth"
import ServiceFormModal from "@/components/ServiceFormModal"
import ServiceDetailModal from "@/components/ServiceDetailModal"
import ConfirmDeleteModal from "@/components/ConfirmDeleteModal"

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL
const PAGE_SIZE = 10

interface Service {
  id: string
  category: string
  name: string
  slogan: string
  priceList: string[]
  primaryColor: string
  createdBy: string
  createdAt: string
  deletedAt: string | null
}

interface ServicesResponse {
  data: Service[]
  total: number
  page: string
  size: string
}

export default function SuperadminPage() {
  const router = useRouter()
  const [auth, setAuth] = useState<AuthData | null>(null)
  const [services, setServices] = useState<Service[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [showCreate, setShowCreate] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)
  const [viewId, setViewId] = useState<string | null>(null)
  const [editId, setEditId] = useState<string | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null)

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
          `${API_BASE}/services?page=${page}&size=${PAGE_SIZE}`,
          { headers: getAuthHeader() }
        )
        if (!res.ok) throw new Error()
        const data: ServicesResponse = await res.json()
        if (!cancelled) {
          setServices(data.data)
          setTotal(data.total)
        }
      } catch {
        if (!cancelled) setError("No se pudieron cargar los servicios")
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
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
            <span className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-white bg-blue-600/20 border border-blue-500/20 text-sm font-medium cursor-default select-none">
              <svg className="w-4 h-4 text-blue-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Servicios
            </span>
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-6xl mx-auto">
            {/* Page header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-white text-2xl font-bold">Servicios</h1>
                {!loading && (
                  <p className="text-slate-400 text-sm mt-0.5">{total} registro{total !== 1 ? "s" : ""}</p>
                )}
              </div>
              <button
                onClick={() => setShowCreate(true)}
                className="btn-primary text-sm font-semibold px-5 py-2.5 rounded-full"
              >
                + Nuevo servicio
              </button>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-red-400 text-sm mb-5">
                {error}
              </div>
            )}

            {loading ? (
              <div className="flex items-center justify-center py-32 text-slate-400 text-base">
                Cargando servicios…
              </div>
            ) : (
              <>
                <div className="glass-card rounded-2xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-white/8">
                          {["Servicio", "Categoría", "Precios", "Creado por", "Acciones"].map(
                            (h, i) => (
                              <th
                                key={h}
                                className={`text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-6 py-4 ${
                                  i === 1 ? "hidden lg:table-cell" :
                                  i === 2 ? "hidden xl:table-cell" :
                                  i === 3 ? "hidden lg:table-cell" : ""
                                }`}
                              >
                                {h}
                              </th>
                            )
                          )}
                        </tr>
                      </thead>
                      <tbody>
                        {services.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="text-center text-slate-500 py-20 text-sm">
                              No hay servicios registrados
                            </td>
                          </tr>
                        ) : (
                          services.map((s) => (
                            <tr
                              key={s.id}
                              className="border-b border-white/5 hover:bg-white/3 transition-colors"
                            >
                              {/* Servicio */}
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                  <div
                                    className="w-1.5 h-10 rounded-full shrink-0"
                                    style={{ background: s.primaryColor || "#2563eb" }}
                                  />
                                  <div>
                                    <p className="text-white font-semibold text-sm">{s.name}</p>
                                    <p className="text-slate-400 text-xs mt-0.5 line-clamp-1 max-w-xs">
                                      {s.slogan}
                                    </p>
                                  </div>
                                </div>
                              </td>

                              {/* Categoría */}
                              <td className="px-6 py-4 hidden lg:table-cell">
                                <span className="text-slate-300 text-sm">{s.category}</span>
                              </td>

                              {/* Precios */}
                              <td className="px-6 py-4 hidden xl:table-cell">
                                <div className="flex flex-col gap-0.5">
                                  {s.priceList?.slice(0, 2).map((entry, i) => {
                                    const [plan, price] = entry.split("|")
                                    return (
                                      <span key={i} className="text-xs text-slate-400">
                                        <span className="text-white font-medium">{price}</span>
                                        {plan ? ` · ${plan}` : ""}
                                      </span>
                                    )
                                  })}
                                </div>
                              </td>

                              {/* Creado por */}
                              <td className="px-6 py-4 hidden lg:table-cell">
                                <span className="text-slate-400 text-sm">{s.createdBy}</span>
                              </td>

                              {/* Acciones */}
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-1">
                                  <button
                                    onClick={() => setViewId(s.id)}
                                    className="text-blue-400 hover:text-blue-300 text-xs font-medium px-2 py-1 rounded hover:bg-blue-500/10 transition-colors"
                                  >
                                    Ver
                                  </button>
                                  <button
                                    onClick={() => setEditId(s.id)}
                                    className="text-slate-400 hover:text-white text-xs font-medium px-2 py-1 rounded hover:bg-white/5 transition-colors"
                                  >
                                    Editar
                                  </button>
                                  <button
                                    onClick={() => setDeleteTarget({ id: s.id, name: s.name })}
                                    className="text-red-400 hover:text-red-300 text-xs font-medium px-2 py-1 rounded hover:bg-red-500/10 transition-colors"
                                  >
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

                {/* Pagination */}
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
      <ServiceFormModal
        onClose={() => setShowCreate(false)}
        onSaved={() => setRefreshKey(k => k + 1)}
      />
    )}

    {editId && (
      <ServiceFormModal
        serviceId={editId}
        onClose={() => setEditId(null)}
        onSaved={() => { setRefreshKey(k => k + 1); setEditId(null) }}
      />
    )}

    {viewId && (
      <ServiceDetailModal
        id={viewId}
        onClose={() => setViewId(null)}
      />
    )}

    {deleteTarget && (
      <ConfirmDeleteModal
        serviceId={deleteTarget.id}
        serviceName={deleteTarget.name}
        onClose={() => setDeleteTarget(null)}
        onDeleted={() => { setRefreshKey(k => k + 1); setDeleteTarget(null) }}
      />
    )}
    </>
  )
}