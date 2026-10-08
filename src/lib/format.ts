export function formatClock(totalSeconds: number): string {
  const s = Math.max(0, Math.floor(totalSeconds))
  const m = Math.floor(s / 60)
  return `${m}:${String(s % 60).padStart(2, '0')}`
}

/** "0:47" → "47 seconds", "2:30" → "2 minutes 30 seconds" for screen-reader friendly text. */
export function spokenDuration(totalSeconds: number): string {
  const s = Math.max(0, Math.floor(totalSeconds))
  const m = Math.floor(s / 60)
  const r = s % 60
  const parts: string[] = []
  if (m) parts.push(`${m} ${m === 1 ? 'minute' : 'minutes'}`)
  if (r || !m) parts.push(`${r} ${r === 1 ? 'second' : 'seconds'}`)
  return parts.join(' ')
}

export function formatTimestamp(iso: string | null): string {
  if (!iso) return 'No activity yet'
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return 'No activity yet'
  const time = new Intl.DateTimeFormat(undefined, { hour: 'numeric', minute: '2-digit' }).format(date)
  const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime()
  const dayDiff = Math.round((startOfDay(new Date()) - startOfDay(date)) / 86_400_000)
  if (dayDiff === 0) return `Today at ${time}`
  if (dayDiff === 1) return `Yesterday at ${time}`
  const day = new Intl.DateTimeFormat(undefined, { weekday: 'long', month: 'long', day: 'numeric' }).format(date)
  return `${day} at ${time}`
}

export const plural = (n: number, one: string, many = `${one}s`) => `${n} ${n === 1 ? one : many}`
