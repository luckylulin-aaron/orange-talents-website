import nodemailer from 'nodemailer'
import { query, transaction } from './db'
export const APPLICATION_RECIPIENT = 'hr@orangetalents.com'
export function mailConfigured() {
 const p = Number(process.env.SMTP_PORT || 587)
 return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASSWORD && process.env.SMTP_FROM && Number.isInteger(p) && p > 0 && p < 65536)
}
export async function deliverApplication(id: number) {
 if (!mailConfigured()) return 'pending'
 const claim = await query("UPDATE application_mail SET state='sending',attempts=attempts+1,updated_at=NOW() WHERE application_id=$1 AND state IN ('pending','failed') AND attempts<5 AND next_attempt_at<=NOW() RETURNING *",[id])
 const mail = claim.rows[0]
 if (!mail) return 'unchanged'
 let accepted = false
 try {
  const application = (await query('SELECT job_title,job_link,cover_letter FROM job_applications WHERE id=$1',[id])).rows[0]
  if (!application) throw new Error('Application missing')
  const port = Number(process.env.SMTP_PORT || 587)
  const transport = nodemailer.createTransport({host:process.env.SMTP_HOST,port,secure:port===465,requireTLS:port!==465,
   auth:{user:process.env.SMTP_USER,pass:process.env.SMTP_PASSWORD},connectionTimeout:10000,greetingTimeout:10000,socketTimeout:20000,
   disableFileAccess:true,disableUrlAccess:true})
  const result = await transport.sendMail({from:process.env.SMTP_FROM,to:APPLICATION_RECIPIENT,
   replyTo:{name:mail.applicant_name,address:mail.applicant_email},messageId:'<application-'+id+'@orangetalents.com>',
   subject:'Job application #'+id+' — '+application.job_title,
   text:['Application #'+id,'Job: '+application.job_title,'Job path: '+application.job_link,'Applicant: '+mail.applicant_name,
    'Email: '+mail.applicant_email,'',application.cover_letter || '','', 'Resume attached.'].join('\n'),
   attachments:[{filename:mail.resume_name,content:mail.resume_bytes,contentType:mail.resume_type}]})
  if (!result.accepted?.length) throw new Error('Recipient rejected')
  accepted = true
  await transaction(async client => {
   await client.query("UPDATE application_mail SET state='sent',sent_at=NOW(),updated_at=NOW(),last_error=NULL WHERE application_id=$1",[id])
   await client.query("UPDATE job_applications SET delivery_status='sent' WHERE id=$1",[id])
  })
  return 'sent'
 } catch(e) {
  // SMTP acknowledgement or DB failure can leave delivery uncertain. Do not auto-resend those cases.
  const error = e as {code?:string;command?:string;responseCode?:number}
  const uncertain = accepted || error.code === 'ETIMEDOUT' || error.code === 'ECONNECTION' || error.command === 'DATA'
  const state = uncertain ? 'review' : 'failed'
  await transaction(async client => {
   await client.query("UPDATE application_mail SET state=$2,last_error=$3,updated_at=NOW(),next_attempt_at=NOW()+INTERVAL '5 minutes' WHERE application_id=$1",[id,state,uncertain?'Delivery uncertain; check the HR mailbox before retrying.':'Mail submission failed; check SMTP configuration.'])
   await client.query('UPDATE job_applications SET delivery_status=$2 WHERE id=$1',[id,state])
  })
  return state
 }
}
