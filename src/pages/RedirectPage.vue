<script setup>
import { onMounted, ref } from 'vue'
import { fetchRandomLink } from '../services/links'
import { getCurrentPageType } from '../utils/pageType'

function openDeepLink(url) {
  if (!url) return
  try {
    window.location.href = url
  } catch {
    // ignore
  }
}

const targetUrl = ref('')

function onUserContinue() {
  openDeepLink(targetUrl.value)
}

onMounted(async () => {
  try {
    targetUrl.value = await fetchRandomLink({ type: getCurrentPageType() })
  } catch {
    // ignore
  }
})
</script>

<template>
  <div class="redirect-page">
    <button class="redirect-button" type="button" :disabled="!targetUrl" @click="onUserContinue">
      Open WhatsApp
    </button>
  </div>
</template>

<style scoped>
.redirect-page {
  min-height: 100vh;
  background: transparent;
  display: grid;
  place-items: center;
}

.redirect-button {
  border: 0;
  border-radius: 14px;
  padding: 14px 18px;
  font-size: 16px;
  font-weight: 800;
  color: #ffffff;
  background: #16a34a;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}

.redirect-button:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}
</style>
