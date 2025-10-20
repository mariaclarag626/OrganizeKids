
import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import FacebookProvider from 'next-auth/providers/facebook'
import { DrizzleAdapter } from '@auth/drizzle-adapter'
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

// Opcional: conecta ao banco somente se DATABASE_URL existir
const databaseUrl = process.env.DATABASE_URL
const sql = databaseUrl
  ? postgres(databaseUrl, {
      ssl: 'require',
    })
  : undefined
const db = sql ? drizzle(sql) : undefined

export const { handlers, signIn, signOut, auth } = NextAuth({
  // Persistência com Drizzle Adapter quando DATABASE_URL estiver configurado
  adapter: db ? (DrizzleAdapter(db) as any) : undefined,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID || '',
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET || '',
    }),
  ],
  pages: {
    signIn: '/login',
  },
  // Em desenvolvimento, ajuda a registrar erros no console
  debug: process.env.NODE_ENV !== 'production',
  // Permite inferir host correto em proxies/localhost variando de porta
  trustHost: true,
  callbacks: {
    async signIn({ user }) {
      // Apenas retornar true - o localStorage será gerenciado no cliente
      return true
    },
    async redirect({ url, baseUrl }) {
      // Redirect to who-is-using after successful login
      if (url === baseUrl || url === `${baseUrl}/` || url.includes('/login') || url.includes('/signup')) {
        return `${baseUrl}/who-is-using`
      }
      // Allows relative callback URLs
      if (url.startsWith('/')) return `${baseUrl}${url}`
      // Allows callback URLs on the same origin
      if (new URL(url).origin === baseUrl) return url
      return baseUrl
    },
    async session({ session, token }) {
      // Adicionar dados do token à sessão
      if (session.user && token.sub) {
        session.user.id = token.sub
      }
      return session
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
})

