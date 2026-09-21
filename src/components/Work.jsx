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
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-paper via-paper/50 to-transparent" />
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
  const linkClass =
    "inline-flex items-center border border-oxide/25 px-3 py-1 font-display text-[10px] font-semibold uppercase tracking-[0.16em] text-oxide transition hover:border-oxide hover:bg-oxide/10"
  const items = [
    project.live && { href: project.live, label: "Play" },
    project.github && { href: project.github, label: "Source" },
    project.youtube && { href: project.youtube, label: "Replay" },
    project.devpost && { href: project.devpost, label: "Devpost" },
  ].filter(Boolean)

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
              Two live builds: a workplace simulation and a multi-agent media librarian. Tap a card for the full dossier.
            </p>
          </Reveal>
        </div>

        {plates.length === 0 ? (
          <p className="mt-10 text-sm text-ink-soft">No missions unlocked yet.</p>
        ) : (
          <div className="mt-10 grid gap-5 lg:grid-cols-2">
            {plates.map((project, i) => (
              <Reveal key={project.id} delay={i * 0.06}>
                <article
                  data-cursor="hover"
                  className="group card card-live cut flex h-full flex-col overflow-hidden hover:border-oxide/40 hover:shadow-[0_0_40px_rgba(200,240,77,0.12)]"
                >
                  <button
                    type="button"
                    onClick={() => setActiveProject(project)}
                    className="block w-full flex-1 text-left"
                  >
                    <div className="relative h-56 sm:h-64">
                      <ProjectMedia project={project} className="h-full w-full" />
                      <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                        <p className="font-display text-[11px] font-semibold uppercase tracking-[0.2em] text-oxide">
                          Mission {String(i + 1).padStart(2, "0")} · {project.tag || project.client}
                        </p>
                        <h3 className="mt-2 font-display text-[1.9rem] font-semibold leading-[1.05] tracking-wide text-white">
                          {project.name}
                        </h3>
                      </div>
                    </div>
                    <div className="flex flex-1 flex-col p-5 sm:p-6">
                      <p className="text-sm leading-relaxed text-ink-soft">{project.description}</p>
                      {project.highlights?.length > 0 && (
                        <ul className="mt-4 space-y-2">
                          {project.highlights.map((h) => (
                            <li key={h} className="flex gap-2.5 text-[13px] leading-relaxed text-ink-soft">
                              <span className="mt-0.5 font-display text-xs text-oxide">✓</span>
                              {h}
                            </li>
                          ))}
                        </ul>
                      )}
                      {project.metrics?.length > 0 && (
                        <div className="mt-5 grid grid-cols-3 gap-3">
                          {project.metrics.map((m) => (
                            <div key={m.label}>
                              <p className="font-display text-xl font-semibold tracking-wide text-oxide">{m.value}</p>
                              <p className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.14em] text-ink-soft">
                                {m.label}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                      <div className="mt-5">
                        <TechList tech={project.tech} />
                      </div>
                    </div>
                  </button>
                  <div className="border-t border-oxide/10 px-5 py-3 sm:px-6">
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
