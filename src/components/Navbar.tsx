import { Container } from './Container'
import { Button } from './Button'

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-ink-900/10 bg-paper-50/85 backdrop-blur">
      <Container>
        <div className="flex h-16 items-center justify-between">
          <a href="/" className="font-semibold no-underline">
            <span className="inline-flex items-center gap-2">
              <span className="inline-block h-2.5 w-2.5 rounded-full bg-accent-violet" />
              <span>Portfolio</span>
            </span>
          </a>
          <nav className="hidden items-center gap-2 sm:flex">
            <a className="rounded-lg px-3 py-2 text-sm no-underline hover:bg-paper-200" href="#projects">
              Projects
            </a>
            <a className="rounded-lg px-3 py-2 text-sm no-underline hover:bg-paper-200" href="#experience">
              Experience
            </a>
            <a className="rounded-lg px-3 py-2 text-sm no-underline hover:bg-paper-200" href="#qualifications">
              Qualifications
            </a>
            <a className="rounded-lg px-3 py-2 text-sm no-underline hover:bg-paper-200" href="#contact">
              Contact
            </a>
          </nav>
          <div className="flex items-center gap-2">
            <Button variant="ghost" onClick={() => window.open('/resume.pdf', '_blank')}>
              Resume
            </Button>
          </div>
        </div>
      </Container>
    </header>
  )
}


