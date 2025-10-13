
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import FacebookProvider from 'next-auth/providers/facebook'
import { DrizzleAdapter } from '@auth/drizzle-adapter'
import { db } from '@/db'
import { accounts, sessions, users, verificationTokens } from '@/db/schema'
import { eq } from 'drizzle-orm'

if (!db) {
  throw new Error('Database not initialized')
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }),
  providers: [
    CredentialsProvider({
      name: 'Email',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'your@email.com' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null
        // Busca usuário pelo email
        if (!db) return null
  // Busca usuário pelo email
  const userArr = await db.select().from(users).where(eq(users.email, String(credentials.email)))
        const user = userArr[0]
        if (!user || typeof user.password !== 'string') return null
        // Verifica senha
        const valid = await bcrypt.compare(String(credentials.password), user.password)
        if (!valid) return null
        return {
          id: user.id,
          name: user.name,
          email: user.email,
        }
      }
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      allowDangerousEmailAccountLinking: true,
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID || '',
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET || '',
      allowDangerousEmailAccountLinking: true,
    }),
  ],
  pages: {
    signIn: '/',
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      // Permite vincular contas com o mesmo email
      return true
    },
    async redirect({ url, baseUrl }) {
      // Redirect to who-is-using after successful login
      if (url === baseUrl || url === `${baseUrl}/`) {
        return `${baseUrl}/who-is-using`
      }
      // Allows relative callback URLs
      if (url.startsWith('/')) return `${baseUrl}${url}`
      // Allows callback URLs on the same origin
      if (new URL(url).origin === baseUrl) return url
      return baseUrl
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
})

