import { useAtelier } from "../context/AtelierContext"
import { Folio, Reveal, StatBar } from "./ui"

const rarity = {
  Frontend: { rank: "S", label: "Legendary", xp: 92 },
  Backend: { rank: "A", label: "Rare", xp: 70 },
  Data: { rank: "B", label: "Uncommon", xp: 62 },
  DevOps: { rank: "A", label: "Rare", xp: 78 },
  "Agentic AI": { rank: "S", label: "Legendary", xp: 88 },
  Quality: { rank: "B", label: "Uncommon", xp: 68 },
  "AI APIs": { rank: "A", label: "Rare", xp: 74 },
}

export default function Skills() {
  const { skills } = useAtelier().data

  return (
    <section id="instruments" className="px-5 py-20 sm:px-8 lg:px-10 lg:py-28">
      <div className="mx-auto max-w-[1120px]">
        <Folio n="02" label="Loadout" />
        <Reveal>
          <h2 className="mt-6 max-w-2xl font-display text-[2.2rem] font-semibold leading-[1.1] tracking-wide sm:text-5xl">
            Equipped stack.
          </h2>
        </Reveal>

        <div className="mt-10 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {skills.map((group, i) => {
            const r = rarity[group.drawer] || { rank: "A", label: "Rare", xp: 70 }
            return (
              <Reveal key={group.drawer} delay={i * 0.04}>
                <article className="card card-live cut h-full overflow-hidden p-6 hover:border-oxide/40 hover:shadow-[0_0_28px_rgba(200,240,77,0.12)]">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-mono text-[11px] text-cyan">{group.index}</p>
                    <span className="border border-gold/40 bg-gold/10 px-2 py-0.5 font-display text-[10px] font-semibold uppercase tracking-[0.16em] text-gold">
                      {r.rank} · {r.label}
                    </span>
                  </div>
                  <h3 className="mt-4 font-display text-[1.55rem] font-semibold tracking-wide">{group.drawer}</h3>
                  <div className="mt-4">
                    <StatBar label="Mastery" value={r.xp} delay={0.1} />
                  </div>
                  <ul className="mt-5 flex flex-wrap gap-1.5">
                    {group.items.map((item) => (
                      <li key={item} className="chip">
                        {item}
                      </li>
                    ))}
                  </ul>
                </article>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
