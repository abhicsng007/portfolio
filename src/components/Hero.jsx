import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion"
import { useAtelier } from "../context/AtelierContext"
import { scrollToId } from "../hooks/useLenis"
import Schematic from "./Schematic"
import { Magnetic, SplitName, ease } from "./ui"

const SPARKS = [
  { l: "7%", t: "18%", d: "8s", delay: "0s" },
  { l: "16%", t: "68%", d: "11s", delay: "1.1s" },
  { l: "29%", t: "12%", d: "9s", delay: "0.4s" },
  { l: "44%", t: "82%", d: "10s", delay: "1.8s" },
  { l: "63%", t: "9%", d: "12s", delay: "0.7s" },
  { l: "76%", t: "48%", d: "9.5s", delay: "1.4s" },
  { l: "88%", t: "22%", d: "8.5s", delay: "0.2s" },
  { l: "92%", t: "71%", d: "13s", delay: "2.2s" },
]

export default function Hero({ ready = true }) {
  const { data } = useAtelier()
  const { profile, links, github } = data
  const reduce = useReducedMotion()
  const { scrollY } = useScroll()
  const schematicY = useTransform(scrollY, [0, 480], [0, reduce ? 0 : 48])

  const social = [
    { href: links.github || (github.username ? `https://github.com/${github.username}` : ""), label: "GitHub" },
    { href: links.linkedin, label: "LinkedIn" },
    { href: links.devpost, label: "Devpost" },
    { href: links.website, label: "Website" },
    { href: links.youtube, label: "YouTube" },
  ].filter((s) => s.href)

  return (
    <section
      id="index"
      className="relative flex min-h-[100svh] items-center px-5 pb-16 pt-24 sm:px-8 lg:px-10 lg:pb-20 lg:pt-28"
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        {SPARKS.map((spark) => (
          <span
            key={`${spark.l}-${spark.t}`}
            className="spark"
            style={{ left: spark.l, top: spark.t, animationDuration: spark.d, animationDelay: spark.delay }}
          />
        ))}
      </div>

      <div className="relative mx-auto grid w-full max-w-[1120px] items-stretch gap-8 lg:grid-cols-[1.12fr_0.88fr] lg:gap-10">
        <div className="flex flex-col justify-center py-4 lg:py-8">
          <motion.p
            className="font-display text-[12px] font-semibold uppercase tracking-[0.28em] text-oxide"
            initial={{ opacity: 0, y: 8 }}
            animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
            transition={{ delay: 0.12, ease }}
          >
            Class · {profile.role} · {profile.location}
          </motion.p>

          <h1 className="mt-5 overflow-hidden font-display text-[clamp(3rem,9vw,6.2rem)] font-semibold leading-[0.9] tracking-[0.02em] text-ink">
            <span className="block">
              <SplitName text={profile.first.toUpperCase()} delay={0.06} play={ready} />
            </span>
            <span className="hero-glow block text-oxide">
              <SplitName text={profile.last.toUpperCase()} delay={0.22} play={ready} />
            </span>
          </h1>

          <motion.p
            className="mt-7 max-w-xl text-[17px] leading-relaxed text-ink-soft sm:text-lg"
            initial={{ opacity: 0, y: 10 }}
            animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
            transition={{ delay: 0.5, duration: 0.55, ease }}
          >
            {profile.kicker}
          </motion.p>

          <motion.div
            className="mt-9 flex flex-wrap items-center gap-3"
            initial={{ opacity: 0, y: 10 }}
            animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
            transition={{ delay: 0.68, ease }}
          >
            <Magnetic>
              <a
                href="#plates"
                onClick={(e) => {
                  e.preventDefault()
                  scrollToId("#plates")
                }}
                className="btn btn-primary"
              >
                Enter missions
              </a>
            </Magnetic>
            <Magnetic>
              <a
                href="#post"
                onClick={(e) => {
                  e.preventDefault()
                  scrollToId("#post")
                }}
                className="btn btn-secondary"
              >
                Invite to party
              </a>
            </Magnetic>
          </motion.div>

          {social.length > 0 && (
            <div className="mt-8 flex flex-wrap gap-x-5 gap-y-2 font-display text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-soft">
              {social.map((s, i) => (
                <motion.a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  className="ink-underline hover:text-oxide"
                  initial={{ opacity: 0, y: 8 }}
                  animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
                  transition={{ delay: 0.82 + i * 0.06, duration: 0.4, ease }}
                >
                  {s.label}
                </motion.a>
              ))}
            </div>
          )}
        </div>

        <motion.div className="h-full" style={{ y: schematicY }}>
          <Schematic ready={ready} profile={profile} />
        </motion.div>
      </div>

      <a
        href="#practice"
        onClick={(e) => {
          e.preventDefault()
          scrollToId("#practice")
        }}
        className="absolute bottom-5 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 sm:flex"
        aria-label="Scroll to lore"
      >
        <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-ink-soft">Descend</span>
        <span className="scroll-cue block h-8 w-px bg-oxide" />
      </a>
    </section>
  )
}
