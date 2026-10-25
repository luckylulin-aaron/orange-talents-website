import { NextRequest } from 'next/server'
import { currentAccount, canManageJobs, apiError } from '@/lib/access'
export const dynamic = 'force-dynamic'
export async function GET(request: NextRequest) {
 try { const account = await currentAccount(request); return Response.json({canManageJobs:canManageJobs(account.email)}) }
 catch(e) { return apiError(e) }
}
