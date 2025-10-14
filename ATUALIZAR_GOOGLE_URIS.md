# 🔧 ATUALIZAR URIs AUTORIZADAS DO GOOGLE - 5 MINUTOS

## ✅ Status Atual:
- ✅ Credenciais do Google configuradas
- ✅ Client ID: `805217317137-s82amac113a9bjr0p7uf1jpdlh7laodq.apps.googleusercontent.com`
- ✅ Código atualizado com botão do Google
- ⚠️ **PENDENTE:** Atualizar URIs para porta 3001

## 🚀 PASSO A PASSO (5 minutos):

### 1️⃣ Acessar Google Cloud Console
🔗 https://console.cloud.google.com/apis/credentials

### 2️⃣ Selecionar o Projeto
- Clique no dropdown do projeto (canto superior esquerdo)
- Selecione **"OrganizeKids"** (ou o nome do seu projeto)

### 3️⃣ Encontrar as Credenciais OAuth
- Na página "Credenciais", procure por:
  - **Client ID:** `805217317137-s82amac113a9bjr0p7uf1jpdlh7laodq`
- Clique no **ícone de lápis** ✏️ (editar) ao lado

### 4️⃣ Atualizar URIs Autorizadas

**SEÇÃO 1: "URIs de redirecionamento autorizados"**

Adicione estas URIs (clique em "+ ADICIONAR URI"):

```
http://localhost:3001/api/auth/callback/google
http://localhost:3000/api/auth/callback/google
```

**SEÇÃO 2: "Origens JavaScript autorizadas"**

Adicione estas origens (clique em "+ ADICIONAR ORIGEM"):

```
http://localhost:3001
http://localhost:3000
```

### 5️⃣ Salvar
- Clique no botão **"SALVAR"** no final da página
- Aguarde a confirmação ✅

### 6️⃣ Reiniciar o Servidor
No terminal do VS Code, execute:
```bash
# Parar o servidor (Ctrl+C)
# Depois reiniciar:
npm run dev
```

## 🎉 TESTAR O LOGIN:

1. Acesse: http://localhost:3001/login
2. Clique em **"Continuar com Google"**
3. Deve abrir popup do Google REAL
4. Escolha sua conta
5. Após autorizar, redireciona para `/who-is-using`
6. Depois de 3 segundos, vai para o dashboard! 🚀

## ❓ TROUBLESHOOTING:

### Erro: "redirect_uri_mismatch"
- ✅ Volte ao passo 4
- ✅ Verifique se adicionou exatamente: `http://localhost:3001/api/auth/callback/google`
- ✅ Salve novamente

### Erro: "origin not allowed"
- ✅ Adicione `http://localhost:3001` em "Origens JavaScript autorizadas"
- ✅ Salve

### Login não funciona
- ✅ Reinicie o servidor (`npm run dev`)
- ✅ Limpe o cache do navegador (Cmd+Shift+R)
- ✅ Tente em aba anônima

## 📱 PRÓXIMOS PASSOS (PRODUÇÃO):

Quando fizer deploy do app, adicione também:

```
https://seu-dominio.com
https://seu-dominio.com/api/auth/callback/google
```

---

**Tempo total:** 5 minutos  
**Resultado:** Google OAuth funcionando! 🎊
