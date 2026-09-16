import { useEffect } from "react"
import Lenis from "lenis"

let lenis

export function getLenis() {
  return lenis
}

export function scrollToId(href) {
  const el = document.querySelector(href)
  if (!el) return
  if (lenis) lenis.scrollTo(el, { offset: -8 })
  else el.scrollIntoView({ behavior: "smooth", block: "start" })
}

export function useLenis(paused = false) {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined

    lenis = new Lenis({
      duration: 1.15,
      smoothWheel: true,
      wheelMultiplier: 0.9,
      autoRaf: true,
      anchors: true,
    })

    return () => {
      lenis?.destroy()
      lenis = undefined
    }
  }, [])

  useEffect(() => {
    if (!lenis) return
    if (paused) lenis.stop()
    else lenis.start()
  }, [paused])
}
