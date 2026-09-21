import { useAtelier } from "../context/AtelierContext"
import { Folio, Reveal } from "./ui"

const fallback = "/fallback.svg"

function ProjectMedia({ project, className = "" }) {
  return (
    <div className={`relative overflow-hidden bg-paper ${className}`}>
      <img
        src={project.image || fallback}
        alt=""
        className="h-full w-full object-cover object-center transition duration-700 group-hover:scale-[1.04]"
        onError={(e) => {
          e.currentTarget.src = fallback
        }}
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-paper via-paper/40 to-transparent" />
      {project.confidential && (
        <span className="absolute right-3 top-3 border border-gold/40 bg-paper/80 px-2.5 py-1 font-display text-[10px] font-semibold uppercase tracking-[0.16em] text-gold">
          Locked
        </span>
      )}
      {!project.confidential && project.youtube && (
        <span className="absolute right-3 top-3 z-[2] inline-flex items-center gap-1.5 border border-oxide/40 bg-paper/80 px-2.5 py-1 font-display text-[10px] font-semibold uppercase tracking-[0.16em] text-oxide">
          <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-oxide" />
          Replay
        </span>
      )}
    </div>
  )
}

function TechList({ tech, limit }) {
  const items = limit ? tech.slice(0, limit) : tech
  return (
    <ul className="flex flex-wrap gap-1.5">
      {items.map((t) => (
        <li key={t} className="chip">
          {t}
        </li>
      ))}
    </ul>
  )
}

function Links({ project }) {
  const hasLink = project.github || project.live || project.youtube || project.devpost
  const linkClass =
    "inline-flex items-center border border-oxide/25 px-3 py-1 font-display text-[10px] font-semibold uppercase tracking-[0.16em] text-oxide transition hover:border-oxide hover:bg-oxide/10"
  const items = [
    project.live && { href: project.live, label: "Play" },
    project.github && { href: project.github, label: "Source" },
    project.youtube && { href: project.youtube, label: "Replay" },
    project.devpost && { href: project.devpost, label: "Devpost" },
  ].filter(Boolean)

  if (!hasLink && project.confidential) {
    return <span className="text-[13px] text-ink-soft">Confidential mission</span>
  }

  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <a key={item.label} href={item.href} target="_blank" rel="noreferrer" className={linkClass}>
          {item.label}
        </a>
      ))}
    </div>
  )
}

