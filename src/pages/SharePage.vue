<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { fetchRandomLink } from '../services/links'
import { trackMetaPixel } from '../analytics/metaPixel'
import { getCurrentPageType } from '../utils/pageType'

const pageTitle = 'Share'

const scrollEl = ref(null)
const contactSheetOpen = ref(false)

onMounted(() => {
    document.title = pageTitle
    listenViewport()
    syncViewportMode()
})

let prevHtmlStyle = ''
let prevBodyStyle = ''
let viewportMql = null
let removeViewportListener = null
let isMobileMode = false
let removeOverscrollGuard = null

function attachOverscrollGuard(el) {
    let startY = 0

    const onTouchStart = (event) => {
        if (!event.touches || event.touches.length !== 1) return
        startY = event.touches[0].clientY
    }

    const onTouchMove = (event) => {
        if (!event.touches || event.touches.length !== 1) return

        const currentY = event.touches[0].clientY
        const deltaY = currentY - startY

        const maxScrollTop = el.scrollHeight - el.clientHeight
        if (maxScrollTop <= 0) {
            event.preventDefault()
            return
        }

        if (el.scrollTop <= 0 && deltaY > 0) {
            event.preventDefault()
            return
        }

        if (el.scrollTop >= maxScrollTop && deltaY < 0) {
            event.preventDefault()
        }
    }

    el.addEventListener('touchstart', onTouchStart, { passive: true })
    el.addEventListener('touchmove', onTouchMove, { passive: false })

    return () => {
        el.removeEventListener('touchstart', onTouchStart)
        el.removeEventListener('touchmove', onTouchMove)
    }
}

function enableMobileMode() {
    if (isMobileMode) return
    const html = document.documentElement
    const body = document.body

    prevHtmlStyle = html.getAttribute('style') || ''
    prevBodyStyle = body.getAttribute('style') || ''

    html.style.height = '100%'
    html.style.overflow = 'hidden'

    body.style.height = '100%'
    body.style.overflow = 'hidden'

    const el = scrollEl.value
    if (el && !removeOverscrollGuard) {
        removeOverscrollGuard = attachOverscrollGuard(el)
    }

    isMobileMode = true
}

function disableMobileMode() {
    if (!isMobileMode) return
    const html = document.documentElement
    const body = document.body

    if (removeOverscrollGuard) removeOverscrollGuard()
    removeOverscrollGuard = null

    if (prevHtmlStyle) html.setAttribute('style', prevHtmlStyle)
    else html.removeAttribute('style')

    if (prevBodyStyle) body.setAttribute('style', prevBodyStyle)
    else body.removeAttribute('style')

    isMobileMode = false
}

function syncViewportMode() {
    const isMobile = viewportMql ? viewportMql.matches : window.matchMedia('(max-width: 899px)').matches
    if (isMobile) enableMobileMode()
    else disableMobileMode()
}

function listenViewport() {
    viewportMql = window.matchMedia('(max-width: 899px)')

    const handler = () => syncViewportMode()
    if (typeof viewportMql.addEventListener === 'function') {
        viewportMql.addEventListener('change', handler)
        removeViewportListener = () => viewportMql?.removeEventListener('change', handler)
    } else {
        viewportMql.addListener(handler)
        removeViewportListener = () => viewportMql?.removeListener(handler)
    }
}

onUnmounted(() => {
    if (removeViewportListener) removeViewportListener()
    removeViewportListener = null
    viewportMql = null
    disableMobileMode()
})

function openDeepLink(url) {
    if (!url) return
    try {
        window.location.href = url
    } catch {
        // ignore
    }
}

function openContactSheet() {
    contactSheetOpen.value = true
}

function closeContactSheet() {
    contactSheetOpen.value = false
}

async function openRandomLinkInPlace() {
    try {
        const url = await fetchRandomLink({ type: getCurrentPageType() })
        openDeepLink(url)
    } catch {
        // ignore
    }
}

function onContactUs() {
    trackMetaPixel('ContactUsClick')
    openContactSheet()
}

async function onWhatsApp() {
    closeContactSheet()
    await openRandomLinkInPlace()
}

async function onBottomButton() {
    trackMetaPixel('BottomButtonClick')
    await openRandomLinkInPlace()
}

watch(contactSheetOpen, (open, _prev, onCleanup) => {
    const onKeydown = (event) => {
        if (event.key === 'Escape') closeContactSheet()
    }

    if (open) window.addEventListener('keydown', onKeydown)
    onCleanup(() => window.removeEventListener('keydown', onKeydown))
})
</script>

