import { transaction } from '@/lib/db'
import { currentAccount, assertSameOrigin, HttpError, apiError } from '@/lib/access'
import { boundedFormData, validateResume } from '@/lib/resume'
import { mailConfigured, deliverApplication } from '@/lib/mail'
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { verifyToken } from '@/lib/auth'

type AuthPayload = { userId: number }

const PHASE_STEPS = [
  { key: 'applied', label: 'Applied', statuses: ['submitted', 'applied'] },
  { key: 'resume_screening_passed', label: 'Resume screening passed', statuses: ['resume_screening_passed'] },
  { key: 'interviewing', label: 'Interviewing', statuses: ['interviewing', 'interview'] },
  {
    key: 'rejected_offered',
    label: 'Rejected / offered',
    statuses: ['rejected', 'offered', 'rejected_offered'],
  },
  { key: 'onboarding', label: 'Onboarding', statuses: ['onboarding'] },
] as const

async function getAuthUserId(request: NextRequest): Promise<number | null> {
  try {
    const token = request.cookies.get('auth_token')?.value
    if (!token) return null
    const payload = verifyToken<AuthPayload>(token)
    return payload.userId
  } catch {
    return null
  }
}

function mapStatusToPhase(status: string) {
  const normalized = String(status ?? '').toLowerCase()

  const idx = PHASE_STEPS.findIndex((step) => step.statuses.some((s) => s.toLowerCase() === normalized))
  if (idx === -1) return { phaseIndex: 0, phaseKey: 'applied', phaseLabel: 'Applied' }

  const step = PHASE_STEPS[idx]
  return { phaseIndex: idx, phaseKey: step.key, phaseLabel: step.label }
}

export async function GET(request: NextRequest) {
  const userId = await getAuthUserId(request)
  if (!userId) {
    return NextResponse.json({ applications: [] }, { status: 401 })
  }

  const result = await query(
    `SELECT id, job_link, job_title, job_category, cover_letter, status, created_at, delivery_status, resume_name
     FROM job_applications
     WHERE account_id = $1
     ORDER BY created_at DESC`,
    [userId],
  )

  const applications = result.rows.map((row) => {
    const { phaseIndex, phaseKey, phaseLabel } = mapStatusToPhase(row.status)
    return { ...row, phaseIndex, phaseKey, phaseLabel }
  })

  return NextResponse.json({ applications }, { status: 200 })
}


export async function POST(request: NextRequest) {
 try {
  assertSameOrigin(request); const account = await currentAccount(request)
  if (!mailConfigured()) throw new HttpError(503,'Applications are temporarily unavailable. Please try again later.')
  const form = await boundedFormData(request)
  const link = form.get('jobLink'); const intro = form.get('coverLetter') || ''
  if (typeof link !== 'string' || !/^\/jobs\/[a-z0-9]+(?:-[a-z0-9]+)*$/.test(link)) throw new HttpError(400,'Invalid job.')
  if (form.get('confirmed') !== 'true') throw new HttpError(400,'Please confirm the job before applying.')
  if (typeof intro !== 'string' || intro.length > 6000 || intro.includes('\u0000')) throw new HttpError(400,'Introduction must be 6000 characters or fewer.')
  const resume = await validateResume(form.get('resume'))
  const application = await transaction(async client => {
   // Serialize submissions per account to enforce rate limits across processes.
   await client.query('SELECT id FROM accounts WHERE id=$1 FOR UPDATE',[account.id])
   const job = (await client.query("SELECT * FROM jobs WHERE slug=$1 AND status='published' FOR SHARE",[link.slice(6)])).rows[0]
   if (!job) throw new HttpError(410,'This job is no longer accepting applications.')
   const duplicate = await client.query('SELECT id FROM job_applications WHERE account_id=$1 AND job_link=$2',[account.id,link])
   if (duplicate.rows.length) throw new HttpError(409,'You have already applied for this job. See Applications in your account.')
   const count = await client.query("SELECT COUNT(*) AS total FROM job_applications WHERE account_id=$1 AND created_at>NOW()-INTERVAL '1 day'",[account.id])
   if (Number(count.rows[0].total)>=20) throw new HttpError(429,'Daily application limit reached. Please try again tomorrow.')
   const record = (await client.query("INSERT INTO job_applications (account_id,job_link,job_title,job_category,cover_letter,status,resume_name,delivery_status) VALUES ($1,$2,$3,$4,$5,'submitted',$6,'pending') RETURNING id,job_link,job_title,status,created_at,delivery_status,resume_name",
    [account.id,link,job.title,job.category,intro.trim(),resume.name])).rows[0]
   await client.query('INSERT INTO application_mail (application_id,applicant_email,applicant_name,resume_name,resume_type,resume_bytes) VALUES ($1,$2,$3,$4,$5,$6)',
    [record.id,account.email,account.name || account.email,resume.name,resume.type,resume.bytes])
   return record
  })
  // The durable record survives mail failure. A scheduled worker retries known failures.
  try { await deliverApplication(application.id) } catch { /* Remains queued or marked sending; worker will flag stale claims. */ }
  const delivery = (await query('SELECT delivery_status FROM job_applications WHERE id=$1',[application.id])).rows[0]
  return NextResponse.json({application:{...application,...delivery}}, {status:201})
 } catch(e) {
  if ((e as {code?:string}).code==='23505') return apiError(new HttpError(409,'You have already applied for this job.'))
  return apiError(e)
 }
}
