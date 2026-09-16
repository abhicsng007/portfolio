export function parseYouTubeId(input) {
  if (!input) return null
  const value = input.trim()
  if (/^[A-Za-z0-9_-]{11}$/.test(value)) return value
  try {
    const url = new URL(value)
    if (url.hostname.includes("youtu.be")) {
      const id = url.pathname.split("/").filter(Boolean)[0]
      return id?.slice(0, 11) || null
    }
    if (url.searchParams.get("v")) return url.searchParams.get("v")
    const parts = url.pathname.split("/").filter(Boolean)
    const embed = parts.findIndex((p) => p === "embed" || p === "shorts")
    if (embed >= 0 && parts[embed + 1]) return parts[embed + 1].slice(0, 11)
  } catch {
    return null
  }
  return null
}

export function youtubeEmbed(input) {
  const id = parseYouTubeId(input)
  return id ? `https://www.youtube.com/embed/${id}` : ""
}

export function youtubeWatch(input) {
  const id = parseYouTubeId(input)
  return id ? `https://www.youtube.com/watch?v=${id}` : input
}