<template>
    <div class="share-shell" :class="{ 'modal-open': contactSheetOpen }">
        <main ref="scrollEl" class="share-page">
            <div class="content">
                <img class="share-image" src="https://app-web.aipay-app.com/static/png/share-bg-2e4caf9a.png" alt=""
                    loading="eager" decoding="async" />
            </div>

            <section class="actions">
                <button class="contact-card" type="button" @click="onContactUs">
                    <span class="contact-left">
                        <svg t="1766060969845" class="contact-icon" viewBox="0 0 1024 1024" version="1.1"
                            xmlns="http://www.w3.org/2000/svg" p-id="9519" aria-hidden="true">
                            <path
                                d="M927.616 465.6C923.328 236.704 745.888 51.808 528 51.808h-32c-217.888 0-395.328 184.896-399.616 413.76C58.112 487.744 32 528.672 32 576v64c0 70.592 57.408 128 128 128s128-57.408 128-128v-64a128.064 128.064 0 0 0-126.784-127.872C173.728 262.688 318.912 115.808 496 115.808h32c177.12 0 322.272 146.88 334.784 332.32A128.064 128.064 0 0 0 736 576v64c0 57.792 38.72 106.176 91.392 122.016a337.504 337.504 0 0 1-191.936 124.48A79.712 79.712 0 0 0 560 832a80 80 0 1 0 0 160 79.68 79.68 0 0 0 67.872-38.112 402.432 402.432 0 0 0 278.24-193.6C955.968 742.816 992 695.776 992 640v-64c0-47.328-26.112-88.256-64.384-110.4zM224 576v64c0 35.296-28.704 64-64 64s-64-28.704-64-64v-64c0-35.296 28.704-64 64-64s64 28.704 64 64z m704 64c0 34.304-27.2 62.176-61.12 63.712l-2.496-1.184c-0.224 0.512-0.576 0.928-0.8 1.408A64 64 0 0 1 800 640v-64c0-35.296 28.704-64 64-64s64 28.704 64 64v64z"
                                p-id="9520" fill="currentColor"></path>
                        </svg>
                        <span class="contact-text">
                            Contact Us
                        </span>
                    </span>

                    <svg class="chevron" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M9 18l6-6-6-6" fill="none" stroke="currentColor" stroke-width="2"
                            stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                </button>

                <button class="image-button" type="button" @click="onBottomButton">
                    <img class="action-image" src="https://app-web.aipay-app.com/static/png/share-btn-367419ac.png"
                        alt="" loading="eager" decoding="async" />
                </button>
            </section>
        </main>
    </div>

    <Teleport to="body">
        <Transition name="contact-overlay">
            <div v-if="contactSheetOpen" class="contact-overlay" role="presentation" @click="closeContactSheet" />
        </Transition>

        <Transition name="contact-sheet">
            <section v-if="contactSheetOpen" class="contact-sheet" role="dialog" aria-modal="true"
                aria-label="Contact options" @click.stop>
                <div class="contact-sheet-handle" aria-hidden="true" />
                <div class="contact-sheet-grid">
                    <button class="contact-sheet-item" type="button" @click="onWhatsApp">
                        <span class="contact-sheet-icon whatsapp" aria-hidden="true">
                            <svg viewBox="0 0 24 24">
                                <path fill="currentColor"
                                    d="M12 2a9.9 9.9 0 0 0-8.6 14.8L2 22l5.4-1.4A9.9 9.9 0 1 0 12 2Zm0 18a8 8 0 0 1-4.1-1.1l-.3-.2-3.2.8.9-3.1-.2-.3A8 8 0 1 1 12 20Zm4.7-6.1c-.2-.1-1.4-.7-1.6-.7s-.4-.1-.6.1-.7.7-.8.9-.3.2-.5.1a6.5 6.5 0 0 1-1.9-1.2 7 7 0 0 1-1.3-1.7c-.1-.2 0-.4.1-.5l.4-.4c.1-.1.2-.3.3-.4.1-.2.1-.3 0-.5s-.6-1.4-.8-1.9c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3s-1 1-1 2.4 1 2.8 1.1 3c.1.2 2 3 4.9 4.2.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.6-.1 1.4-.6 1.6-1.1.2-.6.2-1.1.1-1.2-.1-.1-.2-.2-.4-.3Z" />
                            </svg>
                        </span>
                        <span class="contact-sheet-label">WhatsApp</span>
                    </button>
                </div>

                <button class="contact-sheet-cancel" type="button" @click="closeContactSheet">Cancel</button>
            </section>
        </Transition>
    </Teleport>
</template>

<style scoped>
.share-shell {
    min-height: 100vh;
    background: transparent;
    display: flex;
    justify-content: center;
}

.share-page {
    min-height: 100vh;
    width: 100%;
    max-width: 980px;
    padding: env(safe-area-inset-top) 18px env(safe-area-inset-bottom);
    display: flex;
    flex-direction: column;
    gap: 0;
    background: #000;
    overflow-x: hidden;
}

