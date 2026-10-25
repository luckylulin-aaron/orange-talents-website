import nextEnv from '@next/env'
nextEnv.loadEnvConfig(process.cwd())
async function main(){
 const {query,pool,transaction}=await import('../src/lib/db')
 const {deliverApplication,mailConfigured}=await import('../src/lib/mail')
 try{
  if(!mailConfigured())throw new Error('SMTP configuration is incomplete.')
  // A crash after SMTP accepted a message is ambiguous: never blindly retry it.
  await transaction(async client=>{
   const stale=await client.query("UPDATE application_mail SET state='review',last_error='Stale sending claim; verify the HR inbox.',updated_at=NOW() WHERE state='sending' AND updated_at<NOW()-INTERVAL '10 minutes' RETURNING application_id")
   for(const row of stale.rows)await client.query("UPDATE job_applications SET delivery_status='review' WHERE id=$1",[row.application_id])
  })
  const ids=await query("SELECT application_id FROM application_mail WHERE state IN ('pending','failed') AND attempts<5 AND next_attempt_at<=NOW() ORDER BY application_id LIMIT 25")
  for(const row of ids.rows)console.log(row.application_id,await deliverApplication(row.application_id))
  const attention=await query("SELECT application_id,state,attempts FROM application_mail WHERE state='review' OR (state='failed' AND attempts>=5)")
  if(attention.rows.length){console.error('Manual delivery check required:',attention.rows);process.exitCode=2}
 }finally{await pool.end()}
}
main().catch(e=>{console.error(e instanceof Error?e.message:'Mail worker failed');process.exitCode=1})
