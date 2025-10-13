# 🔑 ONDE PEGAR AS CREDENCIAIS DO GOOGLE

Você já criou o projeto no Google Cloud! Agora precisa copiar as credenciais:

## 📍 PASSO A PASSO:

### 1. Acesse o Google Cloud Console:
https://console.cloud.google.com/

### 2. Selecione seu projeto "OrganizeKids"
- No topo da página, clique no nome do projeto

### 3. Vá em "APIs & Services" → "Credentials"
- Menu lateral esquerdo
- Clique em "Credentials" (Credenciais)

### 4. Encontre suas credenciais OAuth 2.0:
- Na lista, procure por "OAuth 2.0 Client IDs"
- Clique no nome da credencial que você criou

### 5. Copie o Client ID:
```
Exemplo: 123456789-abc123def456.apps.googleusercontent.com
```

### 6. Copie o Client Secret:
```
Exemplo: GOCSPX-abc123def456ghi789
```

### 7. Cole no arquivo `.env`:
```env
GOOGLE_CLIENT_ID=cole-aqui-seu-client-id
GOOGLE_CLIENT_SECRET=cole-aqui-seu-client-secret
```

### 8. ⚠️ IMPORTANTE - Configure a Redirect URI:

Ainda no Google Cloud Console, na mesma página das credenciais:

**Authorized redirect URIs** deve ter:
```
http://localhost:3000/api/auth/callback/google
```

Se não tiver, clique em "ADD URI" e adicione!

---

## ✅ CHECKLIST RÁPIDO:

- [ ] Acessei console.cloud.google.com
- [ ] Selecionei meu projeto
- [ ] Fui em APIs & Services → Credentials
- [ ] Copiei o Client ID
- [ ] Copiei o Client Secret
- [ ] Colei ambos no arquivo `.env`
- [ ] Verifiquei a Redirect URI
- [ ] Salvei o arquivo `.env`
- [ ] Reiniciei o servidor (Ctrl+C e npm run dev)

---

**Depois de configurar, teste clicando no botão Google!** 🚀
