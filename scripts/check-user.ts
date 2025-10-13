import { db } from '../src/db'
import { users } from '../src/db/schema'
import { eq } from 'drizzle-orm'

async function checkUser() {
  const email = 'maria.calvarenga@eaportal.org'
  
  if (!db) {
    console.error('❌ Database not connected')
    process.exit(1)
  }
  
  try {
    const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1)
    
    if (user) {
      console.log('✅ Usuário encontrado:')
      console.log('Email:', user.email)
      console.log('Nome:', user.name)
      console.log('UserType:', user.userType || '❌ NÃO DEFINIDO')
      console.log('Criado em:', user.createdAt)
    } else {
      console.log('❌ Usuário não encontrado')
    }
  } catch (error) {
    console.error('❌ Erro:', error)
  }
  
  process.exit(0)
}

checkUser()
