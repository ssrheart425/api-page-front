import axios from 'axios'

function pickUrl(payload) {
  if (!payload) return ''
  if (typeof payload === 'string') return payload

  if (typeof payload.url === 'string') return payload.url
  if (typeof payload.link === 'string') return payload.link
  if (typeof payload.href === 'string') return payload.href

  if (payload.data) return pickUrl(payload.data)
  if (payload.result) return pickUrl(payload.result)

  return ''
}

export async function fetchRandomLink({ baseURL, type } = {}) {
  const client = axios.create({
    baseURL: baseURL || undefined,
    timeout: 15000,
  })

  const response = await client.get('/api/v1/links/random', {
    params: typeof type === 'string' && type ? { type } : undefined,
  })
  const url = pickUrl(response?.data)

  if (!url) {
    throw new Error('Empty link from API.')
  }

  return url
}
