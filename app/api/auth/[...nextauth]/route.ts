import { handlers } from '@/lib/auth'

export const { GET, POST } = handlers

// Forçar runtime Node para compatibilidade com OAuth/NextAuth
export const runtime = 'nodejs'
