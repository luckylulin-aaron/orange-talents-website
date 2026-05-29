import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { verifyToken } from '@/lib/auth'

type AuthPayload = { userId: number }

function getAuthUserId(request: NextRequest): number | null {
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
  const userId = getAuthUserId(request)
  if (!userId) {
    return NextResponse.json({ applied: false }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const jobLink = searchParams.get('jobLink')?.trim()

  if (!jobLink) {
    return NextResponse.json({ error: 'jobLink is required.' }, { status: 400 })
  }

  try {
    const result = await query(
      `SELECT id, job_link, job_title, job_category, status, created_at
       FROM job_applications
       WHERE account_id = $1 AND job_link = $2`,
      [userId, jobLink],
    )

    const application = result.rows[0] ?? null
    return NextResponse.json({ applied: Boolean(application), application }, { status: 200 })
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error in /api/job-applications/is-applied GET', error)
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 })
  }
}

