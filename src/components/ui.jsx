import { useEffect, useRef, useState } from "react"
import { motion, useInView, useReducedMotion } from "framer-motion"

export const ease = [0.22, 1, 0.36, 1]

export function Container({ children, className = "" }) {
  return <div className={`mx-auto w-full max-w-[1120px] ${className}`}>{children}</div>
}

export function Folio({ n, label }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-8% 0px" })
  return (
    <div
      ref={ref}
      className="flex items-center gap-3 font-display text-[11px] font-semibold uppercase tracking-[0.28em] text-oxide"
    >
      <span className="font-mono text-cyan">[{n}]</span>
      <motion.span
        className="inline-block h-px bg-oxide/40"
        initial={{ width: 0, opacity: 0 }}
        animate={inView ? { width: 32, opacity: 1 } : { width: 0, opacity: 0 }}
        transition={{ duration: 0.7, ease }}
      />
      <motion.span
        initial={{ opacity: 0, x: -8 }}
        animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -8 }}
        transition={{ duration: 0.5, delay: 0.1, ease }}
      >
        {label}
      </motion.span>
    </div>
  )
}

export function Reveal({ children, className = "", delay = 0 }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-12% 0px" })
  const reduce = useReducedMotion()
  if (reduce) return <div className={className}>{children}</div>
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 22 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 22 }}
      transition={{ duration: 0.7, delay, ease }}
    >
      {children}
    </motion.div>
  )
}

export function CountUp({ to, decimals = 0, pad = 0, suffix = "", duration = 1.05, className = "" }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-10% 0px" })
  const reduce = useReducedMotion()
  const [val, setVal] = useState(reduce ? to : 0)

  useEffect(() => {
    if (!inView || reduce) return undefined
    let raf
    const start = performance.now()
    const ms = duration * 1000
    const tick = (now) => {
      const t = Math.min(1, (now - start) / ms)
      const eased = 1 - (1 - t) ** 3
      setVal(to * eased)
      if (t < 1) raf = requestAnimationFrame(tick)
      else setVal(to)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inView, to, duration, reduce])

  const num = decimals > 0 ? val.toFixed(decimals) : String(Math.round(val)).padStart(pad, "0")
  return (
    <span ref={ref} className={className}>
      {num}
      {suffix}
    </span>
  )
}

export function SplitName({ text, className = "", delay = 0, play = true }) {
  const reduce = useReducedMotion()
  if (reduce) return <span className={className}>{text}</span>
  return (
    <span className={`inline-flex ${className}`}>
      {text.split("").map((ch, i) => (
        <span key={`${ch}-${i}`} className="inline-block overflow-hidden">
          <motion.span
            className="inline-block"
            initial={{ y: "110%" }}
            animate={play ? { y: 0 } : { y: "110%" }}
            transition={{ duration: 0.7, delay: delay + i * 0.03, ease }}
          >
            {ch === " " ? "\u00A0" : ch}
          </motion.span>
        </span>
      ))}
    </span>
  )
}

export function Magnetic({ children, className = "", strength = 0.18 }) {
  const ref = useRef(null)
  const [delta, setDelta] = useState({ x: 0, y: 0 })
  const reduce = useReducedMotion()

  function onMove(e) {
    if (reduce) return
    const node = ref.current
    if (!node) return
    const r = node.getBoundingClientRect()
    const x = e.clientX - (r.left + r.width / 2)
    const y = e.clientY - (r.top + r.height / 2)
    setDelta({ x: x * strength, y: y * strength })
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      onMouseMove={onMove}
      onMouseLeave={() => setDelta({ x: 0, y: 0 })}
      animate={{ x: delta.x, y: delta.y }}
      transition={{ type: "spring", stiffness: 220, damping: 18, mass: 0.4 }}
    >
      {children}
    </motion.div>
  )
}

export function Tilt({ children, className = "", max = 5 }) {
  const ref = useRef(null)
  const [rot, setRot] = useState({ x: 0, y: 0 })
  const reduce = useReducedMotion()

  function onMove(e) {
    if (reduce) return
    const node = ref.current
    if (!node) return
    const r = node.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width - 0.5
    const py = (e.clientY - r.top) / r.height - 0.5
    setRot({ x: -(py * max * 2), y: px * max * 2 })
  }

  return (
    <div
      ref={ref}
      className={className}
      onMouseMove={onMove}
      onMouseLeave={() => setRot({ x: 0, y: 0 })}
      style={{ perspective: 900 }}
    >
      <motion.div
        className="h-full"
        animate={{ rotateX: rot.x, rotateY: rot.y }}
        transition={{ type: "spring", stiffness: 160, damping: 18, mass: 0.45 }}
        style={{ transformStyle: "preserve-3d" }}
      >
        {children}
      </motion.div>
    </div>
  )
}

export function StatBar({ label, value, delay = 0 }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-8% 0px" })
  return (
    <div ref={ref}>
      <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.16em] text-ink-soft">
        <span>{label}</span>
        <span className="text-oxide">{value}</span>
      </div>
      <div className="mt-1.5 h-1.5 overflow-hidden bg-white/10">
        <motion.div
          className="h-full bg-oxide shadow-[0_0_12px_rgba(200,240,77,0.65)]"
          initial={{ width: 0 }}
          animate={inView ? { width: `${value}%` } : { width: 0 }}
          transition={{ duration: 0.9, delay, ease }}
        />
      </div>
    </div>
  )
}

export function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 block font-display text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-soft">
        {label}
      </span>
      {children}
    </label>
  )
}

export const inputClass =
  "w-full border border-oxide/20 bg-paper px-3 py-2.5 text-sm text-ink outline-none transition placeholder:text-ink/30 focus:border-oxide focus:bg-chalk"

export function External({ href, children, className = "" }) {
  if (!href) return null
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={`ink-underline inline-flex items-center gap-1.5 ${className}`}
    >
      {children}
    </a>
  )
}
