import { defineConfig } from 'vitest/config'
import { fileURLToPath } from 'node:url'
export default defineConfig({resolve:{alias:{'@':fileURLToPath(new URL('./src',import.meta.url))}},test:{include:['tests/**/*.test.ts'],fileParallelism:false,testTimeout:20000,hookTimeout:30000,env:{JWT_SECRET:'isolated-test-signing-key-not-for-deployment',ADMIN_EMAILS:'admin@example.test',JOB_EDITOR_EMAILS:'mk@example.test',NEXT_PUBLIC_SITE_URL:'http://localhost:3100',SMTP_HOST:'smtp.example.test',SMTP_PORT:'587',SMTP_USER:'test',SMTP_PASSWORD:'test',SMTP_FROM:'website@example.test'}}})
