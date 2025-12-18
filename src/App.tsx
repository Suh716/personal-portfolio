import { Container } from './components/Container'
import { Footer } from './components/Footer'
import { Navbar } from './components/Navbar'
import { Button } from './components/Button'
import { PixelCompanion } from './components/PixelCompanion'
import { RevealOnScroll } from './components/RevealOnScroll'
import backgroundVideo from './assets/backgroundvideo.mp4'
import { useScrollAge } from './hooks/useScrollAge'
import { experience, profile, projects, qualifications } from './content/load'

const formatMonthYear = (iso: string | undefined | null): string => {
  if (!iso) return ''
  const [year, month] = iso.split('-')
  if (!year || !month) return iso
  const mm = month.padStart(2, '0')
  return `${mm}/${year}`
}

function App() {
  const { ageProgress, scrollProgress, scrollY } = useScrollAge()
  const parallaxOffset = -scrollY * 0.15

  return (
    <div className="relative min-h-screen">
      <video
        className="fixed inset-0 z-[-20] h-full w-full object-cover"
        src={backgroundVideo}
        autoPlay
        muted
        loop
        playsInline
      />
      <div
        className="pointer-events-none fixed inset-0 z-[-10] bg-gradient-to-b from-ink-900/80 via-ink-900/50 to-ink-900/90"
        style={{ transform: `translateY(${parallaxOffset}px)` }}
      />

      <Navbar />
      <PixelCompanion ageProgress={ageProgress} scrollProgress={scrollProgress} />

      <main>
        <section className="py-16 sm:py-24">
          <Container>
            <div className="grid gap-10 lg:grid-cols-[1.2fr] lg:items-center">
              <div className="hover-card rounded-3xl border border-ink-900/10 bg-paper-50/95 p-6 shadow-soft sm:p-10">
                <h1 className="text-balance text-4xl font-semibold tracking-tight text-ink-900 sm:text-5xl">
                  Hi, I’m <span className="text-accent-violet">{profile.name}</span>.
                </h1>
                <p className="mt-4 max-w-2xl text-pretty text-lg text-ink-900/80">{profile.summary}</p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Button onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}>
                    View projects
                  </Button>
                  <a className="inline-flex" href={`${import.meta.env.BASE_URL}resume.pdf`} download aria-label="Download resume PDF">
                    <Button variant="ghost" type="button">
                      Download resume
                    </Button>
                  </a>
                </div>
              </div>
            </div>
          </Container>
        </section>

        <section id="experience" className="py-16 motion-safe:animate-fade-in-up">
          <Container>
            <RevealOnScroll>
              <h2 className="text-2xl font-semibold tracking-tight">Experience</h2>
              <p className="mt-2 text-ink-900/70">Recent roles and impact.</p>
              <div className="mt-6 space-y-4">
                {experience.roles.map((r, index) => (
                  <RevealOnScroll key={`${r.company}-${r.title}-${r.start}`} delayMs={index * 80}>
                    <article className="hover-card rounded-2xl border border-ink-900/10 bg-paper-100 p-5 shadow-soft">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <h3 className="text-sm font-semibold">
                            {r.title} · {r.company}
                          </h3>
                          <p className="mt-1 text-xs text-ink-900/60">
                            {r.location ? `${r.location} · ` : ''}
                            {formatMonthYear(r.start)} – {r.end ? formatMonthYear(r.end) : 'Present'}
                          </p>
                        </div>
                      </div>
                      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-ink-900/70">
                        {r.bullets.map((b) => (
                          <li key={b}>{b}</li>
                        ))}
                      </ul>
                      {r.tech?.length ? (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {r.tech.slice(0, 14).map((t) => (
                            <span
                              key={t}
                              className="rounded-full border border-ink-900/10 bg-paper-50 px-2.5 py-1 text-xs text-ink-900/70"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      ) : null}
                    </article>
                  </RevealOnScroll>
                ))}
              </div>
            </RevealOnScroll>
          </Container>
        </section>

        <section id="projects" className="py-16 motion-safe:animate-fade-in-up">
          <Container>
            <RevealOnScroll>
              <h2 className="text-2xl font-semibold tracking-tight">Projects</h2>
              <p className="mt-2 text-ink-900/70">Selected projects from my resume.</p>
              <div className="mt-6 space-y-4">
                {projects.projects.map((p, index) => (
                  <RevealOnScroll key={p.slug} delayMs={index * 80}>
                    <article className="hover-card rounded-2xl border border-ink-900/10 bg-paper-100 p-5 shadow-soft">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <h3 className="text-sm font-semibold">{p.title}</h3>
                        <span className="text-xs text-ink-900/60">{formatMonthYear(p.date)}</span>
                      </div>
                      {p.highlights?.length ? (
                        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-ink-900/70">
                          {p.highlights.map((h) => (
                            <li key={h}>{h}</li>
                          ))}
                        </ul>
                      ) : (
                        <p className="mt-2 text-sm text-ink-900/70">{p.description}</p>
                      )}
                      {p.tech?.length ? (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {p.tech.slice(0, 8).map((t) => (
                            <span
                              key={t}
                              className="rounded-full border border-ink-900/10 bg-paper-50 px-2.5 py-1 text-xs text-ink-900/70"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      ) : null}
                    </article>
                  </RevealOnScroll>
                ))}
              </div>
            </RevealOnScroll>
          </Container>
        </section>

        <section id="qualifications" className="py-16 motion-safe:animate-fade-in-up">
          <Container>
            <RevealOnScroll>
              <h2 className="text-2xl font-semibold tracking-tight">Qualifications</h2>
              <p className="mt-2 text-ink-900/70">Education, leadership, and skills.</p>
            </RevealOnScroll>
            <div className="mt-6 space-y-4">
              <RevealOnScroll>
                <div className="hover-card rounded-2xl border border-ink-900/10 bg-paper-100 p-5 shadow-soft">
                  <h3 className="text-sm font-semibold">Education</h3>
                  <div className="mt-3 space-y-3">
                    {qualifications.education.map((e) => (
                      <div key={`${e.school}-${e.degree}`} className="rounded-xl bg-paper-50 p-4">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span className="text-sm font-semibold">{e.school}</span>
                          <span className="text-xs text-ink-900/60">{formatMonthYear(e.end)}</span>
                        </div>
                        <p className="mt-1 text-sm text-ink-900/70">{e.degree}</p>
                        {(() => {
                          if (!e.notes?.length) return null
                          const courseworkNote =
                            e.notes.find((note) => note.toLowerCase().includes('coursework')) ?? e.notes[0]
                          const cleaned = courseworkNote.replace(/^[Rr]elevant Coursework:\s*/, '')
                          const courses = cleaned
                            .split(',')
                            .map((c) => c.trim())
                            .filter(Boolean)
                          if (!courses.length) return null
                          return (
                            <div className="mt-3">
                              <div className="text-xs font-semibold uppercase tracking-wide text-ink-900/60">
                                Coursework
                              </div>
                              <div className="mt-2 flex flex-wrap gap-2">
                                {courses.map((course) => (
                                  <span
                                    key={course}
                                    className="rounded-full border border-ink-900/10 bg-paper-50 px-2.5 py-1 text-xs text-ink-900/70"
                                  >
                                    {course}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )
                        })()}
                      </div>
                    ))}
                  </div>
                </div>
              </RevealOnScroll>
              <RevealOnScroll delayMs={80}>
                <div className="hover-card rounded-2xl border border-ink-900/10 bg-paper-100 p-5 shadow-soft">
                  <h3 className="text-sm font-semibold">Skills</h3>
                  <div className="mt-3 space-y-4 text-sm">
                    {Object.entries(qualifications.skills).map(([k, arr]) => (
                      <div key={k}>
                        <div className="text-xs font-semibold uppercase tracking-wide text-ink-900/60">{k}</div>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {(arr ?? []).slice(0, 14).map((s) => (
                            <span
                              key={s}
                              className="rounded-full border border-ink-900/10 bg-paper-50 px-2.5 py-1 text-xs text-ink-900/70"
                            >
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </RevealOnScroll>
            </div>
          </Container>
        </section>

        <section id="contact" className="py-16 motion-safe:animate-fade-in-up">
          <Container>
            <RevealOnScroll>
              <div className="hover-card rounded-3xl border border-ink-900/10 bg-paper-100 p-8 shadow-soft sm:p-10">
                <h2 className="text-2xl font-semibold tracking-tight">Contact</h2>
                <p className="mt-2 text-ink-900/70">Reach out — I’m happy to chat.</p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Button onClick={() => (window.location.href = `mailto:${profile.email}`)}>Email me</Button>
                  <Button
                    variant="ghost"
                    onClick={() => window.open(profile.links.github ?? 'https://github.com/', '_blank')}
                  >
                    GitHub
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => window.open(profile.links.linkedin ?? 'https://www.linkedin.com/', '_blank')}
                  >
                    LinkedIn
                  </Button>
                </div>
              </div>
            </RevealOnScroll>
          </Container>
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default App
