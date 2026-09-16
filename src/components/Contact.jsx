import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { useAtelier } from "../context/AtelierContext"
import { External, Folio, Magnetic, Reveal } from "./ui"

export default function Contact() {
  const { profile, links, github } = useAtelier().data
  const [copied, setCopied] = useState("")
  const [form, setForm] = useState({ name: "", note: "" })

  const githubUrl = links.github || (github.username ? `https://github.com/${github.username}` : "")
  const profiles = [
    { href: githubUrl, label: "GitHub" },
    { href: links.linkedin, label: "LinkedIn" },
    { href: links.devpost, label: "Devpost" },
    { href: links.website, label: "Website" },
    { href: links.youtube, label: "YouTube" },
  ].filter((p) => p.href)

  function copy(value, key) {
    navigator.clipboard.writeText(value)
    setCopied(key)
    setTimeout(() => setCopied(""), 1600)
  }

  function mail(e) {
    e.preventDefault()
    const subject = encodeURIComponent(`Hello Abhishek — from ${form.name || "your portfolio"}`)
    const body = encodeURIComponent(form.note || "I saw the portfolio and wanted to connect.")
    window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`
  }

  return (
    <section id="post" className="px-5 py-20 sm:px-8 lg:px-10 lg:py-28">
      <div className="mx-auto max-w-[1120px]">
        <Folio n="05" label="Co-op" />
        <Reveal>
          <h2 className="mt-6 font-display text-[2.2rem] font-semibold leading-[1.1] tracking-wide sm:text-5xl lg:text-[3.2rem]">
            Invite to party.
          </h2>
        </Reveal>
        <Reveal delay={0.06}>
          <p className="mt-4 max-w-xl text-[17px] leading-relaxed text-ink-soft">
            Queue is open for full-time frontend roles. Drop a note — I’ll accept from inbox.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-8 lg:grid-cols-[1fr_0.9fr] lg:gap-14">
          <Reveal>
            <a
              href={`mailto:${profile.email}`}
              className="block font-display text-[1.35rem] font-semibold leading-tight tracking-wide sm:text-[1.65rem]"
            >
              {profile.email}
            </a>
            <a href={`tel:+91${profile.phone}`} className="mt-3 block text-lg tracking-tight sm:text-xl">
              {profile.phoneDisplay}
            </a>
            <p className="mt-3 font-mono text-[12px] uppercase tracking-[0.16em] text-ink-soft">
              Spawn · {profile.location}
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => copy(profile.email, "email")}
                className="btn btn-secondary h-10 px-4 text-[11px]"
              >
                <CopyLabel on={copied === "email"} idle="Copy email" />
              </button>
              <button
                type="button"
                onClick={() => copy(profile.phoneDisplay, "phone")}
                className="btn btn-secondary h-10 px-4 text-[11px]"
              >
                <CopyLabel on={copied === "phone"} idle="Copy phone" />
              </button>
            </div>

            {profiles.length > 0 && (
              <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2">
                {profiles.map((p) => (
                  <External
                    key={p.label}
                    href={p.href}
                    className="font-display text-[11px] font-semibold uppercase tracking-[0.16em] hover:text-oxide"
                  >
                    {p.label}
                  </External>
                ))}
              </div>
            )}
          </Reveal>

          <Reveal delay={0.08}>
            <form onSubmit={mail} className="card card-live cut overflow-hidden p-6 sm:p-8">
              <p className="font-display text-[11px] font-semibold uppercase tracking-[0.2em] text-oxide">
                Matchmaking
              </p>
              <label className="mt-5 block">
                <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-soft">Your name</span>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Player name"
                  className="mt-2 w-full border border-oxide/20 bg-paper px-3 py-2.5 text-sm outline-none transition placeholder:text-ink/30 focus:border-oxide"
                />
              </label>
              <label className="mt-5 block">
                <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-soft">Message</span>
                <textarea
                  rows={4}
                  value={form.note}
                  onChange={(e) => setForm({ ...form, note: e.target.value })}
                  placeholder="A short note about the role or raid."
                  className="mt-2 w-full resize-none border border-oxide/20 bg-paper px-3 py-2.5 text-sm outline-none transition placeholder:text-ink/30 focus:border-oxide"
                />
              </label>
              <Magnetic className="mt-6 inline-block">
                <button type="submit" className="btn btn-primary">
                  Send invite
                </button>
              </Magnetic>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

function CopyLabel({ on, idle }) {
  return (
    <span className="relative inline-grid place-items-center">
      <span className="invisible">{idle}</span>
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={on ? "copied" : idle}
          className="absolute inset-0 flex items-center justify-center"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.18 }}
        >
          {on ? "Copied" : idle}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}
