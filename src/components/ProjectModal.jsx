import { useEffect } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { useAtelier } from "../context/AtelierContext"
import { youtubeEmbed } from "../lib/youtube"
import { External, ease } from "./ui"

export default function ProjectModal() {
  const { activeProject, setActiveProject } = useAtelier()
  const project = activeProject
  const embed = project ? youtubeEmbed(project.youtube) : ""

  useEffect(() => {
    if (!project) return undefined
    document.body.classList.add("modal-open")
    const onKey = (e) => {
      if (e.key === "Escape") setActiveProject(null)
    }
    window.addEventListener("keydown", onKey)
    return () => {
      document.body.classList.remove("modal-open")
      window.removeEventListener("keydown", onKey)
    }
  }, [project, setActiveProject])

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          className="fixed inset-0 z-[80] flex items-end justify-center bg-paper/70 p-3 backdrop-blur-sm sm:items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setActiveProject(null)}
        >
          <motion.article
            className="card cut relative max-h-[92vh] w-full max-w-3xl overflow-y-auto"
            initial={{ y: 36, opacity: 0, scale: 0.97 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 24, opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.42, ease }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-oxide/15 bg-paper/95 px-4 py-2.5">
              <p className="font-display text-[10px] font-semibold uppercase tracking-[0.18em] text-oxide">
                {embed ? "Mission replay" : "Mission dossier"}
              </p>
              <button
                type="button"
                onClick={() => setActiveProject(null)}
                className="border border-oxide bg-paper px-3 py-1.5 font-display text-[10px] font-semibold uppercase tracking-[0.16em] text-oxide"
              >
                Close
              </button>
            </div>
            {embed ? (
              <div className="relative aspect-video max-h-[240px] w-full overflow-hidden bg-paper-deep sm:max-h-[320px]">
                <img
                  src={project.image || "/fallback.svg"}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <iframe
                  key={project.id}
                  title={`${project.name} demo`}
                  src={`${embed}?rel=0`}
                  className="relative h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
            ) : (
              <div className="relative h-56 overflow-hidden bg-paper sm:h-64">
                <img
                  src={project.image || "/fallback.svg"}
                  alt=""
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = "/fallback.svg"
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-paper/80 to-transparent" />
              </div>
            )}
            <div className="p-6 sm:p-8">
              <p className="font-display text-[11px] font-semibold uppercase tracking-[0.2em] text-oxide">
                {project.tag || project.client} · {project.year}
              </p>
              <h3 className="mt-2 font-display text-[2rem] font-semibold tracking-wide">{project.name}</h3>
              <div className="mt-4 flex flex-wrap gap-5 font-display text-[11px] font-semibold uppercase tracking-[0.16em]">
                <External href={project.live} className="text-oxide">
                  Play live
                </External>
                <External href={project.github} className="text-ink">
                  Source
                </External>
                <External href={project.youtube} className="text-ink">
                  Replay
                </External>
                <External href={project.devpost}>Devpost</External>
              </div>
              <p className="mt-4 leading-relaxed text-ink-soft">{project.description}</p>

              {project.highlights?.length > 0 && (
                <ul className="mt-5 space-y-2.5">
                  {project.highlights.map((h) => (
                    <li key={h} className="flex gap-3 text-[15px] leading-relaxed text-ink-soft">
                      <span className="mt-0.5 font-display text-xs text-oxide">✓</span>
                      {h}
                    </li>
                  ))}
                </ul>
              )}

              {project.metrics?.length > 0 && (
                <div className="mt-6 grid grid-cols-3 gap-3">
                  {project.metrics.map((m) => (
                    <div key={m.label} className="border border-oxide/15 bg-paper px-3 py-3">
                      <p className="font-display text-2xl font-semibold text-oxide">{m.value}</p>
                      <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-soft">{m.label}</p>
                    </div>
                  ))}
                </div>
              )}

              <ul className="mt-6 flex flex-wrap gap-1.5">
                {project.tech.map((t) => (
                  <li key={t} className="chip">
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </motion.article>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
