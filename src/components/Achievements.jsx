import { useAtelier } from "../context/AtelierContext"
import { External, Folio, Reveal } from "./ui"

export default function Achievements() {
  const { achievements = [] } = useAtelier().data
  const lead = achievements.find((item) => item.featured) || achievements[0]
  const rest = achievements.filter((item) => item.id !== lead?.id)

  return (
    <section id="feats" className="px-5 py-20 sm:px-8 lg:px-10 lg:py-28">
      <div className="mx-auto max-w-[1120px]">
        <Folio n="04" label="Feats" />
        <Reveal>
          <h2 className="mt-6 max-w-2xl font-display text-[2.2rem] font-semibold leading-[1.1] tracking-wide sm:text-5xl">
            Unlocked trophies.
          </h2>
        </Reveal>

        {achievements.length === 0 ? (
          <p className="mt-10 text-sm text-ink-soft">No feats unlocked yet.</p>
        ) : (
          <div className="mt-10 space-y-5">
            {lead && (
              <Reveal>
                <article className="card card-live cut overflow-hidden p-6 sm:p-8">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="font-display text-[11px] font-semibold uppercase tracking-[0.2em] text-oxide">
                      Featured feat · {lead.year}
                    </p>
                    <span className="border border-gold/40 bg-gold/10 px-2.5 py-0.5 font-display text-[10px] font-semibold uppercase tracking-[0.16em] text-gold">
                      Rank {lead.rank || "S"}
                    </span>
                  </div>
                  <h3 className="mt-4 font-display text-[1.7rem] font-semibold leading-tight tracking-wide sm:text-[2rem]">
                    {lead.title}
                  </h3>
                  <p className="mt-2 text-sm text-ink-soft">{lead.org}</p>
                  <p className="mt-4 max-w-3xl text-[16px] leading-relaxed text-ink">{lead.detail}</p>
                  {lead.href && (
                    <div className="mt-6">
                      <External
                        href={lead.href}
                        className="font-display text-[11px] font-semibold uppercase tracking-[0.16em] text-oxide"
                      >
                        {lead.hrefLabel || "View certificate"}
                      </External>
                    </div>
                  )}
                </article>
              </Reveal>
            )}

            {rest.length > 0 && (
              <div className="grid gap-4 md:grid-cols-3">
                {rest.map((item, i) => (
                  <Reveal key={item.id} delay={i * 0.04}>
                    <article className="card card-live cut h-full p-5 sm:p-6">
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-soft">{item.year}</p>
                        <span className="border border-gold/30 bg-gold/10 px-2 py-0.5 font-display text-[10px] font-semibold uppercase tracking-[0.14em] text-gold">
                          {item.rank || "A"}
                        </span>
                      </div>
                      <h3 className="mt-3 font-display text-[1.25rem] font-semibold leading-tight tracking-wide">
                        {item.title}
                      </h3>
                      <p className="mt-1.5 text-sm text-ink-soft">{item.org}</p>
                      <p className="mt-3 text-sm leading-relaxed text-ink-soft">{item.detail}</p>
                      {item.href && (
                        <div className="mt-4">
                          <External
                            href={item.href}
                            className="font-display text-[10px] font-semibold uppercase tracking-[0.16em] text-oxide"
                          >
                            {item.hrefLabel || "View certificate"}
                          </External>
                        </div>
                      )}
                    </article>
                  </Reveal>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
