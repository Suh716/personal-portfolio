import profileJson from './profile.json'
import experienceJson from './experience.json'
import projectsJson from './projects.json'
import qualificationsJson from './qualifications.json'
import { experienceSchema, profileSchema, projectsSchema, qualificationsSchema } from './schema'

export const profile = profileSchema.parse(profileJson)
export const experience = experienceSchema.parse(experienceJson)
export const projects = projectsSchema.parse(projectsJson)
export const qualifications = qualificationsSchema.parse(qualificationsJson)


