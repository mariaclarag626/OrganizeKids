import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { users } from '@/db/schema'
import { eq } from 'drizzle-orm'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const { action, email, password, name, fullName } = await request.json()

    if (!db) {
      return NextResponse.json({ error: 'Database not connected' }, { status: 500 })
    }

    // CREATE USER
    if (action === 'signup') {
      // Hash da senha
      const hashedPassword = await bcrypt.hash(password, 10)

      // Verificar se já existe
      const [existingUser] = await db
        .select()
        .from(users)
        .where(eq(users.email, email))
        .limit(1)

      if (existingUser) {
        // ✅ Se já existe, ATUALIZAR e RESETAR userType para null
        console.log('♻️ Usuário já existe, atualizando e resetando userType...')
        const [updatedUser] = await db
          .update(users)
          .set({
            name: fullName || name || existingUser.name,
            password: hashedPassword,
            userType: null, // ✅ RESETAR para null - forçar nova seleção
            updatedAt: new Date(),
          })
          .where(eq(users.email, email))
          .returning()

        console.log('✅ Usuário atualizado:', updatedUser.email, 'userType resetado para:', updatedUser.userType)

        return NextResponse.json({
          success: true,
          user: updatedUser,
          passwordHash: hashedPassword,
        })
      }

      // Criar usuário novo COM SENHA e SEM userType (para forçar seleção)
      const [newUser] = await db
        .insert(users)
        .values({
          email,
          name: fullName || name || email.split('@')[0],
          password: hashedPassword,
          userType: null, // ✅ EXPLICITAMENTE null para forçar seleção em /who-is-using
        })
        .returning()

      console.log('✅ Novo usuário criado:', newUser.email, 'userType:', newUser.userType)

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
        console.log('❌ [LOGIN] Usuário não encontrado:', email)
        return NextResponse.json({ error: 'User not found' }, { status: 404 })
      }

      if (!user.password) {
        console.log('❌ [LOGIN] Senha não definida para:', email)
        return NextResponse.json({ error: 'Password not set for this user' }, { status: 400 })
      }

      // Verificar senha comparando com a senha do BANCO DE DADOS
      const isValid = await bcrypt.compare(password, user.password)

      console.log('🔐 [LOGIN] Resultado:', isValid ? 'SUCESSO' : 'FALHA')
      console.log('👤 [LOGIN] User data:', {
        id: user.id,
        email: user.email,
        name: user.name,
        userType: user.userType,
        userTypeIsNull: user.userType === null,
        userTypeIsUndefined: user.userType === undefined,
      })

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
