import { query } from './db'
import { HttpError } from './access'
import type { Job } from './job-types'
export async function listPublishedJobs(): Promise<Job[]> {
  return (await query("SELECT * FROM jobs WHERE status = 'published' ORDER BY published_at DESC, id DESC")).rows
}
export async function findJob(slug: string): Promise<Job | null> {
  return (await query('SELECT * FROM jobs WHERE slug = $1', [slug])).rows[0] || null
}
export const jobFields = ['title','category','summary','responsibilities','requirements','next_steps','company_type','specialization','industry','job_function','job_type','contract_type','salary','location','region','consultant','contact_email','contact_phone','reference'] as const
export function validateJob(input: Record<string, unknown>): Record<string,string> {
  if (!input || typeof input !== 'object' || Array.isArray(input)) throw new HttpError(400,'Invalid job data.')
  const data: Record<string, string> = {}
  for (const key of jobFields) {
    const value = input[key] ?? ''
    const max = ['responsibilities','requirements','next_steps','summary'].includes(key) ? 12000 : 200
    if (typeof value !== 'string' || value.length > max || value.includes('\u0000')) throw new HttpError(400, 'Invalid field: ' + key)
    data[key] = value.trim()
  }
  if (!data.title) throw new HttpError(400, 'A job title is required.')
  if (data.contact_email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.contact_email)) throw new HttpError(400, 'Invalid contact email.')
  data.category ||= 'Opportunities'
  const status = input.status
  if (!['draft','published','closed'].includes(String(status))) throw new HttpError(400, 'Invalid job status.')
  if (status === 'published' && (!data.summary || !data.responsibilities || !data.requirements || !data.location))
    throw new HttpError(400, 'Fill in summary, responsibilities, requirements and location before publishing.')
  return { ...data, status: String(status) }
}
