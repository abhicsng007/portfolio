import { createContext, useContext, useEffect, useMemo, useState } from "react"
import { defaults } from "../data/defaults"
import { loadAtelier, saveAtelier, clearAtelier } from "../lib/storage"

const AtelierContext = createContext(null)

function fillBlanks(savedItem, fallback) {
  if (!fallback) return savedItem
  const next = { ...fallback, ...savedItem }
  for (const key of Object.keys(fallback)) {
    if (next[key] === "" || next[key] == null) next[key] = fallback[key]
  }
  return next
}

function mergeById(saved, fallback) {
  if (!saved?.length) return structuredClone(fallback)
  const savedById = new Map(saved.map((item) => [item.id, item]))
  const fallbackIds = new Set(fallback.map((item) => item.id))
  const merged = fallback.map((item) => fillBlanks(savedById.get(item.id) || {}, item))
  const extras = saved.filter((item) => !fallbackIds.has(item.id))
  return [...merged, ...extras]
}

function mergeProjects(saved, fallback) {
  if (!saved?.length) return structuredClone(fallback)
  const savedById = new Map(saved.map((item) => [item.id, item]))
  return fallback.map((item) => fillBlanks(savedById.get(item.id) || {}, item))
}

function mergeLoaded(saved) {
  if (!saved) return structuredClone(defaults)
  return {
    ...structuredClone(defaults),
    ...saved,
    profile: { ...defaults.profile, ...(saved.profile || {}) },
    links: fillBlanks(saved.links || {}, defaults.links),
    github: { ...defaults.github, ...(saved.github || {}) },
    skills: defaults.skills,
    experience: saved.experience ?? defaults.experience,
    education: mergeById(saved.education, defaults.education),
    achievements: mergeById(saved.achievements, defaults.achievements),
    projects: mergeProjects(saved.projects, defaults.projects),
  }
}

export function AtelierProvider({ children }) {
  const [data, setData] = useState(() => mergeLoaded(loadAtelier()))
  const [open, setOpen] = useState(false)
  const [tab, setTab] = useState("identity")
  const [activeProject, setActiveProject] = useState(null)

  useEffect(() => {
    saveAtelier(data)
  }, [data])

  useEffect(() => {
    document.body.classList.toggle("atelier-open", open)
  }, [open])

  const api = useMemo(
    () => ({
      data,
      setData,
      open,
      setOpen,
      tab,
      setTab,
      activeProject,
      setActiveProject,
      openTab: (next) => {
        setTab(next)
        setOpen(true)
      },
      patchProfile: (patch) =>
        setData((d) => ({ ...d, profile: { ...d.profile, ...patch } })),
      patchLinks: (patch) =>
        setData((d) => ({ ...d, links: { ...d.links, ...patch } })),
      patchGithub: (patch) =>
        setData((d) => ({ ...d, github: { ...d.github, ...patch } })),
      setExperience: (experience) => setData((d) => ({ ...d, experience })),
      setEducation: (education) => setData((d) => ({ ...d, education })),
      setAchievements: (achievements) => setData((d) => ({ ...d, achievements })),
      setProjects: (projects) => setData((d) => ({ ...d, projects })),
      upsertProjects: (incoming) =>
        setData((d) => {
          const map = new Map(d.projects.map((p) => [p.id, p]))
          incoming.forEach((p) => {
            const prev = map.get(p.id)
            map.set(p.id, prev ? { ...p, youtube: prev.youtube, devpost: prev.devpost, live: prev.live || p.live, featured: prev.featured ?? p.featured } : p)
          })
          return { ...d, projects: [...map.values()] }
        }),
      reset: () => {
        clearAtelier()
        setData(structuredClone(defaults))
      },
    }),
    [data, open, tab, activeProject],
  )

  return <AtelierContext.Provider value={api}>{children}</AtelierContext.Provider>
}

export function useAtelier() {
  const ctx = useContext(AtelierContext)
  if (!ctx) throw new Error("useAtelier must be used within AtelierProvider")
  return ctx
}
