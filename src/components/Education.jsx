import { useAtelier } from "../context/AtelierContext"
import { CountUp, Folio, Magnetic, Reveal } from "./ui"

export default function Education() {
  const { data, openTab } = useAtelier()
  const { education } = data

  return (
    <section id="school" className="px-5 py-20 sm:px-8 lg:px-10 lg:py-28">
      <div className="mx-auto max-w-[1120px]">
        <Folio n="★" label="Rank" />
        <Reveal>
          <h2 className="mt-6 font-display text-[2.2rem] font-semibold leading-[1.1] tracking-wide sm:text-5xl">
            Academy rank.
          </h2>
        </Reveal>

        {education.length === 0 ? (
          <Reveal delay={0.1}>
            <div className="card cut mt-8 max-w-xl p-8">
              <p className="font-display text-2xl font-semibold tracking-wide">No rank unlocked.</p>
              <p className="mt-3 text-sm text-ink-soft">Add records from the console (Alt + A).</p>
              <Magnetic className="mt-6 inline-block">
                <button type="button" onClick={() => openTab("school")} className="btn btn-primary">
                  Add education
                </button>
              </Magnetic>
            </div>
          </Reveal>
        ) : (
          <div className="mt-10 space-y-4">
            {education.map((ed) => (
              <Reveal key={ed.id}>
                <article className="card card-live cut grid gap-4 overflow-hidden p-6 sm:p-8 lg:grid-cols-[1fr_auto] lg:items-center">
                  <div>
                    <p className="font-mono text-[12px] text-ink-soft">{ed.years}</p>
                    <h3 className="mt-2 font-display text-[1.5rem] font-semibold leading-tight tracking-wide">
                      {ed.school}
                    </h3>
                    {ed.degree && <p className="mt-2 text-[16px] text-ink">{ed.degree}</p>}
                    {ed.note && <p className="mt-1.5 text-sm text-ink-soft">{ed.note}</p>}
                  </div>
                  {(ed.grade || ed.detail) && (
                    <div className="border border-gold/30 bg-gold/10 px-5 py-4 text-center lg:min-w-[150px]">
                      {ed.grade ? (
                        <>
                          <p className="font-display text-[11px] font-semibold uppercase tracking-[0.2em] text-gold">
                            Rank S+
                          </p>
                          <p className="mt-1 font-display text-4xl font-semibold tabular-nums text-oxide">
                            {Number.isFinite(Number(ed.grade)) ? (
                              <CountUp to={Number(ed.grade)} decimals={String(ed.grade).includes(".") ? 2 : 0} />
                            ) : (
                              ed.grade
                            )}
                          </p>
                          <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.16em] text-ink-soft">
                            GPA / {ed.gradeScale || "10"}
                          </p>
                        </>
                      ) : (
                        <p className="text-sm">{ed.detail}</p>
                      )}
                    </div>
                  )}
                </article>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
