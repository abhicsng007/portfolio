import { useEffect, useState } from "react"
import { AnimatePresence, motion, useScroll, useSpring } from "framer-motion"
import { useAtelier } from "../context/AtelierContext"
import { scrollToId } from "../hooks/useLenis"
import { ease } from "./ui"

const items = [
  { href: "#practice", n: "01", label: "Lore" },
  { href: "#instruments", n: "02", label: "Loadout" },
  { href: "#tenure", n: "03", label: "Campaign" },
  { href: "#plates", n: "04", label: "Missions" },
  { href: "#post", n: "05", label: "Co-op" },
]

export default function Nav() {
  const { data } = useAtelier()
  const [menu, setMenu] = useState(false)
  const [active, setActive] = useState("")
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 28, mass: 0.3 })

  useEffect(() => {
    const sections = items.map((item) => document.querySelector(item.href)).filter(Boolean)
    if (!sections.length) return undefined
    const obs = new IntersectionObserver(
      (entries) => {
        const hit = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (hit) setActive(`#${hit.target.id}`)
      },
      { rootMargin: "-35% 0px -50% 0px", threshold: [0, 0.2, 0.45, 0.7] },
    )
    sections.forEach((el) => obs.observe(el))
    return () => obs.disconnect()
  }, [])

  return (
    <>
      <motion.header
        className="fixed inset-x-0 top-0 z-40 border-b border-oxide/15 bg-paper/80 backdrop-blur-md"
        initial={{ y: -28, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease, delay: 0.15 }}
      >
        <div className="mx-auto flex max-w-[1120px] items-center justify-between gap-4 px-5 py-3 sm:px-8 lg:px-10">
          <a
            href="#index"
            onClick={(e) => {
              e.preventDefault()
              scrollToId("#index")
            }}
            className="group flex items-center gap-2.5"
          >
            <span className="flex h-8 w-8 items-center justify-center bg-oxide font-display text-[13px] font-bold text-paper transition duration-300 group-hover:shadow-[0_0_18px_rgba(200,240,77,0.55)]">
              AC
            </span>
            <span className="font-display text-[12px] font-semibold uppercase tracking-[0.18em]">
              <span className="hidden sm:inline">Player_01</span>
              <span className="sm:hidden">AC</span>
            </span>
          </a>

          <nav className="hidden items-center gap-6 lg:flex">
            {items.map((item) => {
              const on = active === item.href
              return (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault()
                    scrollToId(item.href)
                  }}
                  className={`relative font-display text-[11px] font-semibold uppercase tracking-[0.16em] transition ${
                    on ? "text-oxide" : "text-ink-soft hover:text-oxide"
                  }`}
                >
                  <span className="mr-1.5 text-cyan">{item.n}</span>
                  {item.label}
                  {on && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute -bottom-1 left-0 h-px w-full bg-oxide"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                </a>
              )
            })}
          </nav>

          <div className="flex items-center gap-3">
            {data.profile.availability && (
              <span className="hidden items-center gap-2 border border-oxide/30 bg-oxide/10 px-3 py-1 font-display text-[11px] font-semibold uppercase tracking-[0.16em] text-oxide sm:inline-flex">
                <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-oxide" />
                Online
              </span>
            )}
            <a
              href="#post"
              onClick={(e) => {
                e.preventDefault()
                scrollToId("#post")
              }}
              className="btn btn-primary hidden h-9 px-4 text-[11px] lg:inline-flex"
            >
              Invite
            </a>
            <button
              type="button"
              className="border border-oxide/30 px-3 py-1.5 font-display text-[11px] font-semibold uppercase tracking-[0.16em] lg:hidden"
              onClick={() => setMenu(true)}
            >
              Map
            </button>
          </div>
        </div>
        <motion.div className="absolute inset-x-0 bottom-0 h-px origin-left bg-oxide" style={{ scaleX }} />
      </motion.header>

      <AnimatePresence>
        {menu && (
          <motion.div
            className="fixed inset-0 z-[60] flex flex-col overflow-y-auto bg-paper px-6 pt-24 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease }}
          >
            <button
              type="button"
              className="absolute right-5 top-5 font-display text-[11px] font-semibold uppercase tracking-[0.2em] text-oxide"
              onClick={() => setMenu(false)}
            >
              Close
            </button>
            {items.map((item, i) => (
              <motion.a
                key={item.href}
                href={item.href}
                onClick={(e) => {
                  e.preventDefault()
                  setMenu(false)
                  scrollToId(item.href)
                }}
                className="flex items-baseline justify-between border-b border-oxide/15 py-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.04 * i, ease }}
              >
                <span className="font-display text-4xl font-semibold uppercase tracking-wide">{item.label}</span>
                <span className="font-mono text-sm text-cyan">{item.n}</span>
              </motion.a>
            ))}
            <a
              href="#post"
              onClick={(e) => {
                e.preventDefault()
                setMenu(false)
                scrollToId("#post")
              }}
              className="btn btn-primary mt-8 w-full"
            >
              Invite to party
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
