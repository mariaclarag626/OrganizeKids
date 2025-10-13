import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { users } from '@/db/schema'
import { eq } from 'drizzle-orm'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const { action, email, password, name } = await request.json()

    if (!db) {
      return NextResponse.json({ error: 'Database not connected' }, { status: 500 })
    }

    // CREATE USER
    if (action === 'signup') {
      // Verificar se já existe
      const [existingUser] = await db
        .select()
        .from(users)
        .where(eq(users.email, email))
        .limit(1)

      if (existingUser) {
        return NextResponse.json({ error: 'User already exists' }, { status: 400 })
      }

      // Hash da senha
      const hashedPassword = await bcrypt.hash(password, 10)

      // Criar usuário COM SENHA
      const [newUser] = await db
        .insert(users)
        .values({
          email,
          name: name || email.split('@')[0],
          password: hashedPassword, // ✅ Salvando senha no banco!
        })
        .returning()

      // Retornar user e hash (para salvar no localStorage temporariamente)
      return NextResponse.json({
        success: true,
        user: newUser,
        passwordHash: hashedPassword,
      })
    }

    // CHECK IF USER EXISTS
    if (action === 'check') {
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.email, email))
        .limit(1)

      return NextResponse.json({
        exists: !!user,
        user: user || null,
      })
    }

    // VERIFY PASSWORD
    if (action === 'login') {
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.email, email))
        .limit(1)

      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 })
      }

      if (!user.password) {
        return NextResponse.json({ error: 'Password not set for this user' }, { status: 400 })
      }

      // Verificar senha comparando com a senha do BANCO DE DADOS
      const isValid = await bcrypt.compare(password, user.password)

      return NextResponse.json({
        success: isValid,
        user: isValid ? user : null,
      })
    }

    // DELETE ALL USER DATA
    if (action === 'delete-all') {
      // Deletar usuário do banco
      await db
        .delete(users)
        .where(eq(users.email, email))

      return NextResponse.json({
        success: true,
        message: 'User data deleted',
      })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error('Auth API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
