import { Container } from './components/Container'
import { Footer } from './components/Footer'
import { Navbar } from './components/Navbar'
import { Button } from './components/Button'

function App() {
  return (
    <div className="min-h-screen bg-paper-50">
      <div className="pointer-events-none fixed inset-x-0 top-0 h-40 bg-gradient-to-b from-accent-violet/10 via-accent-cyan/5 to-transparent" />

      <Navbar />

      <main>
        <section className="py-16 sm:py-24">
          <Container>
            <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-ink-900/10 bg-paper-100 px-3 py-1 text-xs text-ink-900/70 shadow-soft">
                  <span className="inline-block h-2 w-2 rounded-full bg-accent-cyan" />
                  <span>Clean white theme • colorful accents • pixel companion coming next</span>
                </div>
                <h1 className="mt-6 text-balance text-4xl font-semibold tracking-tight text-ink-900 sm:text-5xl">
                  Hi, I’m <span className="text-accent-violet">Your Name</span>.
                </h1>
                <p className="mt-4 max-w-2xl text-pretty text-lg text-ink-900/70">
                  I build modern, reliable software. This portfolio will showcase my projects, experience, and qualifications—plus a
                  scroll-driven pixel character that ages with my timeline.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Button onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}>
                    View projects
                  </Button>
                  <Button variant="ghost" onClick={() => window.open('/resume.pdf', '_blank')}>
                    Open resume
                  </Button>
                </div>
              </div>

              <div className="rounded-3xl border border-ink-900/10 bg-paper-100 p-6 shadow-soft">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold">Highlights</span>
                  <span className="text-xs text-ink-900/60">coming from JSON</span>
                </div>
                <div className="mt-6 space-y-4">
                  <div className="rounded-2xl bg-paper-50 p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold">Top project</span>
                      <span className="text-xs text-accent-cyan">React • TS</span>
                    </div>
                    <p className="mt-2 text-sm text-ink-900/70">A short, punchy outcome-driven description.</p>
                  </div>
                  <div className="rounded-2xl bg-paper-50 p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold">Recent role</span>
                      <span className="text-xs text-accent-rose">Impact</span>
                    </div>
                    <p className="mt-2 text-sm text-ink-900/70">2–3 bullets highlighting measurable results.</p>
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </section>

        <section id="projects" className="py-16">
          <Container>
            <h2 className="text-2xl font-semibold tracking-tight">Projects</h2>
            <p className="mt-2 text-ink-900/70">This section will become a filterable grid backed by JSON.</p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="rounded-2xl border border-ink-900/10 bg-paper-100 p-5 shadow-soft">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold">Project #{i + 1}</span>
                    <span className="text-xs text-ink-900/60">2025</span>
                  </div>
                  <p className="mt-2 text-sm text-ink-900/70">Short description. Tags will be colorful chips.</p>
                </div>
              ))}
            </div>
          </Container>
        </section>

        <section id="experience" className="py-16">
          <Container>
            <h2 className="text-2xl font-semibold tracking-tight">Experience</h2>
            <p className="mt-2 text-ink-900/70">This will become a timeline with expandable details.</p>
          </Container>
        </section>

        <section id="qualifications" className="py-16">
          <Container>
            <h2 className="text-2xl font-semibold tracking-tight">Qualifications</h2>
            <p className="mt-2 text-ink-900/70">Education, certifications, and skills will render from JSON.</p>
          </Container>
        </section>

        <section id="contact" className="py-16">
          <Container>
            <div className="rounded-3xl border border-ink-900/10 bg-paper-100 p-8 shadow-soft sm:p-10">
              <h2 className="text-2xl font-semibold tracking-tight">Contact</h2>
              <p className="mt-2 text-ink-900/70">Add your email + social links here (from JSON).</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button onClick={() => (window.location.href = 'mailto:you@example.com')}>Email me</Button>
                <Button variant="ghost" onClick={() => window.open('https://github.com/', '_blank')}>
                  GitHub
                </Button>
                <Button variant="ghost" onClick={() => window.open('https://www.linkedin.com/', '_blank')}>
                  LinkedIn
                </Button>
              </div>
            </div>
          </Container>
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default App