/* Prevent scrolling the page behind the modal */
.share-shell.modal-open .share-page {
    overflow: hidden;
}

@media (max-width: 899px) {
    .share-page {
        height: 100vh;
        height: 100dvh;
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;
        overscroll-behavior-y: contain;
    }
}

.content {
    flex: 1 1 auto;
    display: grid;
    place-items: center;
    width: 100%;
    max-width: 980px;
    margin: 0 auto;
    padding: 16px 0 8px;
}

.share-image {
    width: 110%;
    max-height: calc(130vh - 200px);
    height: auto;
    object-fit: contain;
}

.actions {
    padding: 16px 0 calc(env(safe-area-inset-bottom) + clamp(128px, 10vh, 256px));
    display: flex;
    flex-direction: column;
    gap: clamp(35px, 3vh, 48px);
    align-items: center;
    width: 94%;
    max-width: 980px;
    margin: 0 auto;
}

.contact-card {
    width: 100%;
    border: 0;
    font-size: clamp(16px, calc(0.8vw + 14px), 30px);
    border-radius: 0.85em;
    padding: 0.9em 0.95em;
    background: #011849;
    color: #ffffff;
    display: flex;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
}

.contact-card:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.contact-left {
    display: inline-flex;
    align-items: center;
    gap: 0.65em;
    min-width: 0;
}

.contact-icon {
    width: 1.6em;
    height: 1.6em;
    flex: 0 0 auto;
    display: block;
    color: #ffffff;
}

.contact-text {
    font-size: 1.2em;
    font-weight: 700;
    color: #17ADF7;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.chevron {
    width: 1.35em;
    height: 1.35em;
    flex: 0 0 auto;
    display: block;
    color: #17ADF7;
}

.image-button {
    width: 102%;
    border: 0;
    padding: 0;
    background: transparent;
    cursor: pointer;
}

.action-image {
    width: 100%;
    height: auto;
    display: block;
}

@media (min-width: 900px) {
    .share-image {
        max-height: none;
    }
}

@supports not (gap: 1rem) {
    .actions>*+* {
        margin-top: clamp(14px, 2vh, 24px);
    }
}

.contact-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.45);
    z-index: 1000;
}

.contact-sheet {
    position: fixed;
    left: 50%;
    bottom: 0;
    transform: translateX(-50%);
    width: min(980px, calc(100vw - 24px));
    background: #ffffff;
    border-radius: 18px 18px 0 0;
    padding: 10px 14px calc(env(safe-area-inset-bottom) + 14px);
    z-index: 1001;
    box-shadow: 0 -10px 30px rgba(0, 0, 0, 0.28);
}

.contact-sheet-handle {
    width: 44px;
    height: 5px;
    border-radius: 999px;
    background: rgba(15, 23, 42, 0.12);
    margin: 2px auto 10px;
}

.contact-sheet-grid {
    display: flex;
    gap: 12px;
    justify-content: center;
}

.contact-sheet-item {
    flex: 0 1 320px;
    width: min(320px, 100%);
    border: 1px solid rgba(15, 23, 42, 0.08);
    background: #fff;
    border-radius: 14px;
    padding: 14px 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    cursor: pointer;
    color: #0f172a;
}

.contact-sheet-item:active {
    transform: translateY(1px);
}

.contact-sheet-icon {
    width: 34px;
    height: 34px;
    border-radius: 12px;
    display: inline-grid;
    place-items: center;
    color: #ffffff;
    flex: 0 0 auto;
}

.contact-sheet-icon svg {
    width: 20px;
    height: 20px;
    display: block;
}

.contact-sheet-icon.whatsapp {
    background: #25D366;
}

.contact-sheet-label {
    font-size: 15px;
    font-weight: 700;
}

.contact-sheet-cancel {
    margin-top: 12px;
    width: 100%;
    border: 0;
    background: rgba(15, 23, 42, 0.06);
    color: #0f172a;
    font-weight: 700;
    padding: 12px;
    border-radius: 14px;
    cursor: pointer;
}

.contact-overlay-enter-active,
.contact-overlay-leave-active {
    transition: opacity 160ms ease;
}

.contact-overlay-enter-from,
.contact-overlay-leave-to {
    opacity: 0;
}

.contact-sheet-enter-active,
.contact-sheet-leave-active {
    transition: transform 200ms ease, opacity 200ms ease;
}

.contact-sheet-enter-from,
.contact-sheet-leave-to {
    transform: translateX(-50%) translateY(16px);
    opacity: 0;
}

@media (prefers-reduced-motion: reduce) {
    .contact-overlay-enter-active,
    .contact-overlay-leave-active,
    .contact-sheet-enter-active,
    .contact-sheet-leave-active {
        transition: none;
    }
}
</style>
