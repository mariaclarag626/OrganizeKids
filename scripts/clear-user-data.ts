import { db } from '../src/db'
import { users, accounts, sessions } from '../src/db/schema'
import { eq } from 'drizzle-orm'

async function clearUserData() {
  try {
    const email = 'maria.calvarenga@geoportal.org'
    
    console.log('🗑️  Limpando dados do usuário:', email)
    
    // Deletar do banco de dados
    if (db) {
      // Deletar sessions
      await db.delete(sessions).where(eq(sessions.userId, email))
      console.log('✅ Sessions deletadas')
      
      // Deletar accounts
      await db.delete(accounts).where(eq(accounts.userId, email))
      console.log('✅ Accounts deletadas')
      
      // Deletar user
      const deletedUsers = await db.delete(users).where(eq(users.email, email))
      console.log('✅ Usuário deletado do banco de dados')
    }
    
    console.log('\n✅ DADOS LIMPOS COM SUCESSO!')
    console.log('\n📝 Agora limpe o localStorage do navegador:')
    console.log('   1. Abra o DevTools (F12)')
    console.log('   2. Vá em Console')
    console.log('   3. Digite: localStorage.clear()')
    console.log('   4. Pressione Enter')
    console.log('   5. Recarregue a página')
    
  } catch (error) {
    console.error('❌ Erro ao limpar dados:', error)
  }
  
  process.exit(0)
}

clearUserData()
