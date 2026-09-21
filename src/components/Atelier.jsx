import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { useAtelier } from "../context/AtelierContext"
import { fetchGithubRepos, fetchGithubUser, repoToProject } from "../lib/github"
import { downloadJson } from "../lib/storage"
import { Field, inputClass, ease } from "./ui"

const tabs = [
  { id: "identity", label: "Identity" },
  { id: "constellation", label: "Profiles" },
  { id: "github", label: "GitHub" },
  { id: "plates", label: "Work" },
  { id: "tenure", label: "Exp" },
  { id: "school", label: "Edu" },
  { id: "feats", label: "Feats" },
]

export default function Atelier() {
  const ctx = useAtelier()
  const { open, setOpen, tab, setTab, data, setData, reset } = ctx

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[85] flex justify-end bg-black/60"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setOpen(false)}
        >
          <motion.aside
            className="relative flex h-full w-full max-w-[560px] flex-col border-l border-oxide/20 bg-chalk shadow-[-24px_0_80px_rgba(0,0,0,0.45)]"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.45, ease }}
            onClick={(e) => e.stopPropagation()}
          >
            <header className="flex items-start justify-between gap-4 border-b border-ink/8 px-8 py-5">
              <div>
                <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-brass">
                  Site settings
                </p>
                <h2 className="mt-1 font-display text-3xl tracking-tight">Console</h2>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-sm font-medium text-ink-soft hover:text-ink"
              >
                Close
              </button>
            </header>

            <div className="flex gap-1 overflow-x-auto border-b border-ink/8 px-4 py-2 hide-scrollbar">
              {tabs.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTab(t.id)}
                  className={`shrink-0 rounded-md px-3 py-1.5 text-[12px] font-medium ${
                    tab === t.id ? "bg-oxide text-paper" : "text-ink-soft hover:text-ink"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto px-8 py-6">
              {tab === "identity" && <IdentityForm />}
              {tab === "constellation" && <ProfilesForm />}
              {tab === "github" && <GithubImport />}
              {tab === "plates" && <PlatesForm />}
              {tab === "tenure" && <TenureForm />}
              {tab === "school" && <SchoolForm />}
              {tab === "feats" && <FeatsForm />}
            </div>

            <footer className="flex flex-wrap gap-2 border-t border-ink/8 px-6 py-4">
              <button
                type="button"
                onClick={() => downloadJson(data)}
                className="btn btn-secondary h-9 px-3 text-[12px]"
              >
                Export JSON
              </button>
              <label className="btn btn-secondary h-9 px-3 text-[12px]">
                Import JSON
                <input
                  type="file"
                  accept="application/json"
                  className="hidden"
                  onChange={async (e) => {
                    const file = e.target.files?.[0]
                    if (!file) return
                    const parsed = JSON.parse(await file.text())
                    setData(parsed)
                  }}
                />
              </label>
              <button
                type="button"
                onClick={reset}
                className="ml-auto px-3 py-2 text-[12px] font-medium text-ink-soft hover:text-ink"
              >
                Reset
              </button>
            </footer>
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function IdentityForm() {
  const { data, patchProfile } = useAtelier()
  const p = data.profile
  return (
    <div className="space-y-4">
      <Field label="First name">
        <input className={inputClass} value={p.first} onChange={(e) => patchProfile({ first: e.target.value, name: `${e.target.value} ${p.last}` })} />
      </Field>
      <Field label="Last name">
        <input className={inputClass} value={p.last} onChange={(e) => patchProfile({ last: e.target.value, name: `${p.first} ${e.target.value}` })} />
      </Field>
      <Field label="Role">
        <input className={inputClass} value={p.role} onChange={(e) => patchProfile({ role: e.target.value })} />
      </Field>
      <Field label="Location">
        <input className={inputClass} value={p.location} onChange={(e) => patchProfile({ location: e.target.value })} />
      </Field>
      <Field label="Email">
        <input className={inputClass} value={p.email} onChange={(e) => patchProfile({ email: e.target.value })} />
      </Field>
      <Field label="Phone">
        <input className={inputClass} value={p.phone} onChange={(e) => patchProfile({ phone: e.target.value })} />
      </Field>
      <Field label="Availability">
        <input className={inputClass} value={p.availability} onChange={(e) => patchProfile({ availability: e.target.value })} />
      </Field>
      <Field label="Kicker">
        <input className={inputClass} value={p.kicker} onChange={(e) => patchProfile({ kicker: e.target.value })} />
      </Field>
      <Field label="Summary">
        <textarea className={inputClass} rows={4} value={p.summary} onChange={(e) => patchProfile({ summary: e.target.value })} />
      </Field>
      <Field label="Longform">
        <textarea className={inputClass} rows={6} value={p.longform} onChange={(e) => patchProfile({ longform: e.target.value })} />
      </Field>
    </div>
  )
}

function ProfilesForm() {
  const { data, patchLinks } = useAtelier()
  const l = data.links
  return (
    <div className="space-y-4">
      <p className="text-sm leading-relaxed text-ink-soft">
        These open in a new tab from the header and contact section. Paste full URLs.
      </p>
      <Field label="GitHub profile">
        <input className={inputClass} placeholder="https://github.com/you" value={l.github} onChange={(e) => patchLinks({ github: e.target.value })} />
      </Field>
      <Field label="LinkedIn">
        <input className={inputClass} placeholder="https://linkedin.com/in/you" value={l.linkedin} onChange={(e) => patchLinks({ linkedin: e.target.value })} />
      </Field>
      <Field label="Devpost">
        <input className={inputClass} placeholder="https://devpost.com/you" value={l.devpost} onChange={(e) => patchLinks({ devpost: e.target.value })} />
      </Field>
      <Field label="Website">
        <input className={inputClass} placeholder="https://" value={l.website} onChange={(e) => patchLinks({ website: e.target.value })} />
      </Field>
      <Field label="YouTube channel">
        <input className={inputClass} placeholder="https://youtube.com/@you" value={l.youtube} onChange={(e) => patchLinks({ youtube: e.target.value })} />
      </Field>
    </div>
  )
}

function GithubImport() {
  const { data, patchGithub, upsertProjects, setTab } = useAtelier()
  const [username, setUsername] = useState(data.github.username)
  const [token, setToken] = useState(data.github.token)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState("")
  const [preview, setPreview] = useState([])
  const [includeForks, setIncludeForks] = useState(false)

  async function connect(e) {
    e.preventDefault()
    setBusy(true)
    setError("")
    try {
      const user = await fetchGithubUser(username.trim(), token.trim())
      const repos = await fetchGithubRepos(username.trim(), token.trim())
      patchGithub({
        username: user.login,
        token: token.trim(),
        connected: true,
        avatar: user.avatar_url,
        bio: user.bio || "",
      })
      setPreview(repos.map(repoToProject))
    } catch (err) {
      setError(err.message || "Could not reach GitHub.")
    } finally {
      setBusy(false)
    }
  }

  function importSelected() {
    const chosen = preview
      .filter((p) => includeForks || !p.fork)
      .sort((a, b) => b.stars - a.stars)
      .map((p, i) => ({ ...p, featured: i < 8 }))
    upsertProjects(chosen)
    setTab("plates")
  }

  return (
    <div className="space-y-5">
      <p className="text-sm leading-relaxed text-ink-soft">
        Connect a public GitHub user. Repos become builds — then add live URLs and YouTube demos on the Work tab. A token is optional and stays in this browser.
      </p>
      <form onSubmit={connect} className="space-y-4">
        <Field label="GitHub username">
          <input
            id="github-username"
            name="github-username"
            autoComplete="username"
            className={inputClass}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </Field>
        <Field label="Personal access token (optional)">
          <input className={inputClass} type="password" value={token} onChange={(e) => setToken(e.target.value)} placeholder="github_pat_…" />
        </Field>
        <button
          type="submit"
          disabled={busy}
          className="btn btn-primary disabled:opacity-60"
        >
          {busy ? "Fetching…" : "Fetch repositories"}
        </button>
      </form>
      {error && <p className="text-sm text-ink">{error}</p>}
      {data.github.connected && (
        <div className="flex items-center gap-3 rounded-sm border border-ink/10 bg-chalk/50 p-3">
          {data.github.avatar && (
            <img src={data.github.avatar} alt="" className="h-10 w-10 rounded-full" />
          )}
          <div>
            <p className="font-display text-lg">{data.github.username}</p>
            <p className="text-xs text-ink-soft">{data.github.bio}</p>
          </div>
        </div>
      )}
      {preview.length > 0 && (
        <div>
          <label className="mb-3 flex items-center gap-2 text-sm">
            <input type="checkbox" checked={includeForks} onChange={(e) => setIncludeForks(e.target.checked)} />
            Include forks
          </label>
          <ul className="max-h-56 space-y-2 overflow-y-auto text-sm">
            {preview.filter((p) => includeForks || !p.fork).map((p) => (
              <li key={p.id} className="flex justify-between gap-3 border-b border-ink/10 py-2">
                <span>{p.repoName || p.name}</span>
                <span className="font-mono text-[10px] text-brass">{p.stars}★</span>
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={importSelected}
            className="btn btn-accent mt-4"
          >
            Import builds
          </button>
        </div>
      )}
    </div>
  )
}

function PlatesForm() {
  const { data, setProjects } = useAtelier()

  function update(id, patch) {
    setProjects(data.projects.map((p) => (p.id === id ? { ...p, ...patch } : p)))
  }

  function addBlank() {
    setProjects([
      {
        id: `studio-${Date.now()}`,
        source: "studio",
        name: "Untitled build",
        client: "",
        year: String(new Date().getFullYear()),
        description: "",
        tech: [],
        github: "",
        live: "",
        youtube: "",
        devpost: "",
        image: "/fallback.svg",
        featured: true,
        confidential: false,
        stars: 0,
        metrics: [],
      },
      ...data.projects,
    ])
  }

  function remove(id) {
    setProjects(data.projects.filter((p) => p.id !== id))
  }

  return (
    <div className="space-y-6">
      <button
        type="button"
        onClick={addBlank}
        className="btn btn-secondary h-9 px-3 text-[12px]"
      >
        New build
      </button>
      {data.projects.map((p) => (
        <div key={p.id} className="space-y-3 border border-ink/10 bg-chalk/40 p-4">
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-xs">
              <input
                type="checkbox"
                checked={p.featured}
                onChange={(e) => update(p.id, { featured: e.target.checked })}
              />
              Feature on folio
            </label>
            <button type="button" onClick={() => remove(p.id)} className="text-[12px] font-medium text-ink-soft hover:text-ink">
              Remove
            </button>
          </div>
          <Field label="Title">
            <input className={inputClass} value={p.name} onChange={(e) => update(p.id, { name: e.target.value })} />
          </Field>
          <Field label="Description">
            <textarea className={inputClass} rows={3} value={p.description} onChange={(e) => update(p.id, { description: e.target.value })} />
          </Field>
          <Field label="Tech (comma separated)">
            <input
              className={inputClass}
              value={p.tech.join(", ")}
              onChange={(e) => update(p.id, { tech: e.target.value.split(",").map((t) => t.trim()).filter(Boolean) })}
            />
          </Field>
          <Field label="GitHub URL">
            <input className={inputClass} value={p.github} onChange={(e) => update(p.id, { github: e.target.value })} />
          </Field>
          <Field label="Live deployed URL">
            <input className={inputClass} value={p.live} onChange={(e) => update(p.id, { live: e.target.value })} />
          </Field>
          <Field label="YouTube demo URL">
            <input className={inputClass} value={p.youtube} onChange={(e) => update(p.id, { youtube: e.target.value })} />
          </Field>
          <Field label="Devpost URL">
            <input className={inputClass} value={p.devpost} onChange={(e) => update(p.id, { devpost: e.target.value })} />
          </Field>
        </div>
      ))}
    </div>
  )
}

function TenureForm() {
  const { data, setExperience } = useAtelier()

  function update(id, patch) {
    setExperience(data.experience.map((j) => (j.id === id ? { ...j, ...patch } : j)))
  }

  function add() {
    setExperience([
      ...data.experience,
      {
        id: `job-${Date.now()}`,
        company: "",
        role: "",
        location: "",
        start: "",
        end: "",
        bullets: [""],
      },
    ])
  }

  return (
    <div className="space-y-6">
      <button type="button" onClick={add} className="btn btn-secondary h-9 px-3 text-[12px]">
        Add role
      </button>
      {data.experience.map((job) => (
        <div key={job.id} className="space-y-3 border border-ink/10 p-4">
          <Field label="Company">
            <input className={inputClass} value={job.company} onChange={(e) => update(job.id, { company: e.target.value })} />
          </Field>
          <Field label="Role">
            <input className={inputClass} value={job.role} onChange={(e) => update(job.id, { role: e.target.value })} />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Start">
              <input className={inputClass} value={job.start} onChange={(e) => update(job.id, { start: e.target.value })} />
            </Field>
            <Field label="End">
              <input className={inputClass} value={job.end} onChange={(e) => update(job.id, { end: e.target.value })} />
            </Field>
          </div>
          <Field label="Location">
            <input className={inputClass} value={job.location} onChange={(e) => update(job.id, { location: e.target.value })} />
          </Field>
          <Field label="Bullets (one per line)">
            <textarea
              className={inputClass}
              rows={6}
              value={job.bullets.join("\n")}
              onChange={(e) => update(job.id, { bullets: e.target.value.split("\n") })}
            />
          </Field>
          <button
            type="button"
            onClick={() => setExperience(data.experience.filter((j) => j.id !== job.id))}
            className="text-[12px] font-medium text-ink-soft hover:text-ink"
          >
            Remove
          </button>
        </div>
      ))}
    </div>
  )
}

function SchoolForm() {
  const { data, setEducation } = useAtelier()

  function add() {
    setEducation([
      ...data.education,
      { id: `ed-${Date.now()}`, school: "", degree: "", years: "", note: "", detail: "", href: "" },
    ])
  }

  function update(id, patch) {
    setEducation(data.education.map((e) => (e.id === id ? { ...e, ...patch } : e)))
  }

  return (
    <div className="space-y-6">
      <p className="text-sm text-ink-soft">
        School, degree, years. Add another row if needed.
      </p>
      <button type="button" onClick={add} className="btn btn-secondary h-9 px-3 text-[12px]">
        Add school
      </button>
      {data.education.map((ed) => (
        <div key={ed.id} className="space-y-3 border border-ink/10 p-4">
          <Field label="Institution">
            <input className={inputClass} value={ed.school} onChange={(e) => update(ed.id, { school: e.target.value })} />
          </Field>
          <Field label="Degree">
            <input className={inputClass} value={ed.degree} onChange={(e) => update(ed.id, { degree: e.target.value })} />
          </Field>
          <Field label="Years">
            <input className={inputClass} value={ed.years} onChange={(e) => update(ed.id, { years: e.target.value })} />
          </Field>
          <Field label="Note">
            <input className={inputClass} value={ed.note} onChange={(e) => update(ed.id, { note: e.target.value })} />
          </Field>
          <Field label="GPA / honors">
            <input className={inputClass} value={ed.detail || ""} onChange={(e) => update(ed.id, { detail: e.target.value })} />
          </Field>
          <Field label="Certificate URL">
            <input className={inputClass} value={ed.href || ""} onChange={(e) => update(ed.id, { href: e.target.value })} />
          </Field>
          <button
            type="button"
            onClick={() => setEducation(data.education.filter((e) => e.id !== ed.id))}
            className="text-[12px] font-medium text-ink-soft hover:text-ink"
          >
            Remove
          </button>
        </div>
      ))}
    </div>
  )
}

function FeatsForm() {
  const { data, setAchievements } = useAtelier()

  function add() {
    setAchievements([
      ...data.achievements,
      {
        id: `feat-${Date.now()}`,
        title: "",
        org: "",
        year: "",
        rank: "A",
        featured: false,
        detail: "",
        href: "",
        hrefLabel: "View certificate",
      },
    ])
  }

  function update(id, patch) {
    setAchievements(data.achievements.map((item) => (item.id === id ? { ...item, ...patch } : item)))
  }

  return (
    <div className="space-y-6">
      <p className="text-sm text-ink-soft">Scholarships, certificates, and other trophies shown on the Feats section.</p>
      <button type="button" onClick={add} className="btn btn-secondary h-9 px-3 text-[12px]">
        Add feat
      </button>
      {(data.achievements || []).map((item) => (
        <div key={item.id} className="space-y-3 border border-ink/10 p-4">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={Boolean(item.featured)}
              onChange={(e) => update(item.id, { featured: e.target.checked })}
            />
            Featured
          </label>
          <Field label="Title">
            <input className={inputClass} value={item.title} onChange={(e) => update(item.id, { title: e.target.value })} />
          </Field>
          <Field label="Organization">
            <input className={inputClass} value={item.org} onChange={(e) => update(item.id, { org: e.target.value })} />
          </Field>
          <Field label="Year">
            <input className={inputClass} value={item.year} onChange={(e) => update(item.id, { year: e.target.value })} />
          </Field>
          <Field label="Rank">
            <input className={inputClass} value={item.rank || ""} onChange={(e) => update(item.id, { rank: e.target.value })} />
          </Field>
          <Field label="Detail">
            <textarea
              className={inputClass}
              rows={3}
              value={item.detail}
              onChange={(e) => update(item.id, { detail: e.target.value })}
            />
          </Field>
          <Field label="Certificate URL">
            <input className={inputClass} value={item.href || ""} onChange={(e) => update(item.id, { href: e.target.value })} />
          </Field>
          <Field label="Link label">
            <input
              className={inputClass}
              value={item.hrefLabel || ""}
              onChange={(e) => update(item.id, { hrefLabel: e.target.value })}
            />
          </Field>
          <button
            type="button"
            onClick={() => setAchievements(data.achievements.filter((feat) => feat.id !== item.id))}
            className="text-[12px] font-medium text-ink-soft hover:text-ink"
          >
            Remove
          </button>
        </div>
      ))}
    </div>
  )
}
