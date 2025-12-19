export function getPageTypeFromPathname(pathname) {
  const parts = String(pathname || '')
    .split('/')
    .map((p) => p.trim())
    .filter(Boolean)
  return parts[parts.length - 1] || ''
}

export function getCurrentPageType() {
  if (typeof window === 'undefined') return ''
  return getPageTypeFromPathname(window.location.pathname) || 'share'
}

