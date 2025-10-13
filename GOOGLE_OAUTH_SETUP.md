# 🔐 CONFIGURAR GOOGLE OAUTH - PASSO A PASSO

## ✅ O QUE VOCÊ PRECISA FAZER:

### 1️⃣ Criar Projeto no Google Cloud Console

1. **Acesse:** https://console.cloud.google.com/

2. **Criar Novo Projeto:**
   - Clique em "Select a project" (topo da página)
   - Clique em "NEW PROJECT"
   - Nome do projeto: `OrganizeKids`
   - Clique em "CREATE"

### 2️⃣ Configurar OAuth Consent Screen

1. **No menu lateral, vá em:**
   - `APIs & Services` → `OAuth consent screen`

2. **Escolha:**
   - User Type: **External**
   - Clique em "CREATE"

3. **Preencha as informações:**
   - App name: `OrganizeKids`
   - User support email: `seu-email@gmail.com`
   - Developer contact: `seu-email@gmail.com`
   - Clique em "SAVE AND CONTINUE"

4. **Scopes (Escopos):**
   - Clique em "ADD OR REMOVE SCOPES"
   - Selecione:
     - `.../auth/userinfo.email`
     - `.../auth/userinfo.profile`
   - Clique em "UPDATE"
   - Clique em "SAVE AND CONTINUE"

5. **Test users:**
   - Clique em "ADD USERS"
   - Adicione seu email: `maria.calvarenga@geoportal.org`
   - Clique em "ADD"
   - Clique em "SAVE AND CONTINUE"

6. **Summary:**
   - Revise tudo
   - Clique em "BACK TO DASHBOARD"

### 3️⃣ Criar Credenciais OAuth

1. **No menu lateral, vá em:**
   - `APIs & Services` → `Credentials`

2. **Criar OAuth Client ID:**
   - Clique em "+ CREATE CREDENTIALS"
   - Selecione "OAuth client ID"
   - Application type: **Web application**
   - Name: `OrganizeKids Web`

3. **Authorized JavaScript origins:**
   - Clique em "+ ADD URI"
   - Cole: `http://localhost:3000`
   - Clique em "+ ADD URI" novamente
   - Cole: `https://seu-dominio.com` (quando fizer deploy)

4. **Authorized redirect URIs:**
   - Clique em "+ ADD URI"
   - Cole: `http://localhost:3000/api/auth/callback/google`
   - Clique em "+ ADD URI" novamente  
   - Cole: `https://seu-dominio.com/api/auth/callback/google` (quando fizer deploy)

5. **Clique em "CREATE"**

### 4️⃣ Copiar as Credenciais

1. **Você verá um popup com:**
   - ✅ **Client ID** (exemplo: `123456789-abc123.apps.googleusercontent.com`)
   - ✅ **Client Secret** (exemplo: `GOCSPX-abc123def456`)

2. **COPIE AMBOS!** Você vai precisar deles no próximo passo.

### 5️⃣ Adicionar no arquivo .env

1. **Abra o arquivo `.env` na raiz do projeto**

2. **Adicione as linhas:**
   ```env
   GOOGLE_CLIENT_ID=cole-aqui-seu-client-id
   GOOGLE_CLIENT_SECRET=cole-aqui-seu-client-secret
   ```

3. **Salve o arquivo**

### 6️⃣ Reiniciar o Servidor

1. **Pare o servidor** (Ctrl+C no terminal)

2. **Inicie novamente:**
   ```bash
   npm run dev
   ```

## 🎉 PRONTO! AGORA VAI FUNCIONAR!

Quando você clicar no botão do Google, vai abrir a **janela popup real do Google** mostrando:
- ✅ Suas contas do Gmail
- ✅ Opção de escolher qual conta usar
- ✅ Opção de adicionar outra conta
- ✅ Exatamente como funciona no YouTube, Gmail, etc!

---

## 📝 RESUMO DAS CREDENCIAIS NECESSÁRIAS:

- ✅ `GOOGLE_CLIENT_ID` - ID do cliente OAuth
- ✅ `GOOGLE_CLIENT_SECRET` - Segredo do cliente OAuth
- ✅ Redirect URI configurada: `http://localhost:3000/api/auth/callback/google`

---

## ⚠️ ATENÇÃO:

- Mantenha o **Client Secret** em segredo! Nunca compartilhe!
- Adicione `.env` ao `.gitignore` (já está configurado)
- Para produção, adicione o domínio real nas URIs autorizadas

---

## 🐛 TROUBLESHOOTING:

### Se der erro "redirect_uri_mismatch":
- Verifique se a URI no Google Console está exatamente: `http://localhost:3000/api/auth/callback/google`
- Certifique-se que não tem espaços ou caracteres extras

### Se não abrir o popup:
- Verifique se o popup blocker do navegador está desabilitado
- Tente em outra aba/janela

### Se der erro "Email not verified":
- Adicione seu email como "Test user" no OAuth consent screen

---

**Criado em:** 11 de outubro de 2025  
**Tempo estimado:** 10-15 minutos
