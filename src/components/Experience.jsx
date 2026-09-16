import { motion } from "framer-motion"
import { useAtelier } from "../context/AtelierContext"
import { Folio, Reveal, ease } from "./ui"

const list = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.08 } },
}

const item = {
  hidden: { opacity: 0, x: -10 },
  show: { opacity: 1, x: 0, transition: { duration: 0.45, ease } },
}

export default function Experience() {
  const { experience } = useAtelier().data

  return (
    <section id="tenure" className="px-5 py-20 sm:px-8 lg:px-10 lg:py-28">
      <div className="mx-auto max-w-[1120px]">
        <Folio n="03" label="Campaign" />
        <Reveal>
          <h2 className="mt-6 font-display text-[2.2rem] font-semibold leading-[1.1] tracking-wide sm:text-5xl">
            Completed quests.
          </h2>
        </Reveal>

        <div className="mt-10 space-y-4">
          {experience.map((job) => (
            <Reveal key={job.id}>
              <article className="card card-live cut overflow-hidden p-6 sm:p-8">
                <div className="grid gap-6 lg:grid-cols-[220px_1fr] lg:gap-12">
                  <div>
                    <p className="inline-flex items-center gap-2 border border-oxide/30 bg-oxide/10 px-2 py-0.5 font-display text-[10px] font-semibold uppercase tracking-[0.16em] text-oxide">
                      <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-oxide" />
                      Quest complete
                    </p>
                    <p className="mt-4 font-mono text-[12px] text-ink-soft">
                      {job.start} — {job.end}
                    </p>
                    <p className="mt-3 font-display text-[1.45rem] font-semibold leading-tight tracking-wide">
                      {job.company}
                    </p>
                    <p className="mt-1.5 text-sm text-ink-soft">{job.location}</p>
                    <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.16em] text-gold">XP +2400</p>
                  </div>
                  <div>
                    <h3 className="font-display text-[1.7rem] font-semibold tracking-wide">{job.role}</h3>
                    <motion.ul
                      className="mt-5 space-y-3"
                      variants={list}
                      initial="hidden"
                      whileInView="show"
                      viewport={{ once: true, margin: "-8%" }}
                    >
                      {job.bullets.map((b) => (
                        <motion.li
                          key={b}
                          variants={item}
                          className="flex gap-3 text-[15px] leading-relaxed text-ink-soft"
                        >
                          <span className="mt-0.5 font-display text-xs text-oxide">✓</span>
                          {b}
                        </motion.li>
                      ))}
                    </motion.ul>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
