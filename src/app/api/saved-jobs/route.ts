import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { apiError, assertSameOrigin, currentAccount, HttpError } from '@/lib/access'

export const dynamic = 'force-dynamic'

async function readJobLink(request: NextRequest) {
  const body = await request.json().catch(() => { throw new HttpError(400, 'Invalid request.') })
  if (!body || typeof body.jobLink !== 'string' || !/^\/jobs\/[a-z0-9]+(?:-[a-z0-9]+)*$/.test(body.jobLink) || body.jobLink.length > 106) {
    throw new HttpError(400, 'Invalid job link.')
  }
  return body.jobLink as string
}

export async function GET(request: NextRequest) {
  try {
    const account = await currentAccount(request)
    const result = await query(
      `SELECT s.job_link, COALESCE(j.title,s.job_title) AS job_title, COALESCE(j.category,s.job_category) AS job_category, s.saved_at,
        j.location, j.contract_type, j.salary, j.status AS job_status
       FROM saved_jobs s
       LEFT JOIN jobs j ON s.job_link = '/jobs/' || j.slug AND j.status <> 'draft'
       WHERE s.account_id = $1
       ORDER BY s.saved_at DESC, s.id DESC`, [account.id],
    )
    return NextResponse.json({ savedJobs: result.rows })
  } catch (error) { return apiError(error) }
}

export async function POST(request: NextRequest) {
  try {
    assertSameOrigin(request)
    const account = await currentAccount(request)
    const jobLink = await readJobLink(request)
    // Store real, public jobs and take their title from the database, never the caller.
    const result = await query(
      `INSERT INTO saved_jobs (account_id,job_link,job_title,job_category)
       SELECT $1,$2,title,category FROM jobs WHERE slug=$3 AND status IN ('published','closed')
       ON CONFLICT (account_id,job_link) DO UPDATE
         SET job_title=EXCLUDED.job_title,job_category=EXCLUDED.job_category,saved_at=NOW()
       RETURNING job_link,job_title,job_category,saved_at`, [account.id,jobLink,jobLink.slice(6)],
    )
    if (!result.rows[0]) throw new HttpError(404, 'This job is no longer available.')
    return NextResponse.json({ savedJob: result.rows[0] }, { status: 201 })
  } catch (error) { return apiError(error) }
}

export async function DELETE(request: NextRequest) {
  try {
    assertSameOrigin(request)
    const account = await currentAccount(request)
    const jobLink = await readJobLink(request)
    // Old saved entries stay removable after their jobs are deleted or made private.
    const result = await query('DELETE FROM saved_jobs WHERE account_id=$1 AND job_link=$2', [account.id,jobLink])
    return NextResponse.json({ success: (result.rowCount ?? 0) > 0 })
  } catch (error) { return apiError(error) }
}
