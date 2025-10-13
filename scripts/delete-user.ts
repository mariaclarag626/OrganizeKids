import { db } from '../src/db'
import { users } from '../src/db/schema'
import { eq } from 'drizzle-orm'

async function deleteUser() {
  const email = 'maria.calvarenga@eaportal.org'
  
  if (!db) {
    console.error('❌ Database not connected')
    process.exit(1)
  }
  
  try {
    await db.delete(users).where(eq(users.email, email))
    console.log(`✅ Usuário ${email} deletado com sucesso!`)
  } catch (error) {
    console.error('❌ Erro ao deletar usuário:', error)
  }
  
  process.exit(0)
}

deleteUser()
