import { Container } from './Container'
import { profile } from '../content/load'

export function Footer() {
  return (
    <footer className="border-t border-ink-900/10">
      <Container>
        <div className="flex flex-col gap-2 py-10 text-sm text-ink-900/70 sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} {profile.name}</span>
          <span className="flex items-center gap-2">
            <span className="inline-block h-2 w-2 rounded-full bg-accent-cyan" />
            <span className="inline-block h-2 w-2 rounded-full bg-accent-lime" />
            <span className="inline-block h-2 w-2 rounded-full bg-accent-rose" />
          </span>
        </div>
      </Container>
    </footer>
  )
}


