import { NextResponse } from 'next/server'
import { db } from '../../../src/db/index'
import { users } from '../../../src/db/schema'
import { eq } from 'drizzle-orm'

export async function POST(req: Request) {
  const { email } = await req.json()
  if (!email || typeof email !== 'string') {
    return NextResponse.json({ exists: false }, { status: 400 })
  }
  // Ajuste para o seu schema/tabela de usuários
  if (!db) return NextResponse.json({ exists: false }, { status: 500 })
  // Consulta usando Drizzle ORM
  const usersResult = await db.select().from(users).where(eq(users.email, email))
  const user = usersResult[0]
  return NextResponse.json({ exists: !!user })
}
