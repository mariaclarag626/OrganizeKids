import { signIn } from '@/lib/auth'

export async function GET() {
  // Server action para iniciar OAuth do Google
  await signIn('google')
}
