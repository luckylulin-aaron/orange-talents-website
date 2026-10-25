import { GET as savedList, POST as saveJob, DELETE as removeJob } from '../src/app/api/saved-jobs/route'
import { beforeAll,beforeEach,afterAll,describe,it,expect,vi } from 'vitest'
import { readFile } from 'node:fs/promises'
import { NextRequest } from 'next/server'
const {sendMail}=vi.hoisted(()=>({sendMail:vi.fn()}))
vi.mock('nodemailer',()=>({default:{createTransport:()=>({sendMail})}}))
import { pool,query } from '../src/lib/db'
import { POST as register } from '../src/app/api/auth/register/route'
import { POST as login } from '../src/app/api/auth/login/route'
import { signToken } from '../src/lib/auth'
import { POST as createJob,GET as adminList } from '../src/app/api/admin/jobs/route'
import { PATCH as updateJob } from '../src/app/api/admin/jobs/[id]/route'
import { POST as apply,GET as applications } from '../src/app/api/job-applications/route'
import { GET as appliedStatus } from '../src/app/api/job-applications/is-applied/route'
import { listPublishedJobs,findJob } from '../src/lib/jobs'
import { deliverApplication } from '../src/lib/mail'
import { validateResume,MAX_RESUME_BYTES } from '../src/lib/resume'
let candidate:number,editor:number,other:number
const origin='http://localhost:3100'
const jobData={slug:'director-events',title:'Director, Events & Marketing',category:'Opportunities',summary:'Lead international events.',responsibilities:'Plan events\nCoordinate teams',requirements:'Relevant experience\nClear communication',location:'Singapore',status:'published'}
function token(id:number,email='candidate@example.test'){return signToken({userId:id,email})}
function request(path:string,method:string,id?:number,body?:BodyInit,contentType?:string,requestOrigin=origin){
 const headers:Record<string,string>={origin:requestOrigin}
 if(id)headers.cookie='auth_token='+token(id)
 if(contentType)headers['Content-Type']=contentType
 return new NextRequest(origin+path,{method,headers,body})
}
async function job(){const r=await createJob(request('/api/admin/jobs','POST',editor,JSON.stringify(jobData),'application/json'));expect(r.status).toBe(201);return (await r.json()).job}
function upload(overrides?:{file?:File;confirmed?:string;link?:string}){
 const form=new FormData();form.set('jobLink',overrides?.link||'/jobs/director-events');form.set('confirmed',overrides?.confirmed??'true')
 form.set('resume',overrides?.file||new File(['%PDF-1.7\n1 0 obj\n<<>>\nendobj\n%%EOF'],'candidate.pdf',{type:'application/pdf'}));form.set('coverLetter','A test application.');return form
}
beforeAll(async()=>{
 if(!process.env.DATABASE_URL || new URL(process.env.DATABASE_URL).pathname!=='/orange_review_test')throw new Error('Tests require a dedicated orange_review_test database; no other database is accepted.')
 await query(await readFile('db/schema.sql','utf8'))
 const migration=await readFile('db/migrations/20261022_opportunities.sql','utf8')
 await query(migration);await query(migration)
})
beforeEach(async()=>{
 await query('TRUNCATE application_mail,job_changes,job_applications,saved_jobs,jobs,accounts RESTART IDENTITY CASCADE')
 const rows=(await query("INSERT INTO accounts (email,password_hash,name) VALUES ('candidate@example.test','test','Candidate'),('mk@example.test','test','MK'),('other@example.test','test','Other') RETURNING id")).rows
 candidate=rows[0].id;editor=rows[1].id;other=rows[2].id
 sendMail.mockReset();sendMail.mockResolvedValue({accepted:['hr@orangetalents.com']})
})
afterAll(()=>pool.end())
describe('MK job management',()=>{
 it('blocks public registration of reserved staff addresses, including case variants',async()=>{
  for(const email of ['mk@example.test','MK@EXAMPLE.TEST','admin@example.test'])expect((await register(request('/api/auth/register','POST',undefined,JSON.stringify({email,password:'test-password'}),'application/json'))).status).toBe(403)
 })
 it('denies anonymous, ordinary and forged-email editor access',async()=>{
  expect((await adminList(request('/api/admin/jobs','GET'))).status).toBe(401)
  expect((await adminList(request('/api/admin/jobs','GET',candidate))).status).toBe(403)
  const req=request('/api/admin/jobs','GET',candidate);req.headers.set('cookie','auth_token='+token(candidate,'mk@example.test'))
  expect((await adminList(req)).status).toBe(403)
  expect((await adminList(request('/api/admin/jobs','GET',editor))).status).toBe(200)
 })
 it('creates, edits, rejects stale edits and closes a live job with audit records',async()=>{
  const item=await job();expect((await listPublishedJobs()).length).toBe(1)
  const closed=await updateJob(request('/api/admin/jobs/'+item.id,'PATCH',editor,JSON.stringify({...jobData,status:'closed',version:item.version}),'application/json'),{params:{id:String(item.id)}})
  expect(closed.status).toBe(200);expect(await listPublishedJobs()).toHaveLength(0);expect((await findJob(item.slug))?.status).toBe('closed')
  const stale=await updateJob(request('/api/admin/jobs/'+item.id,'PATCH',editor,JSON.stringify({...jobData,version:item.version}),'application/json'),{params:{id:String(item.id)}})
  expect(stale.status).toBe(409);expect((await query('SELECT * FROM job_changes')).rows).toHaveLength(2)
 })
 it('keeps drafts private and validates required publish fields',async()=>{
  const invalid=await createJob(request('/api/admin/jobs','POST',editor,JSON.stringify({...jobData,location:''}),'application/json'));expect(invalid.status).toBe(400)
  const draft=await createJob(request('/api/admin/jobs','POST',editor,JSON.stringify({slug:'draft-job',title:'Draft',status:'draft'}),'application/json'));expect(draft.status).toBe(201);expect(await listPublishedJobs()).toHaveLength(0)
 })
 it('rejects cross-origin mutation and duplicate URLs',async()=>{
  expect((await createJob(request('/api/admin/jobs','POST',editor,JSON.stringify(jobData),'application/json','https://attacker.test'))).status).toBe(403)
  await job();expect((await createJob(request('/api/admin/jobs','POST',editor,JSON.stringify(jobData),'application/json'))).status).toBe(409)
 })
})
describe('Resume submission and delivery',()=>{
 it('stores a private resume, sends only to HR and prevents double submission',async()=>{
  await job();const form=upload();form.set('jobTitle','Forged title');form.set('recipient','attacker@example.test')
  const r=await apply(request('/api/job-applications','POST',candidate,form));expect(r.status).toBe(201)
  const result=await r.json();expect(result.application.delivery_status).toBe('sent')
  const message=sendMail.mock.calls[0][0];expect(message.to).toBe('hr@orangetalents.com');expect(message.replyTo.address).toBe('candidate@example.test');expect(message.subject).toContain(jobData.title);expect(message.subject).not.toContain('Forged');expect(message.attachments[0].content.toString()).toContain('%PDF-')
  expect((await apply(request('/api/job-applications','POST',candidate,upload()))).status).toBe(409);expect(sendMail).toHaveBeenCalledTimes(1)
  const own=await applications(request('/api/job-applications','GET',candidate));expect((await own.json()).applications).toHaveLength(1)
  const others=await applications(request('/api/job-applications','GET',other));expect((await others.json()).applications).toHaveLength(0)
  expect(JSON.stringify(await (await appliedStatus(request('/api/job-applications/is-applied?jobLink=/jobs/director-events','GET',candidate))).json())).not.toContain('resume_bytes')
 })
 it('does not accept unauthenticated, unconfirmed or cross-origin requests',async()=>{
  await job();expect((await apply(request('/api/job-applications','POST',undefined,upload()))).status).toBe(401)
  expect((await apply(request('/api/job-applications','POST',candidate,upload({confirmed:'false'})))).status).toBe(400)
  expect((await apply(request('/api/job-applications','POST',candidate,upload(),undefined,'https://attacker.test'))).status).toBe(403)
  expect((await query('SELECT * FROM job_applications')).rows).toHaveLength(0)
 })
 it('rejects spoofed files, oversized content and closed jobs',async()=>{
  const item=await job()
  const fake=new File(['<script>bad</script>'],'fake.pdf',{type:'application/pdf'})
  expect((await apply(request('/api/job-applications','POST',candidate,upload({file:fake})))).status).toBe(400)
  const large=new File([new Uint8Array(MAX_RESUME_BYTES+1)],'large.pdf',{type:'application/pdf'})
  expect((await apply(request('/api/job-applications','POST',candidate,upload({file:large})))).status).toBe(413)
  await query("UPDATE jobs SET status='closed' WHERE id=$1",[item.id])
  expect((await apply(request('/api/job-applications','POST',candidate,upload()))).status).toBe(410)
  expect((await query('SELECT * FROM job_applications')).rows).toHaveLength(0)
 })
 it('persists known mail failures and retries without creating another application',async()=>{
  await job();sendMail.mockRejectedValueOnce(Object.assign(new Error('Auth failed'),{code:'EAUTH'}))
  const r=await apply(request('/api/job-applications','POST',candidate,upload()));expect(r.status).toBe(201);const data=await r.json();expect(data.application.delivery_status).toBe('failed')
  await query("UPDATE application_mail SET next_attempt_at=NOW()-INTERVAL '1 minute' WHERE application_id=$1",[data.application.id])
  expect(await deliverApplication(data.application.id)).toBe('sent');expect((await query('SELECT * FROM job_applications')).rows).toHaveLength(1)
 })
 it('flags ambiguous SMTP timeouts for manual review, without automatic resends',async()=>{
  await job();sendMail.mockRejectedValueOnce(Object.assign(new Error('timeout'),{code:'ETIMEDOUT'}))
  const data=await (await apply(request('/api/job-applications','POST',candidate,upload()))).json();expect(data.application.delivery_status).toBe('review')
  expect(await deliverApplication(data.application.id)).toBe('unchanged');expect(sendMail).toHaveBeenCalledTimes(1)
 })
 it('does not accept applications when SMTP is unconfigured',async()=>{
  await job();const previous=process.env.SMTP_HOST;delete process.env.SMTP_HOST
  try{expect((await apply(request('/api/job-applications','POST',candidate,upload()))).status).toBe(503);expect((await query('SELECT * FROM job_applications')).rows).toHaveLength(0)}finally{process.env.SMTP_HOST=previous}
 })
 it('serializes concurrent double-click submissions',async()=>{
  await job();const results=await Promise.all([apply(request('/api/job-applications','POST',candidate,upload())),apply(request('/api/job-applications','POST',candidate,upload()))])
  expect(results.map(r=>r.status).sort()).toEqual([201,409]);expect(sendMail).toHaveBeenCalledTimes(1)
 })
})

