import { motion, useReducedMotion } from "framer-motion"
import { StatBar, Tilt, ease } from "./ui"

export default function Schematic({ ready, profile }) {
  const reduce = useReducedMotion()
  const stats = [
    { label: "React", value: 92 },
    { label: "Agentic AI", value: 88 },
    { label: "AWS / Bedrock", value: 84 },
    { label: "Delivery", value: 90 },
  ]

  return (
    <Tilt className="h-full">
      <motion.aside
        className="card cut relative flex h-full flex-col justify-between overflow-hidden p-6 text-ink sm:p-7"
        initial={{ opacity: 0, y: 16 }}
        animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
        transition={{ delay: 0.28, duration: 0.7, ease }}
      >
        <motion.div
          className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-oxide/15 blur-3xl"
          animate={
            reduce
              ? { opacity: 0.35, scale: 1 }
              : { opacity: [0.22, 0.5, 0.22], scale: [1, 1.14, 1] }
          }
          transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut" }}
        />

        <div className="relative">
          <div className="flex items-center justify-between gap-3">
            <p className="font-display text-[11px] font-semibold uppercase tracking-[0.22em] text-cyan">
              Player card
            </p>
            <span className="inline-flex items-center gap-2 border border-oxide/30 bg-oxide/10 px-2.5 py-1 font-display text-[10px] font-semibold uppercase tracking-[0.16em] text-oxide">
              <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-oxide" />
              {profile?.availability || "Online"}
            </span>
          </div>

          <div className="mt-5 flex items-end justify-between gap-4">
            <div>
              <p className="font-display text-5xl font-semibold tracking-wide text-oxide">LV.04</p>
              <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.16em] text-ink-soft">
                {profile?.role || "Frontend engineer"}
              </p>
            </div>
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-gold">Rank S</p>
          </div>

          <div className="mt-5">
            <div className="flex justify-between font-mono text-[10px] uppercase tracking-[0.16em] text-ink-soft">
              <span>XP to next role</span>
              <span className="text-oxide">72%</span>
            </div>
            <div className="mt-1.5 h-2 overflow-hidden bg-white/10">
              <motion.div
                className="h-full w-[72%] origin-left bg-gradient-to-r from-oxide to-cyan shadow-[0_0_12px_rgba(200,240,77,0.6)]"
                initial={{ scaleX: 0 }}
                animate={ready ? { scaleX: 1 } : { scaleX: 0 }}
                transition={{ duration: 1.1, delay: 0.45, ease }}
              />
            </div>
          </div>
        </div>

        <div className="relative mt-8 space-y-3">
          {stats.map((s, i) => (
            <StatBar key={s.label} label={s.label} value={s.value} delay={0.15 + i * 0.08} />
          ))}
        </div>

        <dl className="relative mt-8 grid grid-cols-2 gap-4 border-t border-oxide/15 pt-5">
          <div>
            <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-soft">Spawn</dt>
            <dd className="mt-1 text-sm">{profile?.location}</dd>
          </div>
          <div>
            <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-soft">Cooldown</dt>
            <dd className="mt-1 text-sm">Immediate</dd>
          </div>
        </dl>
      </motion.aside>
    </Tilt>
  )
}
