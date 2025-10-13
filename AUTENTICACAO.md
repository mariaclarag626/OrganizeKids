# Sistema de Autenticação - OrganizeKids

## 🔐 Como Funciona Atualmente

### **Armazenamento de Dados**
- **LocalStorage do navegador** (temporário, até configurar banco de dados)
- Dados salvos:
  - `saved_accounts`: Array com todas as contas criadas
  - `user_email`: Email do usuário logado atualmente
  - `auth_provider`: Provedor usado (google/facebook/email)

### **Fluxo de Autenticação**

#### 1️⃣ **Primeira vez (Sign Up)**
1. Usuário clica no Google/Facebook/Email
2. Vai para `/auth/signin?provider=google`
3. **Seleciona um email** (ou digita um novo)
4. Como não existe conta, mostra tela **"Criar Senha"**
5. Usuário cria senha → Conta é salva no localStorage
6. Redireciona para `/who-is-using`

#### 2️⃣ **Login (conta existente)**
1. Usuário clica no Google/Facebook/Email
2. Vai para `/auth/signin?provider=google`
3. **Seleciona um email já cadastrado**
4. Sistema detecta que já existe conta
5. Mostra tela **"Bem-vindo de volta!"** com:
   - Avatar e nome do usuário
   - Campo de senha apenas
   - Botão "Entrar"
6. Verifica senha → Redireciona para `/who-is-using`

### **Estrutura de Dados**

```json
// localStorage.getItem('saved_accounts')
[
  {
    "email": "maria@gmail.com",
    "name": "Maria Clara",
    "avatar": "👩",
    "password": "senha123"
  },
  {
    "email": "joao@gmail.com",
    "name": "João Silva",
    "avatar": "👨",
    "password": "senha456"
  }
]
```

## ⚠️ **Banco de Dados**

### **Status Atual:**
- ❌ **Banco NÃO conectado**
- ⚠️ DATABASE_URL configurada mas PostgreSQL não instalado
- ✅ Migrations criadas e prontas
- ✅ Schema completo definido

### **Por que não está salvando no banco?**
1. PostgreSQL não está instalado localmente (`which psql` retorna erro)
2. DATABASE_URL aponta para `localhost:5432` (servidor local inexistente)

### **Como ativar o banco de dados:**

#### **Opção 1: PostgreSQL Local**
```bash
# Instalar PostgreSQL
brew install postgresql@16

# Iniciar serviço
brew services start postgresql@16

# Criar banco
createdb organizekids

# Rodar migrations
npm run db:migrate
```

#### **Opção 2: Banco Cloud (RECOMENDADO)**
1. Criar conta em [Neon.tech](https://neon.tech) (grátis)
2. Copiar a DATABASE_URL fornecida
3. Colar no arquivo `.env`
4. Executar: `npm run db:migrate`

## 🔄 **Próximos Passos**

### **Quando conectar o banco:**
1. Atualizar código para usar Drizzle ORM ao invés de localStorage
2. Implementar hash de senha (bcrypt)
3. Implementar NextAuth.js completamente
4. Configurar OAuth real do Google/Facebook

### **Segurança:**
⚠️ **IMPORTANTE**: Atualmente as senhas estão em **texto plano** no localStorage!
Isso é apenas para desenvolvimento. Em produção:
- Usar hash de senha (bcrypt/argon2)
- Salvar no banco de dados
- Implementar tokens JWT
- HTTPS obrigatório

## 📝 **Resumo**

✅ **Funcionando:**
- Fluxo de Sign Up (criar conta)
- Fluxo de Login (conta existente)
- Detecção automática de conta existente
- Botão de visualizar senha
- Interface estilo Google

⚠️ **Temporário (localStorage):**
- Salvamento de contas
- Validação de senha
- Sessão do usuário

❌ **Aguardando banco:**
- Persistência real dos dados
- Segurança de senhas
- OAuth real do Google/Facebook
- NextAuth.js completo

---

**Data:** 11 de outubro de 2025
**Desenvolvido por:** GitHub Copilot
