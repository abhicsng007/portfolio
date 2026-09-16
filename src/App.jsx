import { useEffect, useState } from "react"
import { AnimatePresence } from "framer-motion"
import { AtelierProvider, useAtelier } from "./context/AtelierContext"
import { useLenis } from "./hooks/useLenis"
import Loader from "./components/Loader"
import Cursor from "./components/Cursor"
import Nav from "./components/Nav"
import Hero from "./components/Hero"
import Practice from "./components/Practice"
import Skills from "./components/Skills"
import Experience from "./components/Experience"
import Education from "./components/Education"
import Work from "./components/Work"
import Contact from "./components/Contact"
import Footer from "./components/Footer"
import Atelier from "./components/Atelier"
import ProjectModal from "./components/ProjectModal"

function Shell() {
  const { setOpen, open, activeProject } = useAtelier()
  useLenis(open || Boolean(activeProject))
  const [booting, setBooting] = useState(true)

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (reduce) setBooting(false)
    const t = setTimeout(() => setBooting(false), reduce ? 0 : 1800)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    const onKey = (e) => {
      const typing = ["INPUT", "TEXTAREA"].includes(e.target.tagName)
      if (e.key === "Escape") setOpen(false)
      if (
        (e.altKey && e.key.toLowerCase() === "a") ||
        (!typing && e.key === "a" && !e.metaKey && !e.ctrlKey && e.altKey)
      ) {
        e.preventDefault()
        setOpen((v) => !v)
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [setOpen])

  return (
    <div className="folio-shell relative min-h-svh">
      <div className="scan-layer" />
      <Cursor />
      <AnimatePresence>{booting && <Loader />}</AnimatePresence>
      <Nav />
      <main className="relative z-[1]">
        <Hero ready={!booting} />
        <Practice />
        <Skills />
        <Experience />
        <Education />
        <Work />
        <Contact />
      </main>
      <Footer />
      <Atelier />
      <ProjectModal />
    </div>
  )
}

export default function App() {
  return (
    <AtelierProvider>
      <Shell />
    </AtelierProvider>
  )
}
