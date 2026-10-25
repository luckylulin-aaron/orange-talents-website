import { NextRequest } from 'next/server'
import { query, transaction } from '@/lib/db'
import { requireJobEditor, assertSameOrigin, apiError, HttpError } from '@/lib/access'
import { jobFields, validateJob } from '@/lib/jobs'
export const dynamic = 'force-dynamic'
export async function GET(request: NextRequest) {
 try { await requireJobEditor(request); return Response.json({ jobs: (await query('SELECT * FROM jobs ORDER BY updated_at DESC, id DESC')).rows }) }
 catch (e) { return apiError(e) }
}
export async function POST(request: NextRequest) {
 try {
  assertSameOrigin(request); const actor = await requireJobEditor(request)
  const input = await request.json(); const data = validateJob(input)
  const slug = typeof input.slug === 'string' ? input.slug.trim() : ''
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) || slug.length > 100) throw new HttpError(400, 'Use a URL name containing lowercase letters, numbers and hyphens.')
  const job = await transaction(async client => {
   const values = [slug, ...jobFields.map(k => data[k]), data.status]
   const result = await client.query('INSERT INTO jobs (slug,' + jobFields.join(',') + ',status,published_at) VALUES (' + values.map((_,i) => '$' + (i+1)).join(',') + ",CASE WHEN $" + values.length + " = 'published' THEN NOW() ELSE NULL END) RETURNING *", values)
   await client.query('INSERT INTO job_changes (job_id,actor_id,payload) VALUES ($1,$2,$3)', [result.rows[0].id,actor.id,JSON.stringify(result.rows[0])])
   return result.rows[0]
  })
  return Response.json({job}, {status:201})
 } catch (e) { if ((e as {code?:string}).code === '23505') return apiError(new HttpError(409,'This URL name already exists.')); return apiError(e) }
}
