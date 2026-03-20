import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { verifyToken } from '@/lib/auth'

type AuthPayload = { userId: number; email: string }

const ALLOWED_STATUSES = [
  'submitted',
  'applied',
  'resume_screening_passed',
  'interviewing',
  'interview',
  'rejected',
  'offered',
  'rejected_offered',
  'onboarding',
] as const

type NewStatus = (typeof ALLOWED_STATUSES)[number]

function getAdminEmails(): string[] {
  const raw = process.env.ADMIN_EMAILS
  if (!raw) return []
  return raw
    .split(',')
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean)
}

async function assertAdmin(request: NextRequest): Promise<AuthPayload | null> {
  const token = request.cookies.get('auth_token')?.value
  if (!token) return null

  const payload = verifyToken<AuthPayload>(token)
  const adminEmails = getAdminEmails()
  if (adminEmails.length === 0) return null

  const isAdmin = adminEmails.includes(String(payload.email).toLowerCase())
  if (!isAdmin) return null

  return payload
}

export async function POST(request: NextRequest) {
  let auth: AuthPayload | null = null
  try {
    auth = await assertAdmin(request)
    if (!auth) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const { applicationId, newStatus } = await request.json()
    if (!applicationId || typeof applicationId !== 'number') {
      return NextResponse.json({ error: 'applicationId is required.' }, { status: 400 })
    }

    if (!newStatus || typeof newStatus !== 'string') {
      return NextResponse.json({ error: 'newStatus is required.' }, { status: 400 })
    }

    const normalized = newStatus as NewStatus
    if (!ALLOWED_STATUSES.includes(normalized)) {
      return NextResponse.json({ error: 'Invalid newStatus.' }, { status: 400 })
    }

    const result = await query(
      'UPDATE job_applications SET status = $1 WHERE id = $2 RETURNING id, status',
      [normalized, applicationId],
    )

    if (result.rowCount === 0) {
      return NextResponse.json({ error: 'Application not found.' }, { status: 404 })
    }

    return NextResponse.json({ application: result.rows[0] }, { status: 200 })
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error in /api/admin/job-applications/status POST', error)
    if (auth) {
      return NextResponse.json({ error: 'Internal server error.' }, { status: 500 })
    }
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }
}

