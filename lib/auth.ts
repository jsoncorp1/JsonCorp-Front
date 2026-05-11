export interface AuthUser {
  id: string
  username: string
  role: string
}

export interface AuthData {
  user: AuthUser
  accessToken: string
  refreshToken: string
}

const KEY = "jsoncorp_auth"

export function saveAuth(data: AuthData): void {
  localStorage.setItem(KEY, JSON.stringify(data))
}

export function getAuth(): AuthData | null {
  if (typeof window === "undefined") return null
  const raw = localStorage.getItem(KEY)
  return raw ? (JSON.parse(raw) as AuthData) : null
}

export function clearAuth(): void {
  localStorage.removeItem(KEY)
}

export function getAuthHeader(): Record<string, string> {
  const auth = getAuth()
  if (!auth) return {}
  return { Authorization: `Bearer ${auth.accessToken}` }
}