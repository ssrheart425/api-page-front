import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { initMetaPixel } from './analytics/metaPixel'
import { fetchFbqPixelId } from './services/fbqPixel'
import { getCurrentPageType } from './utils/pageType'

async function bootstrapMetaPixel() {
  const pixelType = getCurrentPageType()
  const apiBase = String(import.meta.env.API_BASE || import.meta.env.VITE_API_BASE || '').trim()

  if (!apiBase) return

  try {
    const pixelId = String(await fetchFbqPixelId({ baseURL: apiBase, type: pixelType })).trim()
    initMetaPixel(pixelId)
  } catch {
    // ignore
  }
}

bootstrapMetaPixel()
createApp(App).mount('#app')
