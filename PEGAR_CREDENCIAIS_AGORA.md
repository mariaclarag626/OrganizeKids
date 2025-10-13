# 🎯 PASSO A PASSO - PEGAR CREDENCIAIS DO GOOGLE

Você já está no Google Cloud Console! Agora siga exatamente estes passos:

## 📍 1. No menu lateral esquerdo, clique em:
```
☰ (menu hambúrguer) → APIs e serviços → Credenciais
```

Ou acesse direto: https://console.cloud.google.com/apis/credentials?project=organizekids

## 📍 2. Na página de Credenciais:

Você vai ver uma lista. Procure por **"OAuth 2.0 Client IDs"**

## 📍 3. Clique no nome da credencial

Se você ainda não criou, clique em **"+ CREATE CREDENTIALS"** → **"OAuth client ID"**

### Se for criar agora:
1. Application type: **Web application**
2. Name: **OrganizeKids Web**
3. Authorized JavaScript origins:
   - `http://localhost:3000`
4. Authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google`
5. Clique em **CREATE**

## 📍 4. Copie as credenciais:

Você verá um popup com:

```
Client ID
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
123456789-abcdefghijk.apps.googleusercontent.com
[copiar]

Client Secret  
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
GOCSPX-abcdefghijklmnop123456
[copiar]
```

## 📍 5. Cole no arquivo `.env`:

Abra o arquivo `.env` do projeto e substitua:

```env
GOOGLE_CLIENT_ID=cole-aqui-o-client-id-completo
GOOGLE_CLIENT_SECRET=cole-aqui-o-client-secret-completo
```

**IMPORTANTE:** Cole os valores COMPLETOS, sem espaços no início ou fim!

## 📍 6. Salve e reinicie o servidor:

No terminal:
```bash
# Pressione Ctrl+C para parar o servidor
# Depois rode novamente:
npm run dev
```

## ✅ PRONTO!

Depois disso, quando você clicar no botão Google, vai abrir o popup REAL do Google! 🎉

---

**Se tiver dúvida em algum passo, me mande uma screenshot!**
