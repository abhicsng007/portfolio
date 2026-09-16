import { useEffect, useState } from "react"
import { motion, useMotionValue, useSpring } from "framer-motion"

export default function Cursor() {
  const [enabled, setEnabled] = useState(false)
  const [hovering, setHovering] = useState(false)
  const x = useMotionValue(-80)
  const y = useMotionValue(-80)
  const sx = useSpring(x, { stiffness: 420, damping: 34, mass: 0.35 })
  const sy = useSpring(y, { stiffness: 420, damping: 34, mass: 0.35 })

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (!fine || reduce) return undefined
    setEnabled(true)
    const move = (e) => {
      x.set(e.clientX)
      y.set(e.clientY)
    }
    const over = (e) => {
      setHovering(Boolean(e.target.closest("a, button, input, textarea, [data-cursor='hover']")))
    }
    window.addEventListener("pointermove", move)
    window.addEventListener("pointerover", over)
    return () => {
      window.removeEventListener("pointermove", move)
      window.removeEventListener("pointerover", over)
    }
  }, [x, y])

  if (!enabled) return null

  const size = hovering ? 44 : 20

  return (
    <motion.div
      className="pointer-events-none fixed z-[90] -translate-x-1/2 -translate-y-1/2 mix-blend-difference"
      style={{ left: sx, top: sy }}
      animate={{ width: size, height: size }}
      transition={{ type: "spring", stiffness: 280, damping: 20, mass: 0.4 }}
    >
      <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-oxide" />
      <div className="absolute top-1/2 left-0 h-px w-full -translate-y-1/2 bg-oxide" />
      <div className="absolute inset-0 border border-oxide shadow-[0_0_12px_rgba(200,240,77,0.45)]" />
      <motion.span
        className="absolute left-1/2 top-1/2 rounded-full bg-oxide"
        animate={{ width: hovering ? 5 : 3, height: hovering ? 5 : 3 }}
        style={{ x: "-50%", y: "-50%" }}
      />
    </motion.div>
  )
}
