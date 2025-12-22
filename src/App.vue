<template>
  <SharePage v-if="isShareRoute" />
  <RedirectPage v-else-if="isRedirectRoute" />
  <div v-else class="not-found">Not Found</div>
</template>

<script setup>
import { computed, ref } from 'vue'
import SharePage from './pages/SharePage.vue'
import RedirectPage from './pages/RedirectPage.vue'

const basePath = String(import.meta.env.BASE_URL || '/').replace(/\/+$/, '')
const SHARE_PATH = `${basePath || ''}/share`
const REDIRECT_PATH = `${basePath || ''}/redirect`
const currentPath = ref((window.location.pathname.replace(/\/+$/, '') || '/'))

const isShareRoute = computed(() => currentPath.value === SHARE_PATH)
const isRedirectRoute = computed(() => currentPath.value === REDIRECT_PATH)
</script>

<style scoped>
.not-found {
  min-height: 100vh;
  display: grid;
  place-items: center;
  background: #000;
  color: rgba(255, 255, 255, 0.75);
  font-weight: 700;
}
</style>
