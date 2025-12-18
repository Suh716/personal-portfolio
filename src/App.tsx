import { Container } from './components/Container'
import { Footer } from './components/Footer'
import { Navbar } from './components/Navbar'
import { Button } from './components/Button'
import { PixelCompanion } from './components/PixelCompanion'
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
  const { ageProgress, scrollProgress } = useScrollAge()

  return (
    <div className="relative min-h-screen bg-paper-50">
      <div className="pointer-events-none fixed inset-x-0 top-0 h-40 bg-gradient-to-b from-accent-violet/10 via-accent-cyan/5 to-transparent" />

      <Navbar />
      <PixelCompanion ageProgress={ageProgress} scrollProgress={scrollProgress} />

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
                  Hi, I’m <span className="text-accent-violet">{profile.name}</span>.
                </h1>
                <p className="mt-4 max-w-2xl text-pretty text-lg text-ink-900/70">{profile.summary}</p>
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

              <div className="rounded-3xl border border-ink-900/10 bg-paper-100 p-6 shadow-soft">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold">Highlights</span>
                </div>
                <div className="mt-6 space-y-4">
                  <div className="rounded-2xl bg-paper-50 p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold">{projects.projects[0]?.title ?? 'Top project'}</span>
                    </div>
                    <p className="mt-2 text-sm text-ink-900/70">
                      {projects.projects[0]?.description ?? 'A short, punchy outcome-driven description.'}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-paper-50 p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold">{experience.roles[0]?.title ?? 'Recent role'}</span>
                    </div>
                    <p className="mt-2 text-sm text-ink-900/70">
                      {(experience.roles[0]?.bullets ?? [])[0] ?? '2–3 bullets highlighting measurable results.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </section>

        <section id="experience" className="py-16">
          <Container>
            <h2 className="text-2xl font-semibold tracking-tight">Experience</h2>
            <p className="mt-2 text-ink-900/70">Recent roles and impact.</p>
            <div className="mt-6 space-y-4">
              {experience.roles.map((r) => (
                <article
                  key={`${r.company}-${r.title}-${r.start}`}
                  className="rounded-2xl border border-ink-900/10 bg-paper-100 p-5 shadow-soft"
                >
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
              ))}
            </div>
          </Container>
        </section>

        <section id="projects" className="py-16">
          <Container>
            <h2 className="text-2xl font-semibold tracking-tight">Projects</h2>
            <p className="mt-2 text-ink-900/70">Selected projects from my resume.</p>
            <div className="mt-6 space-y-4">
              {projects.projects.map((p) => (
                <article key={p.slug} className="rounded-2xl border border-ink-900/10 bg-paper-100 p-5 shadow-soft">
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
              ))}
            </div>
          </Container>
        </section>

        <section id="qualifications" className="py-16">
          <Container>
            <h2 className="text-2xl font-semibold tracking-tight">Qualifications</h2>
            <p className="mt-2 text-ink-900/70">Education, leadership, and skills.</p>
            <div className="mt-6 space-y-4">
              <div className="rounded-2xl border border-ink-900/10 bg-paper-100 p-5 shadow-soft">
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
              <div className="rounded-2xl border border-ink-900/10 bg-paper-100 p-5 shadow-soft">
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
            </div>
          </Container>
        </section>

        <section id="contact" className="py-16">
          <Container>
            <div className="rounded-3xl border border-ink-900/10 bg-paper-100 p-8 shadow-soft sm:p-10">
              <h2 className="text-2xl font-semibold tracking-tight">Contact</h2>
              <p className="mt-2 text-ink-900/70">Reach out — I’m happy to chat.</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button onClick={() => (window.location.href = `mailto:${profile.email}`)}>Email me</Button>
                <Button variant="ghost" onClick={() => window.open(profile.links.github ?? 'https://github.com/', '_blank')}>
                  GitHub
                </Button>
                <Button variant="ghost" onClick={() => window.open(profile.links.linkedin ?? 'https://www.linkedin.com/', '_blank')}>
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
