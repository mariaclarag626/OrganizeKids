import { db } from '@/db'
import { users } from '@/db/schema'
import { eq } from 'drizzle-orm'
import bcrypt from 'bcryptjs'

export async function createUser(email: string, password: string, name?: string) {
  try {
    if (!db) {
      throw new Error('Database not connected')
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 10)

    // Criar usuário
    const [newUser] = await db
      .insert(users)
      .values({
        email,
        name: name || email.split('@')[0],
      })
      .returning()

    // Salvar hash da senha no localStorage temporariamente
    // (Em produção, você salvaria em uma tabela credentials)
    const passwords = JSON.parse(localStorage.getItem('user_passwords') || '{}')
    passwords[email] = hashedPassword
    localStorage.setItem('user_passwords', JSON.stringify(passwords))

    return { success: true, user: newUser }
  } catch (error) {
    console.error('Error creating user:', error)
    return { success: false, error: 'Failed to create user' }
  }
}

export async function getUserByEmail(email: string) {
  try {
    if (!db) {
      return null
    }

    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1)

    return user || null
  } catch (error) {
    console.error('Error getting user:', error)
    return null
  }
}

export async function verifyPassword(email: string, plainPassword: string) {
  try {
    // Buscar hash do localStorage
    const passwords = JSON.parse(localStorage.getItem('user_passwords') || '{}')
    const hashedPassword = passwords[email]
    
    if (!hashedPassword) {
      return false
    }

    return await bcrypt.compare(plainPassword, hashedPassword)
  } catch (error) {
    console.error('Error verifying password:', error)
    return false
  }
}
