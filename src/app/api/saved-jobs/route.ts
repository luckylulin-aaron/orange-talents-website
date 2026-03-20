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
    return NextResponse.json({ savedJobs: [] }, { status: 401 })
  }

  const result = await query(
    `SELECT job_link, job_title, job_category, saved_at
     FROM saved_jobs
     WHERE account_id = $1
     ORDER BY saved_at DESC`,
    [userId],
  )

  return NextResponse.json({ savedJobs: result.rows }, { status: 200 })
}

export async function POST(request: NextRequest) {
  const userId = await getAuthUserId(request)
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { jobLink, jobTitle, jobCategory } = await request.json()

    if (!jobLink) {
      return NextResponse.json({ error: 'jobLink is required.' }, { status: 400 })
    }

    const result = await query(
      `INSERT INTO saved_jobs (account_id, job_link, job_title, job_category)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (account_id, job_link) DO UPDATE
         SET job_title = EXCLUDED.job_title,
             job_category = EXCLUDED.job_category,
             saved_at = NOW()
       RETURNING job_link, job_title, job_category, saved_at`,
      [userId, jobLink, jobTitle ?? null, jobCategory ?? null],
    )

    return NextResponse.json({ savedJob: result.rows[0] }, { status: 201 })
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error in /api/saved-jobs POST', error)
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  const userId = await getAuthUserId(request)
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { jobLink } = await request.json()
    if (!jobLink) {
      return NextResponse.json({ error: 'jobLink is required.' }, { status: 400 })
    }

    const result = await query('DELETE FROM saved_jobs WHERE account_id = $1 AND job_link = $2', [
      userId,
      jobLink,
    ])

    // `pg` exposes `rowCount` as `number | null`
    return NextResponse.json({ success: (result.rowCount ?? 0) > 0 }, { status: 200 })
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error in /api/saved-jobs DELETE', error)
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 })
  }
}