describe('Saved jobs',()=>{
 it('returns current metadata, deduplicates saves and isolates accounts',async()=>{
  const item=await job()
  const body=JSON.stringify({jobLink:'/jobs/director-events',jobTitle:'Original title',jobCategory:'Old'})
  for(let i=0;i<2;i++)expect((await saveJob(request('/api/saved-jobs','POST',candidate,body,'application/json'))).status).toBe(201)
  await query("UPDATE jobs SET title='Updated title',location='Singapore',contract_type='Permanent',salary='SGD 100,000 per year' WHERE id=$1",[item.id])
  const own=await (await savedList(request('/api/saved-jobs','GET',candidate))).json()
  expect(own.savedJobs).toHaveLength(1);expect(own.savedJobs[0]).toMatchObject({job_title:'Updated title',location:'Singapore',contract_type:'Permanent',salary:'SGD 100,000 per year',job_status:'published'})
  expect((await (await savedList(request('/api/saved-jobs','GET',other))).json()).savedJobs).toHaveLength(0)
  expect((await savedList(request('/api/saved-jobs','GET'))).status).toBe(401)
 })
 it('removes only the signed-in account’s saved job',async()=>{
  await job();const body=JSON.stringify({jobLink:'/jobs/director-events',jobTitle:'Director'})
  for(const id of [candidate,other])await saveJob(request('/api/saved-jobs','POST',id,body,'application/json'))
  expect((await removeJob(request('/api/saved-jobs','DELETE',candidate,body,'application/json'))).status).toBe(200)
  expect((await (await savedList(request('/api/saved-jobs','GET',candidate))).json()).savedJobs).toHaveLength(0)
  expect((await (await savedList(request('/api/saved-jobs','GET',other))).json()).savedJobs).toHaveLength(1)
  expect((await removeJob(request('/api/saved-jobs','DELETE',undefined,body,'application/json'))).status).toBe(401)
 })
 it('shows closed status and hides draft metadata while retaining a removable snapshot',async()=>{
  const item=await job();await saveJob(request('/api/saved-jobs','POST',candidate,JSON.stringify({jobLink:'/jobs/director-events',jobTitle:'Saved title'}),'application/json'))
  await query("UPDATE jobs SET status='closed' WHERE id=$1",[item.id])
  expect((await (await savedList(request('/api/saved-jobs','GET',candidate))).json()).savedJobs[0].job_status).toBe('closed')
  await query("UPDATE jobs SET status='draft',title='Private draft',location='Private location' WHERE id=$1",[item.id])
  const data=await (await savedList(request('/api/saved-jobs','GET',candidate))).json()
  expect(data.savedJobs[0]).toMatchObject({job_title:jobData.title,job_status:null,location:null});expect(JSON.stringify(data)).not.toContain('Private')
 })
 it('rejects missing, draft and malformed jobs without storing caller-supplied titles',async()=>{
  const item=await job()
  for(const jobLink of [null,42,'javascript:alert(1)','https://example.test/jobs/a','/jobs/']) {
   expect((await saveJob(request('/api/saved-jobs','POST',candidate,JSON.stringify({jobLink}),'application/json'))).status).toBe(400)
  }
  expect((await saveJob(request('/api/saved-jobs','POST',candidate,JSON.stringify({jobLink:'/jobs/missing'}),'application/json'))).status).toBe(404)
  await query("UPDATE jobs SET status='draft' WHERE id=$1",[item.id])
  expect((await saveJob(request('/api/saved-jobs','POST',candidate,JSON.stringify({jobLink:'/jobs/director-events'}),'application/json'))).status).toBe(404)
  expect((await query('SELECT * FROM saved_jobs')).rows).toHaveLength(0)
 })
 it('rejects cross-origin saves and removals',async()=>{
  await job();const body=JSON.stringify({jobLink:'/jobs/director-events'})
  expect((await saveJob(request('/api/saved-jobs','POST',candidate,body,'application/json','https://attacker.test'))).status).toBe(403)
  await saveJob(request('/api/saved-jobs','POST',candidate,body,'application/json'))
  expect((await removeJob(request('/api/saved-jobs','DELETE',candidate,body,'application/json','https://attacker.test'))).status).toBe(403)
  expect((await query('SELECT * FROM saved_jobs')).rows).toHaveLength(1)
 })
})

describe('Sign-in compatibility',()=>{
 it('signs in after registration with mixed-case email and surrounding spaces',async()=>{
  const body=JSON.stringify({email:'New.User@Example.Test',password:'test-password',name:'New user'})
  expect((await register(request('/api/auth/register','POST',undefined,body,'application/json'))).status).toBe(201)
  const response=await login(request('/api/auth/login','POST',undefined,JSON.stringify({email:' NEW.USER@EXAMPLE.TEST ',password:'test-password'}),'application/json'))
  expect(response.status).toBe(200);expect(response.headers.get('set-cookie')).toContain('auth_token=')
 })
 it('rejects invalid email types without throwing a server error',async()=>{
  expect((await login(request('/api/auth/login','POST',undefined,JSON.stringify({email:42,password:'test-password'}),'application/json'))).status).toBe(400)
 })
})
