import { useAtelier } from "../context/AtelierContext"
import { scrollToId } from "../hooks/useLenis"
import { Reveal } from "./ui"

export default function Footer() {
  const { data } = useAtelier()
  return (
    <footer className="relative z-[1] border-t border-oxide/15 px-5 py-8 sm:px-8 lg:px-10">
      <Reveal>
        <div className="mx-auto flex max-w-[1120px] flex-wrap items-center justify-between gap-4">
          <div>
            <p className="font-display text-[12px] font-semibold uppercase tracking-[0.18em]">
              Player_01 · {data.profile.name}
            </p>
            <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.14em] text-ink-soft">
              {data.profile.role} · {data.profile.location} · {new Date().getFullYear()}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-5 font-display text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-soft">
            <a href={`mailto:${data.profile.email}`} className="ink-underline hover:text-oxide">
              {data.profile.email}
            </a>
            <a
              href="#index"
              onClick={(e) => {
                e.preventDefault()
                scrollToId("#index")
              }}
              className="ink-underline hover:text-oxide"
            >
              Continue?
            </a>
          </div>
        </div>
      </Reveal>
    </footer>
  )
}
