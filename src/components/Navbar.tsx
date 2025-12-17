import { Container } from './Container'
import { Button } from './Button'
import { profile } from '../content/load'

export function Navbar() {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id)
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <header className="sticky top-0 z-40 border-b border-ink-900/10 bg-paper-50/85 backdrop-blur">
      <Container>
        <div className="flex h-16 items-center justify-between">
          <a href="/" className="font-semibold no-underline">
            <span className="inline-flex items-center gap-2">
              <span className="inline-block h-2.5 w-2.5 rounded-full bg-accent-violet" />
              <span>{profile.name}</span>
            </span>
          </a>
          <nav className="hidden items-center gap-2 sm:flex">
            <a
              className="rounded-lg px-3 py-2 text-sm no-underline hover:bg-paper-200"
              href="#projects"
              onClick={(e) => {
                e.preventDefault()
                scrollTo('projects')
              }}
            >
              Projects
            </a>
            <a
              className="rounded-lg px-3 py-2 text-sm no-underline hover:bg-paper-200"
              href="#experience"
              onClick={(e) => {
                e.preventDefault()
                scrollTo('experience')
              }}
            >
              Experience
            </a>
            <a
              className="rounded-lg px-3 py-2 text-sm no-underline hover:bg-paper-200"
              href="#qualifications"
              onClick={(e) => {
                e.preventDefault()
                scrollTo('qualifications')
              }}
            >
              Qualifications
            </a>
            <a
              className="rounded-lg px-3 py-2 text-sm no-underline hover:bg-paper-200"
              href="#contact"
              onClick={(e) => {
                e.preventDefault()
                scrollTo('contact')
              }}
            >
              Contact
            </a>
          </nav>
          <div className="flex items-center gap-2">
            <a className="inline-flex" href="/resume.pdf" download aria-label="Download resume PDF">
              <Button variant="ghost" type="button">
                Resume
              </Button>
            </a>
          </div>
        </div>
      </Container>
    </header>
  )
}


