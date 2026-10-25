import nextEnv from '@next/env'
nextEnv.loadEnvConfig(process.cwd())
async function main(){
 const {transaction,pool}=await import('../src/lib/db')
 try {
  const id=Number(process.argv[2]); const action=process.argv[3]
  if(!Number.isSafeInteger(id)||id<1||!['--confirmed-received','--confirmed-not-received'].includes(action))throw new Error('Usage: npm run mail:resolve -- APPLICATION_ID --confirmed-received|--confirmed-not-received. First check the HR inbox.')
  const sent=action==='--confirmed-received'
  await transaction(async client=>{
   const row=await client.query("UPDATE application_mail SET state=$2,attempts=CASE WHEN $2='pending' THEN 0 ELSE attempts END,next_attempt_at=NOW(),updated_at=NOW(),last_error='Manually reconciled by operator',sent_at=CASE WHEN $2='sent' THEN NOW() ELSE sent_at END WHERE application_id=$1 AND state IN ('review','failed') RETURNING application_id",[id,sent?'sent':'pending'])
   if(!row.rows.length)throw new Error('Application not found or not in a state requiring review.')
   await client.query('UPDATE job_applications SET delivery_status=$2 WHERE id=$1',[id,sent?'sent':'pending'])
  })
  console.log('Application',id,sent?'marked received':'queued for retry')
 }finally{await pool.end()}
}
main().catch(e=>{console.error(e instanceof Error?e.message:'Reconciliation failed');process.exitCode=1})
