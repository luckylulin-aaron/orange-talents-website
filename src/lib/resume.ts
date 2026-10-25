import { fileTypeFromBuffer } from 'file-type'
import { HttpError } from './access'
export const MAX_RESUME_BYTES = 5 * 1024 * 1024
export async function boundedFormData(request: Request) {
 const limit = MAX_RESUME_BYTES + 128 * 1024
 if (Number(request.headers.get('content-length')) > limit) throw new HttpError(413,'Resume must be 5 MB or smaller.')
 if (!request.headers.get('content-type')?.startsWith('multipart/form-data')) throw new HttpError(400,'Upload a resume using the application form.')
 const reader = request.body?.getReader()
 if (!reader) throw new HttpError(400,'No application data received.')
 const chunks: Uint8Array[] = []; let size = 0
 try {
  while (true) {
   const {done,value} = await reader.read(); if (done) break
   size += value.byteLength
   if (size > limit) { await reader.cancel(); throw new HttpError(413,'Resume must be 5 MB or smaller.') }
   chunks.push(value)
  }
 } finally { reader.releaseLock() }
 try { return await new Response(Buffer.concat(chunks),{headers:{'Content-Type':request.headers.get('content-type')!}}).formData() }
 catch { throw new HttpError(400,'Invalid upload. Please select your file again.') }
}
export async function validateResume(value: FormDataEntryValue | null) {
 if (!value || typeof value === 'string' || !value.size) throw new HttpError(400,'Please upload your resume.')
 if (value.size > MAX_RESUME_BYTES) throw new HttpError(413,'Resume must be 5 MB or smaller.')
 const bytes = Buffer.from(await value.arrayBuffer())
 const kind = await fileTypeFromBuffer(bytes).catch(() => undefined)
 const ext = value.name.split('.').pop()?.toLowerCase()
 if (!kind || !['pdf','docx'].includes(kind.ext) || ext !== kind.ext) throw new HttpError(400,'Please upload a valid PDF or DOCX file.')
 const name = value.name.replace(/[\/\\\r\n\u0000-\u001f]/g,'_').slice(-160)
 return {bytes,name,type:kind.mime}
}
