import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { initMetaPixel } from './analytics/metaPixel'
import { fetchFbqPixelId } from './services/fbqPixel'
import { getCurrentPageType } from './utils/pageType'

async function bootstrapMetaPixel() {
  const pixelType = getCurrentPageType()
  try {
    const pixelId = String(await fetchFbqPixelId({ type: pixelType })).trim()
    initMetaPixel(pixelId)
  } catch {
    // ignore
  }
}

bootstrapMetaPixel()
createApp(App).mount('#app')
