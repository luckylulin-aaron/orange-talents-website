'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import Header from '@/components/Header/Header'
import Footer from '@/components/Footer/Footer'
import type { Job } from '@/lib/job-types'
import styles from './JobsAdmin.module.scss'
const fields:[string,string,boolean?][]=[['title','岗位名称'],['category','分类'],['location','工作地点'],['region','地区'],['company_type','公司类型'],['specialization','专业方向'],['industry','行业'],['job_function','职能'],['job_type','工作方式'],['contract_type','合同类型（如 Permanent）'],['salary','薪酬范围'],['reference','岗位编号'],['consultant','顾问'],['contact_email','页面联系邮箱'],['contact_phone','页面联系电话'],['summary','岗位简介',true],['responsibilities','工作职责（每行一项）',true],['requirements','任职要求（每行一项）',true],['next_steps','后续流程说明',true]]
type Draft = Record<string,string> & {slug:string;status:string}
const empty:Draft=Object.fromEntries([...fields.map(([key])=>[key,key==='category'?'Opportunities':'']),['slug',''],['status','draft']]) as Draft
export default function JobsAdmin(){
 const [jobs,setJobs]=useState<Job[]>([])
 const [loading,setLoading]=useState(true)
 const [access,setAccess]=useState(200)
 const [draft,setDraft]=useState<Draft>({...empty})
 const [editing,setEditing]=useState<Job|null>(null)
 const [saving,setSaving]=useState(false)
 const [dirty,setDirty]=useState(false)
 const [error,setError]=useState('')
 const [notice,setNotice]=useState('')
 async function load(){
  setLoading(true);setError('')
  try{const res=await fetch('/api/admin/jobs',{cache:'no-store'});setAccess(res.status);const data=await res.json();if(!res.ok)throw new Error(data.error||'无法加载岗位');setJobs(data.jobs)}
  catch(e){setError(e instanceof Error?e.message:'无法加载岗位')}
  finally{setLoading(false)}
 }
 useEffect(()=>{load()},[])
 useEffect(()=>{
  const handler=(event:BeforeUnloadEvent)=>{if(dirty){event.preventDefault();event.returnValue=''}}
  window.addEventListener('beforeunload',handler);return()=>window.removeEventListener('beforeunload',handler)
 },[dirty])
 function select(job:Job|null){
  if(saving)return
  if(dirty&&!window.confirm('有未保存的修改，确定放弃吗？'))return
  setEditing(job);setDraft(job?Object.fromEntries(Object.keys(empty).map(k=>[k,String(job[k as keyof Job]??'')])) as Draft:{...empty});setDirty(false);setError('');setNotice('')
 }
 function change(key:string,value:string){setDraft(v=>({...v,[key]:value}));setDirty(true);setNotice('')}
 async function save(e:React.FormEvent){
  e.preventDefault();if(saving)return;setSaving(true);setError('');setNotice('')
  try{
   const res=await fetch(editing?'/api/admin/jobs/'+editing.id:'/api/admin/jobs',{method:editing?'PATCH':'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({...draft,version:editing?.version})})
   const data=await res.json();if(!res.ok)throw new Error(data.error||'保存失败')
   setEditing(data.job);setDraft(Object.fromEntries(Object.keys(empty).map(k=>[k,String(data.job[k]??'')])) as Draft);setDirty(false)
   setJobs(previous=>[data.job,...previous.filter(j=>j.id!==data.job.id)]);setNotice(data.job.status==='published'?'已发布，官网会显示该岗位。':data.job.status==='closed'?'已下架，该岗位停止接收新申请。':'草稿已保存，官网暂不显示。')
  }catch(e){setError(e instanceof Error?e.message:'保存失败')}
  finally{setSaving(false)}
 }
 return <div className="site"><Header/><main className={'main '+styles.page}>
  <header className={styles.heading}><div><p>ORANGE TALENTS · MK</p><h1>岗位管理</h1><span>编辑岗位内容，发布后同步到官网。</span></div><Link href="/jobs">查看官网岗位 →</Link></header>
  {loading?<p role="status">正在加载…</p>:access===401?<p>请先 <Link href="/account/sign-in?next=%2Fadmin%2Fjobs">登录管理账号</Link>。</p>:access===403?<p role="alert">当前账号没有岗位管理权限，请联系网站管理员配置。</p>:access!==200?<div role="alert"><p>{error}</p><button onClick={load}>重新加载</button></div>:<div className={styles.workspace}>
   <aside className={styles.list}><button className={styles.primary} onClick={()=>select(null)} disabled={saving}>＋ 新增岗位</button><button className={styles.refresh} disabled={saving} onClick={()=>{if(!dirty||window.confirm('重新加载将放弃未保存的修改，是否继续？')){setEditing(null);setDraft({...empty});setDirty(false);load()}}}>刷新列表</button>
    {jobs.length===0?<p>暂无岗位，创建第一条岗位信息。</p>:jobs.map(job=><button className={editing?.id===job.id?styles.selected:''} key={job.id} onClick={()=>select(job)} disabled={saving}><strong>{job.title}</strong><span>{job.location||'未填写地点'} · {job.status==='published'?'已发布':job.status==='closed'?'已下架':'草稿'}</span></button>)}
   </aside>
   <form className={styles.editor} onSubmit={save}><div className={styles.formTop}><h2>{editing?'编辑岗位':'新增岗位'}</h2>{editing?.status!=='draft'&&editing&&<Link href={'/jobs/'+editing.slug} target="_blank">查看页面 ↗</Link>}</div>
    <fieldset disabled={saving}><div className={styles.grid}>
     <label>页面网址名称<input required pattern="[a-z0-9]+(-[a-z0-9]+)*" maxLength={100} value={draft.slug} disabled={Boolean(editing)} onChange={e=>change('slug',e.target.value)} placeholder="例如 marketing-director"/><small>创建后固定，避免旧投递链接失效。</small></label>
     <label>发布状态<select value={draft.status} onChange={e=>change('status',e.target.value)}><option value="draft">草稿</option><option value="published">发布</option><option value="closed">下架</option></select></label>
     {fields.map(([key,label,long])=><label key={key} className={long?styles.full:''}>{label}{key==='title'?' *':''}
      {long?<textarea rows={key==='summary'?4:6} maxLength={12000} value={draft[key]} onChange={e=>change(key,e.target.value)} required={draft.status==='published'&&['summary','responsibilities','requirements'].includes(key)}/>:<input type={key==='contact_email'?'email':'text'} maxLength={200} value={draft[key]} onChange={e=>change(key,e.target.value)} required={key==='title'||(key==='location'&&draft.status==='published')} />}
     </label>)}
    </div></fieldset>
    <p className={styles.hint}>简历统一投递至 hr@orangetalents.com；页面联系邮箱仅供展示。</p>
    {error&&<p className={styles.error} role="alert">{error}</p>}{notice&&<p className={styles.success} role="status">{notice}</p>}
    <button className={styles.primary} disabled={saving} type="submit">{saving?'正在保存…':draft.status==='published'?'保存并发布':draft.status==='closed'?'保存并下架':'保存草稿'}</button>
   </form>
  </div>}
 </main><Footer/></div>
}