export default function Work() {
  const { data, setActiveProject } = useAtelier()
  const plates = data.projects.filter((p) => p.featured)
  const lead = plates.find((p) => !p.confidential) || plates[0]
  const rest = plates.filter((p) => p.id !== lead?.id && !p.confidential)
  const internal = plates.filter((p) => p.confidential)

  return (
    <section id="plates" className="px-5 py-20 sm:px-8 lg:px-10 lg:py-28">
      <div className="mx-auto max-w-[1120px]">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <Folio n="05" label="Missions" />
            <Reveal>
              <h2 className="mt-6 max-w-xl font-display text-[2.2rem] font-semibold leading-[1.1] tracking-wide sm:text-5xl">
                Main quests.
              </h2>
            </Reveal>
          </div>
          <Reveal delay={0.08}>
            <p className="max-w-sm text-sm leading-relaxed text-ink-soft">
              Live builds you can launch. Agents, workplaces, and media tools — tap a card to inspect the loot.
            </p>
          </Reveal>
        </div>

        {plates.length === 0 ? (
          <p className="mt-10 text-sm text-ink-soft">No missions unlocked yet.</p>
        ) : (
          <div className="mt-10 space-y-5">
            {lead && (
              <Reveal>
                <article
                  data-cursor="hover"
                  className="group card card-live cut overflow-hidden hover:border-oxide/40 hover:shadow-[0_0_40px_rgba(200,240,77,0.12)]"
                >
                  <button
                    type="button"
                    onClick={() => setActiveProject(lead)}
                    className="block w-full text-left"
                  >
                    <div className="relative h-[22rem] sm:h-[26rem] lg:h-[30rem]">
                      <ProjectMedia project={lead} className="h-full w-full" />
                      <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8 lg:p-10">
                        <p className="font-display text-[11px] font-semibold uppercase tracking-[0.2em] text-oxide">
                          Mission 01 · {lead.tag || lead.client}
                        </p>
                        <h3 className="mt-3 font-display text-[2.2rem] font-semibold leading-[1.05] tracking-wide text-white sm:text-5xl">
                          {lead.name}
                        </h3>
                        <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-white/80">
                          {lead.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col gap-5 p-6 sm:flex-row sm:items-end sm:justify-between sm:p-8">
                      {lead.metrics?.length > 0 && (
                        <div className="grid flex-1 grid-cols-3 gap-3">
                          {lead.metrics.map((m) => (
                            <div key={m.label}>
                              <p className="font-display text-2xl font-semibold tracking-wide text-oxide">{m.value}</p>
                              <p className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.14em] text-ink-soft">
                                {m.label}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                      <TechList tech={lead.tech} limit={6} />
                    </div>
                  </button>
                  <div className="border-t border-oxide/10 px-6 py-4 sm:px-8">
                    <Links project={lead} />
                  </div>
                </article>
              </Reveal>
            )}

            {rest.length > 0 && (
              <div className="grid gap-5 lg:grid-cols-2">
                {rest.map((project, i) => (
                  <Reveal key={project.id} delay={i * 0.04}>
                    <article
                      data-cursor="hover"
                      className="group card card-live cut flex h-full flex-col overflow-hidden hover:border-oxide/40 hover:shadow-[0_0_28px_rgba(200,240,77,0.1)]"
                    >
                      <button
                        type="button"
                        onClick={() => setActiveProject(project)}
                        className="block w-full flex-1 text-left"
                      >
                        <div className="relative h-52 sm:h-60">
                          <ProjectMedia project={project} className="h-full w-full" />
                          <div className="absolute bottom-0 left-0 right-0 p-5">
                            <p className="font-display text-[10px] font-semibold uppercase tracking-[0.18em] text-oxide">
                              Mission {String(i + 2).padStart(2, "0")} · {project.tag || project.client}
                            </p>
                            <h3 className="mt-1.5 font-display text-[1.7rem] font-semibold leading-tight tracking-wide text-white">
                              {project.name}
                            </h3>
                          </div>
                        </div>
                        <div className="p-5">
                          <p className="text-sm leading-relaxed text-ink-soft">{project.description}</p>
                          <div className="mt-4">
                            <TechList tech={project.tech} limit={5} />
                          </div>
                        </div>
                      </button>
                      <div className="border-t border-oxide/10 px-5 py-3">
                        <Links project={project} />
                      </div>
                    </article>
                  </Reveal>
                ))}
              </div>
            )}

            {internal.map((project) => (
              <Reveal key={project.id}>
                <article className="group card card-live cut overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setActiveProject(project)}
                    className="grid w-full text-left lg:grid-cols-[0.7fr_1.3fr]"
                  >
                    <ProjectMedia project={project} className="h-44 min-h-[180px] lg:h-full" />
                    <div className="p-6 sm:p-8">
                      <p className="font-display text-[11px] font-semibold uppercase tracking-[0.18em] text-gold">
                        Side quest · {project.year}
                      </p>
                      <h3 className="mt-2 font-display text-[1.6rem] font-semibold tracking-wide">{project.name}</h3>
                      <p className="mt-3 text-sm leading-relaxed text-ink-soft">{project.description}</p>
                      <div className="mt-4">
                        <TechList tech={project.tech} />
                      </div>
                    </div>
                  </button>
                  <div className="border-t border-oxide/10 px-6 py-3 sm:px-8">
                    <Links project={project} />
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
