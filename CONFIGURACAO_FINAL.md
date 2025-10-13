# 🚀 CONFIGURAÇÃO FINAL - PASSO A PASSO

## ✅ O QUE FOI FEITO:

1. **Validação de Email** ✅
   - Agora o botão "Login" não funciona sem email
   - Mostra alerta se email estiver vazio ou inválido

2. **Google OAuth REAL** ✅
   - Botão Google agora usa `signIn('google')`
   - Vai abrir popup do Google REAL (como na foto)
   - **MAS PRECISA DAS CREDENCIAIS!**

## 🔑 VOCÊ PRECISA FAZER AGORA:

### 1. Pegar as credenciais no Google Cloud Console:

**Acesse:** https://console.cloud.google.com/

**Vá em:** APIs & Services → Credentials

**Copie:**
- Client ID (tipo: `123456-abc.apps.googleusercontent.com`)
- Client Secret (tipo: `GOCSPX-abc123def`)

### 2. Cole no arquivo `.env`:

Abra o arquivo `.env` e substitua:

```env
GOOGLE_CLIENT_ID=cole-aqui-seu-client-id-real
GOOGLE_CLIENT_SECRET=cole-aqui-seu-client-secret-real
```

### 3. ⚠️ IMPORTANTE - Configure a Redirect URI:

No Google Cloud Console, adicione esta URL nas "Authorized redirect URIs":

```
http://localhost:3000/api/auth/callback/google
```

### 4. Reinicie o servidor:

```bash
# Pressione Ctrl+C no terminal
# Depois rode:
npm run dev
```

---

## 🎯 COMO VAI FUNCIONAR:

### **Login com Email:**
1. Usuário digita email
2. Clica "Login"
3. ✅ Se email vazio → mostra alerta
4. ✅ Se email válido → vai para próxima página

### **Login com Google (REAL):**
1. Usuário clica botão Google
2. ✅ Abre popup do Google (como na foto!)
3. ✅ Mostra suas contas do Gmail
4. ✅ Escolhe a conta
5. ✅ Autoriza o app
6. ✅ Login automático
7. ✅ Redireciona para who-is-using

---

## 📝 CHECKLIST:

- [ ] Peguei Client ID no Google Cloud
- [ ] Peguei Client Secret no Google Cloud
- [ ] Colei ambos no `.env`
- [ ] Configurei Redirect URI (`/api/auth/callback/google`)
- [ ] Salvei o `.env`
- [ ] Reiniciei o servidor (Ctrl+C e npm run dev)
- [ ] Testei clicando no Google

---

**Depois de configurar, o popup do Google vai aparecer EXATAMENTE como na foto!** 🎉
