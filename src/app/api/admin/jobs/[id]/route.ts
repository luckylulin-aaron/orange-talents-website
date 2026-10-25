import { NextRequest } from 'next/server'
import { transaction } from '@/lib/db'
import { requireJobEditor, assertSameOrigin, apiError, HttpError } from '@/lib/access'
import { jobFields, validateJob } from '@/lib/jobs'
export async function PATCH(request: NextRequest, {params}: {params:{id:string}}) {
 try {
  assertSameOrigin(request); const actor = await requireJobEditor(request)
  const input = await request.json(); const data = validateJob(input)
  const id = Number(params.id)
  if (!Number.isSafeInteger(id) || id < 1 || !Number.isSafeInteger(input.version)) throw new HttpError(400,'Invalid job or version.')
  const job = await transaction(async client => {
   const values = [...jobFields.map(k => data[k]),data.status,id,input.version]
   const statusIndex = jobFields.length+1
   const result = await client.query('UPDATE jobs SET ' + jobFields.map((k,i)=>k+'=$'+(i+1)).join(',') +
    ',status=$'+statusIndex+",published_at=CASE WHEN $"+statusIndex+"='published' THEN COALESCE(published_at,NOW()) ELSE published_at END,version=version+1,updated_at=NOW() WHERE id=$"+(statusIndex+1)+' AND version=$'+(statusIndex+2)+' RETURNING *',values)
   if (!result.rows[0]) throw new HttpError(409,'This job was changed by someone else. Reload the list before editing again.')
   await client.query('INSERT INTO job_changes (job_id,actor_id,payload) VALUES ($1,$2,$3)',[id,actor.id,JSON.stringify(result.rows[0])])
   return result.rows[0]
  })
  return Response.json({job})
 } catch(e) { return apiError(e) }
}
