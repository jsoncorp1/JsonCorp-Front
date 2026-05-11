import { createHash } from "crypto"
import { type NextRequest } from "next/server"

export async function POST(request: NextRequest) {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME
  const apiKey = process.env.CLOUDINARY_API_KEY
  const apiSecret = process.env.CLOUDINARY_API_SECRET

  if (!cloudName || !apiKey || !apiSecret) {
    return Response.json({ error: "Cloudinary no configurado" }, { status: 500 })
  }

  const form = await request.formData()
  const file = form.get("file") as File | null

  if (!file) {
    return Response.json({ error: "No se recibió ningún archivo" }, { status: 400 })
  }

  const timestamp = Math.round(Date.now() / 1000)
  const signature = createHash("sha1")
    .update(`timestamp=${timestamp}${apiSecret}`)
    .digest("hex")

  const upload = new FormData()
  upload.append("file", file)
  upload.append("api_key", apiKey)
  upload.append("timestamp", String(timestamp))
  upload.append("signature", signature)

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    { method: "POST", body: upload }
  )

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    return Response.json(
      { error: (err as { error?: { message?: string } }).error?.message ?? "Error al subir imagen" },
      { status: 500 }
    )
  }

  const data = await res.json()
  return Response.json({ url: data.secure_url as string })
}
