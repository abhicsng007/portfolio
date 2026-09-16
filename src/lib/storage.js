const KEY = "ac-folio-v3"

export function loadAtelier() {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export function saveAtelier(data) {
  localStorage.setItem(KEY, JSON.stringify(data))
}

export function clearAtelier() {
  localStorage.removeItem(KEY)
}

export function downloadJson(data, filename = "portfolio-content.json") {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
