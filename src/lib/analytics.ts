export function track(event: string, data?: Record<string, any>) {
  if (typeof window !== 'undefined') {
    console.log(`📊 [Analytics] ${event}`, data || '')
    // Vercel Analytics will capture this
    try {
      fetch('/api/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event, data, timestamp: Date.now() })
      }).catch(() => {})
    } catch {
      // Silent fail — don't block UI
    }
  }
}

export function checkRepeatVisit() {
  if (typeof window === 'undefined') return
  const key = 'castflow_last_visit'
  const lastVisit = localStorage.getItem(key)
  const now = Date.now()
  
  if (lastVisit) {
    const hoursSince = (now - parseInt(lastVisit)) / (1000 * 60 * 60)
    if (hoursSince > 24) {
      track('repeat_visit', { daysSince: Math.floor(hoursSince / 24) })
    }
  }
  localStorage.setItem(key, now.toString())
}
