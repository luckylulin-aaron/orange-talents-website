'use client'
import { useEffect, useRef, useState } from 'react'
import styles from './SaveJobButton.module.scss'
type Props = { jobLink: string; jobTitle: string; jobCategory: string }
export default function SaveJobButton({ jobLink, jobTitle, jobCategory }: Props) {
 const [saved,setSaved]=useState(false), [loading,setLoading]=useState(true), [pending,setPending]=useState(false), [auth,setAuth]=useState(false), [error,setError]=useState('')
 const lock=useRef(false)
 useEffect(()=>{const controller=new AbortController();setLoading(true);setError('')
  fetch('/api/saved-jobs/is-saved?jobLink='+encodeURIComponent(jobLink),{credentials:'include',cache:'no-store',signal:controller.signal}).then(async res=>{if(res.status===401){setAuth(true);return}if(!res.ok)throw new Error();const data=await res.json();setSaved(Boolean(data.saved));setAuth(false)}).catch(()=>{if(!controller.signal.aborted)setError('Could not load saved status. Refresh to try again.')}).finally(()=>{if(!controller.signal.aborted)setLoading(false)})
  return()=>controller.abort()
 },[jobLink])
 const signIn=()=>{window.location.href='/account/sign-in?next='+encodeURIComponent(jobLink)}
 async function toggle(){
  if(auth){signIn();return}if(lock.current)return
  lock.current=true;setPending(true);setError('')
  try{const res=await fetch('/api/saved-jobs',{method:saved?'DELETE':'POST',credentials:'include',headers:{'Content-Type':'application/json'},body:JSON.stringify({jobLink,jobTitle,jobCategory})});if(res.status===401){signIn();return}if(!res.ok)throw new Error();setSaved(!saved)}catch{setError('Could not update saved job. Please try again.')}finally{lock.current=false;setPending(false)}
 }
 return <span><button type="button" className={[styles.button,saved?styles.saved:''].join(' ')} onClick={toggle} disabled={loading||pending||error.startsWith('Could not load')} aria-pressed={saved} aria-label={auth?'Sign in to save this job':saved?'Unsave this job':'Save this job'}>{pending?'Saving…':auth?'Sign in':saved?'★ Saved':'☆ Save Job'}</button>{error&&<span role="alert" style={{display:'block',fontSize:12,marginTop:8,color:'#a32a16'}}>{error}</span>}</span>
}
