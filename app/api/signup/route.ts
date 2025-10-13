import { NextResponse } from 'next/server'
import { db } from '../../../src/db/index'
import { users } from '../../../src/db/schema'
import { eq } from 'drizzle-orm'
import bcrypt from 'bcryptjs'

export async function POST(req: Request) {
  const { fullName, email, age, password } = await req.json()
  if (!fullName || !email || !password) {
    return NextResponse.json({ error: 'Campos obrigatórios faltando.' }, { status: 400 })
  }
  // Verifica se já existe
  const exists = await db.select().from(users).where(eq(users.email, email))
  if (exists.length > 0) {
    return NextResponse.json({ error: 'Email já cadastrado.' }, { status: 409 })
  }
  // Criptografa a senha
  const hashedPassword = await bcrypt.hash(password, 10)
  // Insere usuário
  await db.insert(users).values({
    name: fullName,
    email,
    password: hashedPassword,
    userType: 'parents', // ou outro tipo se quiser
  })
  return NextResponse.json({ success: true })
}
