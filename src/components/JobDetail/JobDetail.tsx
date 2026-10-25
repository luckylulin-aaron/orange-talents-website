'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import SaveJobButton from '@/components/SaveJobButton/SaveJobButton'
import type { Job } from '@/lib/job-types'
import { jobLink } from '@/lib/job-types'
import styles from './JobDetail.module.scss'

function Lines({text}:{text:string}) {
 const lines = text.split('\n').map(v=>v.trim()).filter(Boolean)
 return <ul className={styles.points}>{lines.map((line,i)=><li key={i}>{line.replace(/^[-•]\s*/, '')}</li>)}</ul>
}
export default function JobDetail({job}:{job:Job}) {
 const dialog = useRef<HTMLDialogElement>(null)
 const fileInput = useRef<HTMLInputElement>(null)
 const lock = useRef(false)
 const [auth,setAuth] = useState<'loading'|'signed-in'|'signed-out'|'error'>('loading')
 const [applied,setApplied] = useState(false)
 const [delivery,setDelivery] = useState('')
 const [sending,setSending] = useState(false)
 const [error,setError] = useState('')
 const [intro,setIntro] = useState('')
 const [file,setFile] = useState<File|null>(null)
 const [open,setOpen] = useState(false)
 const [accountCheck,setAccountCheck] = useState(0)
 const link = jobLink(job)
 const signIn = '/account/sign-in?next='+encodeURIComponent(link)
 useEffect(()=>{
  let active = true
  setAuth('loading')
  fetch('/api/job-applications/is-applied?jobLink='+encodeURIComponent(link),{cache:'no-store'})
   .then(async r=>{
    if(!active)return
    if(r.status===401){setAuth('signed-out');return}
    if(!r.ok)throw new Error('status')
    const data=await r.json();if(!active)return
    setAuth('signed-in');setApplied(Boolean(data.applied));setDelivery(data.application?.delivery_status||'')
   }).catch(()=>{if(active)setAuth('error')})
  return ()=>{active=false}
 },[link,accountCheck])
 useEffect(()=>{
  if(!open)return
  const previous=document.body.style.overflow
  document.body.style.overflow='hidden'
  return ()=>{document.body.style.overflow=previous}
 },[open])
 function show(){setError('');dialog.current?.showModal();setOpen(true)}
 function close(){if(lock.current)return;dialog.current?.close();setOpen(false)}
 async function submit(e:React.FormEvent){
  e.preventDefault();if(lock.current)return
  if(!file){setError('Please upload your resume.');fileInput.current?.focus();return}
  if(file.size>5*1024*1024||!file.size||! /\.(pdf|docx)$/i.test(file.name)){setError('Choose a PDF or DOCX file, up to 5 MB.');return}
  lock.current=true;setSending(true);setError('')
  try{
   const data=new FormData();data.set('jobLink',link);data.set('resume',file);data.set('coverLetter',intro);data.set('confirmed','true')
   const res=await fetch('/api/job-applications',{method:'POST',body:data})
   const result=await res.json().catch(()=>({}))
   if(res.status===401){setAuth('signed-out');return}
   if(res.status===409){setApplied(true);setDelivery('');return}
   if(!res.ok)throw new Error(result.error||'Your application could not be submitted. Please try again.')
   setApplied(true);setDelivery(result.application?.delivery_status||'pending');setFile(null)
  }catch(e){setError(e instanceof Error?e.message:'Please try again.')}
  finally{lock.current=false;setSending(false)}
 }
 const applyButton=<button className={styles.apply} onClick={show}>{applied?'View application':'Apply'}</button>
 const facts:[string,string][]=[['Contract type',job.contract_type],['Company type',job.company_type],['Specialization',job.specialization],['Function',job.job_function],['Industry',job.industry],['Workplace type',job.job_type],['Salary',job.salary],['Location',job.location],['Region',job.region],['Job reference',job.reference||'OT-'+job.id],['Date posted',job.published_at?new Date(job.published_at).toISOString().slice(0,10):''],['Consultant',job.consultant],['Email address',job.contact_email],['Phone number',job.contact_phone]]
 const statusText=delivery==='sent'?'Your application has been received and the email has been accepted by our mail service.':delivery==='legacy'?'Your application is already recorded.':delivery==='review'?'Your application is saved. Our team is checking its email delivery; please do not submit again.':delivery==='failed'?'Your application is saved. Email delivery needs attention; you do not need to apply again.':delivery?'Your application is saved and awaiting email delivery.':'You have already applied for this role.'
 return <>
  <section className={styles.hero}><div><Link href="/jobs">← All opportunities</Link><h1>{job.title}</h1><p>{[job.location,job.job_type].filter(Boolean).join(' · ')}</p></div></section>
  <section className={styles.layout}>
   <article className={styles.description}>
    {job.summary&&<p className={styles.summary}>{job.summary}</p>}
    {job.responsibilities&&<section><h2>What you’ll do</h2><Lines text={job.responsibilities}/></section>}
    {job.requirements&&<section><h2>What you’ll bring</h2><Lines text={job.requirements}/></section>}
    {job.next_steps&&<section><h2>What’s next</h2><p className={styles.multiline}>{job.next_steps}</p></section>}
    {job.status==='published'?applyButton:<p className={styles.notice}>This role is no longer accepting applications. <Link href="/jobs">Browse open roles</Link></p>}
   </article>
   <aside className={styles.aside}><h2>About the job</h2><dl>{facts.filter(([,value])=>value).map(([label,value])=><div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
    <div className={styles.actions}>{job.status==='published'&&applyButton}<SaveJobButton jobLink={link} jobTitle={job.title} jobCategory={job.category}/></div>
   </aside>
  </section>
  <dialog ref={dialog} className={styles.dialog} aria-labelledby="application-title" onCancel={e=>{if(lock.current)e.preventDefault()}} onClose={()=>setOpen(false)} onClick={e=>{if(e.target===e.currentTarget)close()}}>
   <div className={styles.dialogInner}>
    <button className={styles.close} aria-label="Close application" disabled={sending} onClick={close}>×</button>
    <h2 id="application-title">Application Confirmation</h2>
    {applied?<div role="status"><p>{statusText}</p><Link className={styles.textLink} href="/account/applications">View my applications →</Link><button className={styles.secondary} onClick={close}>Close</button></div>
     :auth==='loading'?<p role="status">Checking your account…</p>
     :auth==='signed-out'?<><p>Please sign in before submitting your resume.</p><Link className={styles.apply} href={signIn}>Sign in to apply</Link></>
     :auth==='error'?<><p role="alert">We couldn’t check your account. Please try again.</p><button className={styles.secondary} onClick={()=>setAccountCheck(value=>value+1)}>Try again</button></>
     :<form onSubmit={submit}>
       <p>You’re applying for the role below.</p>
       <div className={styles.confirmJob}><strong>{job.title}</strong><span>{job.location}</span><span>Job reference: {job.reference||'OT-'+job.id}</span>{job.consultant&&<span>Consultant: {job.consultant}</span>}</div>
       <label htmlFor="application-resume">Upload your resume <span>(PDF or DOCX, up to 5 MB)</span></label>
       <input ref={fileInput} id="application-resume" type="file" accept=".pdf,.docx" required disabled={sending} onChange={e=>{setFile(e.target.files?.[0]||null);setError('')}}/>
       <label htmlFor="application-intro">Short introduction <span>(optional)</span></label>
       <textarea id="application-intro" rows={3} maxLength={6000} value={intro} onChange={e=>setIntro(e.target.value)} disabled={sending}/>
       <p className={styles.privacy}>By confirming, you submit your resume and account contact details to hr@orangetalents.com for this role. <Link href="/candidate-privacy-policy" target="_blank" rel="noreferrer">Candidate privacy policy</Link></p>
       {error&&<p role="alert" className={styles.error}>{error}</p>}
       <button className={styles.apply} disabled={sending} type="submit">{sending?'Submitting…':'Yes, I would like to apply for this job'}</button>
       <button type="button" className={styles.cancel} disabled={sending} onClick={close}>No, I would like to reconsider the job</button>
      </form>}
   </div>
  </dialog>
 </>
}
