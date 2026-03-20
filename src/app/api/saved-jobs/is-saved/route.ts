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
    return NextResponse.json({ saved: false }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const jobLink = searchParams.get('jobLink')

  if (!jobLink) {
    return NextResponse.json({ error: 'jobLink is required.' }, { status: 400 })
  }

  const result = await query('SELECT 1 FROM saved_jobs WHERE account_id = $1 AND job_link = $2', [
    userId,
    jobLink,
  ])

  return NextResponse.json({ saved: result.rowCount > 0 }, { status: 200 })
}

