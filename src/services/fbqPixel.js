import axios from 'axios'

function pickPixelId(payload) {
  if (!payload) return ''
  if (typeof payload === 'string') return payload

  if (typeof payload.pixelId === 'string') return payload.pixelId
  if (typeof payload.pixel_id === 'string') return payload.pixel_id
  if (typeof payload.fbq === 'string') return payload.fbq
  if (typeof payload.fb_token === 'string') return payload.fb_token
  if (typeof payload.token === 'string') return payload.token
  if (typeof payload.id === 'string') return payload.id

  if (payload.data) return pickPixelId(payload.data)
  if (payload.result) return pickPixelId(payload.result)

  return ''
}

export async function fetchFbqPixelId({ baseURL, type } = {}) {
  const client = axios.create({
    baseURL: baseURL || undefined,
    timeout: 15000,
  })

  const response = await client.get('/api/v1/fb_token/by_type', { params: { type } })
  return pickPixelId(response?.data)
}
