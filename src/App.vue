<template>
  <SharePage v-if="isShareRoute" />
  <div v-else class="not-found">Not Found</div>
</template>

<script setup>
import { computed, ref } from 'vue'
import SharePage from './pages/SharePage.vue'

const SHARE_PATH = '/share'
const currentPath = ref((window.location.pathname.replace(/\/+$/, '') || '/'))

const isShareRoute = computed(() => currentPath.value === SHARE_PATH)
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
