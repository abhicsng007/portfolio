import { useAtelier } from "../context/AtelierContext"
import { CountUp, Folio, Reveal } from "./ui"

export default function Practice() {
  const { profile } = useAtelier().data

  const stats = [
    { render: () => <CountUp to={2} pad={2} />, label: "Years in production", tag: "LVL" },
    { render: () => <CountUp to={30} suffix="%" />, label: "UI performance lift", tag: "ATK" },
    { render: () => <CountUp to={4500} />, label: "of 100k+ AWS applicants", tag: "RNK" },
    { render: () => "0d", label: "Notice period", tag: "SPD" },
  ]

  return (
    <section id="practice" className="px-5 py-20 sm:px-8 lg:px-10 lg:py-28">
      <div className="mx-auto max-w-[1120px]">
        <Folio n="01" label="Lore" />
        <div className="mt-6 grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
          <Reveal>
            <h2 className="font-display text-[2.2rem] font-semibold leading-[1.1] tracking-wide sm:text-5xl lg:text-[3.2rem]">
              Interfaces and agents that hold up{" "}
              <span className="text-oxide">after the demo.</span>
            </h2>
          </Reveal>
          <div>
            <Reveal delay={0.08}>
              <p className="text-[17px] leading-relaxed text-ink-soft">{profile.longform}</p>
            </Reveal>
            <Reveal delay={0.16}>
              <p className="mt-5 text-base leading-relaxed text-ink-soft">{profile.summary}</p>
            </Reveal>
          </div>
        </div>

        <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={0.05 * i}>
              <div className="card card-live cut h-full px-5 py-5">
                <p className="font-display text-[11px] font-semibold uppercase tracking-[0.2em] text-cyan">{s.tag}</p>
                <p className="mt-2 font-display text-3xl font-semibold tracking-wide text-oxide tabular-nums lg:text-[2rem]">
                  {s.render()}
                </p>
                <p className="mt-2 text-[13px] leading-snug text-ink-soft">{s.label}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
