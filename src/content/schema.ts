import { z } from 'zod'

export const profileSchema = z.object({
  name: z.string(),
  headline: z.string(),
  location: z.string().optional(),
  openToRelocation: z.boolean().optional(),
  email: z.string().email(),
  phone: z.string().optional(),
  links: z.object({
    github: z.string().url().optional(),
    linkedin: z.string().url().optional(),
  }),
  summary: z.string().optional(),
})

export type Profile = z.infer<typeof profileSchema>

export const experienceSchema = z.object({
  roles: z.array(
    z.object({
      company: z.string(),
      title: z.string(),
      location: z.string().optional(),
      start: z.string(),
      end: z.string().optional(),
      bullets: z.array(z.string()),
      tech: z.array(z.string()).optional(),
    }),
  ),
})

export type Experience = z.infer<typeof experienceSchema>

export const projectsSchema = z.object({
  projects: z.array(
    z.object({
      title: z.string(),
      slug: z.string(),
      date: z.string(),
      description: z.string(),
      highlights: z.array(z.string()).optional(),
      tech: z.array(z.string()).optional(),
      links: z.object({
        demo: z.string().nullable().optional(),
        source: z.string().nullable().optional(),
      }),
    }),
  ),
})

export type Projects = z.infer<typeof projectsSchema>

export const qualificationsSchema = z.object({
  education: z.array(
    z.object({
      school: z.string(),
      degree: z.string(),
      location: z.string().optional(),
      end: z.string().optional(),
      notes: z.array(z.string()).optional(),
    }),
  ),
  leadership: z
    .array(
      z.object({
        title: z.string(),
        org: z.string(),
        location: z.string().optional(),
        start: z.string().optional(),
        end: z.string().optional(),
        bullets: z.array(z.string()).optional(),
      }),
    )
    .optional(),
  skills: z.object({
    languagesAndWeb: z.array(z.string()).optional(),
    frameworksAndTools: z.array(z.string()).optional(),
    mlAndData: z.array(z.string()).optional(),
    cloudAndDevOps: z.array(z.string()).optional(),
    embeddedAndSystems: z.array(z.string()).optional(),
  }),
})

export type Qualifications = z.infer<typeof qualificationsSchema>


