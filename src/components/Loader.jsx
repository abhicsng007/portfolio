import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { ease } from "./ui"

const phrases = ["Loading world…", "Binding HUD…", "Syncing loadout…"]

export default function Loader() {
  const [tick, setTick] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setTick((n) => n + 1), 520)
    return () => clearInterval(id)
  }, [])

  const phrase = phrases[tick % phrases.length]

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-paper"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease }}
    >
      <div className="w-[min(420px,86vw)] text-center">
        <motion.p
          className="font-display text-[11px] font-semibold uppercase tracking-[0.32em] text-oxide"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          Spawning player
        </motion.p>
        <motion.p
          className="mt-4 font-display text-4xl font-semibold tracking-wide text-ink flicker sm:text-5xl"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12, duration: 0.5, ease }}
        >
          AC_01
        </motion.p>
        <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.2em] text-ink-soft">
          Lv. 04 · Frontend engineer
        </p>
        <div className="mt-8 h-2 overflow-hidden bg-white/10">
          <motion.div
            className="h-full bg-oxide shadow-[0_0_16px_rgba(200,240,77,0.8)]"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 1.35, ease }}
          />
        </div>
        <div className="relative mt-3 h-4">
          <AnimatePresence mode="wait">
            <motion.p
              key={phrase}
              className="absolute inset-x-0 font-mono text-[10px] uppercase tracking-[0.22em] text-cyan"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.22, ease }}
            >
              {phrase}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  )
}
