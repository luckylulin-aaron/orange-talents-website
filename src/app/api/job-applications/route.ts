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
    `SELECT id, job_link, job_title, job_category, cover_letter, status, created_at
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
  const userId = await getAuthUserId(request)
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { jobLink, jobTitle, jobCategory, coverLetter } = await request.json()
    const normalizedJobLink = typeof jobLink === 'string' ? jobLink.trim() : ''
    const normalizedCoverLetter = typeof coverLetter === 'string' ? coverLetter.trim() : ''

    if (!normalizedJobLink) {
      return NextResponse.json({ error: 'jobLink is required.' }, { status: 400 })
    }

    if (!normalizedCoverLetter) {
      return NextResponse.json({ error: 'coverLetter is required.' }, { status: 400 })
    }

    const result = await query(
      `INSERT INTO job_applications (account_id, job_link, job_title, job_category, cover_letter, status)
       VALUES ($1, $2, $3, $4, $5, 'submitted')
       ON CONFLICT (account_id, job_link) DO NOTHING
       RETURNING id, job_link, job_title, job_category, cover_letter, status, created_at`,
      [
        userId,
        normalizedJobLink,
        typeof jobTitle === 'string' ? jobTitle.trim() || null : null,
        typeof jobCategory === 'string' ? jobCategory.trim() || null : null,
        normalizedCoverLetter,
      ],
    )

    if (result.rowCount === 0) {
      const existing = await query(
        `SELECT id, job_link, job_title, job_category, cover_letter, status, created_at
         FROM job_applications
         WHERE account_id = $1 AND job_link = $2`,
        [userId, normalizedJobLink],
      )

      const existingApplication = existing.rows[0]
      const phase = existingApplication ? mapStatusToPhase(existingApplication.status) : null

      return NextResponse.json(
        {
          error: 'You have already applied for this job.',
          alreadyApplied: true,
          application: existingApplication && phase ? { ...existingApplication, ...phase } : null,
        },
        { status: 409 },
      )
    }

    const application = result.rows[0]
    return NextResponse.json(
      { application: { ...application, ...mapStatusToPhase(application.status) } },
      { status: 201 },
    )
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error in /api/job-applications POST', error)
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 })
  }
}

