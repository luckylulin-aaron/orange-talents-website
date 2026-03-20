import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { verifyToken } from '@/lib/auth'

type AuthPayload = { userId: number }

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

export async function GET(request: NextRequest) {
  const userId = await getAuthUserId(request)
  if (!userId) {
    return NextResponse.json({ applications: [] }, { status: 401 })
  }

  const result = await query(
    `SELECT job_link, job_title, job_category, cover_letter, status, created_at
     FROM job_applications
     WHERE account_id = $1
     ORDER BY created_at DESC`,
    [userId],
  )

  return NextResponse.json({ applications: result.rows }, { status: 200 })
}

export async function POST(request: NextRequest) {
  const userId = await getAuthUserId(request)
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { jobLink, jobTitle, jobCategory, coverLetter } = await request.json()

    if (!jobLink) {
      return NextResponse.json({ error: 'jobLink is required.' }, { status: 400 })
    }

    const result = await query(
      `INSERT INTO job_applications (account_id, job_link, job_title, job_category, cover_letter, status)
       VALUES ($1, $2, $3, $4, $5, 'submitted')
       ON CONFLICT (account_id, job_link) DO UPDATE
         SET job_title = EXCLUDED.job_title,
             job_category = EXCLUDED.job_category,
             cover_letter = EXCLUDED.cover_letter,
             status = EXCLUDED.status,
             created_at = NOW()
       RETURNING job_link, job_title, job_category, cover_letter, status, created_at`,
      [userId, jobLink, jobTitle ?? null, jobCategory ?? null, coverLetter ?? null],
    )

    return NextResponse.json({ application: result.rows[0] }, { status: 201 })
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error in /api/job-applications POST', error)
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 })
  }
}

